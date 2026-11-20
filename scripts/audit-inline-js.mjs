import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'acorn';

const SCRIPT_TAG = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const GLOBAL_OBJECTS = new Set(['window', 'globalThis']);
const FUNCTION_TYPES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);

function attributeValue(attributes, name) {
  const match = attributes.match(new RegExp('\\b' + name + '\\s*=\\s*(?:"([^"]*)"|\\'([^\\']*)\\'|([^\\s>]+))', 'i'));
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : null;
}

function isJavaScriptType(type) {
  if (!type) return true;
  const normalized = type.split(';', 1)[0].trim().toLowerCase();
  return normalized === 'module'
    || normalized === 'text/javascript'
    || normalized === 'application/javascript'
    || normalized === 'text/ecmascript'
    || normalized === 'application/ecmascript'
    || normalized === 'text/jscript';
}

function extractScriptBlocks(html) {
  const blocks = [];
  let externalScriptCount = 0;
  let nonJavaScriptScriptCount = 0;
  let match;
  SCRIPT_TAG.lastIndex = 0;
  while ((match = SCRIPT_TAG.exec(html)) !== null) {
    const attributes = match[1] || '';
    const source = match[2] || '';
    const src = attributeValue(attributes, 'src');
    if (src !== null) {
      externalScriptCount += 1;
      continue;
    }
    const type = attributeValue(attributes, 'type');
    if (!isJavaScriptType(type)) {
      nonJavaScriptScriptCount += 1;
      continue;
    }
    blocks.push({
      index: blocks.length + 1,
      source,
      sourceType: type?.trim().toLowerCase() === 'module' ? 'module' : 'script'
    });
  }
  return { blocks, externalScriptCount, nonJavaScriptScriptCount };
}

function walk(node, visit, ancestors = [], parentKey = null) {
  if (!node || typeof node !== 'object' || typeof node.type !== 'string') return;
  const parent = ancestors.at(-1) || null;
  visit(node, parent, parentKey, ancestors);
  const nextAncestors = [...ancestors, node];
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc' || key === 'start' || key === 'end') continue;
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child.type === 'string') walk(child, visit, nextAncestors, key);
      }
    } else if (value && typeof value.type === 'string') {
      walk(value, visit, nextAncestors, key);
    }
  }
}

function containsNode(outer, inner) {
  return Boolean(outer && inner && outer.start <= inner.start && outer.end >= inner.end);
}

function isFunctionNode(node) {
  return node && FUNCTION_TYPES.has(node.type);
}

function isExportedDeclaration(node, ancestors) {
  return ancestors.some(ancestor =>
    (ancestor.type === 'ExportNamedDeclaration' || ancestor.type === 'ExportDefaultDeclaration')
    && (ancestor.declaration === node
      || (node.type === 'VariableDeclarator' && ancestor.declaration?.declarations?.includes(node)))
  );
}

function isBindingIdentifier(node, parent, key, ancestors) {
  if (!parent) return false;
  if ((parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression' || parent.type === 'ClassDeclaration' || parent.type === 'ClassExpression') && key === 'id') return true;
  if (parent.type === 'VariableDeclarator' && key === 'id') return true;
  if (parent.type === 'CatchClause' && key === 'param') return true;
  if (parent.type === 'ImportSpecifier' && key === 'local') return true;
  if (parent.type === 'ImportDefaultSpecifier' && key === 'local') return true;
  if (parent.type === 'ImportNamespaceSpecifier' && key === 'local') return true;
  if (parent.type === 'Property' && key === 'key' && !parent.computed && !parent.shorthand) return true;
  if (parent.type === 'MethodDefinition' && key === 'key' && !parent.computed) return true;
  if (parent.type === 'MemberExpression' && key === 'property' && !parent.computed) {
    return !(parent.object?.type === 'Identifier' && GLOBAL_OBJECTS.has(parent.object.name));
  }
  if ((parent.type === 'LabeledStatement' && key === 'label')
    || ((parent.type === 'BreakStatement' || parent.type === 'ContinueStatement') && key === 'label')) return true;

  for (const ancestor of ancestors) {
    if (ancestor.type === 'VariableDeclarator' && containsNode(ancestor.id, node)) return true;
    if (isFunctionNode(ancestor) && ancestor.params?.some(param => containsNode(param, node))) return true;
    if (ancestor.type === 'CatchClause' && containsNode(ancestor.param, node)) return true;
    if (ancestor.type === 'ImportDeclaration' && ancestor.specifiers?.some(specifier => containsNode(specifier.local, node))) return true;
  }
  return false;
}

function extractInlineHandlerNames(html) {
  const names = new Set();
  const attributePattern = /\bon[a-z]+\s*=\s*(["'])([\s\S]*?)\1/gi;
  const identifierPattern = /\b([A-Za-z_$][\w$]*)\b/g;
  let attribute;
  while ((attribute = attributePattern.exec(html)) !== null) {
    let identifier;
    identifierPattern.lastIndex = 0;
    while ((identifier = identifierPattern.exec(attribute[2])) !== null) names.add(identifier[1]);
  }
  return names;
}

function addStringHandlerNames(value, names) {
  if (typeof value !== 'string') return;
  const callPattern = /\b([A-Za-z_$][\w$]*)\s*\(/g;
  let match;
  while ((match = callPattern.exec(value)) !== null) names.add(match[1]);
}

function auditInlineScripts(html, sourceLabel = '<memory>') {
  const extracted = extractScriptBlocks(html);
  const parsedBlocks = [];
  const parseErrors = [];
  let astNodeCount = 0;
  let functionCount = 0;
  let dynamicDispatchCount = 0;
  const dynamicReferences = new Map();
  const addDynamicReference = (name, kind) => {
    if (!name) return;
    if (!dynamicReferences.has(name)) dynamicReferences.set(name, new Set());
    dynamicReferences.get(name).add(kind);
  };

  for (const block of extracted.blocks) {
    try {
      const ast = parse(block.source, {
        ecmaVersion: 'latest',
        sourceType: block.sourceType,
        allowReturnOutsideFunction: true,
        locations: true
      });
      parsedBlocks.push({ ...block, ast });
      walk(ast, node => {
        astNodeCount += 1;
        if (isFunctionNode(node)) functionCount += 1;
        if (node.type === 'MemberExpression' && node.object?.type === 'Identifier' && GLOBAL_OBJECTS.has(node.object.name)) {
          if (node.computed && node.property?.type === 'Literal' && typeof node.property.value === 'string') {
            addDynamicReference(node.property.value, 'global-property-string');
          } else if (!node.computed && node.property?.type === 'Identifier') {
            addDynamicReference(node.property.name, 'global-property-name');
          } else if (node.computed) {
            dynamicDispatchCount += 1;
          }
        }
        if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && ['setTimeout', 'setInterval'].includes(node.callee.name) && node.arguments[0]?.type === 'Literal') {
          const names = new Set();
          addStringHandlerNames(node.arguments[0].value, names);
          for (const name of names) addDynamicReference(name, 'string-timer-handler');
        }
        if ((node.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'eval')
          || (node.type === 'NewExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'Function')) {
          dynamicDispatchCount += 1;
        }
      });
    } catch (error) {
      parseErrors.push({
        scriptIndex: block.index,
        message: String(error?.message || error),
        line: Number.isInteger(error?.loc?.line) ? error.loc.line : null,
        column: Number.isInteger(error?.loc?.column) ? error.loc.column + 1 : null
      });
    }
  }

  const candidates = [];
  const byName = new Map();
  for (const block of parsedBlocks) {
    walk(block.ast, (node, parent, key, ancestors) => {
      let candidate = null;
      if (node.type === 'FunctionDeclaration' && node.id?.type === 'Identifier') {
        candidate = { name: node.id.name, kind: 'function-declaration', scriptIndex: block.index, functionNode: node, declarationNode: node };
      } else if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && isFunctionNode(node.init)) {
        candidate = { name: node.id.name, kind: node.init.type === 'ArrowFunctionExpression' ? 'arrow-function' : 'function-expression', scriptIndex: block.index, functionNode: node.init, declarationNode: node };
      }
      if (!candidate || isExportedDeclaration(candidate.declarationNode, ancestors)) return;
      candidate.directReferenceCount = 0;
      candidates.push(candidate);
      if (!byName.has(candidate.name)) byName.set(candidate.name, []);
      byName.get(candidate.name).push(candidate);
    });
  }

  for (const block of parsedBlocks) {
    walk(block.ast, (node, parent, key, ancestors) => {
      if (node.type !== 'Identifier') return;
      const matches = byName.get(node.name);
      if (!matches?.length) return;
      if (isBindingIdentifier(node, parent, key, ancestors)) return;
      for (const candidate of matches) {
        if (candidate.scriptIndex === block.index && containsNode(candidate.functionNode, node)) continue;
        if (parent?.type === 'MemberExpression' && key === 'property' && !parent.computed
          && parent.object?.type === 'Identifier' && GLOBAL_OBJECTS.has(parent.object.name)) continue;
        candidate.directReferenceCount += 1;
      }
    });
  }

  const inlineHandlerReferences = extractInlineHandlerNames(html);
  const reportCandidates = candidates
    .filter(candidate => candidate.directReferenceCount === 0 && !dynamicReferences.has(candidate.name) && !inlineHandlerReferences.has(candidate.name))
    .map(candidate => ({
      name: candidate.name,
      kind: candidate.kind,
      scriptIndex: candidate.scriptIndex,
      confidence: 'low',
      directReferenceCount: candidate.directReferenceCount,
      dynamicReferenceKinds: [],
      reason: dynamicDispatchCount > 0
        ? 'No direct or recognized dynamic reference was found, but the file contains unresolved dynamic dispatch. Manual review is required; this is not a deletion recommendation.'
        : 'No direct identifier, recognized global-property, timer-string, or inline-handler reference was found in this HTML. Runtime-generated names and consumers outside this document may still use it; manual review is required.'
    }))
    .sort((a, b) => a.name.localeCompare(b.name) || a.scriptIndex - b.scriptIndex);

  const htmlDataActions = [...html.matchAll(/\bdata-action\s*=\s*(["'])(.*?)\1/gi)].map(match => match[2]);
  const report = {
    schemaVersion: 1,
    mode: 'report-only',
    source: sourceLabel,
    deletionPerformed: false,
    metrics: {
      htmlBytes: Buffer.byteLength(html, 'utf8'),
      inlineScriptCount: extracted.blocks.length,
      externalScriptCount: extracted.externalScriptCount,
      nonJavaScriptScriptCount: extracted.nonJavaScriptScriptCount,
      inlineJavaScriptBytes: extracted.blocks.reduce((sum, block) => sum + Buffer.byteLength(block.source, 'utf8'), 0),
      astNodeCount,
      functionCount,
      candidateCount: reportCandidates.length,
      dataActionCount: htmlDataActions.length,
      uniqueDataActionCount: new Set(htmlDataActions).size,
      inlineHandlerCount: inlineHandlerReferences.size,
      dynamicDispatchCount
    },
    candidates: reportCandidates,
    parseErrors
  };
  return report;
}

function printSummary(report) {
  const metrics = report.metrics;
  const lines = [
    'Report-only inline JavaScript AST audit — no code deleted.',
    'Source: ' + report.source,
    'HTML: ' + metrics.htmlBytes + ' bytes · inline JS: ' + metrics.inlineScriptCount + ' blocks / ' + metrics.inlineJavaScriptBytes + ' bytes · AST nodes: ' + metrics.astNodeCount,
    'Functions: ' + metrics.functionCount + ' · possible unused candidates (low confidence): ' + metrics.candidateCount + ' · parse errors: ' + report.parseErrors.length,
    'Markup actions: ' + metrics.dataActionCount + ' (' + metrics.uniqueDataActionCount + ' unique) · inline handlers: ' + metrics.inlineHandlerCount + ' · unresolved dynamic dispatch: ' + metrics.dynamicDispatchCount
  ];
  if (report.candidates.length) {
    lines.push('Review candidates only (never auto-delete): ' + report.candidates.slice(0, 30).map(candidate => candidate.name).join(', '));
    if (report.candidates.length > 30) lines.push('… and ' + (report.candidates.length - 30) + ' more candidate(s).');
  }
  if (report.parseErrors.length) {
    lines.push('Parse errors:');
    for (const error of report.parseErrors) lines.push('- inline script #' + error.scriptIndex + ' ' + (error.line ?? '?') + ':' + (error.column ?? '?') + ' — ' + error.message);
  }
  return lines.join('\n');
}

function main() {
  const input = process.argv[2];
  const format = process.argv.includes('--json') ? 'json' : 'summary';
  if (!input || input.startsWith('--')) {
    console.error('Usage: node scripts/audit-inline-js.mjs <generated-html-file> [--json|--summary]');
    process.exitCode = 2;
    return;
  }
  try {
    const sourcePath = resolve(input);
    const html = readFileSync(sourcePath, 'utf8');
    const report = auditInlineScripts(html, sourcePath);
    process.stdout.write(format === 'json' ? JSON.stringify(report, null, 2) + '\n' : printSummary(report) + '\n');
    if (report.parseErrors.length) process.exitCode = 1;
  } catch (error) {
    console.error(String(error?.stack || error));
    process.exitCode = 2;
  }
}

export { auditInlineScripts };
if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) main();
