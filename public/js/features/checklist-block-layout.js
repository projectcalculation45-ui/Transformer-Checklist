/**
 * checklist-block-layout.js
 * In-Cell Visual Layout Builder (Admin Only)
 */
(function(window) {
    'use strict';

    let _stage = null;
    let _editMode = false;
    let _drawMode = null; // 'split-h' | 'split-v' | 'pointer'
    let _layouts = {}; // sectionIndex -> layout tree
    let _draggingResizer = null;

    const isAdmin = () => window.currentUserRole === 'admin';

    function uid() { return 'blk_' + Math.random().toString(36).substr(2, 9); }

    function _api(endpoint, method, body) {
        if (typeof window.apiCall === 'function') {
            return window.apiCall(endpoint, method || 'GET', body || null);
        }
        const opts = { method: method || 'GET', headers: {'Content-Type': 'application/json'} };
        if (body) opts.body = JSON.stringify(body);
        return fetch(endpoint, opts).then(r => r.json());
    }

    let _autoSaveTimer = null;

    function _triggerAutoSave() {
        const status = document.getElementById('vb-save-status');
        if (status) {
            status.textContent = 'Unsaved Changes';
            status.style.color = '#eab308'; // yellow
        }
        if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
        _autoSaveTimer = setTimeout(_saveAllQuietly, 2000);
    }

    /* --- Toolbar --- */
    function _buildToolbar() {
        if (document.getElementById('vb-toolbar')) return;

        const tb = document.createElement('div');
        tb.id = 'vb-toolbar';
        tb.innerHTML = `
            <div class="vb-title">Visual Builder Tools</div>
            <button class="vb-btn active" data-mode="pointer">👆 Pointer / Drag</button>
            <button class="vb-btn" data-mode="split-h">⬍ Draw Horizontal Line</button>
            <button class="vb-btn" data-mode="split-v">⬌ Draw Vertical Line</button>
            <button class="vb-btn" data-mode="merge" style="color:#fca5a5;">🗑️ Merge (Delete Line)</button>
            <hr>
            <div class="vb-title" style="margin-top:10px;">Components</div>
            <div class="vb-palette-item" draggable="true" data-type="text">📝 Text Label</div>
            <div class="vb-palette-item" draggable="true" data-type="input">✍️ Input Field</div>
            <div class="vb-palette-item" draggable="true" data-type="dropdown">🔽 Dropdown</div>
            <div class="vb-palette-item" draggable="true" data-type="sign">✒️ Signature Box</div>
            <hr>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button class="vb-btn" id="vb-save" style="background:#059669; color:white; flex: 1;">💾 Save Layout</button>
                <span id="vb-save-status" style="font-size: 0.75rem; color: #94a3b8; min-width: 90px; text-align: right;"></span>
            </div>
        `;
        document.body.appendChild(tb);

        tb.querySelectorAll('.vb-btn[data-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                tb.querySelectorAll('.vb-btn[data-mode]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                _drawMode = btn.dataset.mode;
                document.body.dataset.drawMode = _drawMode;
            });
        });

        document.getElementById('vb-save').addEventListener('click', _saveAll);
    }

    function _buildToggle() {
        if (!isAdmin()) return;
        let btn = document.getElementById('blk-edit-toggle');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'blk-edit-toggle';
            btn.style.cssText = 'position:fixed;top:70px;right:18px;z-index:9998;';
            btn.addEventListener('click', toggleEditMode);
            document.body.appendChild(btn);
        }
        btn.textContent = _editMode ? 'Exit Layout Builder' : '⬛ Layout Builder';
        btn.classList.toggle('active', _editMode);
    }

    /* --- Cell Targeting --- */
    function _wrapSections() {
        const tables = document.querySelectorAll('.form-table');
        tables.forEach((table, idx) => {
            if (!_layouts[idx]) _layouts[idx] = { cells: {} };

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach((row, rIdx) => {
                const cells = row.querySelectorAll('td');
                const inp = row.querySelector('input[id], select[id]');
                let rowId = inp ? (inp.id.match(/row_[a-zA-Z0-9_]+/) || [null])[0] : `r${rIdx}`;
                if (!rowId) rowId = `r${rIdx}`;

                cells.forEach((cell, cIdx) => {
                    const cellKey = `${rowId}_c${cIdx}`;
                    cell.dataset.vbCellKey = cellKey;
                    cell.dataset.sectionIndex = idx;
                    
                    if (!cell.dataset.vbInit) {
                        cell.dataset.vbInit = 'true';
                        
                        // If we have saved layout for this cell, apply it!
                        if (_layouts[idx] && _layouts[idx].cells && _layouts[idx].cells[cellKey]) {
                            cell.innerHTML = '';
                            const rootBlock = _buildDOMFromTree(_layouts[idx].cells[cellKey], cellKey, idx);
                            cell.appendChild(rootBlock);
                        } else {
                            // Wrap existing content
                            const content = cell.innerHTML;
                            cell.innerHTML = '';
                            const rootBlock = document.createElement('div');
                            rootBlock.className = 'vb-block vb-root-block';
                            rootBlock.innerHTML = content;
                            cell.appendChild(rootBlock);
                            _attachCellListeners(rootBlock, cellKey, idx);
                        }
                    }
                });
            });
        });
    }

    function _buildDOMFromTree(node, cellKey, secIdx) {
        if (node.type === 'split') {
            const el = document.createElement('div');
            el.className = `vb-split vb-split-${node.direction}`;
            if (node.isRoot) el.classList.add('vb-root-block');
            
            const child1 = _buildDOMFromTree(node.children[0], cellKey, secIdx);
            child1.style.flexBasis = node.resizerPosition + (typeof node.resizerPosition === 'number' ? '%' : '');
            
            const resizer = document.createElement('div');
            resizer.className = `vb-resizer vb-resizer-${node.direction}`;
            resizer.dataset.cellKey = cellKey;
            resizer.dataset.secIdx = secIdx;
            
            if (node.resizerThickness) {
                if (node.direction === 'vertical') resizer.style.width = node.resizerThickness;
                else resizer.style.height = node.resizerThickness;
            }
            if (node.resizerLength) {
                if (node.direction === 'vertical') resizer.style.height = node.resizerLength;
                else resizer.style.width = node.resizerLength;
            }
            
            const child2 = _buildDOMFromTree(node.children[1], cellKey, secIdx);
            child2.style.flexBasis = (100 - parseFloat(node.resizerPosition)) + '%';
            
            el.appendChild(child1);
            el.appendChild(resizer);
            el.appendChild(child2);
            return el;
        } else {
            const el = document.createElement('div');
            el.className = 'vb-block' + (node.isRoot ? ' vb-root-block' : '');
            
            // Restore original HTML if any
            if (node.originalHtml) el.innerHTML = node.originalHtml;

            // Restore items
            if (node.items) {
                node.items.forEach(item => {
                    const cEl = document.createElement('div');
                    cEl.className = 'vb-item';
                    cEl.dataset.type = item.type;
                    cEl.innerHTML = item.html;
                    
                    if (_editMode) {
                        if (!cEl.querySelector('.vb-del-item')) {
                            const delBtn = document.createElement('span');
                            delBtn.className = 'vb-del-item';
                            delBtn.textContent = 'x';
                            delBtn.onclick = (e) => { e.stopPropagation(); cEl.remove(); _saveCellStateToMemory(cellKey, secIdx); };
                            cEl.appendChild(delBtn);
                        }
                    }
                    el.appendChild(cEl);
                });
            }

            _attachCellListeners(el, cellKey, secIdx);
            return el;
        }
    }

    /* --- Interactive Drawing --- */
    function _attachCellListeners(el, cellKey, secIdx) {
        const oldGuide = el.querySelector('.vb-guide');
        if (oldGuide) oldGuide.remove();

        const guide = document.createElement('div');
        guide.className = 'vb-guide';
        el.appendChild(guide);

        el.addEventListener('mousemove', (e) => {
            if (!_editMode || _drawMode === 'pointer' || _drawMode === 'merge') { guide.style.display = 'none'; return; }
            e.stopPropagation();
            const rect = el.getBoundingClientRect();
            guide.style.display = 'block';
            if (_drawMode === 'split-v') {
                guide.className = 'vb-guide guide-v';
                guide.style.left = (e.clientX - rect.left) + 'px';
            } else if (_drawMode === 'split-h') {
                guide.className = 'vb-guide guide-h';
                guide.style.top = (e.clientY - rect.top) + 'px';
            }
        });

        el.addEventListener('mouseleave', () => { if(guide) guide.style.display = 'none'; });

        el.addEventListener('click', (e) => {
            if (!_editMode) return;
            
            // Handle edit item logic
            if (e.target.classList.contains('vb-edit-item')) {
                // ... logic handled inside block ...
                e.stopPropagation();
                const itemEl = e.target.closest('.vb-item');
                const type = itemEl.dataset.type;
                if (type === 'text') {
                    const inp = itemEl.querySelector('.vb-text-input');
                    const val = prompt('Enter label text:', inp.value);
                    if (val !== null) inp.value = val;
                } else if (type === 'input') {
                    const inp = itemEl.querySelector('.vb-data-input');
                    const val = prompt('Enter placeholder for text box:', inp.placeholder);
                    if (val !== null) inp.placeholder = val;
                } else if (type === 'dropdown') {
                    const sel = itemEl.querySelector('.vb-data-dropdown');
                    const currentOpts = Array.from(sel.options).filter(o => o.value !== '').map(o => o.value).join(',');
                    const val = prompt('Enter comma-separated options (e.g. Pass,Fail,N/A):', currentOpts);
                    if (val !== null) {
                        sel.innerHTML = '<option value="">Select...</option>';
                        val.split(',').forEach(opt => {
                            const trimmed = opt.trim();
                            if (trimmed) {
                                const o = document.createElement('option');
                                o.value = trimmed;
                                o.textContent = trimmed;
                                sel.appendChild(o);
                            }
                        });
                    }
                }
                _saveCellStateToMemory(cellKey, secIdx);
                return;
            }

            if (e.target.classList.contains('vb-resizer')) {
                e.stopPropagation();
                _showLinePanel(e.target);
                return;
            } else if (!e.target.closest('#vb-line-panel')) {
                _hideLinePanel();
            }

            if (_drawMode === 'pointer') return;
            e.stopPropagation();
            
            if (_drawMode === 'merge') {
                const parentSplit = el.parentElement;
                if (parentSplit && parentSplit.classList.contains('vb-split')) {
                    const isRoot = parentSplit.classList.contains('vb-root-block');
                    const currentContent = el.innerHTML;
                    parentSplit.innerHTML = '';
                    parentSplit.className = 'vb-block' + (isRoot ? ' vb-root-block' : '');
                    parentSplit.style.flexBasis = '';
                    parentSplit.innerHTML = currentContent;
                    
                    _attachCellListeners(parentSplit, cellKey, secIdx);
                    _saveCellStateToMemory(cellKey, secIdx);
                }
                return;
            }

            const rect = el.getBoundingClientRect();
            let posPct = 50;
            let dir = '';
            if (_drawMode === 'split-v') {
                dir = 'vertical';
                posPct = ((e.clientX - rect.left) / rect.width) * 100;
            } else {
                dir = 'horizontal';
                posPct = ((e.clientY - rect.top) / rect.height) * 100;
            }

            _performSplit(el, dir, posPct, cellKey, secIdx);
        });

        el.addEventListener('dragover', e => { if(_editMode) { e.preventDefault(); e.stopPropagation(); }});
        el.addEventListener('drop', e => {
            if (!_editMode) return;
            e.preventDefault(); e.stopPropagation();
            const type = e.dataTransfer.getData('text/plain');
            if (!type) return;
            
            const cEl = document.createElement('div');
            cEl.className = 'vb-item';
            cEl.dataset.type = type;
            
            const newId = uid();
            if (type === 'text') cEl.innerHTML = `<input type="text" value="Label..." class="vb-text-input"><button class="vb-edit-item" title="Edit Label">⚙️</button>`;
            if (type === 'input') cEl.innerHTML = `<input type="text" id="val_${newId}" placeholder="Enter value..." class="vb-data-input"><button class="vb-edit-item" title="Edit Placeholder">⚙️</button>`;
            if (type === 'dropdown') cEl.innerHTML = `<select id="val_${newId}" class="vb-data-dropdown"><option value="">Select...</option></select><button class="vb-edit-item" title="Edit Options">⚙️</button>`;
            if (type === 'sign') cEl.innerHTML = `<button class="vb-sign-btn">Sign</button>`;
            
            const delBtn = document.createElement('span');
            delBtn.className = 'vb-del-item';
            delBtn.textContent = 'x';
            delBtn.onclick = (ev) => { ev.stopPropagation(); cEl.remove(); _saveCellStateToMemory(cellKey, secIdx); };
            cEl.appendChild(delBtn);
            
            el.insertBefore(cEl, guide);
            _saveCellStateToMemory(cellKey, secIdx);
        });
    }

    function _performSplit(el, dir, posPct, cellKey, secIdx) {
        const guide = el.querySelector('.vb-guide');
        if (guide) guide.remove();
        
        const isRoot = el.classList.contains('vb-root-block');
        const currentContent = el.innerHTML;
        el.innerHTML = '';
        el.className = `vb-split vb-split-${dir}` + (isRoot ? ' vb-root-block' : '');

        const child1 = document.createElement('div');
        child1.className = 'vb-block';
        child1.style.flexBasis = posPct + '%';
        child1.innerHTML = currentContent;
        
        const resizer = document.createElement('div');
        resizer.className = `vb-resizer vb-resizer-${dir}`;
        resizer.dataset.cellKey = cellKey;
        resizer.dataset.secIdx = secIdx;
        
        const child2 = document.createElement('div');
        child2.className = 'vb-block';
        child2.style.flexBasis = (100 - posPct) + '%';
        
        el.appendChild(child1);
        el.appendChild(resizer);
        el.appendChild(child2);

        _attachCellListeners(child1, cellKey, secIdx);
        _attachCellListeners(child2, cellKey, secIdx);

        _saveCellStateToMemory(cellKey, secIdx);
    }

    /* --- Resizer Dragging --- */
    document.addEventListener('mousedown', (e) => {
        if (!_editMode) return;
        if (!e.target.classList.contains('vb-resizer')) return;
        _draggingResizer = e.target;
        document.body.style.cursor = _draggingResizer.classList.contains('vb-resizer-vertical') ? 'col-resize' : 'row-resize';
    });

    document.addEventListener('mousemove', (e) => {
        if (!_draggingResizer) return;
        const splitEl = _draggingResizer.parentElement;
        const rect = splitEl.getBoundingClientRect();
        const child1 = splitEl.children[0];
        const child2 = splitEl.children[2];
        const isVert = splitEl.classList.contains('vb-split-vertical');

        let posPct = isVert ? ((e.clientX - rect.left) / rect.width) * 100 : ((e.clientY - rect.top) / rect.height) * 100;
        if (posPct < 5) posPct = 5;
        if (posPct > 95) posPct = 95;

        child1.style.flexBasis = posPct + '%';
        child2.style.flexBasis = (100 - posPct) + '%';
    });

    document.addEventListener('mouseup', () => {
        if (_draggingResizer) {
            const cellKey = _draggingResizer.dataset.cellKey;
            const secIdx = _draggingResizer.dataset.secIdx;
            
            // If panel is open, update it
            if (_activeResizer === _draggingResizer) {
                _showLinePanel(_draggingResizer);
            }
            
            _draggingResizer = null;
            document.body.style.cursor = '';
            
            if (cellKey && secIdx !== undefined) {
                _saveCellStateToMemory(cellKey, Number(secIdx));
            }
        }
    });

    /* --- Data Persistence --- */
    function _saveCellStateToMemory(cellKey, secIdx) {
        const td = document.querySelector(`td[data-vb-cell-key="${cellKey}"]`);
        if (!td) return;
        const rootBlock = td.querySelector('.vb-root-block');
        if (!rootBlock) return;

        if (!_layouts[secIdx]) _layouts[secIdx] = { cells: {} };
        _layouts[secIdx].cells[cellKey] = _parseCellDOM(rootBlock);
        
        _triggerAutoSave();
    }

    function _parseCellDOM(el) {
        if (el.classList.contains('vb-split')) {
            const isVert = el.classList.contains('vb-split-vertical');
            const resizerEl = el.children[1];
            return {
                type: 'split',
                direction: isVert ? 'vertical' : 'horizontal',
                resizerPosition: el.children[0].style.flexBasis,
                resizerThickness: isVert ? resizerEl.style.width : resizerEl.style.height,
                resizerLength: isVert ? resizerEl.style.height : resizerEl.style.width,
                isRoot: el.classList.contains('vb-root-block'),
                children: [ _parseCellDOM(el.children[0]), _parseCellDOM(el.children[2]) ]
            };
        } else {
            const items = [];
            const guides = el.querySelectorAll('.vb-guide');
            const delBtns = el.querySelectorAll('.vb-del-item');
            const editBtns = el.querySelectorAll('.vb-edit-item');
            guides.forEach(g => g.style.display = 'none');
            delBtns.forEach(d => d.style.display = 'none');
            editBtns.forEach(d => d.style.display = 'none');

            el.querySelectorAll('.vb-item').forEach(itemEl => {
                const inner = itemEl.innerHTML;
                items.push({ type: itemEl.dataset.type, html: inner });
                itemEl.dataset.parsed = 'true';
            });

            const clone = el.cloneNode(true);
            clone.querySelectorAll('.vb-item').forEach(i => i.remove());
            clone.querySelectorAll('.vb-guide').forEach(g => g.remove());
            
            guides.forEach(g => g.style.display = '');
            delBtns.forEach(d => d.style.display = '');
            editBtns.forEach(d => d.style.display = '');

            return { 
                type: 'block', 
                isRoot: el.classList.contains('vb-root-block'),
                originalHtml: clone.innerHTML.trim(), 
                items: items 
            };
        }
    }

    async function _loadLayouts(stage) {
        _layouts = {};
        const stageData = window.checklistMasterData && window.checklistMasterData[stage];
        if (!stageData || !stageData.sections) return;

        for (let i = 0; i < stageData.sections.length; i++) {
            try {
                const r = await _api(`/block-layout/${stage}/${i}`, 'GET');
                if (r && r.success && r.layout && r.layout.cells) {
                    _layouts[i] = r.layout;
                }
            } catch (e) {}
        }
    }

    async function _saveAllQuietly() {
        const status = document.getElementById('vb-save-status');
        if (status) {
            status.textContent = 'Saving...';
            status.style.color = '#3b82f6'; // blue
        }
        let failed = 0;
        let saved = 0;
        for (const [secIdx, layout] of Object.entries(_layouts)) {
            if (layout.cells && Object.keys(layout.cells).length > 0) {
                try {
                    await _api(`/block-layout/${_stage}/${secIdx}`, 'POST', { cells: layout.cells });
                    saved++;
                } catch (e) { failed++; }
            }
        }
        if (status) {
            if (failed === 0) {
                status.textContent = 'All Changes Saved';
                status.style.color = '#10b981'; // green
            } else {
                status.textContent = 'Save Failed';
                status.style.color = '#ef4444'; // red
            }
        }
        return { saved, failed };
    }

    async function _saveAll() {
        const { saved, failed } = await _saveAllQuietly();
        alert(failed === 0 ? `All ${saved} layouts saved!` : `${saved} saved, ${failed} failed`);
    }

    /* --- Palette Dragging --- */
    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('vb-palette-item')) {
            e.dataTransfer.setData('text/plain', e.target.dataset.type);
        }
    });

    /* --- Line Properties Panel --- */
    let _activeResizer = null;

    function _buildLinePanel() {
        if (document.getElementById('vb-line-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'vb-line-panel';
        panel.className = 'vb-panel-floating';
        panel.innerHTML = `
            <div class="vb-title">Line Properties</div>
            <div class="vb-form-group">
                <label>Position (%)</label>
                <div class="vb-input-group">
                    <button class="vb-btn-small" onclick="document.getElementById('vb-line-pos').stepDown(); document.getElementById('vb-line-pos').dispatchEvent(new Event('input'))">-</button>
                    <input type="number" id="vb-line-pos" step="0.5" min="1" max="99">
                    <button class="vb-btn-small" onclick="document.getElementById('vb-line-pos').stepUp(); document.getElementById('vb-line-pos').dispatchEvent(new Event('input'))">+</button>
                </div>
            </div>
            <div class="vb-form-group">
                <label>Thickness (px)</label>
                <div class="vb-input-group">
                    <button class="vb-btn-small" onclick="document.getElementById('vb-line-thick').stepDown(); document.getElementById('vb-line-thick').dispatchEvent(new Event('input'))">-</button>
                    <input type="number" id="vb-line-thick" step="1" min="1" max="20">
                    <button class="vb-btn-small" onclick="document.getElementById('vb-line-thick').stepUp(); document.getElementById('vb-line-thick').dispatchEvent(new Event('input'))">+</button>
                </div>
            </div>
            <div class="vb-form-group">
                <label>Length (%)</label>
                <div class="vb-input-group">
                    <button class="vb-btn-small" onclick="document.getElementById('vb-line-len').stepDown(); document.getElementById('vb-line-len').dispatchEvent(new Event('input'))">-</button>
                    <input type="number" id="vb-line-len" step="1" min="10" max="100">
                    <button class="vb-btn-small" onclick="document.getElementById('vb-line-len').stepUp(); document.getElementById('vb-line-len').dispatchEvent(new Event('input'))">+</button>
                </div>
            </div>
            <button class="vb-btn" id="vb-line-close" style="width:100%; margin-top:8px;">Close</button>
        `;
        document.body.appendChild(panel);

        document.getElementById('vb-line-close').onclick = _hideLinePanel;

        ['pos', 'thick', 'len'].forEach(key => {
            document.getElementById(`vb-line-${key}`).addEventListener('input', _onLinePropertyChange);
        });
    }

    function _showLinePanel(resizer) {
        _activeResizer = resizer;
        const panel = document.getElementById('vb-line-panel');
        if (!panel) return;
        
        const child1 = resizer.previousElementSibling;
        const isVert = resizer.classList.contains('vb-resizer-vertical');
        
        let pos = parseFloat(child1.style.flexBasis) || 50;
        let thick = parseFloat(isVert ? resizer.style.width : resizer.style.height) || 4;
        let len = parseFloat(isVert ? resizer.style.height : resizer.style.width) || 100;

        document.getElementById('vb-line-pos').value = pos;
        document.getElementById('vb-line-thick').value = thick;
        document.getElementById('vb-line-len').value = len;

        document.querySelectorAll('.vb-resizer').forEach(r => r.classList.remove('vb-resizer-active'));
        resizer.classList.add('vb-resizer-active');

        panel.classList.add('visible');
    }

    function _hideLinePanel() {
        _activeResizer = null;
        const panel = document.getElementById('vb-line-panel');
        if (panel) panel.classList.remove('visible');
        document.querySelectorAll('.vb-resizer').forEach(r => r.classList.remove('vb-resizer-active'));
    }

    function _onLinePropertyChange() {
        if (!_activeResizer) return;
        const isVert = _activeResizer.classList.contains('vb-resizer-vertical');
        const child1 = _activeResizer.previousElementSibling;
        const child2 = _activeResizer.nextElementSibling;
        
        const pos = parseFloat(document.getElementById('vb-line-pos').value);
        const thick = parseFloat(document.getElementById('vb-line-thick').value);
        const len = parseFloat(document.getElementById('vb-line-len').value);

        if (pos >= 1 && pos <= 99) {
            child1.style.flexBasis = pos + '%';
            child2.style.flexBasis = (100 - pos) + '%';
        }
        
        if (thick >= 1) {
            if (isVert) _activeResizer.style.width = thick + 'px';
            else _activeResizer.style.height = thick + 'px';
        }

        if (len >= 1 && len <= 100) {
            if (isVert) _activeResizer.style.height = len + '%';
            else _activeResizer.style.width = len + '%';
        }

        const cellKey = _activeResizer.dataset.cellKey;
        const secIdx = _activeResizer.dataset.secIdx;
        if (cellKey && secIdx !== undefined) {
            _saveCellStateToMemory(cellKey, Number(secIdx));
        }
    }

    /* --- Initialization --- */
    function toggleEditMode() {
        if (!isAdmin()) return;
        _editMode = !_editMode;
        document.body.classList.toggle('vb-edit-mode', _editMode);
        _drawMode = 'pointer';

        if (_editMode) {
            _buildToolbar();
            _buildLinePanel();
            document.getElementById('vb-toolbar').classList.add('visible');
        } else {
            const tb = document.getElementById('vb-toolbar');
            if (tb) tb.classList.remove('visible');
            _hideLinePanel();
        }
        _buildToggle();
        
        const tables = document.querySelectorAll('.form-table');
        tables.forEach(table => {
            const cells = table.querySelectorAll('td');
            cells.forEach(cell => {
                const guides = cell.querySelectorAll('.vb-guide');
                const delBtns = cell.querySelectorAll('.vb-del-item');
                guides.forEach(g => g.style.display = _editMode ? '' : 'none');
                
                if (_editMode) {
                    cell.querySelectorAll('.vb-item').forEach(itemEl => {
                        if (!itemEl.querySelector('.vb-del-item')) {
                            const delBtn = document.createElement('span');
                            delBtn.className = 'vb-del-item';
                            delBtn.textContent = 'x';
                            delBtn.onclick = (e) => { 
                                e.stopPropagation(); 
                                itemEl.remove(); 
                                _saveCellStateToMemory(cell.dataset.vbCellKey, cell.dataset.sectionIndex); 
                            };
                            itemEl.appendChild(delBtn);
                        }
                    });
                }
            });
        });
    }

    async function init(stage) {
        _stage = stage;
        _drawMode = 'pointer';
        if (isAdmin()) {
            _buildToggle();
            await _loadLayouts(stage);
        } else {
            await _loadLayouts(stage);
        }
        setTimeout(_wrapSections, 140);
    }

    window.BlockLayout = { init, toggleEditMode, isEditMode: () => _editMode };

})(window);
