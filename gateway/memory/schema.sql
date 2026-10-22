PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS memory_nodes (
    id TEXT PRIMARY KEY,
    node_type TEXT NOT NULL CHECK (length(node_type) BETWEEN 1 AND 48),
    content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 20000),
    scope TEXT NOT NULL CHECK (scope IN ('conversation', 'project', 'global')),
    scope_id TEXT NOT NULL CHECK (length(scope_id) BETWEEN 1 AND 160),
    source_kind TEXT NOT NULL CHECK (source_kind IN ('message', 'document', 'tool_result', 'user_edit', 'system_event')),
    source_id TEXT NOT NULL CHECK (length(source_id) BETWEEN 1 AND 256),
    source_uri TEXT,
    source_sha256 TEXT,
    created_at TEXT NOT NULL,
    recorded_at TEXT NOT NULL,
    valid_from TEXT,
    valid_until TEXT,
    superseded_at TEXT,
    confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    status TEXT NOT NULL CHECK (status IN ('candidate', 'confirmed', 'disputed', 'superseded', 'rejected')),
    sensitivity TEXT NOT NULL CHECK (sensitivity IN ('normal', 'private', 'confidential')),
    metadata_json TEXT NOT NULL DEFAULT '{}',
    CHECK (scope != 'global' OR scope_id = 'global'),
    CHECK (scope = 'global' OR scope_id != 'global'),
    CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until > valid_from)
);

CREATE INDEX IF NOT EXISTS idx_memory_nodes_scope_status
    ON memory_nodes(scope, scope_id, status, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_type
    ON memory_nodes(scope, scope_id, node_type);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_valid_time
    ON memory_nodes(scope, scope_id, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_source
    ON memory_nodes(scope, scope_id, source_kind, source_id);

CREATE TABLE IF NOT EXISTS memory_edges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_node TEXT NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
    target_node TEXT NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
    scope TEXT NOT NULL CHECK (scope IN ('conversation', 'project', 'global')),
    scope_id TEXT NOT NULL,
    relation_type TEXT NOT NULL CHECK (relation_type IN ('MENTIONS', 'SUPPORTS', 'CONTRADICTS', 'SUPERSEDES', 'DERIVED_FROM')),
    confidence REAL NOT NULL DEFAULT 1 CHECK (confidence >= 0 AND confidence <= 1),
    created_at TEXT NOT NULL,
    evidence_source_kind TEXT NOT NULL,
    evidence_source_id TEXT NOT NULL,
    UNIQUE(source_node, target_node, relation_type),
    CHECK (source_node != target_node),
    CHECK (scope != 'global' OR scope_id = 'global'),
    CHECK (scope = 'global' OR scope_id != 'global')
);
CREATE INDEX IF NOT EXISTS idx_memory_edges_source ON memory_edges(scope, scope_id, source_node);
CREATE INDEX IF NOT EXISTS idx_memory_edges_target ON memory_edges(scope, scope_id, target_node);

CREATE TRIGGER IF NOT EXISTS trg_memory_edge_scope_insert
BEFORE INSERT ON memory_edges
BEGIN
    SELECT CASE WHEN
        (SELECT scope || ':' || scope_id FROM memory_nodes WHERE id = NEW.source_node)
        != NEW.scope || ':' || NEW.scope_id
        OR
        (SELECT scope || ':' || scope_id FROM memory_nodes WHERE id = NEW.target_node)
        != NEW.scope || ':' || NEW.scope_id
    THEN RAISE(ABORT, 'memory edge cannot cross scope boundaries') END;
END;

CREATE TABLE IF NOT EXISTS memory_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scope TEXT NOT NULL,
    scope_id TEXT NOT NULL,
    node_id TEXT,
    action TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    actor_kind TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    reason_code TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_memory_audit_scope ON memory_audit(scope, scope_id, occurred_at DESC);
