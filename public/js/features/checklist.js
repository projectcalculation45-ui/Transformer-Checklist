/* ===============================
   MANUFACTURING CHECKLIST LOGIC
   Atlanta PDF-based checklist with 4-role system
================================ */

let currentStage = 'winding1';
let currentWO = '';
let currentTransformerData = null;
let currentStageStatus = null; // 🔹 NEW: Track stage status

/* ===============================
   STAGE CONTROL SYSTEM (NEW)
================================ */

/**
 * Load and display stage status
 */
async function loadStageStatus(wo) {
    if (!wo) {
        console.warn('⚠️ No W.O. provided to loadStageStatus');
        return;
    }

    try {
        const response = await getStageStatus(wo);
        currentStageStatus = response.data || response;
        console.log(`📊 Stage status loaded for ${wo}:`, currentStageStatus);

        // Ensure stage status container is visible
        const stageContainer = document.getElementById('stageStatusContainer');
        if (stageContainer) {
            stageContainer.style.display = 'block';
        }

        // Update UI with stage status
        updateStageUI();

        return currentStageStatus;
    } catch (error) {
        console.error('❌ Error loading stage status:', error);
        // Create default structure if API fails
        currentStageStatus = {
            winding: { status: 'in-progress', completionPercentage: 0, locked: false, completedAt: null, completedBy: null },
            spa: { status: 'pending', completionPercentage: 0, locked: false, completedAt: null, completedBy: null },
            coreCoil: { status: 'pending', completionPercentage: 0, locked: true, completedAt: null, completedBy: null },
            tanking: { status: 'pending', completionPercentage: 0, locked: true, completedAt: null, completedBy: null },
            vpd: { status: 'pending', completionPercentage: 0, locked: true, completedAt: null, completedBy: null },
            tankFilling: { status: 'pending', completionPercentage: 0, locked: true, completedAt: null, completedBy: null },
            coreBuilding: { status: 'pending', completionPercentage: 0, locked: true, completedAt: null, completedBy: null },
            shunt_reactor: { status: 'in-progress', completionPercentage: 0, locked: false, completedAt: null, completedBy: null }
        };
        updateStageUI();
        return null;
    }
}

/**
 * Update stage UI with badges and lock indicators
 */
function updateStageUI() {
    if (!currentStageStatus) return;

    const stageContainer = document.getElementById('stageStatusContainer');
    if (!stageContainer) return;

    // Show the container
    stageContainer.style.display = 'block';

    const stages = ['winding', 'spa', 'vpd', 'coreCoil', 'tanking', 'tankFilling', 'coreBuilding', 'shunt_reactor'];
    const stageLabels = {
        winding: 'Winding',
        spa: 'SPA',
        vpd: 'VPD',
        coreCoil: 'Core Coil',
        tanking: 'Repacking & Tanking',
        tankFilling: 'Tank Filling',
        coreBuilding: 'Core Building',
        shunt_reactor: 'Shunt Reactor'
    };
    let html = '<div class="stage-badges">';

    stages.forEach(stage => {
        const stageInfo = currentStageStatus[stage] || { status: 'pending', completionPercentage: 0, locked: true };

        let badge = '';
        let icon = '';

        if (stageInfo.locked && stageInfo.status === 'completed') {
            badge = 'completed';
            icon = '✅';
        } else if (stageInfo.locked && stageInfo.status !== 'completed') {
            badge = 'pending';
            icon = '🔒';
        } else if (stageInfo.status === 'in-progress') {
            badge = 'in-progress';
            icon = '⏳';
        } else {
            badge = 'pending';
            icon = '⏳';
        }

        const label = stageLabels[stage] || stage.charAt(0).toUpperCase() + stage.slice(1);
        const percentage = stageInfo.completionPercentage || 0;

        html += `<div class="stage-badge ${badge}" title="${percentage}% complete">
                    <span>${icon}</span>
                    <span>${label}</span>
                    <span class="percentage">${percentage}%</span>
                </div>`;
    });

    html += '</div>';
    stageContainer.innerHTML = html;

    // 🔹 NEW: Update stage control buttons visibility
    updateStageControlButtons();
}

function hideAllStagePanels() {
    ['stageControlButtons', 'stageLockMessage', 'stageApprovedMessage',
        'stageRejectedMessage', 'stageAwaitingQAMessage'].forEach(id => {
            const div = document.getElementById(id);
            if (div) div.style.display = 'none';
        });
}

function renderApprovedState(stageInfo, isAdmin) {
    const approvedMessageDiv = document.getElementById('stageApprovedMessage');
    if (approvedMessageDiv) {
        approvedMessageDiv.style.display = 'block';
        const subMsg = document.getElementById('stageApprovedSubMsg');
        if (subMsg) {
            const approvedBy = stageInfo.approvedBy || 'QA';
            const approvedAt = stageInfo.approvedAt
                ? new Date(stageInfo.approvedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : '';
            subMsg.textContent = `Approved by ${approvedBy}${approvedAt ? ' on ' + approvedAt : ''}.`;
        }
        const adminBtn = document.getElementById('adminUnlockBtnApproved');
        if (adminBtn) adminBtn.style.display = isAdmin ? 'inline-block' : 'none';
    }
}

function renderAwaitingQAState(stageInfo, isAdmin, isQA) {
    const awaitingQADiv = document.getElementById('stageAwaitingQAMessage');
    const lockMessageDiv = document.getElementById('stageLockMessage');
    if (awaitingQADiv) {
        awaitingQADiv.style.display = 'block';
        const subMsg = document.getElementById('stageAwaitingSubMsg');
        if (subMsg && stageInfo.submittedBy) {
            const submittedAt = stageInfo.submittedAt
                ? new Date(stageInfo.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : '';
            subMsg.textContent = `Submitted by ${stageInfo.submittedBy}${submittedAt ? ' on ' + submittedAt : ''}. QA is reviewing — awaiting response.`;
        }
        // QA/admin: show Approve + Reject
        if (isQA || isAdmin) {
            if (lockMessageDiv) {
                lockMessageDiv.style.display = 'block';
                awaitingQADiv.style.display = 'none'; // QA sees lock panel with action buttons
                const approveBtn = document.getElementById('approveStageBtn');
                if (approveBtn) approveBtn.style.display = 'inline-block';
                const rejectBtn = document.getElementById('rejectStageBtn');
                if (rejectBtn) rejectBtn.style.display = 'inline-block';
            }
        } else {
            const reopenBtn = document.getElementById('adminUnlockBtnAwaiting');
            if (reopenBtn) reopenBtn.style.display = isAdmin ? 'inline-block' : 'none';
        }
    }
}

function renderLockedCompletedState(isAdmin, isQA) {
    const lockMessageDiv = document.getElementById('stageLockMessage');
    if (lockMessageDiv) {
        lockMessageDiv.style.display = 'block';
        const approveBtn = document.getElementById('approveStageBtn');
        if (approveBtn) approveBtn.style.display = (isQA || isAdmin) ? 'inline-block' : 'none';
        const rejectBtn = document.getElementById('rejectStageBtn');
        if (rejectBtn) rejectBtn.style.display = (isQA || isAdmin) ? 'inline-block' : 'none';
        const reopenBtn = document.getElementById('adminUnlockBtnLocked');
        if (reopenBtn) reopenBtn.style.display = isAdmin ? 'inline-block' : 'none';
    }
}

function renderInProgressState(stageInfo, isAdmin, isProduction, isLocked, status) {
    const controlDiv = document.getElementById('stageControlButtons');
    const rejectedMessageDiv = document.getElementById('stageRejectedMessage');

    // Show rejection notice if stage was previously rejected
    if (stageInfo.rejectionReason) {
        if (rejectedMessageDiv) {
            rejectedMessageDiv.style.display = 'block';
            const rejBy = document.getElementById('stageRejectedByMsg');
            if (rejBy) {
                const rejectedBy = stageInfo.rejectedBy || 'QA';
                const rejectedAt = stageInfo.rejectedAt
                    ? new Date(stageInfo.rejectedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '';
                rejBy.textContent = `Returned by ${rejectedBy}${rejectedAt ? ' on ' + rejectedAt : ''}:`;
            }
            const reasonEl = document.getElementById('stageRejectionReasonText');
            if (reasonEl) reasonEl.textContent = stageInfo.rejectionReason;
        }
    }

    const isEditable = !isLocked && status === 'in-progress';
    if (isEditable || isAdmin) {
        if (controlDiv) {
            controlDiv.style.display = 'block';
            const submitBtn = controlDiv.querySelector('button[onclick*="markStageComplete"]');
            if (submitBtn) submitBtn.style.display = isEditable ? 'inline-block' : 'none';
            // Ready for QA button: show for production role when editable
            const readyBtn = document.getElementById('readyForQABtn');
            if (readyBtn) readyBtn.style.display = (isEditable && isProduction) ? 'inline-block' : 'none';
            const adminBtn = document.getElementById('adminUnlockBtn');
            if (adminBtn) adminBtn.style.display = (isAdmin && !isEditable) ? 'inline-block' : 'none';
            const hasVisible = controlDiv.querySelectorAll('button');
            const anyVisible = Array.from(hasVisible).some(b => b.style.display !== 'none');
            if (!anyVisible) controlDiv.style.display = 'none';
        }
    }
}

/**
 * Show/hide stage control buttons based on stage status and user role
 */
function updateStageControlButtons() {
    if (!currentStageStatus || !currentStage) return;

    hideAllStagePanels();

    const mainStage = currentStage.startsWith('winding') ? 'winding' : currentStage;
    const stageInfo = currentStageStatus[mainStage];

    if (!stageInfo) return;

    const userRole = window.currentUserRole;
    const isAdmin = userRole === 'admin';
    const isQA = userRole === 'quality';
    const isProduction = userRole === 'engineer' || userRole === 'production';

    const status = stageInfo.status;
    const isLocked = !!stageInfo.locked;

    if (status === 'approved') {
        renderApprovedState(stageInfo, isAdmin);
    } else if (status === 'awaiting_qa') {
        renderAwaitingQAState(stageInfo, isAdmin, isQA);
    } else if (isLocked && status === 'completed') {
        renderLockedCompletedState(isAdmin, isQA);
    } else {
        renderInProgressState(stageInfo, isAdmin, isProduction, isLocked, status);
    }

    if (typeof updateStageTabBadge === 'function') {
        updateStageTabBadge(mainStage, status);
    }
}

/**
 * Check if stage can be accessed
 */
async function validateStageAccess(wo, stage) {
    try {
        console.log(`🔍 Validating access for WO: ${wo}, Stage: ${stage}`);

        // If no stage status loaded, allow access (will show lock message if needed)
        if (!currentStageStatus) {
            console.warn('⚠️ Stage status not loaded, allowing access');
            return true;
        }

        const mainStage = stage.startsWith('winding') ? 'winding' : stage;
        const stageInfo = currentStageStatus[mainStage];

        if (!stageInfo) {
            console.warn(`⚠️ Stage ${mainStage} not found in status`);
            return true;
        }

        // Check if stage is locked and completed
        if (stageInfo.locked && stageInfo.status === 'completed') {
            console.warn(`⛔ Access denied - stage is locked: ${mainStage}`);

            if (window.currentUserRole === 'admin') {
                console.warn(`🔓 Admin override: granting access to locked stage.`);
                return true;
            }

            // Allow QA to view (but API/UI will block their edits)
            if (window.currentUserRole === 'quality') {
                return true;
            }

            alert('⛔ Stage is locked and cannot be edited.\nContact admin to unlock.');
            return false;
        }

        return true;
    } catch (error) {
        console.error('❌ Stage access validation error:', error);
        // Allow access on error - let backend handle validation
        return true;
    }
}

/**
 * Mark stage as complete
 */
async function markStageComplete(wo, stage) {
    if (!wo || !stage) {
        alert('⚠️ Missing WO or stage');
        return false;
    }

    const confirmed = confirm(`✅ Submit ${stage.toUpperCase()} stage for QA review?\n\nThis will lock the stage and send it for QA approval.`);
    if (!confirmed) return false;

    try {
        const response = await completeStage(wo, stage);
        const result = response.data || response;

        console.log('✅ Stage submitted for review:', result);
        alert(`✅ ${stage.toUpperCase()} stage submitted for QA review!`);

        // Reload stage status
        await loadStageStatus(wo);

        return true;
    } catch (error) {
        console.error('❌ Error submitting stage:', error);
        alert(`❌ Error: ${error.message}`);
        return false;
    }
}

/**
 * Approve the current stage (QA / admin only)
 * Calls POST /stage/:wo/approve → marks approved, unlocks next stage
 */
async function approveCurrentStage() {
    const wo = window.currentWO;
    const stage = window.currentStage;
    const mainStage = stage && stage.startsWith('winding') ? 'winding' : stage;

    if (!wo || !mainStage) {
        alert('⚠️ No active WO or stage');
        return;
    }

    const confirmed = confirm(`✔ Approve ${mainStage.toUpperCase()} stage?\n\nThis will mark the stage as QA-approved and unlock the next stage.`);
    if (!confirmed) return;

    try {
        const btn = document.getElementById('approveStageBtn');
        if (btn) { btn.disabled = true; btn.textContent = '⏳ Approving…'; }

        const response = await apiCall(`/stage/${encodeURIComponent(wo)}/approve`, 'POST', { stage: mainStage });

        if (response.success || response.data) {
            alert(`✔ ${mainStage.toUpperCase()} stage approved successfully!\nThe next stage is now unlocked.`);
            await loadStageStatus(wo);
        } else {
            throw new Error(response.error || 'Approval failed');
        }
    } catch (error) {
        console.error('❌ Stage approval error:', error);
        alert(`❌ ${error.message}`);
        const btn = document.getElementById('approveStageBtn');
        if (btn) { btn.disabled = false; btn.textContent = '✔ Approve Stage'; }
    }
}

/**
 * Show the Reject Stage modal
 */
function showRejectStageModal() {
    const userRole = window.currentUserRole;
    if (userRole !== 'quality' && userRole !== 'admin') {
        alert('⚠️ Only QA or admin can reject a stage');
        return;
    }
    const modal = document.getElementById('rejectStageModal');
    const textarea = document.getElementById('rejectStageReason');
    const errDiv = document.getElementById('rejectReasonError');
    if (textarea) textarea.value = '';
    if (errDiv) errDiv.style.display = 'none';
    if (modal) modal.style.display = 'flex';
}

/**
 * Close the Reject Stage modal
 */
function closeRejectStageModal() {
    const modal = document.getElementById('rejectStageModal');
    if (modal) modal.style.display = 'none';
}

/**
 * Confirm stage rejection
 */
async function confirmRejectStage() {
    const wo = window.currentWO;
    const stage = window.currentStage;
    const mainStage = stage && stage.startsWith('winding') ? 'winding' : stage;
    const reason = (document.getElementById('rejectStageReason')?.value || '').trim();
    const errDiv = document.getElementById('rejectReasonError');

    if (reason.length < 10) {
        if (errDiv) errDiv.style.display = 'block';
        return;
    }
    if (errDiv) errDiv.style.display = 'none';

    if (!wo || !mainStage) {
        alert('⚠️ No active WO or stage');
        return;
    }

    try {
        const confirmBtn = document.querySelector('#rejectStageModal .btn-danger');
        if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.textContent = '⏳ Rejecting…'; }

        const response = await apiCall(`/stage/${encodeURIComponent(wo)}/reject`, 'POST', { stage: mainStage, reason });

        if (response.success || response.data) {
            closeRejectStageModal();
            alert(`❌ Stage returned for corrections.\n\nProduction engineer will see the QA comment:\n"${reason}"`);
            await loadStageStatus(wo);
        } else {
            throw new Error(response.error || 'Rejection failed');
        }
    } catch (error) {
        console.error('❌ Stage rejection error:', error);
        alert(`❌ ${error.message}`);
        const confirmBtn = document.querySelector('#rejectStageModal .btn-danger');
        if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = '❌ Confirm Rejection'; }
    }
}

/**
 * Production engineer: signal this stage is ready for QA inspection
 * Calls POST /stage/:wo/ready-for-qa → sets status = awaiting_qa
 */
async function submitStageForQAReview() {
    const wo = window.currentWO;
    const stage = window.currentStage;
    const mainStage = stage && stage.startsWith('winding') ? 'winding' : stage;

    if (!wo || !mainStage) { alert('⚠️ No active WO or stage'); return; }

    const confirmed = confirm(`📋 Mark ${mainStage.toUpperCase()} as Ready for QA?\n\nThe stage will be locked and QA will be able to review and approve or reject it.`);
    if (!confirmed) return;

    try {
        const btn = document.getElementById('readyForQABtn');
        if (btn) { btn.disabled = true; btn.textContent = '⏳ Submitting…'; }

        const response = await apiCall(`/stage/${encodeURIComponent(wo)}/ready-for-qa`, 'POST', { stage: mainStage });

        if (response.success || response.data) {
            alert(`📋 ${mainStage.toUpperCase()} submitted for QA review!\nYou will be notified once QA responds.`);
            await loadStageStatus(wo);
        } else {
            throw new Error(response.error || 'Submission failed');
        }
    } catch (error) {
        console.error('❌ Ready for QA error:', error);
        alert(`❌ ${error.message}`);
        const btn = document.getElementById('readyForQABtn');
        if (btn) { btn.disabled = false; btn.textContent = '📋 Ready for QA'; }
    }
}

/**
 * Unlock stage (admin only)
 */
async function showUnlockDialog(wo, stage) {
    if (window.currentUserRole !== 'admin') {
        alert('⚠️ Only admins can unlock stages');
        return;
    }

    const effectiveWO = wo || window.currentWO;
    const effectiveStage = stage || window.currentStage;

    if (!effectiveWO || !effectiveStage) {
        alert('⚠️ No active WO or stage');
        return;
    }

    const reason = prompt(`🔓 Unlock ${effectiveStage.toUpperCase()} stage?\n\nEnter reason (min 10 characters):`);
    if (!reason || reason.length < 10) {
        alert('⚠️ Please enter a valid reason (minimum 10 characters)');
        return;
    }

    try {
        const response = await unlockStage(effectiveWO, effectiveStage, reason);
        const result = response.data || response;

        console.log('🔓 Stage unlocked:', result);
        alert(`✅ ${effectiveStage.toUpperCase()} stage unlocked by admin.\nReason: ${reason}`);

        await loadStageStatus(effectiveWO);

    } catch (error) {
        console.error('❌ Error unlocking stage:', error);
        alert(`❌ Error: ${error.message}`);
    }
}

/* ===============================
   LOAD CHECKLIST TRANSFORMERS
================================ */
async function loadChecklistTransformers() {
    try {
        const response = await apiCall('/transformers');

        const transformers = response.data || response;

        const select = document.getElementById('checklistWOSelect');
        if (!select) {
            console.error('❌ Select element not found: checklistWOSelect');
            return;
        }

        if (!transformers || transformers.length === 0) {
            console.warn('⚠️ No transformers available');
            select.innerHTML = '<option value="">No transformers available</option>';
            return;
        }

        // Preserve the user's current selection so navigating away and back
        // doesn't silently reset their activity (Bug 3)
        const previousWO = select.value || window.currentWO || '';

        // Get unique W.O. numbers to avoid duplicates
        const uniqueTransformers = Array.from(new Map(transformers.map(t => [t.wo, t])).values());

        const options = uniqueTransformers.map(t =>
            `<option value="${t.wo}" data-transformer='${JSON.stringify(t)}'>${t.wo} - ${t.customer || 'Unknown'}</option>`
        ).join('');

        select.innerHTML = '<option value="">-- Select Transformer W.O. --</option>' + options;
        console.log(`✅ Loaded ${uniqueTransformers.length} transformers`);

        // Restore previous selection and fire change event so the UI syncs
        if (previousWO && uniqueTransformers.some(t => t.wo === previousWO)) {
            select.value = previousWO;
            // Fire the change event to ensure customer details / stage tables load
            select.dispatchEvent(new Event('change'));
        }

    } catch (error) {
        console.error('❌ Error loading transformers:', error);
        const select = document.getElementById('checklistWOSelect');
        if (select) {
            select.innerHTML = '<option value="">Error loading transformers</option>';
        }
    }
}

/* ===============================
   W.O. SELECTION CHANGE
================================ */
function onWOChange() {
    const select = document.getElementById('checklistWOSelect');
    if (!select) return;

    const selectedOption = select.options[select.selectedIndex];
    currentWO = select.value;
    window.currentWO = currentWO;

    if (currentWO) {
        currentTransformerData = JSON.parse(selectedOption.getAttribute('data-transformer'));
        window.currentTransformerData = currentTransformerData;

        // Show transformer details
        document.getElementById('woDetails').style.display = 'block';
        document.getElementById('woCustomer').textContent = currentTransformerData.customer || 'N/A';
        document.getElementById('woRating').textContent = currentTransformerData.rating || 'N/A';
        document.getElementById('woVoltage').textContent =
            `HV: ${currentTransformerData.hv || 'N/A'}V / LV: ${currentTransformerData.lv || 'N/A'}V`;

        // Show checklist content
        document.getElementById('checklistMainContent').style.display = 'block';
        document.getElementById('noWOMessage').style.display = 'none';

        // 🔹 NEW: Load stage status
        loadStageStatus(currentWO).then(() => {
            // Load the current stage
            loadStageContent(currentStage);
            setTimeout(() => {
                loadChecklistData(currentStage);
                updateProgress();
            }, 100);
        }).catch(() => {
            // Even if stage status fails, still render the checklist
            loadStageContent(currentStage);
            setTimeout(() => {
                loadChecklistData(currentStage);
                updateProgress();
            }, 100);
        });
    } else {
        document.getElementById('checklistMainContent').style.display = 'none';
        document.getElementById('noWOMessage').style.display = 'block';
        document.getElementById('woDetails').style.display = 'none';
        document.getElementById('progressBar').style.display = 'none';
        currentTransformerData = null;
        currentStageStatus = null;
    }
}

/* ===============================
   DATA EXTRACTION ADAPTER
================================ */
function extractChecklistRowData(rowId, defaultRowType) {
    let actualValue = '';
    let specifiedValue = undefined;
    const allValues = {};
    const allSpecifiedValues = {};
    const rowEl = document.getElementById(rowId);
    let rowType = defaultRowType;

    if (rowEl) {
        // Collect ALL inputs, selects, and textareas within this row
        const allInputs = rowEl.querySelectorAll('input, select, textarea');

        allInputs.forEach(input => {
            // Skip hidden elements, buttons, and readonly structural fields
            if (input.type === 'hidden' || input.type === 'button' || input.type === 'submit') return;

            const id = input.id;
            if (!id) return;

            // Skip standard sign-off/administrative/structural fields
            if (id === `technician_${rowId}` ||
                id === `shopSup_${rowId}` ||
                id === `qaSup_${rowId}` ||
                id === `remark_${rowId}` ||
                id === `descInput_${rowId}` ||
                id.startsWith('techTime_') ||
                id.startsWith('shopSupTime_') ||
                id.startsWith('qaSupTime_') ||
                id.startsWith('final_qa_') ||
                id.startsWith('cn_operator_') ||
                id.startsWith('cn_shop_') ||
                id.startsWith('cn_qa_') ||
                id.startsWith('jack_total_') ||
                id.startsWith('jack_capacity_') ||
                id.startsWith('jack_ton_') ||
                id.startsWith('jack_psi_')) {
                return;
            }

            // If it's a checkbox/radio, collect boolean state
            if (input.type === 'checkbox' || input.type === 'radio') {
                allValues[id] = input.checked ? 'Yes' : 'No';
            } else {
                // Extract specifiedValue fields
                if (id === `specifiedValue_${rowId}`) {
                    specifiedValue = input.value || '';
                    return;
                } else if (id.startsWith(`specifiedValue_${rowId}_`)) {
                    let key = id.replace(`specifiedValue_${rowId}_`, '');
                    key = key.replace(/_/g, ' ');
                    if (key) allSpecifiedValues[key] = input.value || '';
                    return;
                }

                // Determine a clean key for the JSON object
                let key = id;
                if (id === `actualValue_${rowId}`) {
                    key = 'Value'; // Main input fallback key
                } else if (id.startsWith(`actualValue_${rowId}_`)) {
                    // Extract custom suffix (e.g., actualValue_rowId_Top -> Top)
                    key = id.replace(`actualValue_${rowId}_`, '');
                    key = key.replace(/_/g, ' '); // Convert 'U_Phase' to 'U Phase'
                }

                // Save the value
                if (key) {
                    allValues[key] = input.value || '';
                }
            }
        });
    }

    // Determine final actualValue based on collected fields
    const keys = Object.keys(allValues);
    if (keys.length === 1 && keys[0] === 'Value') {
        // Only the main standard input was found
        actualValue = allValues['Value'];
    } else if (keys.length > 0) {
        // Remove dummy main input if it exists but other inputs were collected
        if ('Value' in allValues) {
            delete allValues['Value'];
        }

        // Force row type to 'multi-field' since we detected multiple or suffixed inputs
        if (!rowType) {
            rowType = 'multi-field';
        }

        actualValue = JSON.stringify(allValues);
    }

    // Combine specified values if multiple were found
    if (Object.keys(allSpecifiedValues).length > 0) {
        specifiedValue = JSON.stringify(allSpecifiedValues);
    }

    // Extract Technician, Supervisors, and Remarks
    let technician = document.getElementById(`technician_${rowId}`)?.value || '';
    let shopSupervisor = document.getElementById(`shopSup_${rowId}`)?.value || '';
    let qaSupervisor = document.getElementById(`qaSup_${rowId}`)?.value || '';
    let remark = document.getElementById(`remark_${rowId}`)?.value || '';

    // Handle Split Sign-offs (tmb-measurements, etc.)
    const phasesForSplit = ['U_Phase', 'V_Phase', 'W_Phase'];

    if (!technician) {
        let techSplit = {};
        phasesForSplit.forEach(phase => {
            const el = document.getElementById(`technician_${rowId}_${phase}`);
            if (el && el.value) techSplit[phase.replace('_', ' ')] = el.value;
        });
        if (Object.keys(techSplit).length > 0) technician = JSON.stringify(techSplit);
    }

    if (!shopSupervisor) {
        let shopSplit = {};
        phasesForSplit.forEach(phase => {
            const el = document.getElementById(`shopSup_${rowId}_${phase}`);
            if (el && el.value) shopSplit[phase.replace('_', ' ')] = el.value;
        });
        if (Object.keys(shopSplit).length > 0) shopSupervisor = JSON.stringify(shopSplit);
    }

    if (!qaSupervisor) {
        let qaSplit = {};
        phasesForSplit.forEach(phase => {
            const el = document.getElementById(`qaSup_${rowId}_${phase}`);
            if (el && el.value) qaSplit[phase.replace('_', ' ')] = el.value;
        });
        if (Object.keys(qaSplit).length > 0) qaSupervisor = JSON.stringify(qaSplit);
    }

    // Remark Split
    if (!remark) {
        let remSplit = {};
        phasesForSplit.forEach(phase => {
            const el = document.getElementById(`remark_${rowId}_${phase}`);
            if (el && el.value) remSplit[phase.replace('_', ' ')] = el.value;
        });
        if (Object.keys(remSplit).length > 0) remark = JSON.stringify(remSplit);
    }

    return {
        actualValue,
        specifiedValue,
        rowType,
        technician,
        shopSupervisor,
        qaSupervisor,
        remark
    };
}

/* ===============================
   SAVE CHECKLIST ITEM (PDF Structure)
================================ */
async function saveNewChecklistItem(stage, itemNumber, rowId) {
    if (!currentWO) {
        alert('⚠️ Please select a transformer W.O. number first!');
        return;
    }

    // 🔹 NEW: Check stage access before saving
    const canAccess = await validateStageAccess(currentWO, stage);
    if (!canAccess) {
        return;
    }

    // Read the row type from the DOM element's data-row-type attribute.
    // Falls back to rowId prefix heuristic for rows rendered by ui.js.
    const rowEl2 = document.getElementById(rowId);
    let initialRowType = rowEl2?.dataset?.rowType || '';

    // Extract all relevant data fields using the adapter
    const extractedData = extractChecklistRowData(rowId, initialRowType);
    let { actualValue, specifiedValue, rowType, technician, shopSupervisor, qaSupervisor, remark } = extractedData;

    // ── Row-type-aware validation ────────────────────────────────────────────
    // Types that NEVER expose a single `actualValue_${rowId}` input — either they
    // use no actual-value field (structural rows) or they already gathered their
    // values above into the JSON `actualValue` string (multi-field rows).
    // All of these skip the "empty actualValue" guard below.
    const NO_VALUE_TYPES = new Set([
        // Structural / display-only rows
        'section-header', 'stop-stage', 'jack-diagram',
        // Complex sub-table rows (their data is collected into allValues above)
        'cooling-nomex-table', 'lead-assembly-table', 'observation-table',
        'shield-preparation-table', 'drum-details-table',
        'brazed-joints-table', 'dof-washer-table',
        'sr-strip-wrap-full',
        // Multi-field rows — values already captured into JSON string above
        'tcb-blocks', 'wlt-blocks', 'sr-disc-height',
        'tmb-measurements', 'ok-notok', 'ok-notok-limbs',
        'text-phases', 'text-per-phase', 'phase-ok-notok', 'ok-notok-stacked',
    ]);

    // Heuristic fallback: infer type from the DOM when attribute is absent
    if (!rowType) {
        if (!document.getElementById(`actualValue_${rowId}`)) {
            // No main input AND no collected value → complex structural row
            rowType = 'section-header';
        } else {
            rowType = 'standard';
        }
    }

    // Ensure multi-field types are properly registered
    if (rowType === 'multi-field') {
        NO_VALUE_TYPES.add('multi-field');
    }

    // Helper: show per-row error instead of generic alert
    function showRowError(msg) {
        const rowElem = document.getElementById(rowId);
        if (rowElem) {
            rowElem.classList.add('row-validation-error');
            setTimeout(() => rowElem.classList.remove('row-validation-error'), 2500);
        }
        if (typeof showToast === 'function') {
            showToast(msg, 'error');
        } else {
            alert(msg);)
        }
    }

    // For multi-field rows that DID populate allValues, validate that at least
    // one sub-field has a non-empty value (prevents saving blank multi-field rows)
    if (NO_VALUE_TYPES.has(rowType) && actualValue && actualValue.startsWith('{')) {
        try {
            const parsed = JSON.parse(actualValue);
            const hasAtLeastOne = Object.values(parsed).some(
                v => v !== null && v !== undefined && String(v).trim() !== ''
            );
            if (!hasAtLeastOne) {
                // All sub-fields empty — require at least one value
                showRowError('❌ Please fill at least one field in Actual Value');
                return;
            }
        } catch (_) { /* malformed JSON – let it pass to the server */ }
    }

    // actualValue is required only for standard single-input rows
    const requiresValue = !NO_VALUE_TYPES.has(rowType);
    if (requiresValue) {
        // Strict check: value must not be null, undefined, or empty string
        const trimmed = (actualValue !== null && actualValue !== undefined) ? String(actualValue).trim() : '';
        if (trimmed === '') {
            showRowError('❌ Please enter Actual Value for this row');
            return;
        }
    }

    // Re-read technician in case it is a hidden auto-filled field
    if (!technician) {
        const hiddenTech = document.getElementById(`technician_${rowId}`);
        technician = hiddenTech?.value || '';
    }

    // Only block save if technician field actually exists in this row
    const techField = document.getElementById(`technician_${rowId}`);
    if (techField && !technician) {
        showRowError('❌ Please enter your name in the Technician field');
        return;
    }

    // Get current timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN');

    const checklistData = {
        wo: String(currentWO || ''),
        customerId: String(currentTransformerData?.customerId || ''),
        customer: String(currentTransformerData?.customer || ''),
        stage: String(stage || ''),
        itemNumber: Number(itemNumber),
        rowId: String(rowId || ''),
        actualValue: String(actualValue || ''),
        specifiedValue: typeof specifiedValue !== 'undefined' ? String(specifiedValue) : '',
        technician: String(technician || ''),
        shopSupervisor: String(shopSupervisor || ''),
        qaSupervisor: String(qaSupervisor || ''),
        remark: String(remark || ''),
        rowType: String(rowType || 'standard'),
        timestamp: String(timestamp || ''),
        userId: String(window.currentUserId || ''),
        userName: String(window.currentUserName || ''),
        userRole: String(window.currentUserRole || '')
    };

    console.log('📤 Sending checklist data:', JSON.stringify(checklistData, null, 2));

    try {
        const response = await fetch(`${API_BASE}/checklist/save`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checklistData)
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Non-JSON response:', text);
            throw new Error('Server returned non-JSON response');
        }

        const result = await response.json();
        console.log('📥 Server response:', result);

        if (response.ok && result.success) {
            // Display timestamps
            if (technician) {
                const techTime = document.getElementById(`techTime_${rowId}`);
                if (techTime) techTime.textContent = timestamp;
            }

            if (shopSupervisor) {
                const shopTime = document.getElementById(`shopTime_${rowId}`);
                if (shopTime) shopTime.textContent = timestamp;
            }

            if (qaSupervisor) {
                const qaTime = document.getElementById(`qaTime_${rowId}`);
                if (qaTime) qaTime.textContent = timestamp;
            }

            // Animate the saved row — green flash
            const row = document.getElementById(rowId);
            if (row) {
                row.setAttribute('data-locked', 'true');
                // Remove old animation first if already flashed
                row.classList.remove('row-saved-flash', 'row-locked-flash');
                // Force reflow so animation replays
                void row.offsetWidth;
                row.classList.add('row-saved-flash');
                setTimeout(() => row.classList.remove('row-saved-flash'), 1500);
            }

            // Bounce the save button
            const saveBtn = document.getElementById(`save_${rowId}`);
            if (saveBtn) {
                saveBtn.classList.add('btn-click-bounce');
                setTimeout(() => saveBtn.classList.remove('btn-click-bounce'), 350);
            }

            // Disable inputs if not admin
            if (window.currentUserRole !== 'admin') {
                const inputs = row?.querySelectorAll('input, select, textarea') || [];
                inputs.forEach(input => input.disabled = true);

                if (saveBtn) {
                    saveBtn.innerHTML = '🔒 Submitted';
                    saveBtn.disabled = true;
                    saveBtn.style.background = '#95a5a6';
                }
            } else {
                if (saveBtn) {
                    saveBtn.innerHTML = '✎ Update';
                    saveBtn.style.background = '#3498db';
                }
            }

            // Show unlock button for admin
            const unlockBtn = document.getElementById(`unlock_${rowId}`);
            if (unlockBtn && window.currentUserRole === 'admin') {
                unlockBtn.style.display = 'inline-block';
            }

            // Activity Line — inject audit trail inline below the row
            if (row) {
                const existingLine = row.querySelector('.audit-activity-line');
                if (!existingLine) {
                    // Build Activity Line: User · Role · Shift · Time → Submitted
                    const userName = (result.savedBy || result.technician || window.currentUser || 'Engineer');
                    const userRole = (result.role || window.currentUserRole || '');
                    const shift = (result.shift || result.shiftName || '');
                    const ts = result.savedAt || result.updatedAt || result.timestamp || '';
                    const timeStr = ts ? new Date(ts).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

                    const lineHTML = `
                        <td colspan="99">
                            <div class="audit-activity-line">
                                <span class="aal-user">${userName}</span>
                                ${userRole ? `<span class="aal-role">${userRole}</span><span class="aal-dot">·</span>` : ''}
                                ${shift ? `<span class="aal-shift">${shift}</span><span class="aal-dot">·</span>` : ''}
                                ${timeStr ? `<span class="aal-time">${timeStr}</span>` : ''}
                                <span class="aal-arrow">→</span>
                                <span class="aal-action aal-submitted">Submitted</span>
                            </div>
                        </td>`;

                    const activityRow = document.createElement('tr');
                    activityRow.innerHTML = lineHTML;
                    activityRow.className = 'audit-activity-row';
                    row.after(activityRow);
                }
            }

            // Brief toast instead of blocking alert
            if (typeof showToast === 'function') {
                showToast('success', `✅ Item ${itemNumber} saved`, { duration: 1800 });
            } else {
                console.log(`✅ Item ${itemNumber} saved successfully`);
            }
            setTimeout(() => updateProgress(), 200);
        } else {
            throw new Error(result.error || 'Failed to save');
        }

    } catch (error) {
        console.error('❌ Error saving:', error);
        alert(`❌ Error: ${error.message}`);
    }
}

/* ===============================
   LOAD CHECKLIST DATA
================================ */
async function loadChecklistData(stage) {
    if (!currentWO) {
        console.log('No W.O. selected');
        return;
    }

    // 🔹 NEW: Check stage access before loading
    const canAccess = await validateStageAccess(currentWO, stage);
    if (!canAccess) {
        console.log(`Access denied for stage ${stage}`);
        const container = document.getElementById('checklistContent');
        if (container) {
            container.innerHTML = '<div class="stage-locked-message">⛔ This stage is locked. Contact your administrator to proceed.</div>';
        }
        return;
    }

    try {
        const checklistItems = await apiCall(`/checklist/${stage}/${encodeURIComponent(currentWO)}`);

        checklistItems.forEach(item => {
            const rowId = item.rowId;

            // ── Load Actual Value ─────────────────────────────────────────────
            const actualValueInput = document.getElementById(`actualValue_${rowId}`);
            if (actualValueInput) {
                // Single main input — value may be plain text OR a JSON string
                // If it's JSON, try to pretty-display it; otherwise, just set it
                let displayVal = item.actualValue || '';
                try {
                    const parsed = JSON.parse(displayVal);
                    if (typeof parsed === 'object' && parsed !== null) {
                        // Compact human-readable for single textarea/input
                        displayVal = Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(' | ');
                    }
                } catch { /* plain string – use as-is */ }
                actualValueInput.value = displayVal;
                // Disable only when the row is fully locked (admin always editable)
                if (window.currentUserRole !== 'admin' && item.locked) {
                    actualValueInput.disabled = true;
                }
            } else {
                // Multi-value field — restore each sub-field from saved JSON
                try {
                    const values = JSON.parse(item.actualValue || '{}');
                    Object.entries(values).forEach(([key, value]) => {
                        // Try exact element ID first (e.g. dynamic block IDs)
                        let input = document.getElementById(key);

                        if (!input) {
                            // Fallback: phase/position-based ID
                            const cleanKey = key.replace(/\s+/g, '_');
                            input = document.getElementById(`actualValue_${rowId}_${cleanKey}`);
                        }

                        if (input) {
                            input.value = value;
                            // Disable if locked (admin always editable)
                            if (window.currentUserRole !== 'admin' && item.locked) {
                                input.disabled = true;
                            }
                        }
                    });
                } catch { /* not JSON or empty – nothing to restore */ }
            }

            // ── Load Specified Value ──────────────────────────────────────────
            const specifiedValueInput = document.getElementById(`specifiedValue_${rowId}`);
            if (specifiedValueInput) {
                let displayVal = item.specifiedValue || '';
                try {
                    const parsed = JSON.parse(displayVal);
                    if (typeof parsed === 'object' && parsed !== null) {
                        displayVal = Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(' | ');
                    }
                } catch { /* plain string – use as-is */ }
                specifiedValueInput.value = displayVal;
                if (window.currentUserRole !== 'admin' && item.locked) {
                    specifiedValueInput.disabled = true;
                }
            } else {
                try {
                    const values = JSON.parse(item.specifiedValue || '{}');
                    Object.entries(values).forEach(([key, value]) => {
                        let input = document.getElementById(key);
                        if (!input) {
                            const cleanKey = key.replace(/\s+/g, '_');
                            input = document.getElementById(`specifiedValue_${rowId}_${cleanKey}`);
                        }
                        if (input) {
                            input.value = value;
                            if (window.currentUserRole !== 'admin' && item.locked) {
                                input.disabled = true;
                            }
                        }
                    });
                } catch { /* not JSON or empty – nothing to restore */ }
            }

            // ── Load Technician ───────────────────────────────────────────────
            const techInput = document.getElementById(`technician_${rowId}`);
            if (techInput) {
                techInput.value = item.technician || '';
                if (window.currentUserRole !== 'admin') {
                    // Disable if already signed OR the current user is not production
                    if (item.technician || window.currentUserRole !== 'production') {
                        techInput.disabled = true;
                    }
                }
            } else {
                // Split per-phase technician inputs
                try {
                    const techs = JSON.parse(item.technician || '{}');
                    Object.entries(techs).forEach(([key, val]) => {
                        const el = document.getElementById(`technician_${rowId}_${key.replace(/\s+/g, '_')}`);
                        if (el) {
                            el.value = val;
                            if (window.currentUserRole !== 'admin' &&
                                (item.technician || window.currentUserRole !== 'production')) {
                                el.disabled = true;
                            }
                        }
                    });
                } catch { }
            }

            // ── Load Shop Supervisor ──────────────────────────────────────────
            const shopInput = document.getElementById(`shopSup_${rowId}`);
            if (shopInput) {
                shopInput.value = item.shopSupervisor || '';
                if (window.currentUserRole !== 'admin') {
                    const shopCanSign = window.currentUserRole === 'production' &&
                        !item.shopSupervisor && item.technician;
                    if (!shopCanSign) {
                        shopInput.disabled = true;
                    } else {
                        shopInput.disabled = false;
                        if (!shopInput.value) shopInput.value = window.currentUserName || '';
                    }
                }
            } else {
                try {
                    const shops = JSON.parse(item.shopSupervisor || '{}');
                    Object.entries(shops).forEach(([key, val]) => {
                        const el = document.getElementById(`shopSup_${rowId}_${key.replace(/\s+/g, '_')}`);
                        if (el) {
                            el.value = val;
                            if (window.currentUserRole !== 'admin') {
                                const canSign = window.currentUserRole === 'production' &&
                                    !item.shopSupervisor && item.technician;
                                if (!canSign) el.disabled = true;
                            }
                        }
                    });
                } catch { }
            }

            // ── Load QA Supervisor ────────────────────────────────────────────
            const qaInput = document.getElementById(`qaSup_${rowId}`);
            if (qaInput) {
                qaInput.value = item.qaSupervisor || '';
                if (window.currentUserRole !== 'admin') {
                    const qaCanSign = window.currentUserRole === 'quality' &&
                        !item.qaSupervisor && item.shopSupervisor;
                    if (!qaCanSign) {
                        qaInput.disabled = true;
                    } else {
                        qaInput.disabled = false;
                        if (!qaInput.value) qaInput.value = window.currentUserName || '';
                    }
                }
            } else {
                try {
                    const qas = JSON.parse(item.qaSupervisor || '{}');
                    Object.entries(qas).forEach(([key, val]) => {
                        const el = document.getElementById(`qaSup_${rowId}_${key.replace(/\s+/g, '_')}`);
                        if (el) {
                            el.value = val;
                            if (window.currentUserRole !== 'admin') {
                                const canSign = window.currentUserRole === 'quality' &&
                                    !item.qaSupervisor && item.shopSupervisor;
                                if (!canSign) el.disabled = true;
                            }
                        }
                    });
                } catch { }
            }

            // ── Load Remark ───────────────────────────────────────────────────
            const remInput = document.getElementById(`remark_${rowId}`);
            if (remInput) {
                // If remark is stored as JSON (split remark), show a readable summary
                let remarkDisplay = item.remark || '';
                try {
                    const parsedRem = JSON.parse(remarkDisplay);
                    if (typeof parsedRem === 'object' && parsedRem !== null) {
                        remarkDisplay = Object.entries(parsedRem)
                            .map(([k, v]) => v ? `${k}: ${v}` : '')
                            .filter(Boolean)
                            .join(' | ');
                    }
                } catch { /* plain string */ }
                remInput.value = remarkDisplay;
                if (window.currentUserRole !== 'admin' && item.locked) remInput.disabled = true;
            } else {
                try {
                    const rems = JSON.parse(item.remark || '{}');
                    Object.entries(rems).forEach(([key, val]) => {
                        const el = document.getElementById(`remark_${rowId}_${key.replace(/\s+/g, '_')}`);
                        if (el) {
                            el.value = val;
                            if (window.currentUserRole !== 'admin' && item.locked) el.disabled = true;
                        }
                    });
                } catch { }
            }


            // Display timestamps
            if (item.timestamp) {
                const techTime = document.getElementById(`techTime_${rowId}`);
                const shopTime = document.getElementById(`shopTime_${rowId}`);
                const qaTime = document.getElementById(`qaTime_${rowId}`);

                if (techTime) techTime.textContent = item.timestamp;
                if (shopTime) shopTime.textContent = item.timestamp;
                if (qaTime) qaTime.textContent = item.timestamp;
            }

            // Update row lock status
            const row = document.getElementById(rowId);
            if (row) {
                row.setAttribute('data-locked', item.locked);
                if (item.locked) row.style.backgroundColor = '#f0f0f0';
                if (!item.locked && window.currentUserRole === 'admin') {
                    row.style.backgroundColor = '#fff3cd';
                }
            }

            // ── Status badge (Week 1: status badges everywhere) ──
            if (typeof renderRowStatusBadge === 'function') {
                renderRowStatusBadge(rowId, item);
            }

            // Update buttons (Week 2: rename Save → Submit)
            if (typeof updateSaveButtonLabel === 'function') {
                updateSaveButtonLabel(rowId, item);
            } else {
                const saveBtn = document.getElementById(`save_${rowId}`);
                if (saveBtn) {
                    let canSave = window.currentUserRole === 'admin';
                    if (window.currentUserRole === 'production' && !item.technician) canSave = true;
                    if (window.currentUserRole === 'shop' && item.technician && !item.shopSupervisor) canSave = true;
                    if (window.currentUserRole === 'quality' && item.shopSupervisor && !item.qaSupervisor) canSave = true;

                    if (!canSave) {
                        saveBtn.innerHTML = '🔒 Locked';
                        saveBtn.disabled = true;
                        saveBtn.style.background = '#95a5a6';
                    } else {
                        saveBtn.innerHTML = '✅ Submit';
                        saveBtn.style.background = '#27ae60';
                        saveBtn.disabled = false;
                    }
                }
            }

            // Update lock/unlock buttons for admin (new system with dropdown)
            if (window.currentUserRole === 'admin') {
                const lockBtn = document.getElementById(`lock_${rowId}`);
                const rowUnlockBtn = document.getElementById(`rowUnlock_${rowId}`);

                if (lockBtn) {
                    lockBtn.style.display = !item.locked ? 'inline-block' : 'none';
                }
                if (rowUnlockBtn) {
                    rowUnlockBtn.style.display = item.locked ? 'inline-block' : 'none';
                }
            }
        });

        console.log(`✅ Loaded ${checklistItems.length} items for ${stage} - WO: ${currentWO}`);

        // ── Stage summary pills (Week 1) ──
        if (typeof renderStageSummaryPills === 'function') {
            renderStageSummaryPills('stageSummaryPills', checklistItems);
        }

        // 🔹 Update stage control button visibility
        updateStageControlButtons();
    } catch (error) {
        console.error('❌ Error loading checklist:', error);
    }
}

/* ===============================
   UPDATE PROGRESS BAR
================================ */
async function updateProgress() {
    if (!currentWO || !currentStage) return;

    try {
        const items = await apiCall(`/checklist/${currentStage}/${encodeURIComponent(currentWO)}`);

        const allRows = document.querySelectorAll('[id^="row_' + currentStage + '_"]');
        const total = allRows.length;
        const completed = items.filter(i => i.locked && i.actualValue).length;
        const pending = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('progressBar').style.display = 'block';
        document.getElementById('progressFill').style.width = percentage + '%';
        document.getElementById('progressText').textContent = percentage + '% Complete';
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('totalCount').textContent = total;

        // Hero banner stat chips
        const hc = document.getElementById('heroCompleted');
        const hp = document.getElementById('heroPending');
        const ht = document.getElementById('heroTotal');
        if (hc) hc.textContent = completed;
        if (hp) hp.textContent = pending;
        if (ht) ht.textContent = total;

        const progressFill = document.getElementById('progressFill');
        if (percentage === 100) {
            progressFill.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
        } else if (percentage >= 50) {
            progressFill.style.background = 'linear-gradient(90deg, #f39c12, #f1c40f)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
        }
    } catch (error) {
        console.error('❌ Error updating progress:', error);
    }
}

/* ===============================
   UNLOCK ITEM (ADMIN ONLY)
================================ */
async function unlockChecklistItem(stage, rowId) {
    if (!currentWO) {
        alert('⚠️ No W.O. selected!');
        return;
    }

    if (window.currentUserRole !== 'admin') {
        alert('⚠️ Only admins can unlock items!');
        return;
    }

    const reason = prompt('Enter reason for unlocking this item:');
    if (!reason) return;

    try {
        const result = await apiCall('/checklist/unlock', 'POST', {
            wo: currentWO,
            stage: stage,
            rowId: rowId,
            reason: reason
        });

        if (result.success) {
            const row = document.getElementById(rowId);
            if (row) {
                const inputs = row.querySelectorAll('input, select, textarea');
                inputs.forEach(input => input.disabled = false);
                // Yellow "reopened" flash instead of static background
                row.classList.remove('row-saved-flash', 'row-locked-flash', 'row-unlocked-flash');
                void row.offsetWidth;
                row.classList.add('row-unlocked-flash');
                setTimeout(() => row.classList.remove('row-unlocked-flash'), 1400);
                row.setAttribute('data-locked', 'false');
            }

            const saveBtn = document.getElementById(`save_${rowId}`);
            if (saveBtn) {
                saveBtn.innerHTML = '💾 Save';
                saveBtn.style.background = '#27ae60';
                saveBtn.disabled = false;
            }

            const unlockBtn = document.getElementById(`unlock_${rowId}`);
            if (unlockBtn) unlockBtn.style.display = 'none';

            if (typeof showToast === 'function') {
                showToast('info', '🔑 Item re-opened', { duration: 1800 });
            }
        }
    } catch (error) {
        console.error('❌ Error unlocking:', error);
        alert(`❌ Error: ${error.message}`);
    }
}

// Export to window
window.loadChecklistTransformers = loadChecklistTransformers;
window.onWOChange = onWOChange;
/**
 * Show unlock dialog for a specific row (admin only)
 */
function showRowUnlockDialog(itemId) {
    if (window.currentUserRole !== 'admin') {
        alert('❌ Only admin can unlock rows');
        return;
    }

    window.currentRowUnlockId = itemId;
    document.getElementById('unlockReasonSelect').value = '';
    document.getElementById('customUnlockReason').value = '';
    document.getElementById('customReasonContainer').style.display = 'none';

    const modal = document.getElementById('rowUnlockModal');
    if (modal) {
        modal.style.display = ''; // clear any stale inline style
        modal.classList.add('open');
        // Add warning pulse to the modal box
        modal.classList.remove('modal-warning-pulse');
        void modal.offsetWidth;
        modal.classList.add('modal-warning-pulse');
        setTimeout(() => modal.classList.remove('modal-warning-pulse'), 5000);
    }
}

/**
 * Show lock dialog for a specific row (admin only)
 */
function showRowLockDialog(itemId) {
    if (window.currentUserRole !== 'admin') {
        alert('❌ Only admin can lock rows');
        return;
    }

    window.currentRowLockId = itemId;

    // Reset chip state
    document.querySelectorAll('#lockReasonChips .reason-chip').forEach(c => c.classList.remove('reason-chip--active'));
    document.getElementById('lockReasonSelect').value = '';
    document.getElementById('customLockReason').value = '';
    document.getElementById('customLockReasonContainer').style.display = 'none';

    const modal = document.getElementById('rowLockModal');
    modal.style.display = 'flex';
}

/**
 * Toggle custom unlock reason textarea
 */
/**
 * Chip-based reason selector for the Re-open (unlock) modal
 * One tap selects and highlights a chip, sets hidden input value
 */
function selectUnlockReason(chipEl, value) {
    // De-select all chips
    document.querySelectorAll('#unlockReasonChips .reason-chip').forEach(c => c.classList.remove('reason-chip--active'));
    chipEl.classList.add('reason-chip--active');

    if (value === 'OTHER') {
        document.getElementById('unlockReasonSelect').value = '';
        document.getElementById('customReasonContainer').style.display = 'block';
        document.getElementById('customUnlockReason').focus();
    } else {
        document.getElementById('unlockReasonSelect').value = value;
        document.getElementById('customReasonContainer').style.display = 'none';
    }
}

// Legacy alias kept for any old references
function toggleCustomReason() { }

/**
 * Chip-based reason selector for the Submit for Review (lock) modal
 */
function selectLockReason(chipEl, value) {
    document.querySelectorAll('#lockReasonChips .reason-chip').forEach(c => c.classList.remove('reason-chip--active'));
    chipEl.classList.add('reason-chip--active');

    if (value === 'OTHER') {
        document.getElementById('lockReasonSelect').value = '';
        document.getElementById('customLockReasonContainer').style.display = 'block';
        document.getElementById('customLockReason').focus();
    } else {
        document.getElementById('lockReasonSelect').value = value;
        document.getElementById('customLockReasonContainer').style.display = 'none';
    }
}

// Legacy alias kept for any old references
function toggleCustomLockReason() { }

/**
 * Close row unlock modal
 */
function closeRowUnlockModal() {
    const m = document.getElementById('rowUnlockModal');
    if (m) { m.classList.remove('open'); m.style.display = ''; }
    window.currentRowUnlockId = null;
}

/**
 * Close row lock modal
 */
function closeRowLockModal() {
    document.getElementById('rowLockModal').style.display = 'none';
    window.currentRowLockId = null;
}

/**
 * Confirm and process row unlock
 */
async function confirmRowUnlock() {
    const itemId = window.currentRowUnlockId;
    // reason is now stored in a hidden input (chip selection or textarea freetext)
    const reason = document.getElementById('unlockReasonSelect').value.trim();

    if (!reason) {
        // Flash the chip area to indicate a selection is required
        const chips = document.getElementById('unlockReasonChips');
        if (chips) {
            chips.classList.add('btn-click-bounce');
            setTimeout(() => chips.classList.remove('btn-click-bounce'), 350);
        }
        if (typeof showToast === 'function') showToast('warning', '⚠️ Please select a reason', { duration: 2000 });
        else alert('⚠️ Please select a reason for re-opening');
        return;
    }

    try {
        console.log(`🔓 Unlocking row ${itemId} with reason: ${reason}`);
        const response = await unlockChecklistRow(itemId, reason);

        if (response.success) {
            console.log('✅ Row unlocked successfully');

            // Animate + re-enable the row
            const row = document.getElementById(itemId);
            if (row) {
                row.removeAttribute('data-locked');
                row.classList.remove('row-saved-flash', 'row-locked-flash');
                void row.offsetWidth;
                row.classList.add('row-unlocked-flash');
                setTimeout(() => row.classList.remove('row-unlocked-flash'), 1400);
                const inputs = row.querySelectorAll('input, select, textarea');
                inputs.forEach(input => input.disabled = false);

                const saveBtn = document.getElementById(`save_${itemId}`);
                if (saveBtn) {
                    saveBtn.innerHTML = '✅ Submit';
                    saveBtn.disabled = false;
                    saveBtn.style.background = '#27ae60';
                }

                if (typeof renderRowStatusBadge === 'function') {
                    renderRowStatusBadge(itemId, { locked: false, status: 'pending' });
                }
            }

            closeRowUnlockModal();
            if (typeof showToast === 'function') showToast('info', '🔑 Row re-opened', { duration: 1800 });

        } else {
            if (typeof showToast === 'function') showToast('error', `❌ ${response.error}`, { duration: 2500 });
            else alert(`❌ Error: ${response.error}`);
        }
    } catch (error) {
        console.error('❌ Error unlocking row:', error);
        if (typeof showToast === 'function') showToast('error', '❌ Error unlocking row', { duration: 2000 });
        else alert('❌ Error unlocking row. Check console for details.');
    }
}

/**
 * Confirm and process row lock
 */
async function confirmRowLock() {
    const itemId = window.currentRowLockId;
    // reason is now stored in a hidden input (chip selection or freetext)
    const reason = document.getElementById('lockReasonSelect').value.trim();

    if (!reason) {
        const chips = document.getElementById('lockReasonChips');
        if (chips) {
            chips.classList.add('btn-click-bounce');
            setTimeout(() => chips.classList.remove('btn-click-bounce'), 350);
        }
        if (typeof showToast === 'function') showToast('warning', '⚠️ Please select a submission reason', { duration: 2000 });
        else alert('⚠️ Please select a reason for submission');
        return;
    }

    try {
        console.log(`🔒 Locking row ${itemId} with reason: ${reason}`);
        const response = await lockChecklistRow(itemId, reason);

        if (response.success) {
            console.log('✅ Row locked successfully');

            const row = document.getElementById(itemId);
            if (row) {
                row.setAttribute('data-locked', 'true');
                // Blue locked flash
                row.classList.remove('row-saved-flash', 'row-unlocked-flash');
                void row.offsetWidth;
                row.classList.add('row-locked-flash');
                setTimeout(() => row.classList.remove('row-locked-flash'), 1300);

                const inputs = row.querySelectorAll('input, select, textarea');
                inputs.forEach(input => input.disabled = true);

                const saveBtn = document.getElementById(`save_${itemId}`);
                if (saveBtn) {
                    saveBtn.innerHTML = '🔒 Submitted';
                    saveBtn.disabled = true;
                    saveBtn.style.background = '#95a5a6';
                }

                if (typeof renderRowStatusBadge === 'function') {
                    renderRowStatusBadge(itemId, { locked: true, status: 'locked' });
                }
            }

            closeRowLockModal();
            if (typeof showToast === 'function') showToast('success', '✅ Row submitted for review', { duration: 1800 });

        } else {
            if (typeof showToast === 'function') showToast('error', `❌ ${response.error}`, { duration: 2500 });
            else alert(`❌ Error: ${response.error}`);
        }
    } catch (error) {
        console.error('❌ Error locking row:', error);
        if (typeof showToast === 'function') showToast('error', '❌ Error submitting row', { duration: 2000 });
        else alert('❌ Error locking row. Check console for details.');
    }
}

window.saveNewChecklistItem = saveNewChecklistItem;
window.loadChecklistData = loadChecklistData;
window.updateProgress = updateProgress;
window.unlockChecklistItem = unlockChecklistItem;
window.currentWO = currentWO;
window.currentTransformerData = currentTransformerData;
window.currentStage = currentStage;
window.loadStageStatus = loadStageStatus;
window.updateStageUI = updateStageUI;
window.validateStageAccess = validateStageAccess;
window.markStageComplete = markStageComplete;
window.approveCurrentStage = approveCurrentStage;
window.showRejectStageModal = showRejectStageModal;
window.closeRejectStageModal = closeRejectStageModal;
window.confirmRejectStage = confirmRejectStage;
window.submitStageForQAReview = submitStageForQAReview;
window.showUnlockDialog = showUnlockDialog;
window.showRowUnlockDialog = showRowUnlockDialog;
window.showRowLockDialog = showRowLockDialog;
window.closeRowUnlockModal = closeRowUnlockModal;
window.closeRowLockModal = closeRowLockModal;
// Chip-based reason selectors (replaces old dropdown toggles)
window.selectUnlockReason = selectUnlockReason;
window.selectLockReason = selectLockReason;
window.toggleCustomReason = toggleCustomReason;       // legacy no-op
window.toggleCustomLockReason = toggleCustomLockReason; // legacy no-op
window.confirmRowUnlock = confirmRowUnlock;
window.confirmRowLock = confirmRowLock;

// ── Bulk Supervisor Sign-Off ──────────────────────────────────────────────────
async function bulkSupervisorSignOff() {
    if (!window.currentWO || !window.currentStage) {
        alert('⚠ Please select a work order and stage first.');
        return;
    }
    const items = document.querySelectorAll('#stageContent tr[id^="row_"]');
    if (items.length === 0) {
        alert('⚠ No checklist items found.');
        return;
    }
    if (!confirm(`Sign off ALL technician-completed items for ${window.currentStage}?`)) return;

    try {
        const result = await apiCall(`/stage/${window.currentWO}/supervisor-signoff-all`, 'POST', {
            stage: window.currentStage
        });
        if (result.success) {
            if (typeof showToast === 'function') showToast('success', 'All items signed off successfully', { title: 'Bulk Sign-Off' });
            loadChecklistData(window.currentStage);
        } else {
            alert('❌ ' + (result.error || 'Failed'));
        }
    } catch (error) {
        alert('❌ ' + error.message);
    }
}
window.bulkSupervisorSignOff = bulkSupervisorSignOff;

// ── Export Checklist PDF ──────────────────────────────────────────────────────
function exportChecklistPDF() {
    if (!window.currentWO || !window.currentStage) {
        alert('⚠ Please select a work order and stage first.');
        return;
    }
    const url = `/checklist/${window.currentStage}/${window.currentWO}/pdf`;
    window.open(url, '_blank');
}
window.exportChecklistPDF = exportChecklistPDF;

/* ===============================
   QUALITY SUPERVISOR: Verify & Sign
   (Ported from Transformer 2.0)
================================ */

function _applyQualityVerifyButton(rowId, item, stage, itemNumber) {
    const userRole = window.currentUserRole;
    const verifyBtn = document.getElementById(`verify_${rowId}`);
    if (!verifyBtn) return;

    if (userRole === 'quality') {
        if (item.qaSignedOff || item.qualitySign) {
            // Already verified
            verifyBtn.innerHTML = '✅ Verified';
            verifyBtn.disabled = true;
            verifyBtn.style.background = '#2e7d32';
        } else if (item.supervisorSignedOff || item.shopSign || item.shopSupervisor) {
            // Ready for quality to verify
            verifyBtn.innerHTML = '🔍 Verify & Sign';
            verifyBtn.disabled = false;
            verifyBtn.style.background = '#1565c0';
        } else {
            // Shop sup hasn't saved yet
            verifyBtn.innerHTML = '⏳ Awaiting Shop Sup';
            verifyBtn.disabled = true;
            verifyBtn.style.background = '#9e9e9e';
        }
    } else {
        verifyBtn.style.display = 'none';
    }
}

/* ─── Quality Supervisor: Verify & Sign a checklist row ───────────────────── */
async function verifyChecklistRow(wo, stage, rowId, itemNumber, verifyRemark) {
    const response = await fetch(`${API_BASE}/checklist/row/${rowId}/signoff`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wo, stage, status: 'approved', notes: verifyRemark })
    });
    const result = await response.json();
    if (!result.success) return result;

    const items = result.data?.items || [];
    const savedItem = items.find(i => i.rowId === rowId);
    return { success: true, item: savedItem };
}

/* ─── Quality Supervisor: Verify & Sign a checklist row ───────────────────── */
async function verifyChecklistItem(stage, itemNumber, rowId) {
    if (!currentWO) { alert('⚠️ Please select a transformer W.O. number first!'); return; }

    const userRole = window.currentUserRole;
    if (userRole !== 'quality' && userRole !== 'admin') {
        alert('⛔ Only Quality Supervisor can verify rows.');
        return;
    }

    const confirmed = confirm(
        `🔍 Verify & Sign Row ${itemNumber}?\n\n` +
        `This will lock the row.\n` +
        `Only Admin will be able to unlock it afterwards.\n\nContinue?`
    );
    if (!confirmed) return;

    // Optional comment field for Quality Supervisor
    const verifyRemark = prompt("Optional: Enter a verification comment/remark (or leave blank):", "");

    try {
        const result = await verifyChecklistRow(currentWO, stage, rowId, itemNumber, verifyRemark);

        if (result.success) {
            const savedItem = result.item;

            // Reload checklist data to refresh badges and states
            loadChecklistData(window.currentStage);

            // Lock ALL inputs in this row
            const row = document.getElementById(rowId);
            if (row) {
                row.style.backgroundColor = '#e8f5e9';  // green = verified & locked
                const inputs = row.querySelectorAll('input, select, textarea');
                inputs.forEach(inp => inp.disabled = true);
            }

            // Update Save button
            const saveBtn = document.getElementById(`save_${rowId}`);
            if (saveBtn) {
                saveBtn.innerHTML = '🔒 Locked';
                saveBtn.disabled = true;
                saveBtn.style.background = '#95a5a6';
            }

            // Update Verify button
            const verifyBtn = document.getElementById(`verify_${rowId}`);
            if (verifyBtn) {
                verifyBtn.innerHTML = '✅ Verified';
                verifyBtn.disabled = true;
                verifyBtn.style.background = '#2e7d32';
            }

            alert(`✅ Row ${itemNumber} verified and locked!`);
            setTimeout(() => updateProgress(), 200);
        } else {
            throw new Error(result.error || 'Verification failed');
        }
    } catch (error) {
        console.error('❌ Verify error:', error);
        alert(`❌ Error: ${error.message}`);
    }
}

/* -- Sign-off badge CSS ─────────────────────────────────────────────────── */
(function injectSignCSS() {
    const s = document.createElement('style');
    s.textContent = `
.sign-badge-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 6px 8px 4px;
    border-top: 1px solid #e0e0e0;
    margin-top: 6px;
    font-size: 12px;
}
.sign-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}
.sign-badge small { font-weight: 400; opacity: 0.8; font-size: 11px; }
.sign-shop    { background: #f3e5f5; color: #4a148c; border: 1px solid #ce93d8; }
.sign-quality { background: #e3f2fd; color: #0d47a1; border: 1px solid #90caf9; }
.sign-locked  { background: #fbe9e7; color: #bf360c; border: 1px solid #ffab91; font-weight: 700; }
.sign-pending { background: #f5f5f5; color: #757575; border: 1px dashed #bdbdbd; }
/* Row state backgrounds */
.checklist-row-saved    { background-color: #e3f2fd !important; }  /* blue  = shop saved  */
.checklist-row-verified { background-color: #e8f5e9 !important; }  /* green = quality locked */
.checklist-row-admin    { background-color: #fff3cd !important; }  /* yellow = admin unlocked */
`;
    if (document.head) {
        document.head.appendChild(s);
    } else {
        document.addEventListener('DOMContentLoaded', () => document.head.appendChild(s));
    }
})();

window.verifyChecklistItem = verifyChecklistItem;
