import { readFileSync, statSync } from 'node:fs';

const path = process.argv[2] || 'assets/css/tailwind.generated.css';
const css = readFileSync(path, 'utf8');
const size = statSync(path).size;
const required = ['.hidden{display:none}', '.flex{display:flex}', '.grid{display:grid}'];
const missing = required.filter(selector => !css.includes(selector));
if (size < 10000 || missing.length) {
  throw new Error(`Tailwind output invalid: ${size} bytes; missing: ${missing.join(', ') || 'none'}`);
}
console.log(JSON.stringify({ path, bytes: size, requiredUtilities: required.length, status: 'PASS' }));
