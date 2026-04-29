/**
 * Block Layout Service
 * Persists per-section block layout trees to data/block-layouts.json
 * Uses JSON file storage (same pattern as the rest of the app)
 */

const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'block-layouts.json');

/** Ensure the data file exists */
function _ensureFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2), 'utf8');
    }
}

/** Read entire store */
function _read() {
    _ensureFile();
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
        return {};
    }
}

/** Write entire store atomically (temp file → rename) */
function _write(data) {
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmp, DATA_FILE);
}

/** Build a unique key per section */
function _key(stage, sectionIndex) {
    return `${stage}__${sectionIndex}`;
}

/**
 * Build a default single-block layout for a section.
 * All rows are placed in one root leaf block.
 */
function _defaultLayout(stage, sectionIndex) {
    return {
        stage,
        sectionIndex: Number(sectionIndex),
        locked: false,
        lockedBy: null,
        lockedAt: null,
        cells: {}
    };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get layout for a stage+section.
 * Returns default single-leaf layout if none saved.
 */
function getLayout(stage, sectionIndex) {
    const store = _read();
    const key   = _key(stage, sectionIndex);
    return store[key] || _defaultLayout(stage, sectionIndex);
}

/**
 * Save a full block tree for a stage+section.
 * @param {string} stage
 * @param {number} sectionIndex
 * @param {object} blockTree  - { blocks: [...], locked?, lockedBy?, lockedAt? }
 * @param {string} savedBy    - username of the admin
 */
function saveLayout(stage, sectionIndex, blockTree, savedBy) {
    const store  = _read();
    const key    = _key(stage, sectionIndex);
    const existing = store[key] || _defaultLayout(stage, sectionIndex);

    // Preserve lock state — only explicit lock/unlock calls change it
    store[key] = {
        ...existing,
        stage,
        sectionIndex: Number(sectionIndex),
        cells:   blockTree.cells   || existing.cells,
        savedBy,
        savedAt: new Date().toISOString()
    };

    _write(store);
    return store[key];
}

/**
 * Lock a layout — admin finalizes structure.
 * @param {string} stage
 * @param {number} sectionIndex
 * @param {string} lockedBy  - admin username
 */
function lockLayout(stage, sectionIndex, lockedBy) {
    const store = _read();
    const key   = _key(stage, sectionIndex);

    if (!store[key]) {
        store[key] = _defaultLayout(stage, sectionIndex);
    }

    store[key].locked   = true;
    store[key].lockedBy = lockedBy;
    store[key].lockedAt = new Date().toISOString();

    _write(store);
    return store[key];
}

/**
 * Unlock a layout — admin opens for editing again.
 * @param {string} stage
 * @param {number} sectionIndex
 * @param {string} unlockedBy
 * @param {string} reason
 */
function unlockLayout(stage, sectionIndex, unlockedBy, reason) {
    const store = _read();
    const key   = _key(stage, sectionIndex);

    if (!store[key]) return _defaultLayout(stage, sectionIndex);

    store[key].locked       = false;
    store[key].unlockedBy   = unlockedBy;
    store[key].unlockedAt   = new Date().toISOString();
    store[key].unlockReason = reason || '';

    _write(store);
    return store[key];
}

/**
 * Reset a section layout back to the default (single leaf).
 * @param {string} stage
 * @param {number} sectionIndex
 * @param {string} resetBy
 */
function resetLayout(stage, sectionIndex, resetBy) {
    const store = _read();
    const key   = _key(stage, sectionIndex);

    store[key] = {
        ..._defaultLayout(stage, sectionIndex),
        resetBy,
        resetAt: new Date().toISOString()
    };

    _write(store);
    return store[key];
}

/**
 * Get all saved layouts (for admin overview / export).
 */
function getAllLayouts() {
    return _read();
}

module.exports = {
    getLayout,
    saveLayout,
    lockLayout,
    unlockLayout,
    resetLayout,
    getAllLayouts
};
