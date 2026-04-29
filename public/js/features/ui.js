window.checklistMasterData = null; // Global storage for master data
window.isEditMode = false; // Toggle for admin structural changes

/* ===============================
   UI NAVIGATION & DISPLAY LOGIC
   Sidebar, tabs, stage navigation, checklist rendering
================================ */

/* ===============================
   TAB NAVIGATION
================================ */
function showTab(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

    const section = document.getElementById(id);
    if (section) section.classList.add('active');
    if (btn) btn.classList.add('active');

    if (id !== 'manufacturingChecklist') {
        const submenu = document.getElementById('checklistSubmenu');
        if (submenu) submenu.classList.remove('active');
    }

    const titles = {
        'home': 'Home',
        'transformerMaster': 'Transformer Master',
        'bomUpload': 'BOM Upload',
        'designDocuments': 'Design Documents',
        'manufacturingChecklist': 'Manufacturing Checklist',
        'designCalculations': 'Winding Calculation',
        'questions': 'Questions'
    };

    const viewTitle = document.getElementById('viewTitle');
    if (viewTitle) viewTitle.textContent = titles[id] || 'Home';

    // Auto-load questions when tab is opened
    if (id === 'questions' && typeof loadQuestions === 'function') {
        loadQuestions();
    }
}
/* ===============================
   SUBMENU TOGGLE
================================ */
function toggleSubmenu(element) {
    const submenu = document.getElementById('checklistSubmenu');
    if (submenu) {
        submenu.classList.toggle('active');

        if (submenu.classList.contains('active')) {
            showTab('manufacturingChecklist', element);
        }
    }
}

/* ===============================
   CHECKLIST STAGE NAVIGATION
================================ */
function showChecklistStage(stage, element) {
    document.querySelectorAll('.nav-subitem').forEach(item => {
        item.classList.remove('active');
    });
    if (element) element.classList.add('active');

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const checklistSection = document.getElementById('manufacturingChecklist');
    if (checklistSection) checklistSection.classList.add('active');

    const stageTitles = {
        'winding': 'Winding Checklist',
        'coreCoil': 'Core Coil Assembly',
        'tanking': 'Repacking & Tanking Checklist',
        'spa': 'SPA Checklist',
        'fos_annexure': 'FOS Annexure',
        'coreBuilding': 'Core Building Checklist',
        'vpd': 'VPD Checklist',
        'dismantling': 'Dismantling Checklist',
        'shunt_reactor': 'Shunt Reactor Checklist',
        'dispatch': 'Dispatch Checklist'
    };

    const viewTitle = document.getElementById('viewTitle');
    if (viewTitle) viewTitle.textContent = stageTitles[stage] || 'Manufacturing Checklist';

    const mainStageButtons = document.querySelectorAll('#mainStageNav .stage-btn');
    mainStageButtons.forEach(btn => btn.classList.remove('active'));

    const windingSubNav = document.getElementById('windingSubNav');

    if (stage === 'winding') {
        if (mainStageButtons[0]) mainStageButtons[0].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'flex';
        window.currentStage = 'winding1';
        loadStageContent('winding1');
    } else if (stage === 'spa') {
        if (mainStageButtons[1]) mainStageButtons[1].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = 'spa';
        loadStageContent('spa');
    } else if (stage === 'fos_annexure') {
        if (mainStageButtons[1]) mainStageButtons[1].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = 'fos_annexure';
        loadStageContent('fos_annexure');
    } else if (stage === 'coreCoil') {
        if (mainStageButtons[2]) mainStageButtons[2].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = 'coreCoil';
        loadStageContent('coreCoil');
    } else if (stage === 'tanking') {
        if (mainStageButtons[3]) mainStageButtons[3].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = 'tanking';
        loadStageContent('tanking');
    } else if (stage === 'coreBuilding') {
        if (mainStageButtons[4]) mainStageButtons[4].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = 'coreBuilding';
        loadStageContent('coreBuilding');
    } else if (stage === 'vpd') {
        if (mainStageButtons[5]) mainStageButtons[5].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = 'vpd';
        loadStageContent('vpd');
    } else if (stage === 'dismantling') {
        if (mainStageButtons[6]) mainStageButtons[6].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = 'dismantling';
        loadStageContent('dismantling');
    } else if (stage === 'dispatch') {
        if (mainStageButtons[7]) mainStageButtons[7].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = 'dispatch';
        loadStageContent('dispatch');
    } else if (stage === 'shunt_reactor') {
        // Set as coreCoil-like for sidebar mapping if needed
        if (mainStageButtons[2]) mainStageButtons[2].classList.add('active');
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = 'shunt_reactor';
        loadStageContent('shunt_reactor');
    }

    setTimeout(() => {
        if (typeof loadChecklistData === 'function') loadChecklistData(window.currentStage);
        if (typeof updateProgress === 'function') updateProgress();
    }, 100);
}
/* ===============================
   MAIN STAGE NAVIGATION
================================ */
function showMainStage(mainStage, button) {
    document.querySelectorAll('#mainStageNav .stage-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (button) button.classList.add('active');

    const windingSubNav = document.getElementById('windingSubNav');

    if (mainStage === 'winding') {
        if (windingSubNav) windingSubNav.style.display = 'flex';
        window.currentStage = 'winding1';
        loadStageContent('winding1');
    } else {
        if (windingSubNav) windingSubNav.style.display = 'none';
        window.currentStage = mainStage;
        loadStageContent(mainStage);
    }

    setTimeout(() => {
        if (typeof loadChecklistData === 'function') loadChecklistData(window.currentStage);
        if (typeof updateProgress === 'function') updateProgress();
    }, 100);
}
/* ===============================
   SWITCH WINDING SUB-STAGE
================================ */
function switchStage(stage, button) {
    const container = button.parentElement;
    container.querySelectorAll('.stage-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');

    window.currentStage = stage;
    loadStageContent(stage);

    setTimeout(() => {
        if (typeof loadChecklistData === 'function') loadChecklistData(stage);
        if (typeof updateProgress === 'function') updateProgress();
    }, 100);
}

function getStageData() {
    // If master data is loaded from server, use it. Otherwise fallback to hardcoded (empty or old)
    if (window.checklistMasterData) {
        return window.checklistMasterData;
    }
    return {
        winding1: {
            title: 'INSPECTION RECORD FOR EHV & UHV - WINDING CHECKLIST',
            subtitle: 'Page 1 of 6 - Continuous Disc - Form No: F/QAS/14',
            sections: [
                {
                    name: 'B - Type of winding (Continuous Disc/Layer/Multi Start Helical/Contrashield)',
                    items: [
                        { point: 'Physical condition of the former, Visual check', specifiedValue: 'No Sharp surface, No damage, Cleanliness' },
                        { point: 'Former diameter (ID of the cylinder) Tol. +2/-0mm (by Measuring Tape)', specifiedValue: 'TOP<br>Centre<br>Bottom', type: 'tcb-blocks' },
                        { point: 'Height and Thickness of cylinder (By Measuring Tape & Vernier)', specifiedValue: 'As per drawing' },
                        { point: 'Inspection of cylinder passing (Visual) Overlap =120 x thk+50mm', specifiedValue: 'No air voids in joints, No Wariness' },
                        { point: 'Cylinder O.D. (Tol.-0 to +2 mm) (By Measuring Tape)', specifiedValue: 'TOP<br>Centre<br>Bottom', type: 'tcb-blocks' },
                        { point: 'Keyed strip thickness & length (By Vernier caliper & Measuring Tape)', specifiedValue: 'As per drawing' },
                        { point: 'Keyed strip alignment (Visual) by Laser', specifiedValue: 'To be Done' },
                        { point: 'No. of dovetail blocks as per circle & width (Visual & Measuring tape)', specifiedValue: 'As per drawing' },
                        { point: 'Dimension of Dovetail block (LxWxT)', specifiedValue: 'Width<br>Length<br>Thickness', type: 'wlt-blocks' }
                    ]
                },
                {
                    name: 'Conductor Verification',
                    items: [
                        { point: 'Bare conductor dimension PTCC/BPICC/CTC (Label Verification)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Covered conductor dimensions (Label Verification)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Shield Conductor dimensions (Label Verification)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Conductor details and drum status', specifiedValue: 'No damage from approved vendor' }
                    ]
                },
                {
                    name: 'B - Winding start details',
                    items: [
                        { point: 'Starting space for winding from cylinder (by Measuring Tape)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Make of Bottom Guard Ring/End Collar', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Lead length(-0,+100mm) (By Measuring Tape)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Type of lead bend at start (Radially/Axially)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Individual and Bunch insulation (By Vernier Caliper)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Lead position take out segment no.', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Direction of winding (Std. /Non std.)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Radial width of winding at 3rd Disc (+/-1mm) (By Vernier Caliper)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Total no. of Disc/Turn', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Line shield at start lead', specifiedValue: 'As per design' },
                        { point: 'Disc/Turn Numbering done at each disc/Turn', specifiedValue: 'To be Done' }
                    ]
                },
                {
                    name: 'C - Details of finish coil',
                    items: [
                        { point: 'Lead bend and insulation at finish end (Radially/Axially)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Disc and lead Anchoring', specifiedValue: 'To be Done as per drg' },
                        { point: 'Block alignment', specifiedValue: 'Visual and Laser verification' },
                        { point: 'Top insulation arrangement', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'OD Rider Provided', specifiedValue: 'To be Provided' },
                        { point: 'Line shield at end lead', specifiedValue: 'As per design' }
                    ]
                },
                {
                    name: 'Final Checks and Brazed Joints',
                    items: [
                        {
                            point: 'Arrangement of DOF washer (OD and ID) between Disc/turn',
                            specifiedValue: 'OD DOF / ID DOF / DOF / Studs',
                            type: 'dof-washer-table'
                        },
                        { point: 'Top Guard Ring/End Collar with protection washer over it', specifiedValue: 'To be verified' },
                        { point: 'Coil OD measure in mm (0,+3mm)', specifiedValue: '', editableSpecifiedValue: true },
                        { point: 'Continuity test after finish between parallel strands (By continuity tester)', specifiedValue: 'To be Done' },
                        { point: 'Identification/Status tag provided', specifiedValue: 'To be Provided' },
                        {
                            point: 'Details of brazed joints',
                            specifiedValue: 'See table below',
                            type: 'brazed-joints-table'
                        }
                    ]
                },
                {
                    name: 'Shield and Drum Details',
                    items: [
                        {
                            point: 'Details of Shield and Preparation, sealing and placement',
                            specifiedValue: 'As per specification',
                            type: 'shield-preparation-table'
                        },
                        {
                            point: 'Drum Details and Vendor name',
                            specifiedValue: 'Record details',
                            type: 'drum-details-table'
                        },
                        {
                            point: 'Details of observation/Nonconformity or balance work',
                            specifiedValue: '',
                            type: 'observation-table'
                        }
                    ]
                }
            ]
        },
        winding2: {
            title: 'WINDING START DETAILS',
            subtitle: 'Page 2 of 6',
            sections: [{
                name: 'B - Winding start details',
                items: [
                    { point: 'Starting space for winding from cylinder (by Measuring Tape)', specifiedValue: 'As per drawing' },
                    { point: 'Make of Bottom Guard Ring/End Collar', specifiedValue: 'Verify material' },
                    { point: 'Lead length(-0,+100mm) (By Measuring Tape)', specifiedValue: 'Within tolerance' },
                    { point: 'Type of lead bend at start (Radially/Axially)', specifiedValue: 'As specified' },
                    { point: 'Individual and Bunch insulation (By Vernier Caliper)', specifiedValue: 'Measure thickness' },
                    { point: 'Lead position take out segment no.', specifiedValue: 'Mark segment' },
                    { point: 'Direction of winding (Std. /Non std.)', specifiedValue: 'Standard direction' }
                ]
            }]
        },
        winding3: {
            title: 'FINISH COIL DETAILS',
            subtitle: 'Page 3 of 6',
            sections: [{
                name: 'C - Details of finish coil',
                items: [
                    { point: 'Lead bend and insulation at finish end (Radially/Axially)', specifiedValue: 'As per drawing' },
                    { point: 'Disc and lead Anchoring', specifiedValue: 'To be Done as per drg' },
                    { point: 'Block alignment', specifiedValue: 'Visual and Laser verification' },
                    { point: 'Top insulation arrangement', specifiedValue: 'Verify placement' },
                    { point: 'OD Rider Provided', specifiedValue: 'To be Provided' },
                    { point: 'Line shield at end lead', specifiedValue: 'As per design' }
                ]
            }]
        },
        coreCoil: {
            title: 'Core Coil Assembly Checklist',
            subtitle: 'Coil Lowering, Top yoke, Connections',
            sections: [{
                name: 'Core Coil Assembly (Coil Lowering, Top yoke, Connections)',
                items: [
                    {
                        point: 'Coil support BCS blocks & Insulation.(Visual).<br>-Alignment <br>-Grain orientation<br>-Leveling to be checked with spirit level. (-0, + 2 mm)',
                        specifiedValue: 'Should be in aligned & perpendicular condition.',
                        type: 'ok-notok-stacked',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'BCS hole are free from any type of blockage / Oil passege of BCS holes are clear.',
                        specifiedValue: 'Visual',
                        type: 'ok-notok',

                    },
                    {
                        point: 'Cleaning of bottom yoke.',
                        specifiedValue: 'should be clean',
                        type: 'ok-notok'
                    },
                    {
                        point: 'Arrangement of Barrier on main limb Cylinder Thickness (Record Barrier on main limb. Cylinder Thickness)',
                        specifiedValue: 'U Phase: ........... mm<br>V Phase: ........... mm<br>W Phase: ........... mm',
                        type: 'text-phases',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Positioning & insulation arrangement of core shield at auxiliary limb.(as per Drawing)',
                        specifiedValue: 'Limb-1 Near U Phase<br>Limb-2 Near W Phase',
                        type: 'ok-notok-limbs',
                        limbs: ['Limb-1 Near U Phase', 'Limb-2 Near W Phase']
                    },
                    {
                        point: 'Measurement of diameter of core on cylinder. To be measured at 3 location. Top,Middle,Bottom. (For tolerences refer relevant drawings)',
                        specifiedValue: '......... mm',
                        type: 'tmb-measurements',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Arrangement & alignment of strips on main limb. (Record Strip Thickness)',
                        specifiedValue: 'U Phase: ........... mm<br>V Phase: ........... mm<br>W Phase: ........... mm',
                        type: 'text-phases',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Measurement of Inner diameter of winding. To be measured at 3 locations. Top, Middle, Bottom.<br><small style="color:#666;">(For tolerances refer relevant drawings)</small>',
                        specifiedValue: '......... mm',
                        type: 'tmb-measurements',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Tung piece insertion B/w Bottom leads & fitch plate',
                        specifiedValue: 'To be inserted',
                        type: 'text-per-phase',
                        phases: ['U', 'V', 'W']
                    },
                    {
                        point: 'Isolation to be check Before Coil Lowering.<br>1) IR Check (2.5 KV DC for 1 min)<br>2) 2kV (Ac for 1 min)',
                        specifiedValue: '',
                        type: 'stop-stage'
                    },
                    {
                        point: 'Deflection & Damage in bottom ring if any.(Visual)',
                        type: 'phase-ok-notok',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Coil Clamping by Jacks',
                        specifiedValue: '',
                        type: 'jack-diagram'
                    },
                    {
                        point: 'Air gap between lamination joints at top yoke (Vernier Calliper)',
                        specifiedValue: '(0-2mm)'
                    },
                    {
                        point: 'Electrical Tests at <strong>10%</strong> of yoke filling:-<br>1) Ratio Test<br>2) Cross Current Checking.<br>3) Magnetic balance test.',
                        specifiedValue: '',
                        editableSpecifiedValue: true
                    },
                    {
                        point: 'Position of cooling duct &amp; Nomex',
                        specifiedValue: '',
                        type: 'cooling-nomex-table'
                    },
                    {
                        point: 'Insulation arrangement at Top <strong>LV</strong> frame.',
                        specifiedValue: 'Thickness (mm)',
                        editableSpecifiedValue: true
                    },
                    {
                        point: 'Insulation arrangement at Top <strong>HV</strong> frame.',
                        specifiedValue: 'Thickness (mm)',
                        editableSpecifiedValue: true
                    },
                    {
                        point: 'Insulation arrangement at flitch plates.',
                        specifiedValue: 'Thickness (mm)',
                        editableSpecifiedValue: true
                    },
                    {
                        point: 'Distance between top &amp; bottom yoke clamp <strong>HV Side</strong> (To be measured by Measuring tape)',
                        specifiedValue: 'HV (mm)',
                        editableSpecifiedValue: true
                    },
                    {
                        point: 'Distance between top &amp; bottom yoke clamp <strong>LV Side</strong> (To be measured by Measuring tape)',
                        specifiedValue: 'LV (mm)',
                        editableSpecifiedValue: true
                    },
                    {
                        point: 'Cleaning of Top Yoke before step block fixing.',
                        specifiedValue: 'Should be clean',
                        type: 'ok-notok'
                    },
                    {
                        point: 'Step block arrangement.<br>(As Per Drawing).',
                        type: 'phase-ok-notok',
                        phases: ['U Phase', 'V Phase', 'W Phase', 'Aux. Limb.1', 'Aux. Limb.2']
                    },
                    {
                        point: 'Isolation arrangement at Steel Bands.<br>As Per Drawing.',
                        type: 'phase-ok-notok',
                        phases: ['F-1', 'F-2', 'F-3', 'F-4']
                    },
                    {
                        point: 'Insulation Araangement between steel bands<br>& yoke.',
                        type: 'phase-ok-notok',
                        phases: ['U Phase', 'V Phase', 'W Phase', 'Aux. Limb.1', 'Aux. Limb.2']
                    },
                    {
                        point: 'T.G. Assembly, Insulation arrangement &amp; Connections',
                        specifiedValue: '',
                        type: 'section-header'
                    },
                    {
                        point: 'Phase barrier assembly.<br>As per drawing.<br>(No Damage or No holes at centre<br>Locking at both ends).',
                        type: 'phase-ok-notok',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Core Earthing Arrangement.',
                        specifiedValue: 'As Per Drg.',
                        type: 'ok-notok'
                    },
                    {
                        point: 'Radial paper covering &amp; insulation at HV main lead.',
                        specifiedValue: '......... mm',
                        type: 'mm-per-phase',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Radial paper covering &amp; insulation at LV lead.',
                        specifiedValue: '......... mm',
                        type: 'mm-per-phase',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Radial paper covering at LV / Tert. Lead/busbar.',
                        specifiedValue: '......... mm',
                        type: 'mm-per-phase',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Radial paper covering at LV / Tert. Lead/busbar/tube.',
                        specifiedValue: '......... mm',
                        type: 'mm-per-phase',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: 'Radial paper covering at TAP Lead/Tubes.',
                        specifiedValue: '......... mm',
                        editableSpecifiedValue: true
                    },
                    {
                        point: 'Radial paper covering at N busbar / Lead.',
                        specifiedValue: '......... mm',
                        type: 'mm-per-phase',
                        phases: ['HV', 'LV']
                    },
                    {
                        point: 'Radial paper covering at N tube / lead.',
                        specifiedValue: '......... mm',
                        type: 'mm-per-phase',
                        phases: ['HV', 'LV']
                    },
                    {
                        point: 'Support assembly &amp; dimension of HV main lead',
                        phase: 'U Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at main lead', unit: 'sq mm' },
                            { label: 'Crimping at main lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    {
                        point: 'Support assembly &amp; dimension of HV main lead',
                        phase: 'V Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at main lead', unit: 'sq mm' },
                            { label: 'Crimping at main lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    {
                        point: 'Support assembly &amp; dimension of HV main lead',
                        phase: 'W Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at main lead', unit: 'sq mm' },
                            { label: 'Crimping at main lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    {
                        point: 'Support assembly &amp; dimension of IV lead',
                        phase: 'U Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at IV lead', unit: 'sq mm' },
                            { label: 'Crimping at IV lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    {
                        point: 'Support assembly &amp; dimension of IV lead',
                        phase: 'V Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at IV lead', unit: 'sq mm' },
                            { label: 'Crimping at IV lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    // Row 39: IV lead W Phase
                    {
                        point: 'Support assembly &amp; dimension of IV lead',
                        phase: 'W Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at IV lead', unit: 'sq mm' },
                            { label: 'Crimping at IV lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    // Row 40: LV lead U Phase
                    {
                        point: 'Support assembly &amp; dimension of LV lead',
                        phase: 'U Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at LV lead', unit: 'sq mm' },
                            { label: 'Crimping at LV lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    // Row 41: LV lead V Phase
                    {
                        point: 'Support assembly &amp; dimension of LV lead',
                        phase: 'V Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at LV lead', unit: 'sq mm' },
                            { label: 'Crimping at LV lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    // Row 42: LV lead Busbar W Phase
                    {
                        point: 'Support assembly &amp; dimension of LV lead / Busbar',
                        phase: 'W Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at LV lead', unit: 'sq mm' },
                            { label: 'Crimping at LV lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    // Row 43: N lead / Busbar
                    {
                        point: 'Support assembly &amp; dimension of N lead / Busbar',
                        phase: '',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Cable size used at LV lead', unit: 'sq mm' },
                            { label: 'Crimping at LV lead. (Connector size)', unit: 'sq mm' },
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    // Row 44: Make & Sr.No. of OCTC / OLTC
                    {
                        point: 'Make &amp; Sr. No. of OCTC / OLTC',
                        specifiedValue: '',
                        type: 'make-srno-table',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    // Rows 45-47: OLTC/OCTC support assembly per phase
                    {
                        point: 'Support assembly &amp; dimension of OLTC / OCTC',
                        phase: 'U Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    {
                        point: 'Support assembly &amp; dimension of OLTC / OCTC',
                        phase: 'V Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    {
                        point: 'Support assembly &amp; dimension of OLTC / OCTC',
                        phase: 'W Phase',
                        type: 'lead-assembly-table',
                        rows: [
                            { label: 'Dimension from leg center.', unit: 'mm' },
                            { label: 'Dimension from core center.', unit: 'mm' },
                            { label: 'Height from ground.', unit: 'mm' }
                        ]
                    },
                    // Row 48: Shaft alignment of OCTC
                    {
                        point: 'Shaft alignment of OCTC (+/- 2 mm)',
                        specifiedValue: 'With Spirit Level',
                        editableSpecifiedValue: false
                    },
                    // Row 49: Tightness verification (Nm per phase) + steel bands torque
                    {
                        point: 'Tightness verification at OLTC / OCTC Connections &amp; Torque at steel bands',
                        specifiedValue: '',
                        type: 'nm-torque-table'
                    },
                    // Row 50: Torque at Top bridge
                    {
                        point: 'Torque Application at Top bridge.',
                        specifiedValue: '......... Nm',
                        editableSpecifiedValue: true
                    },
                    // Row 51: Torque Application at Flitch Plate Hardware
                    {
                        point: 'Torque Application at Flitch Plate Hardware.',
                        specifiedValue: '',
                        type: 'flitch-torque'
                    },
                    // Row 52: Core Shield lead arrangement
                    {
                        point: 'Core Shield lead arrangement.',
                        specifiedValue: 'As Per Drg.',
                        type: 'ok-notok'
                    },
                    // Row 52: DOF pipe arrangement
                    {
                        point: 'DOF pipe arrangement.<br>1-Np gap at joints.<br>2-Check for material M.S. &S.S With magnet ',
                        specifiedValue: '',

                    },
                    // Rows 53-59: Electrical Tests
                    {
                        point: 'Electrical Tests:-<br><small>1) Resistance / Current Balance Test.<br>2) Ratio Test <br>3) Resistance Test.<br>4) Ratio &amp; Magnetic Current / Vector Group Test.<br>5) Step (at initial coil to core shield).</small>',
                        specifiedValue: '',
                        type: 'elec-test-table'
                    },
                    {
                        point: '2.5 Kv DC Megger Test between Core &amp; Frame.',
                        specifiedValue: '',
                        type: 'mm-per-phase',
                        phases: ['U Phase', 'V Phase', 'W Phase']
                    },
                    {
                        point: '2 Kv AC Test for core shield between Core &amp; Frame.',
                        specifiedValue: '',
                        type: 'mm-per-phase',
                        phases: ['CS-1', 'CS-2']
                    },
                    {
                        point: '2 Kv AC Test for core shield between Core shield &amp; Frame.',
                        specifiedValue: '',
                        type: 'mm-per-phase',
                        phases: ['CS-1', 'CS-2']
                    },
                    {
                        point: '2 Kv AC Test for core shield between Core shield &amp; Core.',
                        specifiedValue: '',
                        type: 'mm-per-phase',
                        phases: ['CS-1', 'CS-2']
                    },
                    {
                        point: 'Overall Cleaning of Active Part.',
                        specifiedValue: 'Should be clean',
                    },
                    {
                        point: 'Continuity test for all hardwares of active part.<br><small>(By continuity tester).</small>',
                        specifiedValue: '',
                        type: 'text'
                    }
                ]
            }, {
                name: 'Electrical Clearances',
                items: [
                    { point: 'HV Main Lead to Earth', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'HV Main Lead to Neutral', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'HV Main Lead to Tap Leads.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'HV Main Lead to WInding OD.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'HV Main Lead to LV.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'lV Lead to Earth.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'lV Lead to Neutral.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'lV Lead to Tap Leads.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'lV Lead to Winding OD.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'IV Lead to LV.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'Tap Lead to Earth.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'Tap Lead to Winding OD.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'Tap Lead to LV .', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'Between Tap leads of different Phases.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U-V Phase', 'V-W Phase'] },
                    { point: 'Tap lead to Neutral.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'Tap leads with 2 step, 3 Step difference.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'LV to Earth (MS).', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'LV busbar to Winding OD.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'LV tube to Winding OD.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'LV busbar / lead to Neutral.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U Phase', 'V Phase', 'W Phase'] },
                    { point: 'Between LV leads of different Phases.', specifiedValue: '......... mm', type: 'mm-per-phase', phases: ['U-V Phase', 'V-W Phase'] },
                    { point: 'HV Neutral to Earth.', specifiedValue: '......... mm', editableSpecifiedValue: true },
                    { point: 'LV Neutral to Earth.', specifiedValue: '......... mm', editableSpecifiedValue: true },
                    { point: 'Any Other Clearance.', specifiedValue: '......... mm', editableSpecifiedValue: true }
                ]
            }]
        },
        tanking: {
            title: 'INSPECTION RECORD FOR EHV & UHV (Transformer)',
            subtitle: 'Repacking And Tanking Activity — Form No: F/GAS/15',
            sections: [
                {
                    name: '1 — Pre-tanking Activities',
                    items: [
                        { point: 'Punch No. on Tank', specifiedValue: '', type: 'single-merged' },
                        { point: 'Active Part No.', specifiedValue: '', type: 'single-merged' },
                        { point: 'Insulation arrangement in bottom tank', specifiedValue: 'As per drg.', type: 'split-value' },
                        { point: 'Tank barrier fixing on HV side', specifiedValue: 'As per drg.', type: 'split-value' },
                        { point: 'Tank barrier fixing on LV side', specifiedValue: 'As per drg.', type: 'split-value' },
                        { point: 'Type of shunts in Bottom Tank', specifiedValue: '', type: 'tanking-drums-table' },
                        { point: 'Type of shunts in Top Tank', specifiedValue: '', type: 'tanking-drums-table' },
                        { point: 'Bushing draw rod cleaning', specifiedValue: 'Clean', type: 'split-value' },
                        { point: 'Tightness of Intermediate connections of rod', specifiedValue: 'Torque as per drawing', type: 'split-value' }
                    ]
                },
                {
                    name: '2 — Post VPD Timings',
                    items: [
                        { point: 'Condition of climate chamber before VPD opening', specifiedValue: 'RH ...........%  Temp..............°C\nDate & time ............', type: 'split-value' },
                        { point: 'VPD Door open time', specifiedValue: '', type: 'single-merged' },
                        { point: 'Manual cycle of VPD start time / door closing (if applicable)', specifiedValue: '', type: 'single-merged' },
                        { point: 'VPD Door open for tanking (if point no 3 applicable)', specifiedValue: '', type: 'single-merged' },
                        { point: 'Climate chamber door opening time', specifiedValue: '', type: 'single-merged' },
                        { point: 'Vacuum / Dry air application time', specifiedValue: '', type: 'single-merged' }
                    ]
                },
                {
                    name: '3 — Oily Repacking of Active Part (if applicable)',
                    items: [
                        { point: 'Yoke clamp tightening', specifiedValue: 'Torque as per Drawing', type: 'tanking-torque-row' },
                        { point: 'Drop in tank Time & date', specifiedValue: '', type: 'single-merged' },
                        { point: 'Vacuum application time after curb bolt tightening', specifiedValue: '', type: 'single-merged' },
                        { point: 'Vacuum achieving time & date', specifiedValue: '0.30 in bar\nachieved', type: 'split-value' },
                        { point: 'Vacuum hold time (Duration)', specifiedValue: '', type: 'single-merged' },
                        { point: 'Under vacuum oil filling start time & Date', specifiedValue: '', type: 'single-merged' },
                        { point: 'Under vacuum oil filling completion time & Date', specifiedValue: '', type: 'single-merged' },
                        { point: 'Oil draining with continuous dry air filling inside the tank', specifiedValue: '', type: 'single-merged' },
                        { point: 'Time & date for Active part Shifted in Climate chamber for Re-packing', specifiedValue: '', type: 'single-merged' }
                    ]
                },
                {
                    name: '4 — Humidity & Temperature Hourly Monitoring of Climate Chamber',
                    items: [
                        { point: 'Humidity & Temperature Hourly Monitoring Table', specifiedValue: '', type: 'humidity-monitoring-table' }
                    ]
                },
                {
                    name: '5 — Repacking of Active Part',
                    items: [
                        { point: 'Balance points of T.G. Assembly (if any)', specifiedValue: '', type: 'single-merged' },
                        { point: 'Alignment of Common blocks / Top segment', specifiedValue: 'It must be Properly aligned', type: 'split-value' },
                        { point: 'All Permawood support & TG assembly tightening (Clear bar assembly tightening)', specifiedValue: 'Should be tight', type: 'tanking-dual-hv-lv' },
                        { point: 'Yoke clamp tightening', specifiedValue: 'Torque as per Drawing', type: 'tanking-torque-row' },
                        { point: 'Locking, Punching of pressure screw & Tie Rod', specifiedValue: 'Should be locked', type: 'split-value' },
                        { point: 'Tightening, Locking & Punching of other fasteners & clit supports', specifiedValue: '', type: 'single-merged' },
                        { point: 'All Bus Bar Connection tightening', specifiedValue: 'Torque as per Drawing', type: 'split-value' },
                        { point: 'Height measurement before coil pressing', specifiedValue: '', type: 'coil-uvw-diagram' },
                        { point: 'Clamping force for magnetic disc (Ton / Bar) in Shunt Reactors — U0 / V0 / W0', specifiedValue: '......Ton / ......Bar', type: 'split-value' },
                        { point: 'Clamping force for Winding (Ton / Bar) — U0 / V0 / W0', specifiedValue: '......Ton / ......Bar', type: 'split-value' },
                        { point: 'Final winding Height — 4 places / phase. Record in sketch (Tolerance limit +/- 3.0 mm) — U / V / W HV SIDE', specifiedValue: '', type: 'single-merged' },
                        { point: 'Wedge inserting below top yoke', specifiedValue: 'As per Drg.', type: 'tanking-torque-row' },
                        { point: 'Leveling of bottom shunt assembly on both sides / Checking tightness & alignment of top & bottom blocks by malleting / Capture photographic evidence of alignment', specifiedValue: 'Level check / No looseness / Record', type: 'split-value' },
                        { point: 'Locking of coil pressing Blocks', specifiedValue: 'As per Drg.', type: 'split-value' },
                        { point: 'Cleaning of the portion between Top platform and top yoke', specifiedValue: 'Clean', type: 'split-value' },
                        { point: 'Fibre Optic sensor connection — Winding (Sr.No. / Ok / Not Ok)', specifiedValue: 'Ok / Not Ok', type: 'split-value' },
                        { point: 'Fibre Optic sensor connection — Top Yoke (Sr.No. / Ok / Not Ok)', specifiedValue: 'Ok / Not Ok', type: 'split-value' },
                        { point: 'Fibre Optic sensor connection — Return Limb (Sr.No. / Ok / Not Ok)', specifiedValue: 'Ok / Not Ok', type: 'split-value' },
                        { point: 'Fibre Optic sensor connection — Top Oil (Sr.No. / Ok / Not Ok)', specifiedValue: 'Ok / Not Ok', type: 'split-value' },
                        { point: 'Setting of HV / IV main lead as per drawing', specifiedValue: 'As Per Drawing', type: 'tanking-torque-row' },
                        { point: 'Tightening of drain plug of OLTC', specifiedValue: 'Torque as per drawing', type: 'split-value' },
                        { point: 'Closure of all stress caps after completion of hardware tightening', specifiedValue: 'Stress caps shall be in closed condition', type: 'split-value' },
                        { point: 'Tightness of OLTC stress shield & conical nut (In case of OLTC) with special tool', specifiedValue: 'Should be tight', type: 'split-value' },
                        { point: 'Physical verification must be done in around & top of the Active Part by the Production Engineer', specifiedValue: 'Reqd', type: 'split-value' },
                        { point: 'Re-verification and Interlock Barricading with beacon light — done around & top of Active Part by Quality Test Operator', specifiedValue: 'Reqd', type: 'split-value' },
                        { point: 'Clearance between: a) Tie In resistor lead to earth and other tap leads  b) OLTC lead to earth and other tap leads', specifiedValue: '>Neutral to earth clearance', type: 'split-value' },
                        { point: 'Insulation resistance test — Before putting active part in tank (Core Shield, Core & Frame) — 2.5kV DC for 1 Min', specifiedValue: 'C-F: ......  CS-F: ......', type: 'split-value' },
                        { point: '2 Kv AC withstand test — 2.0 kV AC shall withstand for 1 min (Leakage current for reference only)', specifiedValue: 'C-F: ......  C-C: ......  CS-F: ......', type: 'split-value' },
                        { point: 'Electrical Tests: Magnetic balance test / Magnetic Current / Other Electrical Tests (If Any)', specifiedValue: '', type: 'split-value' },
                        { point: 'Cleaning of Active parts', specifiedValue: 'Clean', type: 'split-value' }
                    ]
                },
                {
                    name: '6 — Tanking of Active Part',
                    items: [
                        {
                            point: 'Trial tanking dimensions',
                            specifiedValue: 'HV side: As per drg.\nLV Side: As per drg.',
                            type: 'tanking-torque-row'
                        },
                        {
                            point: 'Physical verification must be done around & top of the Tanking Part by the Production Engineer',
                            specifiedValue: 'Reqd',
                            type: 'split-value'
                        },
                        {
                            point: 'Re-verification and Interlock Barricading with beacon light must be done around & top of the Tanking by the Quality test Operator',
                            specifiedValue: 'Reqd',
                            type: 'split-value'
                        },
                        {
                            point: 'IR (Megger) test After putting active part in bottom tank. (2.5 kV DC application for 1 Min)',
                            specifiedValue: 'C-F: ......\nC-T: ......\nF-T: ......',
                            type: 'split-value'
                        },
                        {
                            point: 'Isolation test After putting top tank.\n(i) 2.5 kV DC for 1 Min — C-F / C-T / F-T\n(ii) 2 kV AC for 1 Min — C-F / C-T / F-T',
                            specifiedValue: 'C-F: ......\nC-T: ......\nF-T: ......',
                            type: 'split-value'
                        },
                        {
                            point: 'Insulation arrangement in bottom tank for Job placement',
                            specifiedValue: '',
                            type: 'single-merged'
                        },
                        {
                            point: 'Top tank fixing time / Dry air application time. Dew Point of dry air < (-40)',
                            specifiedValue: '',
                            type: 'single-merged'
                        },
                        {
                            point: 'Humidity inside tank',
                            specifiedValue: '< 60 %',
                            type: 'split-value'
                        },
                        {
                            point: 'Check for sharp edges on crimped joints, if any',
                            specifiedValue: 'No sharp edges',
                            type: 'split-value'
                        },
                        {
                            point: 'Core, Frame, Tank & Core Shield earthing connection',
                            specifiedValue: 'Torque as per drawing',
                            type: 'split-value'
                        },
                        {
                            point: 'Fibre Optic sensor connection (Sr.No. / Ok / Not Ok)\n— Winding\n— Top Yoke\n— Return Limb\n— Top Oil',
                            specifiedValue: 'Sr.No. / Ok / Not Ok',
                            type: 'split-value'
                        },
                        {
                            point: 'OCTC Arrangement:\n- Synchronization\n- Shaft alignment\n- Shaft Insertion\n- Contact verification',
                            specifiedValue: 'Visual',
                            type: 'split-value'
                        },
                        {
                            point: 'Removal of ratchet belt & loose packing from OLTC',
                            specifiedValue: 'Visual',
                            type: 'split-value'
                        },
                        {
                            point: 'OLTC / OCTC Details',
                            specifiedValue: 'Type: ......\nSr. No: ......',
                            type: 'split-value'
                        },
                        {
                            point: 'Before assembly of OLTC diverter switch ensure it should be on normal tap no.',
                            specifiedValue: 'Tap Position No: ......',
                            type: 'split-value'
                        }
                    ]
                }
            ]
        },
        spa: {
            title: 'INSPECTION RECORD FOR EHV & UHV TRANSFORMER',
            subtitle: 'Single Phase Assembly - Form No: F/QAS/13',
            sections: [{
                name: '2 - First coil (LV/TER)',
                items: [
                    { point: 'Bottom platform/ring', specifiedValue: 'Leveling (+/-1mm), Make, No Damage/Deformation' },
                    { point: 'Segment marking and numbering on bottom platform/ring', specifiedValue: 'Equally spaced Numbering' },
                    { point: 'ID of cylinder in mm', specifiedValue: '', specifiedValueInput: true },
                    { point: 'Check winding cylinder joint and bulging', specifiedValue: 'Visual check to be done' },
                    { point: 'LV/Ter coil lower', specifiedValue: '', specifiedValueInput: true },
                    { point: 'Height adjustment of coil', specifiedValue: 'Do verification' },
                    { point: 'Physical check of coil from outside', specifiedValue: 'Vacuum cleaning' },
                    { point: 'Winding alignment', specifiedValue: 'Visual check and verification' },
                    { point: 'Winding leads position as per RLP', specifiedValue: 'Match with RLP' },
                    { point: 'Oil circulation hole/ducts are not blocked', specifiedValue: 'To be noted' },
                    { point: 'Fitment of oil sealing washer if any', specifiedValue: 'As per Design' }
                ]
            }, {
                name: '3 - 2nd coil (LV/Reg/IV)',
                items: [
                    { point: 'Coil lower', specifiedValue: '', specifiedValueInput: true, pointPrefixInput: true },
                    { point: 'Height adjustment of coil', specifiedValue: 'Do verification' },
                    { point: 'ID of cylinder in mm', specifiedValue: '', specifiedValueInput: true },
                    { point: 'Check winding cylinder joint and bulging', specifiedValue: 'Visual check to be done' },
                    { point: 'Physical check of coil from outside', specifiedValue: 'Vacuum cleaning' },
                    { point: 'Winding alignment', specifiedValue: 'Visual check and verification' },
                    { point: 'Winding leads position as per RLP', specifiedValue: 'Match with RLP' },
                    { point: 'Fitment of oil sealing washer if any', specifiedValue: 'As per Design' }
                ]
            }, {
                name: '4 - 3rd coil (Reg/IV/HV)',
                items: [
                    { point: 'Coil lower', specifiedValue: '', specifiedValueInput: true, pointPrefixInput: true },
                    { point: 'Height adjustment of coil', specifiedValue: 'Do verification' },
                    { point: 'ID of cylinder in mm', specifiedValue: '', specifiedValueInput: true },
                    { point: 'Check winding cylinder joint and bulging', specifiedValue: 'Visual check to be done' },
                    { point: 'Physical check of coil from outside', specifiedValue: 'Vacuum cleaning' },
                    { point: 'Winding alignment', specifiedValue: 'Visual check and verification' },
                    { point: 'Winding leads position as per RLP', specifiedValue: 'Match with RLP' },
                    { point: 'Oil circulation hole/ducts are not blocked', specifiedValue: 'To be noted' },
                    { point: 'Fitment of oil sealing washer if any', specifiedValue: 'As per Design' }
                ]
            }, {
                name: '5 - 4th Coil (HV/TAP)',
                items: [
                    { point: 'Coil lower', specifiedValue: '', specifiedValueInput: true, pointPrefixInput: true },
                    { point: 'Height adjustment of coil', specifiedValue: 'Do verification' },
                    { point: 'ID of cylinder in mm', specifiedValue: '', specifiedValueInput: true },
                    { point: 'Check winding cylinder joint and bulging', specifiedValue: 'Visual check to be done' },
                    { point: 'Physical check of coil from outside', specifiedValue: 'Vacuum cleaning' },
                    { point: 'Winding alignment', specifiedValue: 'Visual check and verification' },
                    { point: 'Winding leads position as per RLP', specifiedValue: 'Match with RLP' },
                    { point: 'Oil circulation hole/ducts are not blocked', specifiedValue: 'To be noted' },
                    { point: 'Fitment of oil sealing washer if any', specifiedValue: 'As per Design' }
                ]
            }, {
                name: '6 - Diameter of Hi Lo gap wraps of coil',
                items: [
                    { point: 'Hi Lo gap wraps table', type: 'hi-lo-gap-table' }
                ]
            }, {
                name: '7 - Other Inspection Points',
                items: [
                    { point: 'Dimensional verification of snouts (By measuring tape and level verification)', specifiedValue: 'As per drawing' },
                    { point: 'Oil sealing at lead take out slots', specifiedValue: 'As per drawing' },
                    { point: 'Top Platform.', specifiedValue: 'Make\nNo Damage\n/Delamination' },
                    { point: 'Position of top platform with reference to bottom platform (Check by plumb method / Laser)', specifiedValue: 'Should be inline' },
                    { point: 'Uniform packing/spacer rings between snouts (Visual)', specifiedValue: 'Should be provided' },
                    { point: 'Fiber optic sensor detail', specifiedValue: 'Use Annexure \'A_FOS\'' },
                    { point: 'Coil stack OD in SPA condition (by measuring tape)', specifiedValue: 'Level check and supplier name' },
                    { point: 'Lead preparation Top and Bottom.', specifiedValue: 'Should be done as per RLP' },
                    { point: 'Lead numbering', specifiedValue: 'Should be done as per RLP' },
                    { point: 'Outer wrap binding.', specifiedValue: 'As per std,' },
                    { point: 'Final Height from top ring top to Bottom ring bottom at four location and window zone (By measuring tape)', specifiedValue: '' },
                    { point: 'Final cleanliness of coil stack assembly', specifiedValue: 'To be cleaned' }
                ]
            }]
        },
        fos_annexure: {
            title: 'FOS (FIBER OPTIC SENSOR) ANNEXURE',
            subtitle: 'Annexure - FOS_A',
            sections: [{
                name: 'FOS (Fiber Optic Sensor) Annexure - FOS_A',
                items: [
                    { point: 'FOS Annexure table', type: 'fos-annexure-table' }
                ]
            }]
        },

        coreBuilding: {
            title: 'INSPECTION RECORD FOR EHV & UHV (Transformer)',
            subtitle: 'Core Building - Form No: F/QAS | Issue No: 00 | Issue Dt: 17/11/2025 | Rev No: 00 | Rev Dt: 17/11/2025',
            sections: [
                {
                    name: 'Core Building of Transformer (Core Table)',
                    items: [
                        { point: 'Core Building Full Table', type: 'core-building-table' }
                    ]
                }
            ]
        },

        vpd: {
            title: 'INSPECTION RECORD FOR EHV & UHV TRANSFORMER',
            subtitle: 'Active Part Drying – VPD | Form No: F/QAS/13',
            sections: [{
                name: 'VPD – Section 1: T-G Assembly & Chamber Cleaning Check',
                items: [
                    { point: 'All T-G assembly points completed', type: 'vpd-shop-qa', specifiedValue: 'Visual Check' },
                    { point: 'Ensure VPD chamber cleaning before job loading:\na) No visible material\nb) No plastic\nc) No Rusted wall\nd) No Residual oil\ne) No dust\nf) No metallic contamination', type: 'vpd-shop-qa', specifiedValue: 'Visual Check' }
                ]
            }, {
                name: 'VPD – Section 2: Loading Parameters & Sensor Placement',
                items: [
                    { point: 'No foreign material left on active part', specifiedValue: 'No foreign material on job.', type: 'vpd-oknotok' },
                    { point: 'Insulation weight', specifiedValue: '', type: 'vpd-measure-merged', unit: 'Ton' },
                    { point: 'VPD Capacity', specifiedValue: '', type: 'vpd-measure-merged', unit: 'kw' },
                    { point: 'Total Number of Sensors / Location to be marked in below diagram\n(Min 3 upto 765 kV)', specifiedValue: 'Min 3 upto 765 kV', type: 'vpd-sensor-diagram' }
                ]
            }, {
                name: 'VPD – Section 3: Solvent & Process Check',
                items: [
                    { point: 'Last empty distillation cycle Date', specifiedValue: 'Quarterly or after each Oily distillation cycle', type: 'vpd-yesno', hasDescInput: true },
                    { point: 'Last Oily job distillation cycle Date', specifiedValue: '', type: 'vpd-yesno', hasDescInput: true },
                    { point: 'Date of solvent testing', specifiedValue: 'Half Yearly', type: 'vpd-yesno', hasDescInput: true },
                    { point: 'Ensure proper functionality of VPD oven', specifiedValue: 'OK / Not OK', type: 'vpd-oknotok' },
                    { point: 'Quality of the solvent', specifiedValue: 'As per specifications', type: 'vpd-measure', unit: '' },
                    { point: 'Filter in the VPD Oven', specifiedValue: '< 10 Microns after the solvent pump before the evaporator', type: 'vpd-measure', unit: '' },
                    { point: 'Process Start (Time & date)', specifiedValue: '', type: 'vpd-measure', unit: '' },
                    { point: 'Vacuum achieved during preparation phase', specifiedValue: '< 7.0 mbar', type: 'vpd-measure', unit: 'mbar' },
                    { point: 'Set Oven temperature', specifiedValue: '135 deg.', type: 'vpd-measure', unit: '°C' },
                    { point: 'Rate of rise of oven wall (°C / h)', specifiedValue: '± 7°C /h', type: 'vpd-measure', unit: '°C/h' },
                    { point: 'First Heating duration', specifiedValue: '', type: 'vpd-measure', unit: '', hasDescInput: true },
                    { point: 'Total No. of IPRs', specifiedValue: 'Min 4 IPR upto 765 kV', type: 'vpd-measure', unit: '' }
                ]
            }, {
                name: 'VPD – Section 4: Drying Process Parameters',
                items: [
                    { point: 'Core temp during drying procedure', specifiedValue: 'Min 100', type: 'vpd-measure', unit: '°C' },
                    { point: 'Heating duration after last IPR', specifiedValue: 'Min 6 Hrs upto 765 kV', type: 'vpd-measure', unit: '' },
                    { point: 'Core temp after completing above step', specifiedValue: 'Min 100', type: 'vpd-measure', unit: '°C' },
                    { point: 'Vacuum during Final pressure Reduction', specifiedValue: '< 25.0 mbar upto 765kV', type: 'vpd-measure', unit: 'mbar' },
                    { point: 'Period of Fine Vacuum (after achieving 0.2 mbar upto 765 kV) in Hrs', specifiedValue: '24 hr 400 kv | 05 for 765 kv', type: 'vpd-measure', unit: 'Hrs' },
                    { point: 'Water Extraction rate at end of fine vacuum', specifiedValue: '< 5 g/h for 400 kV\n< 5 g/h for 765 kV', type: 'vpd-measure', unit: 'g/h' },
                    { point: 'Final vacuum **', specifiedValue: '≤0.30 mbar upto 400kV\n≤0.20 mbar upto 765 kV', type: 'vpd-measure', unit: 'mbar' },
                    { point: 'Final winding temp **', specifiedValue: '> 110°C; Should not more than 130°C', type: 'vpd-measure', unit: '°C' },
                    { point: 'Final core temp **', specifiedValue: '> 100°C; Should not more than 130°C', type: 'vpd-measure', unit: '°C' },
                    { point: 'Final Dew Point **', specifiedValue: '≤ (-55°C) upto 765 kV', type: 'vpd-measure', unit: '°C' },
                    { point: 'Total operation time', specifiedValue: '', type: 'vpd-measure', unit: '' },
                    { point: 'Dew point of dry air feeded before opening VPD door', specifiedValue: '≤ -40°C', type: 'vpd-dual-measure' },
                    { point: 'Finish date & time', specifiedValue: '', type: 'vpd-measure', unit: '' }
                ]
            }]
        },
        dismantling: {
            title: 'INSPECTION RECORD FOR EHV & UHV (Transformer)',
            subtitle: 'Dismantling | Form No: F/QAS/17 | Issue No: 03 | Issue Dt: 18-11-25 | Rev No: 00 | Rev Dt: 18-11-25',
            formNo: 'F/QAS/17',
            sections: [
                // ── PAGE 1 ──────────────────────────────────────────────────────────────
                {
                    name: 'Name and Signature',
                    isDismantlingSignTable: true,
                    items: []
                },
                {
                    name: 'Dismantling – Main Inspection Record (Page 1 of 5)',
                    items: [
                        { point: 'Oil drain start Date & time', specifiedValue: '', type: 'dismantling-standard' },
                        { point: 'Oil drain stop Date & time', specifiedValue: '', type: 'dismantling-standard' },
                        { point: 'Before window open Dry air application date & time', specifiedValue: 'Dew Point of dry air ≤ -55°C', type: 'dismantling-standard' },
                        { point: 'Time at which location of window Opened', specifiedValue: '', type: 'dismantling-window-row' },
                        { point: 'Time at which location of window Closed', specifiedValue: '', type: 'dismantling-window-row' },
                        { point: 'Details of work done (Section A)', specifiedValue: '', type: 'dismantling-workdone' },
                        { point: 'Time at which location of window Opened', specifiedValue: '', type: 'dismantling-window-row' },
                        { point: 'Time at which location of window Closed', specifiedValue: '', type: 'dismantling-window-row' },
                        { point: 'Details of work done (Section B)', specifiedValue: '', type: 'dismantling-workdone' },
                        { point: 'Time at which location of window Opened', specifiedValue: '', type: 'dismantling-window-row' },
                        { point: 'Time at which location of window Closed', specifiedValue: '', type: 'dismantling-window-row' },
                        { point: 'Details of work done (Section C)', specifiedValue: '', type: 'dismantling-workdone' }
                    ]
                },
                // ── PAGE 2 ──────────────────────────────────────────────────────────────
                {
                    name: 'Dismantling – Visual Checks & Final Tests (Page 2 of 5)',
                    items: [
                        { point: 'Details of Visual checks / work done HV Side', specifiedValue: '', type: 'dismantling-hv-visual' },
                        { point: 'Time at which window Opened', specifiedValue: '', type: 'dismantling-window-row' },
                        { point: 'Time at which window Closed', specifiedValue: '', type: 'dismantling-window-row' },
                        { point: 'Details of Visual checks / work done LV Side', specifiedValue: '', type: 'dismantling-lv-visual' },
                        { point: 'Final Cleanliness at HV side', specifiedValue: '', type: 'dismantling-standard' },
                        { point: 'Final Cleanliness at LV side', specifiedValue: '', type: 'dismantling-standard' },
                        { point: 'IR (Megger) Test', specifiedValue: '', type: 'dismantling-ir-test' },
                        { point: 'Dry air application time & date', specifiedValue: 'Dew Point ≤ -55°C', type: 'dismantling-standard' }
                    ]
                },
                // ── PAGE 3 ──────────────────────────────────────────────────────────────
                {
                    name: 'Vacuum Monitoring Record (Page 3 of 5)',
                    items: [
                        { point: 'Vacuum Monitoring Record Table', type: 'dismantling-vacuum-table' }
                    ]
                },
                // ── PAGE 4 ──────────────────────────────────────────────────────────────
                {
                    name: 'Oil Filling Record (Page 4 of 5)',
                    items: [
                        { point: 'Oil Filling Record Table', type: 'dismantling-oilfill-table' }
                    ]
                },
                // ── PAGE 5 ──────────────────────────────────────────────────────────────
                {
                    name: 'Dry Air Pressure Monitoring Record (Page 5 of 5)',
                    items: [
                        { point: 'Dry Air Pressure Monitoring Table', type: 'dismantling-dryair-table' }
                    ]
                }
            ]
        },
        shunt_reactor: {
            title: "INSPECTION RECORD FOR EHV & UHV (Shunt Reactor)",
            subtitle: "Core Coil Assembly",
            sections: [
                {
                    name: "Core Coil Assembly (Coil Lowering, Top yoke, Connections)",
                    items: [
                        { sr: 1, point: "Magnetic disc Make", specifiedValue: "" },
                        { sr: 2, point: "Bottom yoke Levelling with Optical Level/Dumpy Level. At 4 locations (1 Phase)", specifiedValue: "HV Side: 1, 2<br>LV Side: 3, 4", type: "sr-locations-4" },
                        { sr: 3, point: "Alignment of limbs (+/- 1 mm)", specifiedValue: "With Plumb Level" },
                        { sr: 4, point: "Positoning of Gauge Mark Alignment of Gauge Mark & line marking on core as per Drg.", specifiedValue: "", type: "sr-digital-image" },
                        { sr: 5, point: "Position of Isolation disc (Fiberglass washer) or bottom yoke as per Drawing", specifiedValue: "Required" },
                        { sr: 6, point: "Positoin of Isolation tubes shall be interchanged at adjacent portion on each isolation disc", specifiedValue: "No isolation tubes shall be adjacent sides of isolation washer" },
                        { sr: 7, point: "Positioning of tocido (Resin Sheet) between bottom yoke and magnetic disc (As per Drawing)", specifiedValue: "Required" },
                        { sr: 8, point: "<div style=\"text-align:center; font-weight:bold; border-bottom:1px solid #ddd; padding-bottom:5px; margin-bottom:5px;\">Disc Assembly</div>Disc Part-A", specifiedValue: "Specified Height at Location", type: "sr-disc-height" },
                        { sr: 9, point: "Araldite application before fixing 2nd half on magnetic disc assembly (Curing time: 6:00 hours at Room temp.)", specifiedValue: "" },
                        { sr: 10, point: "<div style=\"text-align:center; font-weight:bold; border-bottom:1px solid #ddd; padding-bottom:5px; margin-bottom:5px;\">Disc Assembly</div>Disc Part-B", specifiedValue: "Specified Height at Location", type: "sr-disc-height" },
                        { sr: 11, point: "Magnetic disc assembly stack height to be measured (+/- 2.0 mm)", specifiedValue: "" },
                        { sr: 12, point: "Arrangment of Pre-dried & oil impregnated bottom ring / segment, support blocks & screw rods (As per Drg.)<br>-Grain Orientation<br>-Leveling with spirit level (-0/+2 mm)<br>-Alignment of magnetic disc (-0/+2 mm)", specifiedValue: "Ok/Not Ok", type: "ok-notok" },
                        { sr: 13, point: "Bottom Shunt & Insulation Fitting (As per Drg.)", specifiedValue: "" },
                        { sr: 14, point: "Alignment of Strips on main limb and Wrap thickness to be record as below.", specifiedValue: "", type: "sr-strip-wrap-full" },
                        { sr: 15, point: "Assembly of core shield on magnetic disc assembly", specifiedValue: "Digital Image", type: "sr-digital-image" },
                        { sr: 16, point: "Core shield overlapping length", specifiedValue: "As per Drg." },
                        { sr: 17, point: "Core shield lead position (Lead takeout should be inside of overlap)", specifiedValue: "As per Drg." },
                        { sr: 18, point: "Pressboard protection at core shield end", specifiedValue: "As per Drg." }
                    ]
                }
            ]
        },
        dispatch: {
            title: 'INSPECTION RECORD FOR EHV & UHV Transformer',
            subtitle: 'Dispatch – Form No: F/GAS/28',
            formNo: 'F/GAS/28',
            sections: [{
                name: 'Dispatch Inspection Checklist',
                isDispatch: true,
                items: [
                    { point: 'Test released note issued / not issued', specifiedValue: 'TRN issued by testing' },
                    { point: 'Terminal Marking plate / Tag fitting<br><small>1) Earthing pad<br>2) OTI, WTI &amp; TP pockets<br>3) Haulage, lashing lugs &amp; lifting bollards<br>4) Valves &amp; Jacking Pad<br>5) Any Other</small>', specifiedValue: 'The labels are provided as per approve GA drg' },
                    { point: 'Valve locking arrangement and protection Guard if required', specifiedValue: 'Locking Rod fitted with split pin/ hardwares' },
                    { point: 'Protection hood for fiber optic sensor plate', specifiedValue: 'Fitted with suitable hardware' },
                    { point: 'Protection hood for OLTC &amp; OCTC', specifiedValue: 'As per Drawing' },
                    { point: 'Turret Blanking plate', specifiedValue: 'All hardwares are tightened' },
                    { point: 'Center line marking on the job', specifiedValue: 'Marked with hard punch and identified by RED' },
                    { point: 'Earthing pads on bottom tank', specifiedValue: 'Duly fitted with SS hardwares' },
                    { point: 'Paint touch up', specifiedValue: 'If required' },
                    { point: 'Bracing support / Transport disk for active part', specifiedValue: 'As provided by design' },
                    { point: 'Protection cover placed under the lashing chains', specifiedValue: 'As Per Required' },
                    { point: 'Torque tightening of curb bolts after placement of transformer on trailer', specifiedValue: 'Torque as per drawing' },
                    { point: 'Core - Frame - Tank earthing terminal', specifiedValue: 'Permanent marking / Tag' },
                    { point: 'All hardware same length fitted', specifiedValue: 'Torque to be applied' },
                    { point: 'Dew Point Measurement', specifiedValue: '', type: 'dispatch-dew-point' },
                    { point: 'IR Test (Megger)', specifiedValue: '', type: 'dispatch-ir-test' },
                    { point: 'Impact Recorder', specifiedValue: '', type: 'dispatch-impact' },
                    { point: 'Main Tank Dispatched with -<br><small>(Mark ✓ which ever is applicable)</small>', specifiedValue: '', type: 'dispatch-main-tank' },
                    { point: 'Pressure Observation for 12 Hrs. (Minimum)', specifiedValue: '', type: 'dispatch-pressure-obs' },
                    { point: 'Remarks per Shortage if any:-', specifiedValue: '', type: 'dispatch-remarks-row' },
                    { point: 'Transformer Dispatch Clearance<br><small>(Mark ✓ which ever is applicable)</small>', specifiedValue: '', type: 'dispatch-clearance' },
                    { point: 'Date of Dispatch', specifiedValue: '', type: 'dispatch-date-row' },
                    { point: 'Name of Production engineer &amp; Name of Quality engineer', specifiedValue: '', type: 'dispatch-sign-row' }
                ]
            }]
        }
    };
}

/* ===============================
   LOAD STAGE CONTENT
================================ */
function loadStageContent(stage) {
    const content = document.getElementById('stageContent');
    if (!content) return;

    const isAdmin = window.currentUserRole === 'admin';
    const isEditMode = window.isEditMode && isAdmin;
    const isCustomer = window.currentUserRole === 'customer';
    const isQuality = window.currentUserRole === 'quality';
    const isProduction = window.currentUserRole === 'production';
    const isShopSupervisor = window.currentUserRole === 'shop_supervisor';
    const disabledAttr = isCustomer ? 'disabled' : '';
    const shopSupervisorAutoSign = isShopSupervisor ? (window.currentUserName || '') : '';
    const qualityAutoSign = isQuality ? (window.currentUserName || '') : '';
    const todayStr = new Date().toLocaleDateString('en-GB');
    const autoSSVal  = shopSupervisorAutoSign ? `${shopSupervisorAutoSign} | ${todayStr}` : '';
    const autoQAVal  = qualityAutoSign        ? `${qualityAutoSign} | ${todayStr}`        : '';

    // Check if we have master data, otherwise fallback to local getStageData()
    const allStages = window.checklistMasterData || getStageData();
    let stageInfo = allStages[stage];

    // If master data is incomplete and missing a specific stage, fallback to local getStageData for that specific stage
    if (!stageInfo && window.checklistMasterData) {
        console.warn(`Stage "${stage}" not found in master data. Falling back to local data.`);
        const fallbackStages = getStageData();
        stageInfo = fallbackStages[stage];
        
        // Optionally inject it back to master data so it's not requested again
        if (stageInfo) {
            window.checklistMasterData[stage] = stageInfo;
        }
    }

    if (!stageInfo) {
        content.innerHTML = '<p style="padding: 20px; color: #e74c3c;">Stage data not found.</p>';
        return;
    }

    let itemCounter = 0;
    let checklistHTML = '';

    // Render all sections
    stageInfo.sections.forEach((section, sectionIndex) => {
        // Special header for tanking stage with split Observed Value columns
        const isTankingStage = stage === 'tanking';

        checklistHTML += `
            ${stage === 'shunt_reactor' ? '' : `
            <h4 style="background: #ecf0f1; padding: 10px; margin-top: 20px; border-left: 4px solid var(--blue);" 
                ${isAdmin ? `contenteditable="true" onblur="updateMasterData('${stage}', 'section', ${sectionIndex}, this.innerText)"` : ''}>
                ${section.name}
            </h4>
            `}
            <table class="form-table">
                <thead>
                    ${stage === 'coreBuilding' ? '' : stage === 'vpd' && section.items.some(i => i.type === 'vpd-shop-qa') ? `
                    <tr>
                        <th style="width:40px;">Sr.no</th>
                        <th style="width:300px;">Inspection Points</th>
                        <th style="width:270px;" colspan="2">Observations</th>
                        <th style="width:130px;">Shop Supervisor</th>
                        <th style="width:130px;">Quality Supervisor</th>
                        <th style="width:120px;">Remarks</th>
                        <th style="width:80px;">Action</th>
                    </tr>
                    ` : stage === 'vpd' && !section.items.some(i => i.type === 'vpd-shop-qa') ? `
                    <tr>
                        <th style="width:40px;">Sr.no</th>
                        <th style="width:240px;">Description</th>
                        <th style="width:160px;">Specified value</th>
                        <th style="width:120px;">Measure</th>
                        <th style="width:110px;">Operator</th>
                        <th style="width:110px;">Shop Supervisor</th>
                        <th style="width:120px;">Remarks</th>
                        <th style="width:80px;">Action</th>
                    </tr>
                    ` : isTankingStage ? `
                    <tr>
                        <th style="width:40px;" rowspan="2">Sr.no</th>
                        <th style="width:300px;" rowspan="2">Inspection Points</th>
                        <th style="width:100px;" rowspan="2">Specified value</th>
                        <th style="width:200px;" colspan="2">Observed Value</th>
                        <th style="width:400px;" rowspan="2">Checked by (Sign & date)</th>
                        <th style="width:120px;" rowspan="2">Remarks</th>
                        <th style="width:80px;" rowspan="2">Action</th>
                    </tr>
                    <tr>
                        <th style="width:100px;">Value 1</th>
                        <th style="width:100px;">Value 2</th>
                    </tr>
                    ` : stage === 'dispatch' ? `
                    <tr>
                        <th style="width:40px;">Sr. No.</th>
                        <th style="width:300px;">Description</th>
                        <th style="width:180px;">Requirements</th>
                        <th style="width:110px;">Findings</th>
                        <th style="width:220px;">Checked by (Sign &amp; date)<br><small style="font-weight:normal;">Operator &nbsp;|&nbsp; Shop Supervisor</small></th>
                        <th style="width:120px;">Remark</th>
                        <th style="width:80px;">Action</th>
                    </tr>
                    ` : stage === 'dismantling' && !section.isDismantlingSignTable && section.items.some(i => i.type !== 'dismantling-vacuum-table' && i.type !== 'dismantling-oilfill-table' && i.type !== 'dismantling-dryair-table') ? `
                    <tr>
                        <th style="width:40px;">Sr. no.</th>
                        <th style="width:260px;">Description</th>
                        <th style="width:130px;">Specified Value<br><small style="font-weight:normal;">(if required)</small></th>
                        <th style="width:120px;">Method of Check<br><small style="font-weight:normal;">Visual / Measure</small></th>
                        <th style="width:100px;">Operator</th>
                        <th style="width:100px;">Shop Supervisor</th>
                        <th style="width:110px;">Remark</th>
                        <th style="width:70px;">Action</th>
                    </tr>
                    ` : stage === 'shunt_reactor' ? `
                    <tr>
                        <th style="width:40px;">Sr. No.</th>
                        <th style="width:280px;">Description</th>
                        <th style="width:140px;">Specified Value</th>
                        <th style="width:120px;">Actual Value</th>
                        <th style="width:130px;">Operator (Sign & Date)</th>
                        <th style="width:130px;">Shop Supervisor (Sign & Date)</th>
                        <th style="width:130px;">Quality Inspector (Sign & Date)</th>
                        <th style="width:80px;">Action</th>
                    </tr>
                    ` : stage === 'dismantling' ? '' : `
                    <tr>
                        <th style="width:40px;">Sr.no</th>
                        <th style="width:300px;">Inspection Points</th>
                        <th style="width:150px;">Specified value</th>
                        <th style="width:120px;">Actual Value</th>
                        <th style="width:400px;">Checked by (Sign & date)</th>
                        <th style="width:120px;">Remarks</th>
                        <th style="width:80px;">Action</th>
                    </tr>
                    `}
                </thead>
                <tbody>
        `;

        if (isAdmin && sectionIndex === 0) {
            checklistHTML = `
                <div style="background: #fff3e0; padding: 10px; margin-bottom: 10px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #ffe0b2;">
                    <div>
                        <b style="color: #e65100; font-size: 14px;">🛠️ Checklist Structure Management</b>
                        <p style="font-size: 11px; margin: 3px 0 0 0; color: #666;">Turn on Edit Mode to add/delete rows or change input types. All structural changes must be saved.</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-primary" onclick="toggleEditMode('${stage}')" 
                                style="padding: 6px 15px; font-size: 12px; background: ${window.isEditMode ? '#e67e22' : '#3498db'};">
                            ${window.isEditMode ? '🔒 Lock Structure' : '✏️ Edit Structure'}
                        </button>
                        <button class="btn btn-primary" onclick="saveMasterLayout(true)" 
                                style="padding: 6px 15px; font-size: 12px; background: #27ae60;">💾 Save Master Layout</button>
                    </div>
                </div>
            ` + checklistHTML;
        }
        // Keep dismantling row numbers continuous across sections after the Name & Signature section
        if (stage === 'dismantling') {
            if (sectionIndex === 0) itemCounter = 0;
        } else if (stage !== 'vpd' || sectionIndex < 2) {
            itemCounter = 0;
        }

        // ── DISMANTLING: Name & Signature special section ──
        if (stage === 'dismantling' && section.isDismantlingSignTable) {
            checklistHTML = checklistHTML.replace(/<h4[^>]*>[\s\S]*?<\/h4>\s*<table[^>]*>[\s\S]*?<thead>[\s\S]*?$/, '');
            checklistHTML += `
                <h4 style="background: #ecf0f1; padding: 10px; margin-top: 20px; border-left: 4px solid var(--blue);">NAME AND SIGNATURE</h4>
                <table class="form-table" style="width:100%;">
                    <thead><tr>
                        <th style="width:40px;">S NO</th>
                        <th style="width:180px;">NAME</th>
                        <th style="width:100px;">SIGN</th>
                        <th style="width:40px;">S NO</th>
                        <th style="width:180px;">NAME</th>
                        <th style="width:100px;">SIGN</th>
                    </tr></thead>
                    <tbody>
                        ${[1, 2, 3, 4].map(n => `
                        <tr style="height:36px;">
                            <td style="padding:4px 8px;text-align:center;border-right:1px solid #ccc;">${n}</td>
                            <td style="padding:4px;border-right:1px solid #ccc;"><input type="text" id="dis_name_${n}a" ${disabledAttr} style="width:100%;border:none;padding:3px;font-size:11px;"></td>
                            <td style="padding:4px;border-right:1px solid #ccc;"><input type="text" id="dis_sign_${n}a" ${disabledAttr} style="width:100%;border:none;padding:3px;font-size:11px;"></td>
                            <td style="padding:4px 8px;text-align:center;border-right:1px solid #ccc;">${n + 4}</td>
                            <td style="padding:4px;border-right:1px solid #ccc;"><input type="text" id="dis_name_${n}b" ${disabledAttr} style="width:100%;border:none;padding:3px;font-size:11px;"></td>
                            <td style="padding:4px;"><input type="text" id="dis_sign_${n}b" ${disabledAttr} style="width:100%;border:none;padding:3px;font-size:11px;"></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            `;
            return; // skip normal table render for this section
        }

        section.items.forEach((item, itemIndex) => {
            if (item.type !== 'section-header') itemCounter++;
            const rowId = `row_${stage}_${itemCounter}`;

            // Determine what type of input to render based on item.type
            // Initialize sign-off cells
            let technicianCell = null;
            let shopSupCell = null;
            let qaSupCell = null;
            let remarkCell = null;
            let actualValueCell = '';
            let specifiedValueCell = item.specifiedValue;

            // Apply dynamic input type for Specified Value
            if (item.specifiedInputType === 'dropdown') {
                specifiedValueCell = `
                    <select id="specifiedValue_${rowId}" ${disabledAttr} style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 11px;">
                        <option value="${item.specifiedValue || ''}">${item.specifiedValue || '-- Select --'}</option>
                        <option value="Ok">Ok</option>
                        <option value="Not Ok">Not Ok</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="N/A">N/A</option>
                    </select>
                `;
            }
            let customRowHTML = null;

            // Check if specified value should be editable (for rows 10-12, 14-20 in winding checklist, or specifiedValueInput flag)
            if (item.editableSpecifiedValue || item.specifiedValueInput) {
                specifiedValueCell = `
                    <input type="text" 
                           id="specifiedValue_${rowId}" 
                           ${disabledAttr}
                           value="${item.specifiedValue}"
                           placeholder="${item.specifiedValue || 'Enter value'}"
                           style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 11px;">
                `;
            }

            const dismantlingSpecifiedValueRows = new Set([1, 2, 4, 5, 7, 8, 10, 11, 14, 15, 17, 18]);
            if (stage === 'dismantling' && dismantlingSpecifiedValueRows.has(itemCounter)) {
                specifiedValueCell = `
                    <input type="text" 
                           id="specifiedValue_${rowId}" 
                           ${disabledAttr}
                           value="${item.specifiedValue || ''}"
                           placeholder="${item.specifiedValue || 'Enter value'}"
                           style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px; font-size: 11px;">
                `;
            }

            // ── Shunt Reactor Row 2: 4-location merged layout ──
            if (item.type === 'sr-locations-4') {
                const cs = 'border:1px solid #aaa; padding:5px 8px; font-size:11px; vertical-align:middle;';
                const inpS = 'width:100%; border:none; padding:3px 5px; font-size:11px; background:transparent; box-sizing:border-box; outline:none;';
                customRowHTML = `
                    <tr>
                        <td rowspan="4" style="${cs} text-align:center; font-weight:bold; background:#f8f8f8;">${itemCounter}</td>
                        <td rowspan="4" style="${cs} text-align:left; vertical-align:middle;">${item.point}</td>
                        <td rowspan="2" style="${cs} text-align:center; background:#f5f5f5; font-weight:600;">HV Side</td>
                        <td style="${cs} vertical-align:middle;">
                            <span style="font-weight:600; margin-right:6px;">1-</span>
                            <input type="text" id="loc1_${rowId}" ${disabledAttr} placeholder="........mm" style="${inpS} width:calc(100% - 30px);">
                        </td>
                        <td style="${cs} padding:2px;"><input type="text" id="op1_${rowId}" ${disabledAttr} placeholder="Sign &amp; Date" style="${inpS}"></td>
                        <td style="${cs} padding:2px;"><input type="text" id="ss1_${rowId}" ${disabledAttr} value="${autoSSVal}" placeholder="Sign &amp; Date" style="${inpS}"></td>
                        <td style="${cs} padding:2px;"><input type="text" id="qa1_${rowId}" ${disabledAttr} value="${autoQAVal}" placeholder="Sign &amp; Date" style="${inpS}"></td>
                        <td rowspan="4" style="${cs} text-align:center; background:#fafafa;"></td>
                    </tr>
                    <tr>
                        <td style="${cs} vertical-align:middle;">
                            <span style="font-weight:600; margin-right:6px;">2-</span>
                            <input type="text" id="loc2_${rowId}" ${disabledAttr} placeholder="........mm" style="${inpS} width:calc(100% - 30px);">
                        </td>
                        <td style="${cs} padding:2px;"><input type="text" id="op2_${rowId}" ${disabledAttr} placeholder="Sign &amp; Date" style="${inpS}"></td>
                        <td style="${cs} padding:2px;"><input type="text" id="ss2_${rowId}" ${disabledAttr} value="${autoSSVal}" placeholder="Sign &amp; Date" style="${inpS}"></td>
                        <td style="${cs} padding:2px;"><input type="text" id="qa2_${rowId}" ${disabledAttr} value="${autoQAVal}" placeholder="Sign &amp; Date" style="${inpS}"></td>
                    </tr>
                    <tr>
                        <td rowspan="2" style="${cs} text-align:center; background:#f5f5f5; font-weight:600;">LV Side</td>
                        <td style="${cs} vertical-align:middle;">
                            <span style="font-weight:600; margin-right:6px;">3-</span>
                            <input type="text" id="loc3_${rowId}" ${disabledAttr} placeholder="........mm" style="${inpS} width:calc(100% - 30px);">
                        </td>
                        <td style="${cs} padding:2px;"><input type="text" id="op3_${rowId}" ${disabledAttr} placeholder="Sign &amp; Date" style="${inpS}"></td>
                        <td style="${cs} padding:2px;"><input type="text" id="ss3_${rowId}" ${disabledAttr} value="${autoSSVal}" placeholder="Sign &amp; Date" style="${inpS}"></td>
                        <td style="${cs} padding:2px;"><input type="text" id="qa3_${rowId}" ${disabledAttr} value="${autoQAVal}" placeholder="Sign &amp; Date" style="${inpS}"></td>
                    </tr>
                    <tr>
                        <td style="${cs} vertical-align:middle;">
                            <span style="font-weight:600; margin-right:6px;">4-</span>
                            <input type="text" id="loc4_${rowId}" ${disabledAttr} placeholder="........mm" style="${inpS} width:calc(100% - 30px);">
                        </td>
                        <td style="${cs} padding:2px;"><input type="text" id="op4_${rowId}" ${disabledAttr} placeholder="Sign &amp; Date" style="${inpS}"></td>
                        <td style="${cs} padding:2px;"><input type="text" id="ss4_${rowId}" ${disabledAttr} value="${autoSSVal}" placeholder="Sign &amp; Date" style="${inpS}"></td>
                        <td style="${cs} padding:2px;"><input type="text" id="qa4_${rowId}" ${disabledAttr} value="${autoQAVal}" placeholder="Sign &amp; Date" style="${inpS}"></td>
                    </tr>
                `;

            // Special handling for tanking stage with split Observed Value columns
            } else if (stage === 'tanking') {
                if (item.type === 'single-merged') {
                    // Rows 1-2: Single input spanning both Value 1 and Value 2 columns
                    actualValueCell = `
                        <td colspan="2" style="padding: 8px;">
                            <input type="text" 
                                   id="actualValue_${rowId}" 
                                   ${disabledAttr}
                                   placeholder="${item.specifiedValue}"
                                   style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px;">
                        </td>
                    `;
                } else if (item.type === 'split-value') {
                    // Rows 3-5, 8-9: Two separate inputs for Value 1 and Value 2
                    actualValueCell = `
                        <td style="padding: 8px;">
                            <input type="text" 
                                   id="observedValue1_${rowId}" 
                                   ${disabledAttr}
                                   placeholder="Value 1"
                                   style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                        </td>
                        <td style="padding: 8px;">
                            <input type="text" 
                                   id="observedValue2_${rowId}" 
                                   ${disabledAttr}
                                   placeholder="Value 2"
                                   style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                        </td>
                    `;
                } else if (item.type === 'sr-disc-height') {
                    // Shunt Reactor Row 8/10: Exact form mirroring
                    actualValueCell = `
                        <td style="padding:0;">
                            <table style="width:100%; border-collapse:collapse; font-size:10px;">
                                <tr>
                                    <td colspan="2" style="border-bottom:1px solid #ddd; padding:4px; text-align:center; background:#f9f9f9; font-weight:bold;">Actual Height at Location</td>
                                </tr>
                                <tr>
                                    <td style="border-right:1px solid #ddd; border-bottom:1px solid #ddd; padding:4px; width:20px;">1.</td>
                                    <td style="border-bottom:1px solid #ddd; padding:0;"><input type="text" id="ah1_${rowId}" ${disabledAttr} style="width:100%; border:none; padding:4px;"></td>
                                </tr>
                                <tr>
                                    <td style="border-right:1px solid #ddd; border-bottom:1px solid #ddd; padding:4px;">2.</td>
                                    <td style="border-bottom:1px solid #ddd; padding:0;"><input type="text" id="ah2_${rowId}" ${disabledAttr} style="width:100%; border:none; padding:4px;"></td>
                                </tr>
                                <tr>
                                    <td style="border-right:1px solid #ddd; border-bottom:1px solid #ddd; padding:4px;">3.</td>
                                    <td style="border-bottom:1px solid #ddd; padding:0;"><input type="text" id="ah3_${rowId}" ${disabledAttr} style="width:100%; border:none; padding:4px;"></td>
                                </tr>
                                <tr>
                                    <td style="border-right:1px solid #ddd; padding:4px;">4.</td>
                                    <td style="padding:0;"><input type="text" id="ah4_${rowId}" ${disabledAttr} style="width:100%; border:none; padding:4px;"></td>
                                </tr>
                            </table>
                        </td>
                    `;
                    // Override specifiedValue cell for this type
                    specifiedValueCell = `
                        <div style="font-weight:bold; border-bottom:1px solid #ddd; padding:4px; text-align:center; background:#f9f9f9; font-size:10px;">Specified Height at Location</div>
                        <div style="display:flex; align-items:center; padding:4px;">
                            <span style="font-size:10px; margin-right:5px;">1.</span>
                            <input type="text" id="sh1_${rowId}" ${disabledAttr} style="flex:1; padding:4px; border:1px solid #ddd; border-radius:2px; font-size:11px;">
                        </div>
                    `;
                } else if (item.type === 'sr-strip-wrap') {
                    // Shunt Reactor Row 14: Strip/Wrap thk table
                    actualValueCell = `
                        <td style="padding:0;">
                            <table style="width:100%; border-collapse:collapse; font-size:9px;">
                                <tr style="background:#f9f9f9;">
                                    <th style="border-bottom:1px solid #ddd; border-right:1px solid #ddd; padding:2px;">Part/BOM</th>
                                    <th style="border-bottom:1px solid #ddd; border-right:1px solid #ddd; padding:2px;">Strip/Wrap thk.</th>
                                    <th style="border-bottom:1px solid #ddd; padding:2px;">Measured Dia</th>
                                </tr>
                                <tr>
                                    <td style="border-right:1px solid #ddd; padding:0;"><input type="text" id="part_${rowId}" ${disabledAttr} style="width:100%; border:none; padding:4px;"></td>
                                    <td style="border-right:1px solid #ddd; padding:0;"><input type="text" id="thk_${rowId}" ${disabledAttr} style="width:100%; border:none; padding:4px;"></td>
                                    <td style="padding:0;"><input type="text" id="dia_${rowId}" ${disabledAttr} style="width:100%; border:none; padding:4px;"></td>
                                </tr>
                            </table>
                        </td>
                    `;
                } else if (item.type === 'sr-digital-image') {
                    // Shunt Reactor Row 4/15/19: Digital Image
                    actualValueCell = `
                        <td style="padding:8px; text-align:center;">
                            <div class="digital-image-upload" data-row-id="${rowId}">
                                <button class="btn" ${disabledAttr} style="font-size:10px; padding:2px 8px; border:1px solid #ccc;"><i class="fas fa-camera"></i> Capture / Upload</button>
                                <span style="display:block; font-size:9px; color:#888; margin-top:4px;">Digital Image Required</span>
                            </div>
                        </td>
                    `;
                } else if (item.type === 'sr-impression-check') {
                    // Shunt Reactor Row 30: Impression Check (U, V, W circular diagrams)
                    actualValueCell = `
                        <td style="padding:5px;">
                            <div style="display:flex; justify-content:space-around; align-items:center;">
                                <div style="text-align:center;">
                                    <div style="width:40px; height:40px; border:2px solid var(--blue); border-radius:50%; margin:0 auto; position:relative; cursor:pointer;" onclick="toggleImpression('${rowId}', 'U')">
                                        <div id="u_diag_${rowId}" style="width:100%; height:100%; display:flex; flex-wrap:wrap; align-content:center; justify-content:center; color:var(--blue); font-weight:bold; font-size:16px;">U</div>
                                    </div>
                                    <span style="font-size:9px;">U Phase</span>
                                </div>
                                <div style="text-align:center;">
                                    <div style="width:40px; height:40px; border:2px solid var(--blue); border-radius:50%; margin:0 auto; position:relative; cursor:pointer;" onclick="toggleImpression('${rowId}', 'V')">
                                        <div id="v_diag_${rowId}" style="width:100%; height:100%; display:flex; flex-wrap:wrap; align-content:center; justify-content:center; color:var(--blue); font-weight:bold; font-size:16px;">V</div>
                                    </div>
                                    <span style="font-size:9px;">V Phase</span>
                                </div>
                                <div style="text-align:center;">
                                    <div style="width:40px; height:40px; border:2px solid var(--blue); border-radius:50%; margin:0 auto; position:relative; cursor:pointer;" onclick="toggleImpression('${rowId}', 'W')">
                                        <div id="w_diag_${rowId}" style="width:100%; height:100%; display:flex; flex-wrap:wrap; align-content:center; justify-content:center; color:var(--blue); font-weight:bold; font-size:16px;">W</div>
                                    </div>
                                    <span style="font-size:9px;">W Phase</span>
                                </div>
                            </div>
                        </td>
                    `;
                } else if (item.type === 'dropdown-merged') {
                    // Rows 6-7: Dropdown spanning both columns
                    actualValueCell = `
                        <td colspan="2" style="padding: 8px;">
                            <select id="actualValue_${rowId}" 
                                    ${disabledAttr}
                                    style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px;">
                                <option value="">-- Select --</option>
                                <option value="Type A">Type A</option>
                                <option value="Type B">Type B</option>
                                <option value="Type C">Type C</option>
                            </select>
                        </td>
                    `;
                } else if (item.type === 'tanking-drums-table') {
                    // Type of drums: As per Drg | Clip Type / Welded columns
                    actualValueCell = `
                        <td colspan="2" style="padding: 0;">
                            <table style="width:100%; border-collapse:collapse; font-size:10px; height:100%;">
                                <tr>
                                    <td style="border-left:1px solid #ddd; border-right:1px solid #ddd; padding:3px 5px; font-size:9px; color:#555; text-align:center; white-space:pre-line; width:35%;">${item.specifiedValue}</td>
                                    <td style="border-right:1px solid #ddd; padding:0; width:32.5%;">
                                        <div style="font-size:9px; text-align:center; padding:2px; border-bottom:1px solid #ddd; color:#555;">Clip Type</div>
                                        <input type="text" id="drums_clip_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:3px 4px;font-size:10px;background:transparent;box-sizing:border-box;">
                                    </td>
                                    <td style="padding:0; width:32.5%;">
                                        <div style="font-size:9px; text-align:center; padding:2px; border-bottom:1px solid #ddd; color:#555;">Welded</div>
                                        <input type="text" id="drums_welded_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:3px 4px;font-size:10px;background:transparent;box-sizing:border-box;">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    `;
                } else if (item.type === 'tanking-timing-row') {
                    // Post VPD Timings: Date & Time | Temp columns
                    actualValueCell = `
                        <td colspan="2" style="padding: 0;">
                            <table style="width:100%; border-collapse:collapse; font-size:10px; height:100%;">
                                <tr>
                                    <td style="border-right:1px solid #ddd; padding:0; width:60%;">
                                        <div style="font-size:9px; text-align:center; padding:2px; border-bottom:1px solid #ddd; color:#555;">Date &amp; Time</div>
                                        <input type="text" id="timing_dt_${rowId}" ${disabledAttr} placeholder="DD/MM/YYYY HH:MM" style="width:100%;border:none;padding:3px 4px;font-size:10px;background:transparent;box-sizing:border-box;">
                                    </td>
                                    <td style="padding:0; width:40%;">
                                        <div style="font-size:9px; text-align:center; padding:2px; border-bottom:1px solid #ddd; color:#555;">Temp........Ãƒâ€šÃ‚Â°C</div>
                                        <input type="text" id="timing_temp_${rowId}" ${disabledAttr} placeholder="Ãƒâ€šÃ‚Â°C" style="width:100%;border:none;padding:3px 4px;font-size:10px;background:transparent;box-sizing:border-box;">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    `;
                } else if (item.type === 'tanking-torque-row') {
                    // Dry Repadking Torque: HV Side | LV Side columns
                    actualValueCell = `
                        <td colspan="2" style="padding: 0;">
                            <table style="width:100%; border-collapse:collapse; font-size:10px; height:100%;">
                                <tr>
                                    <td style="border-right:1px solid #ddd; padding:0; width:50%;">
                                        <div style="font-size:9px; text-align:center; padding:2px; border-bottom:1px solid #ddd; color:#555;">HV Side</div>
                                        <input type="text" id="torque_hv_${rowId}" ${disabledAttr} placeholder="Torque (Nm)" style="width:100%;border:none;padding:3px 4px;font-size:10px;background:transparent;box-sizing:border-box;">
                                    </td>
                                    <td style="padding:0; width:50%;">
                                        <div style="font-size:9px; text-align:center; padding:2px; border-bottom:1px solid #ddd; color:#555;">LV Side</div>
                                        <input type="text" id="torque_lv_${rowId}" ${disabledAttr} placeholder="Torque (Nm)" style="width:100%;border:none;padding:3px 4px;font-size:10px;background:transparent;box-sizing:border-box;">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    `;
                }
            } else if (stage === 'dispatch') {
                // ── DISPATCH: custom row renderers (mirror of physical form F/GAS/28) ──
                if (item.type === 'dispatch-dew-point') {
                    // Row 15: Dew Point – sub-rows Td, T, RH
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:4px 6px;text-align:center;font-weight:bold;border-right:1px solid #ccc;vertical-align:top;">${itemCounter}</td>
                            <td style="padding:4px 6px;border-right:1px solid #ccc;vertical-align:top;font-size:11px;">Dew Point Measurement</td>
                            <td style="padding:0;border-right:1px solid #ccc;">
                                <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                    <tr style="background:#f5f5f5;"><th style="border-bottom:1px solid #ccc;border-right:1px solid #ccc;padding:3px 5px;width:50%;">Measure</th><th style="border-bottom:1px solid #ccc;padding:3px 5px;">Value</th></tr>
                                    <tr style="border-bottom:1px solid #eee;"><td style="border-right:1px solid #ccc;padding:3px 5px;">Td &nbsp; °C</td><td style="padding:0;"><input type="text" id="dew_td_${rowId}" ${disabledAttr} placeholder="°C" style="width:100%;border:none;padding:4px 5px;font-size:10px;"></td></tr>
                                    <tr style="border-bottom:1px solid #eee;"><td style="border-right:1px solid #ccc;padding:3px 5px;">T &nbsp;&nbsp; °C</td><td style="padding:0;"><input type="text" id="dew_t_${rowId}" ${disabledAttr} placeholder="°C" style="width:100%;border:none;padding:4px 5px;font-size:10px;"></td></tr>
                                    <tr><td style="border-right:1px solid #ccc;padding:3px 5px;">RH &nbsp; %</td><td style="padding:0;"><input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="%" style="width:100%;border:none;padding:4px 5px;font-size:10px;"></td></tr>
                                </table>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ccc;vertical-align:top;"><input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="Finding" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;border-right:1px solid #ccc;vertical-align:top;"><input type="text" id="shopSup_${rowId}" readonly value="${shopSupervisorAutoSign}" placeholder="Shop Supervisor" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;background:#f5f5f5;color:#333;cursor:default;"></td>
                            <td style="padding:4px;border-right:1px solid #ccc;vertical-align:top;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;text-align:center;vertical-align:top;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Save</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                } else if (item.type === 'dispatch-ir-test') {
                    // Row 16: IR Test – sub-rows Core-Frame, Core-Tank, Frame-Tank
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:4px 6px;text-align:center;font-weight:bold;border-right:1px solid #ccc;vertical-align:top;">${itemCounter}</td>
                            <td style="padding:4px 6px;border-right:1px solid #ccc;vertical-align:top;font-size:11px;">
                                IR Test<br><small style="color:#555;">(Megger)</small>
                            </td>
                            <td style="padding:0;border-right:1px solid #ccc;">
                                <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                    <tr style="background:#f5f5f5;"><th style="border-bottom:1px solid #ccc;border-right:1px solid #ccc;padding:3px 5px;width:50%;">Test</th><th style="border-bottom:1px solid #ccc;padding:3px 5px;">Value</th></tr>
                                    <tr style="border-bottom:1px solid #eee;"><td style="border-right:1px solid #ccc;padding:3px 5px;">Core - Frame</td><td style="padding:0;"><input type="text" id="ir_cf_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:4px 5px;font-size:10px;"></td></tr>
                                    <tr style="border-bottom:1px solid #eee;"><td style="border-right:1px solid #ccc;padding:3px 5px;">Core - Tank</td><td style="padding:0;"><input type="text" id="ir_ct_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:4px 5px;font-size:10px;"></td></tr>
                                    <tr><td style="border-right:1px solid #ccc;padding:3px 5px;">Frame - Tank</td><td style="padding:0;"><input type="text" id="actualValue_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:4px 5px;font-size:10px;"></td></tr>
                                </table>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ccc;vertical-align:top;"><input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="Finding" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;border-right:1px solid #ccc;vertical-align:top;"><input type="text" id="shopSup_${rowId}" readonly value="${shopSupervisorAutoSign}" placeholder="Shop Supervisor" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;background:#f5f5f5;color:#333;cursor:default;"></td>
                            <td style="padding:4px;border-right:1px solid #ccc;vertical-align:top;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;text-align:center;vertical-align:top;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Save</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                } else if (item.type === 'dispatch-impact') {
                    // Row 17: Impact Recorder – 4 specified value sub-items with measure inputs
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:4px 6px;text-align:center;font-weight:bold;border-right:1px solid #ccc;vertical-align:top;">${itemCounter}</td>
                            <td style="padding:4px 6px;border-right:1px solid #ccc;vertical-align:top;font-size:11px;">Impact Recorder</td>
                            <td style="padding:0;border-right:1px solid #ccc;">
                                <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                    <tr style="background:#f5f5f5;"><th style="border-bottom:1px solid #ccc;border-right:1px solid #ccc;padding:3px 5px;width:60%;">Specified Value</th><th style="border-bottom:1px solid #ccc;padding:3px 5px;">Measure</th></tr>
                                    <tr style="border-bottom:1px solid #eee;"><td style="border-right:1px solid #ccc;padding:3px 5px;">Fitting of as per transport drawing</td><td style="padding:0;"><input type="text" id="imp_fit_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:4px 5px;font-size:10px;"></td></tr>
                                    <tr style="border-bottom:1px solid #eee;"><td style="border-right:1px solid #ccc;padding:3px 5px;">Quantity as per transport drawing</td><td style="padding:0;"><input type="text" id="imp_qty_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:4px 5px;font-size:10px;"></td></tr>
                                    <tr style="border-bottom:1px solid #eee;"><td style="border-right:1px solid #ccc;padding:3px 5px;">Password to operate</td><td style="padding:4px 5px;font-size:10px;font-weight:bold;color:#333;">If Required</td></tr>
                                    <tr><td style="border-right:1px solid #ccc;padding:3px 5px;">Switching ON after loading transformer on trailer (if applicable)</td><td style="padding:0;"><select id="actualValue_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:4px 5px;font-size:10px;"><option value="">--</option><option>Auto</option><option>Manual</option></select></td></tr>
                                </table>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ccc;vertical-align:top;"><input type="text" id="shopSup_${rowId}" readonly value="${shopSupervisorAutoSign}" placeholder="Shop Supervisor" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;background:#f5f5f5;color:#333;cursor:default;"></td>
                            <td style="padding:4px;border-right:1px solid #ccc;vertical-align:top;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;text-align:center;vertical-align:top;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Save</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                } else if (item.type === 'dispatch-main-tank') {
                    // Row 18: Main Tank Dispatched with – Dry Air / N2 / Oil checkboxes
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ccc;vertical-align:middle;">${itemCounter}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ccc;font-size:11px;">${item.point}</td>
                            <td colspan="2" style="padding:8px 12px;border-right:1px solid #ccc;font-size:11px;">
                                <label style="margin-right:20px;cursor:pointer;"><input type="checkbox" id="tank_dryair_${rowId}" ${disabledAttr} style="margin-right:5px;">Dry Air</label>
                                <label style="margin-right:20px;cursor:pointer;"><input type="checkbox" id="tank_n2_${rowId}" ${disabledAttr} style="margin-right:5px;">N2</label>
                                <label style="cursor:pointer;"><input type="checkbox" id="actualValue_${rowId}" ${disabledAttr} style="margin-right:5px;">Oil</label>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ccc;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Save</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                } else if (item.type === 'dispatch-pressure-obs') {
                    // Row 19: Pressure Observation 12 hrs – table with Date/Time/Pressure Applied/Pressure Observed/Leakages
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ccc;vertical-align:top;">${itemCounter}</td>
                            <td colspan="5" style="padding:0;border-right:1px solid #ccc;">
                                <div style="padding:6px 8px;font-weight:bold;font-size:11px;border-bottom:1px solid #ccc;background:#fafafa;">Pressure Observation for 12 Hrs. (Minimum)</div>
                                <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                    <thead>
                                        <tr style="background:#f0f0f0;text-align:center;">
                                            <th style="border:1px solid #ccc;padding:4px;width:14%;">Date</th>
                                            <th style="border:1px solid #ccc;padding:4px;width:12%;">Time</th>
                                            <th style="border:1px solid #ccc;padding:4px;width:22%;">Pressure Applied</th>
                                            <th style="border:1px solid #ccc;padding:4px;width:24%;">Pressure Observed</th>
                                            <th style="border:1px solid #ccc;padding:4px;">Leakages (if any)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${[1, 2, 3, 4, 5, 6, 7, 8].map(r => `
                                        <tr>
                                            <td style="border:1px solid #ccc;padding:0;"><input type="date" id="pobs_date_${rowId}_${r}" ${disabledAttr} style="width:100%;border:none;padding:3px;font-size:9px;"></td>
                                            <td style="border:1px solid #ccc;padding:0;"><input type="text" id="pobs_time_${rowId}_${r}" ${disabledAttr} placeholder="HH:MM" style="width:100%;border:none;padding:3px;font-size:9px;"></td>
                                            <td style="border:1px solid #ccc;padding:0;"><input type="text" id="pobs_applied_${rowId}_${r}" ${disabledAttr} placeholder="mbar" style="width:100%;border:none;padding:3px;font-size:9px;"></td>
                                            <td style="border:1px solid #ccc;padding:0;"><input type="text" id="pobs_observed_${rowId}_${r}" ${disabledAttr} placeholder="mbar" style="width:100%;border:none;padding:3px;font-size:9px;"></td>
                                            <td style="border:1px solid #ccc;padding:0;"><input type="text" id="pobs_leak_${rowId}_${r}" ${disabledAttr} placeholder="—" style="width:100%;border:none;padding:3px;font-size:9px;"></td>
                                        </tr>`).join('')}
                                    </tbody>
                                </table>
                            </td>
                            <td style="padding:4px;text-align:center;vertical-align:top;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Save</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                } else if (item.type === 'dispatch-remarks-row') {
                    // Row 20: Remarks per Shortage – textarea
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ccc;vertical-align:top;">${itemCounter}</td>
                            <td colspan="5" style="padding:8px;border-right:1px solid #ccc;">
                                <b style="font-size:11px;">Remarks per Shortage if any:-</b><br>
                                <textarea id="actualValue_${rowId}" ${disabledAttr} rows="4" placeholder="Enter shortage remarks here..." style="width:100%;padding:6px;border:1px solid #ddd;font-size:11px;margin-top:4px;resize:vertical;"></textarea>
                            </td>
                            <td style="padding:4px;text-align:center;vertical-align:top;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Save</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                } else if (item.type === 'dispatch-clearance') {
                    // Row 21: Transformer Dispatch Clearance – YES / No checkboxes
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ccc;">${itemCounter}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ccc;font-size:11px;">Transformer Dispatch Clearance<br><small style="color:#666;">(Mark ✓ which ever is applicable)</small></td>
                            <td colspan="2" style="padding:10px 16px;border-right:1px solid #ccc;font-size:12px;">
                                <label style="margin-right:30px;cursor:pointer;"><input type="checkbox" id="clearance_yes_${rowId}" ${disabledAttr} style="margin-right:6px;width:14px;height:14px;"> YES</label>
                                <label style="cursor:pointer;"><input type="checkbox" id="actualValue_${rowId}" ${disabledAttr} style="margin-right:6px;width:14px;height:14px;"> No</label>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ccc;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Save</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                } else if (item.type === 'dispatch-date-row') {
                    // Row 22: Date of Dispatch + Time of Dispatch
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ccc;">${itemCounter}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ccc;font-size:11px;">Date of Dispatch</td>
                            <td style="padding:8px;border-right:1px solid #ccc;">
                                <input type="date" id="actualValue_${rowId}" ${disabledAttr} style="padding:4px;border:1px solid #ddd;font-size:11px;width:100%;">
                            </td>
                            <td style="padding:8px;border-right:1px solid #ccc;font-size:11px;">
                                <b>Time of Dispatch:</b><br>
                                <input type="text" id="dispatch_time_${rowId}" ${disabledAttr} placeholder="HH:MM" style="padding:4px;border:1px solid #ddd;font-size:11px;width:90px;margin-top:4px;">
                            </td>
                            <td style="padding:4px;border-right:1px solid #ccc;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Save</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                } else if (item.type === 'dispatch-sign-row') {
                    // Row 23: Name of Production Engineer & Quality Engineer – two sign lines combined
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ccc;vertical-align:top;">${itemCounter}</td>
                            <td colspan="5" style="padding:0;border-right:1px solid #ccc;">
                                <table style="width:100%;border-collapse:collapse;font-size:11px;">
                                    <tr style="border-bottom:1px solid #eee;">
                                        <td style="padding:8px;width:50%;border-right:1px solid #eee;">Name of Production engineer</td>
                                        <td style="padding:8px;">
                                            <b>Sign:</b> <input type="text" id="prod_sign_${rowId}" ${disabledAttr} placeholder="Signature" style="padding:4px;border:1px solid #ddd;font-size:11px;width:calc(100% - 50px);">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:8px;border-right:1px solid #eee;">Name of Quality engineer</td>
                                        <td style="padding:8px;">
                                            <b>Sign:</b> <input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="Signature" style="padding:4px;border:1px solid #ddd;font-size:11px;width:calc(100% - 50px);">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td style="padding:4px;text-align:center;vertical-align:middle;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Save</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                } else {
                    // Standard dispatch rows (1-14): text input in Findings column (not dropdown)
                    customRowHTML = `
                        <tr style="border-bottom:1px solid #ccc;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ccc;">${itemCounter}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ccc;font-size:11px;">${item.point}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ccc;font-size:10px;color:#555;">${item.specifiedValue}</td>
                            <td style="padding:4px;border-right:1px solid #ccc;">
                                <input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;">
                            </td>
                            <td style="padding:4px;border-right:1px solid #ccc;"><input type="text" id="shopSup_${rowId}" readonly value="${shopSupervisorAutoSign}" placeholder="Shop Supervisor" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;background:#f5f5f5;color:#333;cursor:default;"></td>
                            <td style="padding:4px;border-right:1px solid #ccc;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:6px 4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">&#128190; Update</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
                }
            } else if (item.type === 'ok-notok' && item.phases) {
                customRowHTML = `
                        <tr style="border-bottom:1px solid #ddd;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ddd;">${itemCounter}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ddd;">${item.point}</td>
                            <td style="padding:0;border-right:1px solid #ddd;">
                                <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                    <tr><th style="border-bottom:1px solid #ddd;border-right:1px solid #ddd;padding:2px 4px;">Td</th><th style="border-bottom:1px solid #ddd;padding:2px 4px;">Rh</th></tr>
                                    <tr>
                                        <td style="border-right:1px solid #ddd;"><input type="text" id="dispatch_dew_td_${rowId}" ${disabledAttr} placeholder="\u00b0C" style="width:100%;border:none;padding:4px;font-size:10px;"></td>
                                        <td><input type="text" id="dispatch_dew_rh_${rowId}" ${disabledAttr} placeholder="%" style="width:100%;border:none;padding:4px;font-size:10px;"></td>
                                    </tr>
                                </table>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ddd;"><input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="Finding" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;border-right:1px solid #ddd;">
                                <div style="font-size:10px;margin-bottom:3px;"><b>Operator:</b> <input type="text" id="operator_${rowId}" ${disabledAttr} placeholder="Sign" style="width:78%;padding:3px;border:1px solid #ddd;"></div>
                                <div style="font-size:10px;"><b>Shop Sup.:</b> <input type="text" id="shopSup_${rowId}" readonly value="${shopSupervisorAutoSign}" placeholder="Shop Supervisor" style="width:74%;padding:3px;border:1px solid #ddd;background:#f5f5f5;color:#333;cursor:default;"></div>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ddd;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:6px 4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">\ud83d\udcbe Update</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
            } else if (item.type === 'dispatch-ir-test') {
                customRowHTML = `
                        <tr style="border-bottom:1px solid #ddd;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ddd;">${itemCounter}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ddd;">
                                ${item.point}
                                <table style="width:100%;border-collapse:collapse;font-size:10px;margin-top:4px;">
                                    <tr style="background:#f0f0f0;"><th style="border:1px solid #ddd;padding:2px;">Test</th><th style="border:1px solid #ddd;padding:2px;">Value</th></tr>
                                    <tr><td style="border:1px solid #ddd;padding:3px;">Core &amp; Frame</td><td style="border:1px solid #ddd;padding:0;"><input type="text" id="ir_core_frame_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:3px;font-size:10px;"></td></tr>
                                    <tr><td style="border:1px solid #ddd;padding:3px;">Core &ndash; Tank</td><td style="border:1px solid #ddd;padding:0;"><input type="text" id="ir_core_tank_${rowId}" ${disabledAttr} style="width:100%;border:none;padding:3px;font-size:10px;"></td></tr>
                                </table>
                            </td>
                            <td style="padding:6px 8px;border-right:1px solid #ddd;font-size:10px;">IR Test (Megger)</td>
                            <td style="padding:4px;border-right:1px solid #ddd;"><input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="Finding" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:4px;border-right:1px solid #ddd;">
                                <div style="font-size:10px;margin-bottom:3px;"><b>Operator:</b> <input type="text" id="operator_${rowId}" ${disabledAttr} placeholder="Sign" style="width:78%;padding:3px;border:1px solid #ddd;"></div>
                                <div style="font-size:10px;"><b>Shop Sup.:</b> <input type="text" id="shopSup_${rowId}" readonly value="${shopSupervisorAutoSign}" placeholder="Shop Supervisor" style="width:74%;padding:3px;border:1px solid #ddd;background:#f5f5f5;color:#333;cursor:default;"></div>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ddd;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:6px 4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">\ud83d\udcbe Update</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
            } else if (item.type === 'dispatch-impact') {
                customRowHTML = `
                        <tr style="border-bottom:1px solid #ddd;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ddd;">${itemCounter}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ddd;">${item.point}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ddd;font-size:10px;">${item.specifiedValue}</td>
                            <td style="padding:4px;border-right:1px solid #ddd;">
                                <select id="actualValue_${rowId}" ${disabledAttr} style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;">
                                    <option value="">-- Select --</option>
                                    <option>If Required</option>
                                    <option>Fitted</option>
                                    <option>N/A</option>
                                </select>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ddd;">
                                <div style="font-size:10px;margin-bottom:3px;"><b>Operator:</b> <input type="text" id="operator_${rowId}" ${disabledAttr} placeholder="Sign" style="width:78%;padding:3px;border:1px solid #ddd;"></div>
                                <div style="font-size:10px;"><b>Shop Sup.:</b> <input type="text" id="shopSup_${rowId}" readonly value="${shopSupervisorAutoSign}" placeholder="Shop Supervisor" style="width:74%;padding:3px;border:1px solid #ddd;background:#f5f5f5;color:#333;cursor:default;"></div>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ddd;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:6px 4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">\ud83d\udcbe Update</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
            } else if (item.type === 'dispatch-pressure') {
                customRowHTML = `
                        <tr style="border-bottom:1px solid #ddd;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ddd;">${itemCounter}</td>
                            <td style="padding:6px 8px;border-right:1px solid #ddd;">${item.point}</td>
                            <td style="padding:4px;border-right:1px solid #ddd;">
                                <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                    <tr><td style="padding:2px 3px;">Auto / Manual:</td><td style="padding:2px;">
                                        <select id="pressure_mode_${rowId}" ${disabledAttr} style="width:100%;padding:2px;border:1px solid #ddd;font-size:10px;">
                                            <option value="">--</option><option>Auto</option><option>Manual</option>
                                        </select></td></tr>
                                    <tr><td style="padding:2px 3px;">Dry Air / N2:</td><td style="padding:2px;">
                                        <select id="pressure_gas_${rowId}" ${disabledAttr} style="width:100%;padding:2px;border:1px solid #ddd;font-size:10px;">
                                            <option value="">--</option><option>Dry Air</option><option>N2</option>
                                        </select></td></tr>
                                    <tr><td style="padding:2px 3px;">ON / OFF:</td><td style="padding:2px;">
                                        <select id="pressure_status_${rowId}" ${disabledAttr} style="width:100%;padding:2px;border:1px solid #ddd;font-size:10px;">
                                            <option value="">--</option><option>ON</option><option>OFF</option>
                                        </select></td></tr>
                                    <tr><td style="padding:2px 3px;">Leakages:</td><td style="padding:2px;"><input type="text" id="pressure_leak_${rowId}" ${disabledAttr} placeholder="If any" style="width:100%;padding:2px;border:1px solid #ddd;font-size:10px;"></td></tr>
                                    <tr><td style="padding:2px 3px;">Applied (mbar):</td><td style="padding:2px;"><input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="mbar" style="width:100%;padding:2px;border:1px solid #ddd;font-size:10px;"></td></tr>
                                    <tr><td style="padding:2px 3px;">Observed (mbar):</td><td style="padding:2px;"><input type="text" id="pressure_obs_${rowId}" ${disabledAttr} placeholder="mbar" style="width:100%;padding:2px;border:1px solid #ddd;font-size:10px;"></td></tr>
                                </table>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ddd;font-size:10px;">
                                Date: <input type="date" id="pressure_date_${rowId}" ${disabledAttr} style="width:100%;padding:2px;border:1px solid #ddd;font-size:10px;margin-bottom:3px;"><br>
                                Time: <input type="text" id="pressure_time_${rowId}" ${disabledAttr} placeholder="HH:MM" style="width:100%;padding:2px;border:1px solid #ddd;font-size:10px;">
                            </td>
                            <td style="padding:4px;border-right:1px solid #ddd;">
                                <div style="font-size:10px;margin-bottom:3px;"><b>Operator:</b> <input type="text" id="operator_${rowId}" ${disabledAttr} placeholder="Sign" style="width:78%;padding:3px;border:1px solid #ddd;"></div>
                                <div style="font-size:10px;"><b>Shop Sup.:</b> <input type="text" id="shopSup_${rowId}" readonly value="${shopSupervisorAutoSign}" placeholder="Shop Supervisor" style="width:74%;padding:3px;border:1px solid #ddd;background:#f5f5f5;color:#333;cursor:default;"></div>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ddd;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:6px 4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">\ud83d\udcbe Update</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
            } else if (item.type === 'dispatch-date-row') {
                customRowHTML = `
                        <tr style="border-bottom:1px solid #ddd;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ddd;">${itemCounter}</td>
                            <td colspan="5" style="padding:8px;border-right:1px solid #ddd;">
                                <b>Date:</b> <input type="date" id="actualValue_${rowId}" ${disabledAttr} style="padding:4px;border:1px solid #ddd;font-size:12px;margin-left:8px;">
                                &nbsp;&nbsp;<b>Time of Dispatch:</b> <input type="text" id="dispatch_time_${rowId}" ${disabledAttr} placeholder="HH:MM" style="padding:4px;border:1px solid #ddd;font-size:12px;width:80px;">
                            </td>
                            <td style="padding:6px 4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">\ud83d\udcbe Update</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
            } else if (item.type === 'dispatch-remarks-row') {
                customRowHTML = `
                        <tr style="border-bottom:1px solid #ddd;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ddd;">${itemCounter}</td>
                            <td colspan="5" style="padding:8px;border-right:1px solid #ddd;">
                                <b>${item.point}</b><br>
                                <textarea id="actualValue_${rowId}" ${disabledAttr} rows="3" placeholder="Enter any shortage remarks here..." style="width:100%;padding:6px;border:1px solid #ddd;font-size:12px;margin-top:4px;resize:vertical;"></textarea>
                            </td>
                            <td style="padding:6px 4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">\ud83d\udcbe Update</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;
            } else if (item.type === 'dispatch-sign-row') {
                customRowHTML = `
                        <tr style="border-bottom:1px solid #ddd;">
                            <td style="padding:6px 8px;text-align:center;font-weight:bold;border-right:1px solid #ddd;">${itemCounter}</td>
                            <td colspan="2" style="padding:8px;border-right:1px solid #ddd;font-size:11px;">${item.point}</td>
                            <td style="padding:4px;border-right:1px solid #ddd;"><input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="Finding" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:8px;border-right:1px solid #ddd;">
                                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                                    <div><label style="font-size:10px;color:#666;">Name:</label><br><input type="text" id="sign_name_${rowId}" ${disabledAttr} placeholder="Name" style="padding:4px;border:1px solid #ddd;font-size:11px;min-width:140px;"></div>
                                    <div><label style="font-size:10px;color:#666;">Sign:</label><br><input type="text" id="sign_${rowId}" ${disabledAttr} placeholder="Signature" style="padding:4px;border:1px solid #ddd;font-size:11px;min-width:120px;"></div>
                                </div>
                            </td>
                            <td style="padding:4px;border-right:1px solid #ddd;"><input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Date" style="width:100%;padding:4px;border:1px solid #ddd;font-size:10px;"></td>
                            <td style="padding:6px 4px;text-align:center;">
                                <button onclick="saveNewChecklistItem('dispatch',${itemCounter},'${rowId}')" class="btn-save-item" ${disabledAttr} id="save_${rowId}">\ud83d\udcbe Update</button>
                                <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                            </td>
                        </tr>
                    `;

            } else if (item.type === 'ok-notok' && item.phases) {
                // Row 1 & 2: OK/Not OK dropdowns for U, V, W phases
                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        ${item.phases.map((phase, idx) => `
                            <div style="border: 1px solid #333; ${idx > 0 ? 'border-top: none;' : ''} padding: 6px 8px; background: #fff; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 10px; width: 60px; font-weight: 500; color: #000;">${phase}</span>
                                <select id="actualValue_${rowId}_${phase.replace(' ', '_')}" 
                                        ${disabledAttr}
                                        style="flex: 1; padding: 5px; border: 1px solid #333; border-radius: 0; font-size: 10px; background: #fff;">
                                    <option value="">-- Select --</option>
                                    <option value="Ok">Ok</option>
                                    <option value="Not Ok">Not Ok</option>
                                </select>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (item.type === 'ok-notok' && !item.phases) {
                // Row 3: Single OK/Not OK dropdown
                actualValueCell = `
                    <select id="actualValue_${rowId}" 
                            ${disabledAttr}
                            style="width: 100%; padding: 5px; border: 1px solid #333; border-radius: 0; font-size: 10px; background: #fff;">
                        <option value="">-- Select --</option>
                        <option value="Ok">Ok</option>
                        <option value="Not Ok">Not Ok</option>
                    </select>
                `;
            } else if (item.type === 'text-phases' && item.phases) {
                // Row 4 & 7: Text inputs for U, V, W phases
                // Generate Specified Value Cell to match alignment
                specifiedValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        ${item.phases.map((phase, idx) => `
                            <div style="border: 1px solid #333; ${idx > 0 ? 'border-top: none;' : ''} padding: 6px 8px; background: #f9f9f9; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 10px; width: 60px; font-weight: 500; color: #000;">${phase}</span>
                                <input type="text" 
                                       id="specifiedValue_${rowId}_${phase.replace(' ', '_')}"
                                       ${disabledAttr}
                                       placeholder=".......... mm"
                                       style="flex: 1; padding: 5px; border: 1px solid #333; border-radius: 0; font-size: 10px; background-color: #fff; color: #000;">
                            </div>
                        `).join('')}
                    </div>
                `;

                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        ${item.phases.map((phase, idx) => `
                            <div style="border: 1px solid #333; ${idx > 0 ? 'border-top: none;' : ''} padding: 6px 8px; background: #fff; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 10px; width: 60px; font-weight: 500; color: #000;">${phase}</span>
                                <input type="text" 
                                       id="actualValue_${rowId}_${phase.replace(' ', '_')}" 
                                       ${disabledAttr}
                                       placeholder="...... mm"
                                       style="flex: 1; padding: 5px; border: 1px solid #333; border-radius: 0; font-size: 10px; background: #fff;">
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (item.type === 'ok-notok-limbs' && item.limbs) {
                // Row 5: OK/Not OK for Limb-1 and Limb-2
                // Generate Specified Value Cell to match alignment
                specifiedValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        ${item.limbs.map((limb, idx) => `
                            <div style="border: 1px solid #333; ${idx > 0 ? 'border-top: none;' : ''} padding: 6px 8px; background: #f9f9f9; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 10px; width: 120px; font-weight: 500; color: #000;">${limb}</span>
                                <input type="text" 
                                       disabled
                                       value="As per Drawing"
                                       style="flex: 1; padding: 5px; border: 1px solid #333; border-radius: 0; font-size: 10px; background-color: #fff; color: #000;">
                            </div>
                        `).join('')}
                    </div>
                `;

                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        ${item.limbs.map((limb, idx) => `
                            <div style="border: 1px solid #333; ${idx > 0 ? 'border-top: none;' : ''} padding: 6px 8px; background: #fff;">
                                <select id="actualValue_${rowId}_${limb.replace(/[^a-zA-Z0-9]/g, '_')}" 
                                        ${disabledAttr}
                                        style="width: 100%; padding: 5px; border: 1px solid #333; border-radius: 0; font-size: 10px; background: #fff;">
                                    <option value="">-- Select --</option>
                                    <option value="Ok">Ok</option>
                                    <option value="Not Ok">Not Ok</option>
                                </select>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (item.type === 'tmb-measurements' && item.phases) {
                // Row 6: T, M, B measurements for U, V, W phases
                // Generate Specified Value Cell to match alignment
                specifiedValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        ${item.phases.map((phase, idx) => `
                            <div style="border: 1px solid #333; ${idx > 0 ? 'border-top: none;' : ''} padding: 6px 8px; background: #f9f9f9;">
                                <div style="font-size: 10px; font-weight: 500; margin-bottom: 4px; color: #000;">${phase}</div>
                                <input type="text" 
                                       id="specifiedValue_${rowId}_${phase.replace(' ', '_')}"
                                       ${disabledAttr}
                                       placeholder="......... mm"
                                       style="width: 100%; padding: 5px; border: 1px solid #333; border-radius: 0; font-size: 10px; background-color: #fff; color: #000;">
                            </div>
                        `).join('')}
                    </div>
                `;

                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        ${item.phases.map((phase, idx) => `
                            <div style="border: 1px solid #333; ${idx > 0 ? 'border-top: none;' : ''} padding: 6px 8px; background: #fff;">
                                <div style="font-size: 10px; font-weight: 500; margin-bottom: 4px; color: #000;">${phase}</div>
                                <table style="width: 100%; border-collapse: collapse;">
                                    ${['T', 'M', 'B'].map((pos, posIdx) => `
                                        <tr style="${posIdx > 0 ? 'border-top: 1px solid #ddd;' : ''}">
                                            <td style="width: 20px; padding: 3px 0; font-size: 10px; font-weight: bold; color: #000; text-align: center;">${pos}</td>
                                            <td style="padding: 3px 0 3px 6px;">
                                                <input type="text" 
                                                       id="actualValue_${rowId}_${phase.replace(' ', '_')}_${pos}" 
                                                       ${disabledAttr}
                                                       placeholder="mm"
                                                       style="width: 100%; padding: 4px; border: 1px solid #333; border-radius: 0; font-size: 10px; background: #fff; box-sizing: border-box;">
                                            </td>
                                        </tr>
                                    `).join('')}
                                </table>
                            </div>
                        `).join('')}
                    </div>
                `;

                // Custom Technician Cell for TMB (Split per phase)
                technicianCell = `
                     <div style="display: flex; flex-direction: column; gap: 3px;">
                        ${item.phases.map(phase => `
                            <div style="border-bottom: 1px solid #eee; padding: 3px 0; height: 93px; display: flex; align-items: center;">
                                <input type="text" id="technician_${rowId}_${phase.replace(' ', '_')}" placeholder="Name (${phase})" class="technician-input" style="width: 100%; border: 1px solid #ddd; padding: 4px;">
                            </div>
                        `).join('')}
                    </div>
                `;

                // Custom Shop Supervisor Cell for TMB (Split per phase)
                shopSupCell = `
                     <div style="display: flex; flex-direction: column; gap: 3px;">
                        ${item.phases.map(phase => `
                            <div style="border-bottom: 1px solid #eee; padding: 3px 0; height: 93px; display: flex; align-items: center;">
                                <select id="shopSup_${rowId}_${phase.replace(' ', '_')}" style="width: 100%; border: 1px solid #ddd; padding: 4px;">
                                    <option value="">Select</option>
                                    <option value="Supervisor 1">Supervisor 1</option>
                                    <option value="Supervisor 2">Supervisor 2</option>
                                </select>
                            </div>
                        `).join('')}
                    </div>
                `;

                // Custom QA Supervisor Cell for TMB (Split per phase)
                qaSupCell = `
                     <div style="display: flex; flex-direction: column; gap: 3px;">
                        ${item.phases.map(phase => `
                            <div style="border-bottom: 1px solid #eee; padding: 3px 0; height: 93px; display: flex; align-items: center;">
                                <select id="qaSup_${rowId}_${phase.replace(' ', '_')}" style="width: 100%; border: 1px solid #ddd; padding: 4px;">
                                    <option value="">Select</option>
                                    <option value="Inspector 1">Inspector 1</option>
                                    <option value="Inspector 2">Inspector 2</option>
                                </select>
                            </div>
                        `).join('')}
                    </div>
                `;

                // Custom Remark Cell for TMB (Split per phase)
                remarkCell = `
                     <div style="display: flex; flex-direction: column; gap: 3px;">
                        ${item.phases.map(phase => `
                            <div style="border-bottom: 1px solid #eee; padding: 3px 0; height: 93px;">
                                <textarea id="remark_${rowId}_${phase.replace(' ', '_')}" placeholder="Remark (${phase})" style="width: 100%; height: 100%; border: 1px solid #ddd; resize: none; font-size: 10px;"></textarea>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (item.type === 'phase-ok-notok' && item.phases) {
                specifiedValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0; min-height: 100px; border: 1px solid #ccc; border-radius: 3px; background: #fff;">
                        ${item.phases.map((phase, idx) => `
                            <div style="${idx > 0 ? 'border-top: 1px solid #ccc;' : ''} padding: 6px; display: flex; align-items: center; justify-content: center; flex: 1; background: #fafafa;">
                                <span style="font-size: 10px; font-weight: 500; color: #000;">${phase}</span>
                            </div>
                        `).join('')}
                    </div>
                `;

                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0; min-height: 100px; border: 1px solid #ccc; border-radius: 3px; background: #fff;">
                        ${item.phases.map((phase, idx) => `
                            <div style="${idx > 0 ? 'border-top: 1px solid #ccc;' : ''} padding: 6px; display: flex; align-items: center; justify-content: center; flex: 1;">
                                <select id="actualValue_${rowId}_${phase.replace(/ /g, '_')}" 
                                        ${disabledAttr}
                                        style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 2px; font-size: 10px; background: #fff; text-align: center; text-align-last: center;">
                                    <option value="">Ok / Not Ok</option>
                                    <option value="Ok">Ok</option>
                                    <option value="Not Ok">Not Ok</option>
                                </select>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (item.type === 'ok-notok-stacked' && item.phases) {
                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0; min-height: 100px; border: 1px solid #ccc; border-radius: 3px; background: #fff;">
                        ${item.phases.map((phase, idx) => `
                            <div style="${idx > 0 ? 'border-top: 1px solid #ccc;' : ''} padding: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; background: #fafafa;">
                                <select id="actualValue_${rowId}_${phase.replace(/ /g, '_')}" 
                                        ${disabledAttr}
                                        style="width: 100%; padding: 2px; border: 1px solid #ccc; border-radius: 2px; font-size: 10px; background: #fff; text-align: center; text-align-last: center; margin-bottom: 3px;">
                                    <option value="">Ok / Not Ok</option>
                                    <option value="Ok">Ok</option>
                                    <option value="Not Ok">Not Ok</option>
                                </select>
                                <span style="font-size: 9px; font-weight: 500; color: #555;">${phase}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (item.type === 'text-per-phase') {
                // Text inputs per phase (no dropdown) – used for row 9 Tung piece
                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        ${item.phases.map((phase, idx) => `
                            <div style="border: 1px solid #333; ${idx > 0 ? 'border-top: none;' : ''} padding: 6px 8px; background: #fff; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 10px; width: 30px; font-weight: 500; color: #000;">${phase}</span>
                                <input type="text"
                                       id="actualValue_${rowId}_${phase.replace(' ', '_')}"
                                       ${disabledAttr}
                                       placeholder="Enter value"
                                       style="flex: 1; padding: 5px; border: 1px solid #333; border-radius: 0; font-size: 10px; background: #fff;">
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (item.type === 'sr-disc-height') {
                specifiedValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <div style="font-size: 11px;">Specified Height at Location</div>
                        <div>1. <input type="text" id="specValue_${rowId}_1" ${disabledAttr} placeholder="........." style="width: 60px; padding: 2px; border: 1px solid #ccc; font-size: 10px;"></div>
                    </div>
                `;
                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <div style="font-size: 11px;">Actual Height at Location</div>
                        <div>1. <input type="text" id="actualValue_${rowId}_1" ${disabledAttr} placeholder="........." style="width: 60px; padding: 2px; border: 1px solid #ccc; font-size: 10px;"></div>
                        <div>2. <input type="text" id="actualValue_${rowId}_2" ${disabledAttr} placeholder="........." style="width: 60px; padding: 2px; border: 1px solid #ccc; font-size: 10px;"></div>
                        <div>3. <input type="text" id="actualValue_${rowId}_3" ${disabledAttr} placeholder="........." style="width: 60px; padding: 2px; border: 1px solid #ccc; font-size: 10px;"></div>
                        <div>4. <input type="text" id="actualValue_${rowId}_4" ${disabledAttr} placeholder="........." style="width: 60px; padding: 2px; border: 1px solid #ccc; font-size: 10px;"></div>
                    </div>
                `;
            } else if (item.type === 'sr-strip-wrap-full') {
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center; font-weight:bold; font-size:13px; padding:8px; vertical-align:top; border:1px solid #333;">${itemCounter}</td>
                        <td colspan="6" style="padding:0; border:1px solid #333;">
                            <div style="padding: 10px; font-weight: 500; font-size: 11px; border-bottom: 1px solid #333;">${item.point}</div>
                            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                                <tr>
                                    <th style="padding: 6px; border: 1px solid #333; border-top: none; text-align: center;" rowspan="2">Sr. No.</th>
                                    <th style="padding: 6px; border: 1px solid #333; border-top: none; text-align: center;" rowspan="2">Part no./BOM</th>
                                    <th style="padding: 6px; border: 1px solid #333; border-top: none; text-align: center;" colspan="2">Strip/Wrap thk.</th>
                                    <th style="padding: 6px; border: 1px solid #333; border-top: none; text-align: center;" rowspan="2">As per Drg. Dia.</th>
                                    <th style="padding: 6px; border: 1px solid #333; border-top: none; text-align: center;" rowspan="2">Diameter Measured</th>
                                </tr>
                                <tr>
                                    <th style="padding: 6px; border: 1px solid #333; text-align: center;">As per Drg.</th>
                                    <th style="padding: 6px; border: 1px solid #333; text-align: center;">Actual</th>
                                </tr>
                                ${[1,2,3].map(n => `
                                <tr>
                                    <td style="padding: 4px; border: 1px solid #333; text-align: center;">${n}</td>
                                    <td style="padding: 4px; border: 1px solid #333; text-align: center;"><input type="text" id="strip_${rowId}_part_${n}" ${disabledAttr} style="width: 90%; padding: 2px;"></td>
                                    <td style="padding: 4px; border: 1px solid #333; text-align: center;"><input type="text" id="strip_${rowId}_drg_thk_${n}" ${disabledAttr} style="width: 90%; padding: 2px;"></td>
                                    <td style="padding: 4px; border: 1px solid #333; text-align: center;"><input type="text" id="strip_${rowId}_act_thk_${n}" ${disabledAttr} style="width: 90%; padding: 2px;"></td>
                                    <td style="padding: 4px; border: 1px solid #333; text-align: center;"><input type="text" id="strip_${rowId}_drg_dia_${n}" ${disabledAttr} style="width: 90%; padding: 2px;"></td>
                                    <td style="padding: 4px; border: 1px solid #333; text-align: center;"><input type="text" id="strip_${rowId}_act_dia_${n}" ${disabledAttr} style="width: 90%; padding: 2px;"></td>
                                </tr>`).join('')}
                            </table>
                            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; border-top: 1px solid #333;">
                                <div style="border-right: 1px solid #333; padding: 8px;">
                                    <div style="font-size:10px; font-weight:bold; margin-bottom:5px; text-align:center;">Operator (Sign & Date)</div>
                                    <input type="text" id="technician_${rowId}" ${disabledAttr} style="width:100%; padding: 4px; font-size:10px;">
                                </div>
                                <div style="border-right: 1px solid #333; padding: 8px;">
                                    <div style="font-size:10px; font-weight:bold; margin-bottom:5px; text-align:center;">Shop Supervisor (Sign & Date)</div>
                                    <input type="text" id="shopSup_${rowId}" ${disabledAttr} style="width:100%; padding: 4px; font-size:10px;">
                                </div>
                                <div style="padding: 8px;">
                                    <div style="font-size:10px; font-weight:bold; margin-bottom:5px; text-align:center;">Quality Inspector (Sign & Date)</div>
                                    <input type="text" id="qaSup_${rowId}" ${disabledAttr} style="width:100%; padding: 4px; font-size:10px;">
                                </div>
                            </div>
                            <div style="text-align: right; padding: 6px; border-top: 1px solid #333;">
                                <button class="btn-login" id="save_${rowId}" style="width:auto; padding:6px 10px; font-size:11px; background:var(--green);" onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">🔄 Update</button>
                            </div>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'sr-digital-image') {
                specifiedValueCell = `<div style="font-size: 11px; font-weight: 500;">${item.specifiedValue || 'Digital Image'}</div>`;
                actualValueCell = `
                    <div style="padding: 4px;">
                        <input type="file" id="actualValue_${rowId}" ${disabledAttr} style="font-size: 10px;">
                    </div>
                `;
            } else if (item.type === 'tcb-blocks') {
                specifiedValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        <div style="border: 1px solid #333; padding: 6px 8px; background: #f9f9f9; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 50px; font-weight: 500; color: #000;">Top</span>
                            <input type="text" id="specifiedValue_${rowId}_Top" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px; background-color: #fff; color: #000;">
                        </div>
                        <div style="border: 1px solid #333; border-top: none; padding: 6px 8px; background: #f9f9f9; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 50px; font-weight: 500; color: #000;">Centre</span>
                            <input type="text" id="specifiedValue_${rowId}_Centre" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px; background-color: #fff; color: #000;">
                        </div>
                        <div style="border: 1px solid #333; border-top: none; padding: 6px 8px; background: #f9f9f9; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 50px; font-weight: 500; color: #000;">Bottom</span>
                            <input type="text" id="specifiedValue_${rowId}_Bottom" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px; background-color: #fff; color: #000;">
                        </div>
                    </div>
                `;

                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        <div style="border: 1px solid #333; padding: 6px 8px; background: #fff; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 50px; font-weight: 500; color: #000;">Top</span>
                            <input type="text" id="actualValue_${rowId}_Top" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px;">
                        </div>
                        <div style="border: 1px solid #333; border-top: none; padding: 6px 8px; background: #fff; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 50px; font-weight: 500; color: #000;">Centre</span>
                            <input type="text" id="actualValue_${rowId}_Centre" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px;">
                        </div>
                        <div style="border: 1px solid #333; border-top: none; padding: 6px 8px; background: #fff; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 50px; font-weight: 500; color: #000;">Bottom</span>
                            <input type="text" id="actualValue_${rowId}_Bottom" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px;">
                        </div>
                    </div>
                `;
            } else if (item.type === 'wlt-blocks') {
                specifiedValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        <div style="border: 1px solid #333; padding: 6px 8px; background: #f9f9f9; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 55px; font-weight: 500; color: #000;">Width</span>
                            <input type="text" id="specifiedValue_${rowId}_Width" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px; background-color: #fff; color: #000;">
                        </div>
                        <div style="border: 1px solid #333; border-top: none; padding: 6px 8px; background: #f9f9f9; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 55px; font-weight: 500; color: #000;">Length</span>
                            <input type="text" id="specifiedValue_${rowId}_Length" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px; background-color: #fff; color: #000;">
                        </div>
                        <div style="border: 1px solid #333; border-top: none; padding: 6px 8px; background: #f9f9f9; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 55px; font-weight: 500; color: #000;">Thickness</span>
                            <input type="text" id="specifiedValue_${rowId}_Thickness" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px; background-color: #fff; color: #000;">
                        </div>
                    </div>
                `;

                actualValueCell = `
                    <div style="display: flex; flex-direction: column; gap: 0;">
                        <div style="border: 1px solid #333; padding: 6px 8px; background: #fff; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 55px; font-weight: 500; color: #000;">Width</span>
                            <input type="text" id="actualValue_${rowId}_Width" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px;">
                        </div>
                        <div style="border: 1px solid #333; border-top: none; padding: 6px 8px; background: #fff; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 55px; font-weight: 500; color: #000;">Length</span>
                            <input type="text" id="actualValue_${rowId}_Length" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px;">
                        </div>
                        <div style="border: 1px solid #333; border-top: none; padding: 6px 8px; background: #fff; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 10px; width: 55px; font-weight: 500; color: #000;">Thickness</span>
                            <input type="text" id="actualValue_${rowId}_Thickness" ${disabledAttr} placeholder="......... mm" style="flex: 1; padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 10px;">
                        </div>
                    </div>
                `;
            } else if (item.type === 'stop-stage') {
                // STOP STAGE row – red banner + full sign-off columns
                const _techName = isProduction ? (window.currentUserName || '') : '';
                const _ssName = isProduction ? (window.currentUserName || '') : '';
                const _qaName = isQuality ? (window.currentUserName || '') : '';
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center; font-weight:bold; font-size:13px; padding:8px; vertical-align:middle; border:1px solid #333;">${itemCounter}</td>
                        <td style="font-size:11px; padding:8px; vertical-align:middle; border:1px solid #333;">${item.point}</td>
                        <td colspan="2" style="text-align:center; background:#c0392b; color:#fff; font-weight:bold; font-size:15px; letter-spacing:2px; padding:14px; border:1px solid #333;">
                            ⛔ STOP STAGE
                        </td>
                        <td style="padding:0; border:1px solid #333;">
                            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; height:100%; border-collapse:collapse;">
                                <div style="border-right:1px solid #ddd; padding:8px;">
                                    <div style="font-size:10px; font-weight:bold; margin-bottom:5px; text-align:center;">Technician</div>
                                    ${isProduction ? `
                                        <div style="font-size:10px;font-weight:bold;padding:4px 2px;background:#f0fff0;border-radius:3px;text-align:center;">${_techName}</div>
                                        <input type="hidden" id="technician_${rowId}" value="${_techName}">
                                        <small id="techTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                                    ` : isAdmin ? `
                                        <input type="text" id="technician_${rowId}" readonly placeholder="—" style="width:100%;padding:4px;font-size:10px;border:1px solid #ddd;border-radius:3px;background:#f5f5f5;color:#333;margin-bottom:3px;cursor:default;">
                                        <small id="techTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                                    ` : '<span style="font-size:10px;text-align:center;display:block;">-</span>'}
                                </div>
                                <div style="border-right:1px solid #ddd; padding:8px;">
                                    <div style="font-size:10px; font-weight:bold; margin-bottom:5px; text-align:center;">Shop Supervisor</div>
                                    ${isProduction ? `
                                        <div style="font-size:10px;font-weight:bold;padding:4px 2px;background:#f0fff0;border-radius:3px;text-align:center;">${_ssName}</div>
                                        <input type="hidden" id="shopSup_${rowId}" value="${_ssName}">
                                        <small id="shopSupTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                                    ` : isAdmin ? `
                                        <input type="text" id="shopSup_${rowId}" readonly placeholder="—" style="width:100%;padding:4px;font-size:10px;border:1px solid #ddd;border-radius:3px;background:#f5f5f5;color:#333;margin-bottom:3px;cursor:default;">
                                        <small id="shopSupTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                                    ` : '<span style="font-size:10px;text-align:center;display:block;">-</span>'}
                                </div>
                                <div style="padding:8px;">
                                    <div style="font-size:10px; font-weight:bold; margin-bottom:5px; text-align:center;">Quality Supervisor</div>
                                    ${isQuality ? `
                                        <div style="font-size:10px;font-weight:bold;padding:4px 2px;background:#f0f8ff;border-radius:3px;text-align:center;">${_qaName}</div>
                                        <input type="hidden" id="qaSup_${rowId}" value="${_qaName}">
                                        <small id="qaSupTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                                    ` : isAdmin ? `
                                        <input type="text" id="qaSup_${rowId}" readonly placeholder="—" style="width:100%;padding:4px;font-size:10px;border:1px solid #ddd;border-radius:3px;background:#f5f5f5;color:#333;margin-bottom:3px;cursor:default;">
                                        <small id="qaSupTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                                    ` : '<span style="font-size:10px;text-align:center;display:block;">-</span>'}
                                </div>
                            </div>
                        </td>
                        <td style="padding:8px; border:1px solid #333;">
                            <textarea id="remark_${rowId}" ${disabledAttr} placeholder="Optional"
                                style="width:100%; height:60px; padding:4px; border:1px solid #ddd; font-size:10px; resize:none;"></textarea>
                        </td>
                        <td style="text-align:center; padding:6px; border:1px solid #333;">
                            ${!isCustomer ? `
                            <button class="btn-login" id="save_${rowId}"
                                style="width:auto; padding:6px 10px; font-size:11px; background:var(--green); margin-bottom:5px;"
                                onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                                🔄 Update
                            </button>` : ''}
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'jack-diagram') {
                // Row 12: Jack clamping diagram with inputs + accurate SVG technical drawing
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center; font-weight:bold; font-size:13px; padding:8px; vertical-align:top; border:1px solid #333;">${itemCounter}</td>
                        <td colspan="6" style="padding:12px; border:1px solid #333;">
                            <div style="display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;">

                                <!-- Left: numeric inputs -->
                                <div style="flex:0 0 300px; display:flex; flex-direction:column; gap:10px;">
                                    <div style="font-weight:700; font-size:12px; color:#222;">Coil Clamping by Jacks</div>
                                    <div style="display:flex; align-items:center; gap:8px; font-size:11px;">
                                        <label style="width:230px; font-weight:500;">Total Nos of jacks used for coil clamping:</label>
                                        <input type="text" id="jack_total_${rowId}" ${disabledAttr} placeholder="e.g. 8"
                                            style="flex:1; padding:5px; border:1px solid #333; font-size:11px; border-radius:3px;">
                                    </div>
                                    <div style="display:flex; align-items:center; gap:8px; font-size:11px;">
                                        <label style="width:230px; font-weight:500;">Capacity of jacks used (Record in diagram):</label>
                                        <input type="text" id="jack_capacity_${rowId}" ${disabledAttr} placeholder="e.g. 5 Ton"
                                            style="flex:1; padding:5px; border:1px solid #333; font-size:11px; border-radius:3px;">
                                    </div>
                                    <div style="font-size:10px; color:#555; font-weight:600; margin-top:4px;">Force applied:</div>
                                    <div style="display:flex; gap:16px; flex-wrap:wrap;">
                                        <div style="display:flex; align-items:center; gap:6px; font-size:11px;">
                                            <span style="color:#555;">Ton</span>
                                            <input type="text" id="jack_ton_${rowId}" ${disabledAttr} placeholder="Ton"
                                                style="width:70px; padding:5px; border:1px solid #333; font-size:11px; border-radius:3px;">
                                        </div>
                                        <div style="display:flex; align-items:center; gap:6px; font-size:11px;">
                                            <span style="color:#555;">PSI/Bar</span>
                                            <input type="text" id="jack_psi_${rowId}" ${disabledAttr} placeholder="PSI/Bar"
                                                style="width:70px; padding:5px; border:1px solid #333; font-size:11px; border-radius:3px;">
                                        </div>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:8px; font-size:11px; margin-top:6px;">
                                        <label style="font-weight:500; width:160px;">Sign (Technician):</label>
                                        <input type="text" id="technician_${rowId}" ${disabledAttr} placeholder="Technician Signature"
                                            style="flex:1; padding:5px; border:1px solid #333; font-size:11px; border-radius:3px;">
                                    </div>
                                    <div style="display:flex; align-items:center; gap:8px; font-size:11px; margin-top:6px;">
                                        <label style="font-weight:500; width:160px;">Sign (Quality Supervisor):</label>
                                        <input type="text" id="qaSup_${rowId}" ${disabledAttr} placeholder="Quality Supervisor Signature" value="${window.currentUserRole === 'quality' ? (window.currentUserName || '') : ''}"
                                            style="flex:1; padding:5px; border:1px solid #333; font-size:11px; border-radius:3px;">
                                    </div>
                                </div>

                                <!-- Right: Accurate SVG technical drawing -->
                                <div style="flex:1; min-width:320px;">
                                    <div style="font-size:10px; color:#555; font-weight:600; margin-bottom:6px;">Jack Position Diagram</div>
                                    <svg viewBox="0 0 460 210" xmlns="http://www.w3.org/2000/svg"
                                        style="width:100%; max-width:500px; border:1.5px solid #333; background:#fff; display:block;">

                                        <!-- Outer frame -->
                                        <rect x="2" y="2" width="456" height="206" fill="none" stroke="#333" stroke-width="1.5"/>

                                        <!-- Top rail -->
                                        <rect x="10" y="15" width="440" height="28" fill="#d8d8d8" stroke="#333" stroke-width="1.5"/>

                                        <!-- Bottom rail -->
                                        <rect x="10" y="167" width="440" height="28" fill="#d8d8d8" stroke="#333" stroke-width="1.5"/>

                                        <!-- Bolt circles on TOP rail: L-end, U-top, V-top, W-top, R-end -->
                                        <circle cx="20" cy="29" r="7" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <circle cx="130" cy="29" r="7" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <circle cx="230" cy="29" r="7" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <circle cx="330" cy="29" r="7" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <circle cx="440" cy="29" r="7" fill="white" stroke="#333" stroke-width="1.5"/>

                                        <!-- Bolt circles on BOTTOM rail -->
                                        <circle cx="20" cy="181" r="7" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <circle cx="130" cy="181" r="7" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <circle cx="230" cy="181" r="7" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <circle cx="330" cy="181" r="7" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <circle cx="440" cy="181" r="7" fill="white" stroke="#333" stroke-width="1.5"/>

                                        <!-- Diagonal jack-frame crossing lines -->
                                        <!-- Group 1: left span (L-end ↔ U/V mid) -->
                                        <line x1="20" y1="29" x2="330" y2="181" stroke="#333" stroke-width="1" marker-end="url(#arr)"/>
                                        <line x1="20" y1="181" x2="330" y2="29" stroke="#333" stroke-width="1" marker-end="url(#arr)"/>
                                        <!-- Group 2: right span (W-top ↔ R-end) -->
                                        <line x1="130" y1="29" x2="440" y2="181" stroke="#333" stroke-width="1" marker-end="url(#arr)"/>
                                        <line x1="130" y1="181" x2="440" y2="29" stroke="#333" stroke-width="1" marker-end="url(#arr)"/>
                                        <!-- Group 3: centre cross -->
                                        <line x1="230" y1="29" x2="20" y2="181" stroke="#333" stroke-width="1"/>
                                        <line x1="230" y1="29" x2="440" y2="181" stroke="#333" stroke-width="1"/>
                                        <line x1="230" y1="181" x2="20" y2="29" stroke="#333" stroke-width="1"/>
                                        <line x1="230" y1="181" x2="440" y2="29" stroke="#333" stroke-width="1"/>

                                        <!-- Three coil ellipses (U, V, W) drawn ON TOP of lines -->
                                        <ellipse cx="115" cy="105" rx="72" ry="48" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <ellipse cx="230" cy="105" rx="72" ry="48" fill="white" stroke="#333" stroke-width="1.5"/>
                                        <ellipse cx="345" cy="105" rx="72" ry="48" fill="white" stroke="#333" stroke-width="1.5"/>

                                        <!-- Labels -->
                                        <text x="115" y="111" text-anchor="middle" font-size="20" font-weight="bold" font-family="Arial">U</text>
                                        <text x="230" y="111" text-anchor="middle" font-size="20" font-weight="bold" font-family="Arial">V</text>
                                        <text x="345" y="111" text-anchor="middle" font-size="20" font-weight="bold" font-family="Arial">W</text>

                                        <!-- Arrowhead marker -->
                                        <defs>
                                            <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                                <path d="M0,0 L0,6 L6,3 z" fill="#333"/>
                                            </marker>
                                        </defs>
                                    </svg>
                                </div>
                            </div>

                            ${!isCustomer ? `
                            <div style="margin-top:10px; text-align:right;">
                                <button class="btn-login" id="save_${rowId}"
                                    style="width:auto; padding:6px 10px; font-size:11px; background:var(--green);"
                                    onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                                    🔄 Update
                                </button>
                            </div>` : ''}
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'cooling-nomex-table') {
                // Row 15: Position of cooling duct & Nomex - complex sub-table
                const cnSections = [
                    { title: 'Position of cooling duct at <strong>LV side</strong>', rows: ['Cooling duct 1', 'Cooling duct 2', 'Cooling duct 3'] },
                    { title: 'Position of Nomex at <strong>LV side</strong>', rows: ['Nomex 1', 'Nomex 2', 'Nomex 3'] },
                    { title: 'Position of cooling duct at <strong>HV side</strong>', rows: ['Cooling duct 1', 'Cooling duct 2', 'Cooling duct 3'] },
                    { title: 'Position of Nomex at <strong>HV side</strong>', rows: ['Nomex 1', 'Nomex 2', 'Nomex 3'] }
                ];
                let cnRowIdx = 0;
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center; font-weight:bold; font-size:13px; padding:8px; vertical-align:top; border:1px solid #333;">${itemCounter}</td>
                        <td colspan="6" style="padding:0; border:1px solid #333;">
                            <table style="width:100%; border-collapse:collapse; font-size:11px;">
                                ${cnSections.map((sec, sIdx) => `
                                    <tr style="background:#f0f0f0;">
                                        <td colspan="3" style="padding:5px 8px; font-weight:600; border-bottom:1px solid #ccc; border-top:${sIdx > 0 ? '1px solid #aaa' : 'none'};">${sec.title}</td>
                                        <td style="padding:5px 8px; font-size:10px; color:#777; text-align:center; border-bottom:1px solid #ccc; border-top:${sIdx > 0 ? '1px solid #aaa' : 'none'};">Step No</td>
                                        <td colspan="2" style="padding:5px 8px; border-bottom:1px solid #ccc; border-top:${sIdx > 0 ? '1px solid #aaa' : 'none'};"></td>
                                    </tr>
                                    ${sec.rows.map((rowLabel, rIdx) => {
                    const fieldId = `cn_${rowId}_${sIdx}_${rIdx}`;
                    return `
                                        <tr style="border-bottom:1px solid #e8e8e8;">
                                            <td style="width:30px;"></td>
                                            <td colspan="2" style="padding:4px 8px; font-size:11px;">${rowLabel}</td>
                                            <td style="padding:4px 8px;">
                                                <input type="text" id="${fieldId}" ${disabledAttr} placeholder="Step No"
                                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:11px;border-radius:3px;">
                                            </td>
                                            <td colspan="2" style="padding:4px 8px;"></td>
                                        </tr>`;
                }).join('')}
                                `).join('')}
                            </table>
                            ${!isCustomer ? `
                            <div style="border-top:1px solid #ddd; padding:10px; background:#fafafa;">
                                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:8px;">
                                    <div>
                                        <div style="font-size:10px; font-weight:bold; margin-bottom:4px; text-align:center;">Operator</div>
                                        <input type="text" id="cn_operator_${rowId}" ${disabledAttr} placeholder="Operator name / sign"
                                            style="width:100%;padding:5px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                                    </div>
                                    <div>
                                        <div style="font-size:10px; font-weight:bold; margin-bottom:4px; text-align:center;">Shop Supervisor</div>
                                        <input type="text" id="cn_shop_${rowId}" ${disabledAttr} placeholder="Shop Supervisor name / sign"
                                            style="width:100%;padding:5px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                                    </div>
                                    <div>
                                        <div style="font-size:10px; font-weight:bold; margin-bottom:4px; text-align:center;">Quality Supervisor</div>
                                        <input type="text" id="cn_qa_${rowId}" ${disabledAttr} placeholder="Quality Supervisor name / sign"
                                            style="width:100%;padding:5px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                                    </div>
                                </div>
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <div style="flex:1;">
                                        <div style="font-size:10px; font-weight:bold; margin-bottom:4px;">Remark</div>
                                        <textarea id="cn_remark_${rowId}" ${disabledAttr} placeholder="Optional remark"
                                            style="width:100%;height:48px;padding:5px;border:1px solid #ccc;font-size:10px;border-radius:3px;resize:none;"></textarea>
                                    </div>
                                    <div style="text-align:right; padding-top:18px;">
                                        <button class="btn-login" id="save_${rowId}"
                                            style="width:auto; padding:8px 14px; font-size:11px; background:var(--green);"
                                            onclick="saveNewChecklistItem('coreCoil', ${itemCounter}, '${rowId}')">
                                            🔄 Update
                                        </button>
                                    </div>
                                </div>
                            </div>` : ''}
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'vpd-shop-qa') {
                // VPD Section 1: rows with Shop Supervisor & Quality Supervisor sign-off columns
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:top;border:1px solid #333;">${itemCounter}</td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;white-space:pre-line;vertical-align:top;">${item.point}</td>
                        <td colspan="2" style="padding:6px;border:1px solid #333;vertical-align:top;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:4px;text-align:center;">Observations</div>
                            <textarea id="actualValue_${rowId}" ${disabledAttr} placeholder="Observations"
                                style="width:100%;height:70px;padding:5px;border:1px solid #ccc;font-size:10px;border-radius:3px;resize:none;"></textarea>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:4px;text-align:center;">Shop Supervisor</div>
                            ${isProduction ? `
                                <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                <input type="hidden" id="shopSup_${rowId}" value="${window.currentUserName || ''}">
                            ` : `
                                <input type="text" id="shopSup_${rowId}" ${isAdmin ? '' : 'readonly'} placeholder="—"
                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;background:#f5f5f5;text-align:center;">
                            `}
                            <small id="shopTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:4px;text-align:center;">Quality Supervisor</div>
                            ${isQuality ? `
                                <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                <input type="hidden" id="qaSup_${rowId}" value="${window.currentUserName || ''}">
                            ` : `
                                <input type="text" id="qaSup_${rowId}" ${isAdmin ? '' : 'readonly'} placeholder="—"
                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;background:#f5f5f5;text-align:center;">
                            `}
                            <small id="qaTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;">
                            <textarea id="remark_${rowId}" ${disabledAttr} placeholder="Remark"
                                style="width:100%;height:70px;padding:5px;border:1px solid #ccc;font-size:10px;border-radius:3px;resize:none;"></textarea>
                        </td>
                        ${!isCustomer ? `<td style="padding:6px;border:1px solid #333;vertical-align:middle;text-align:center;">
                            <button class="btn-login" id="save_${rowId}" style="width:auto;padding:5px 8px;font-size:10px;background:var(--green);"
                                onclick="saveNewChecklistItem('vpd',${itemCounter},'${rowId}')">💾 Save</button>
                        </td>` : ''}
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'vpd-measure') {
                // VPD Section 2: simple measure row (Ton / kw) with Operator & Shop sign-off
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:middle;border:1px solid #333;">${itemCounter}</td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;vertical-align:middle;">
                            ${item.point}
                            ${item.hasDescInput ? `<input type="text" id="descInput_${rowId}" ${disabledAttr} placeholder="Enter value"
                                style="display:block;width:100%;margin-top:5px;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">` : ''}
                        </td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;text-align:center;white-space:pre-line;vertical-align:middle;">${item.specifiedValue || ''}</td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:middle;">
                            <div style="display:flex;align-items:center;gap:6px;">
                                <input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="Value"
                                    style="width:100%;padding:5px;border:1px solid #ccc;font-size:11px;border-radius:3px;">
                                <span style="font-size:10px;font-weight:600;white-space:nowrap;">${item.unit}</span>
                            </div>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:4px;text-align:center;">Operator</div>
                            <input type="text" id="technician_${rowId}" ${disabledAttr} placeholder="Sign & date"
                                style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                            <small id="techTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:4px;text-align:center;">Shop Supervisor</div>
                            ${isProduction ? `
                                <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                <input type="hidden" id="shopSup_${rowId}" value="${window.currentUserName || ''}">
                            ` : `
                                <input type="text" id="shopSup_${rowId}" ${isAdmin ? '' : 'readonly'} placeholder="—"
                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;background:#f5f5f5;text-align:center;">
                            `}
                            <small id="shopTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;">
                            <textarea id="remark_${rowId}" ${disabledAttr} placeholder="Remark"
                                style="width:100%;height:52px;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;resize:none;"></textarea>
                        </td>
                        ${!isCustomer ? `<td style="padding:6px;border:1px solid #333;vertical-align:middle;text-align:center;">
                            <button class="btn-login" id="save_${rowId}" style="width:auto;padding:5px 8px;font-size:10px;background:var(--green);"
                                onclick="saveNewChecklistItem('vpd',${itemCounter},'${rowId}')">💾 Save</button>
                        </td>` : ''}
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'vpd-measure-merged') {
                // VPD Section 2 Rows 2 & 3: merged Specified Value + Measure cell, auto-fill Shop Supervisor
                const _shopName = isProduction ? (window.currentUserName || '') : '';
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:middle;border:1px solid #333;">${itemCounter}</td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;vertical-align:middle;">${item.point}</td>
                        <td colspan="2" style="padding:6px;border:1px solid #333;vertical-align:middle;">
                            <div style="display:flex;align-items:center;gap:6px;">
                                <input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="Enter value"
                                    style="flex:1;padding:5px;border:1px solid #ccc;font-size:11px;border-radius:3px;">
                                <span style="font-size:10px;font-weight:600;white-space:nowrap;">${item.unit}</span>
                            </div>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Operator</div>
                            <input type="text" id="technician_${rowId}" ${disabledAttr} placeholder="Sign & date"
                                style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                            <small id="techTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Shop Supervisor</div>
                            <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${_shopName}</div>
                            <input type="hidden" id="shopSup_${rowId}" value="${_shopName}">
                            <small id="shopTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;">
                            <textarea id="remark_${rowId}" ${disabledAttr} placeholder="Remark"
                                style="width:100%;height:52px;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;resize:none;"></textarea>
                        </td>
                        ${!isCustomer ? `<td style="padding:6px;border:1px solid #333;vertical-align:middle;text-align:center;">
                            <button class="btn-login" id="save_${rowId}" style="width:auto;padding:5px 8px;font-size:10px;background:var(--green);"
                                onclick="saveNewChecklistItem('vpd',${itemCounter},'${rowId}')">💾 Save</button>
                        </td>` : ''}
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'vpd-yesno') {
                // VPD Yes/No dropdown row with Operator & Shop Supervisor sign-off
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:middle;border:1px solid #333;">${itemCounter}</td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;vertical-align:middle;white-space:pre-line;">
                            ${item.point}
                            ${item.hasDescInput ? `<input type="text" id="descInput_${rowId}" ${disabledAttr} placeholder="Enter value"
                                style="display:block;width:100%;margin-top:5px;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">` : ''}
                        </td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;text-align:center;vertical-align:middle;white-space:pre-line;">${item.specifiedValue || ''}</td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:middle;text-align:center;">
                            <select id="actualValue_${rowId}" ${disabledAttr}
                                style="width:100%;padding:5px;border:1px solid #ccc;font-size:11px;border-radius:3px;">
                                <option value="">-- Select --</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Operator</div>
                            ${isProduction ? `
                                <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                <input type="hidden" id="technician_${rowId}" value="${window.currentUserName || ''}">
                            ` : `
                                <input type="text" id="technician_${rowId}" ${disabledAttr} placeholder="Name"
                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                            `}
                            <small id="techTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Shop Supervisor</div>
                            ${isProduction ? `
                                <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                <input type="hidden" id="shopSup_${rowId}" value="${window.currentUserName || ''}">
                            ` : `
                                <input type="text" id="shopSup_${rowId}" ${isAdmin ? '' : 'readonly'} placeholder="—"
                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;background:#f5f5f5;text-align:center;">
                            `}
                            <small id="shopTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;">
                            <textarea id="remark_${rowId}" ${disabledAttr} placeholder="Remark"
                                style="width:100%;height:52px;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;resize:none;"></textarea>
                        </td>
                        ${!isCustomer ? `<td style="padding:6px;border:1px solid #333;vertical-align:middle;text-align:center;">
                            <button class="btn-login" id="save_${rowId}" style="width:auto;padding:5px 8px;font-size:10px;background:var(--green);"
                                onclick="saveNewChecklistItem('vpd',${itemCounter},'${rowId}')">💾 Save</button>
                        </td>` : ''}
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'vpd-oknotok') {
                // VPD OK/Not OK dropdown row with Operator & Shop Supervisor sign-off
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:middle;border:1px solid #333;">${itemCounter}</td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;vertical-align:middle;">${item.point}</td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;text-align:center;vertical-align:middle;">${item.specifiedValue || ''}</td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:middle;text-align:center;">
                            <select id="actualValue_${rowId}" ${disabledAttr}
                                style="width:100%;padding:5px;border:1px solid #ccc;font-size:11px;border-radius:3px;">
                                <option value="">-- Select --</option>
                                <option value="OK">OK</option>
                                <option value="Not OK">Not OK</option>
                            </select>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Operator</div>
                            ${isProduction ? `
                                <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                <input type="hidden" id="technician_${rowId}" value="${window.currentUserName || ''}">
                            ` : `
                                <input type="text" id="technician_${rowId}" ${disabledAttr} placeholder="Name"
                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                            `}
                            <small id="techTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Shop Supervisor</div>
                            ${isProduction ? `
                                <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                <input type="hidden" id="shopSup_${rowId}" value="${window.currentUserName || ''}">
                            ` : `
                                <input type="text" id="shopSup_${rowId}" ${isAdmin ? '' : 'readonly'} placeholder="—"
                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;background:#f5f5f5;text-align:center;">
                            `}
                            <small id="shopTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;">
                            <textarea id="remark_${rowId}" ${disabledAttr} placeholder="Remark"
                                style="width:100%;height:52px;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;resize:none;"></textarea>
                        </td>
                        ${!isCustomer ? `<td style="padding:6px;border:1px solid #333;vertical-align:middle;text-align:center;">
                            <button class="btn-login" id="save_${rowId}" style="width:auto;padding:5px 8px;font-size:10px;background:var(--green);"
                                onclick="saveNewChecklistItem('vpd',${itemCounter},'${rowId}')">💾 Save</button>
                        </td>` : ''}
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'vpd-dual-measure') {
                // VPD Row 28: Td + RH dual text inputs
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:middle;border:1px solid #333;">${itemCounter}</td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;vertical-align:middle;">${item.point}</td>
                        <td style="padding:8px;border:1px solid #333;font-size:11px;text-align:center;vertical-align:middle;">${item.specifiedValue || ''}</td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:middle;">
                            <div style="display:flex;flex-direction:column;gap:5px;">
                                <div style="display:flex;align-items:center;gap:6px;">
                                    <span style="font-size:10px;font-weight:600;width:24px;">Td:</span>
                                    <input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="Td value"
                                        style="flex:1;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                                </div>
                                <div style="display:flex;align-items:center;gap:6px;">
                                    <span style="font-size:10px;font-weight:600;width:24px;">RH:</span>
                                    <input type="text" id="vpd_rh_${rowId}" ${disabledAttr} placeholder="RH value"
                                        style="flex:1;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                                </div>
                            </div>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Operator</div>
                            ${isProduction ? `
                                <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                <input type="hidden" id="technician_${rowId}" value="${window.currentUserName || ''}">
                            ` : `
                                <input type="text" id="technician_${rowId}" ${disabledAttr} placeholder="Name"
                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                            `}
                            <small id="techTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;min-width:110px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Shop Supervisor</div>
                            ${isProduction ? `
                                <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                <input type="hidden" id="shopSup_${rowId}" value="${window.currentUserName || ''}">
                            ` : `
                                <input type="text" id="shopSup_${rowId}" ${isAdmin ? '' : 'readonly'} placeholder="—"
                                    style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;background:#f5f5f5;text-align:center;">
                            `}
                            <small id="shopTime_${rowId}" style="font-size:9px;color:#666;display:block;"></small>
                        </td>
                        <td style="padding:6px;border:1px solid #333;vertical-align:top;">
                            <textarea id="remark_${rowId}" ${disabledAttr} placeholder="Remark"
                                style="width:100%;height:52px;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;resize:none;"></textarea>
                        </td>
                        ${!isCustomer ? `<td style="padding:6px;border:1px solid #333;vertical-align:middle;text-align:center;">
                            <button class="btn-login" id="save_${rowId}" style="width:auto;padding:5px 8px;font-size:10px;background:var(--green);"
                                onclick="saveNewChecklistItem('vpd',${itemCounter},'${rowId}')">💾 Save</button>
                        </td>` : ''}
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'vpd-sensor-diagram') {
                // VPD Section 2 Row 4: Sensor count + active part position + HV/LV diagram
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:top;border:1px solid #333;">${itemCounter}</td>
                        <td colspan="6" style="padding:0;border:1px solid #333;">
                            <div style="padding:8px 10px;font-size:11px;font-weight:600;background:#f5f5f5;border-bottom:1px solid #ccc;">${item.point}</div>
                            <div style="padding:10px;display:flex;flex-direction:column;gap:10px;">
                                <div style="font-size:11px;font-weight:600;margin-bottom:2px;">Position of active parts:</div>
                                <div style="display:flex;gap:20px;flex-wrap:wrap;">
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <span style="font-size:10px;font-weight:500;">Inner side:</span>
                                        <input type="text" id="vpd_inner_${rowId}" ${disabledAttr} placeholder="Inner position"
                                            style="width:140px;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                                    </div>
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <span style="font-size:10px;font-weight:500;">Outer side:</span>
                                        <input type="text" id="vpd_outer_${rowId}" ${disabledAttr} placeholder="Outer position"
                                            style="width:140px;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                                    </div>
                                </div>
                                <!-- HV / LV SIDE COIL DIAGRAM — exact mirror of physical form -->
                                <div style="display:flex;gap:24px;flex-wrap:wrap;margin-top:8px;">
                                    ${['HV SIDE', 'LV SIDE'].map(label => `
                                    <div style="flex:1;min-width:240px;border:2px solid #555;font-family:Arial,sans-serif;">
                                        <!-- Top header -->
                                        <div style="background:#bbb;border-bottom:2px solid #555;text-align:center;font-weight:bold;font-size:11px;padding:4px 0;letter-spacing:1px;">${label}</div>
                                        <!-- Main body -->
                                        <div style="display:flex;height:90px;background:#888;">
                                            <!-- Left AUX LIMB -->
                                            <div style="width:26px;background:#888;border-right:2px solid #555;display:flex;align-items:center;justify-content:center;position:relative;">
                                                <span style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:8px;font-weight:bold;color:#fff;letter-spacing:3px;">AUXLIMB</span>
                                            </div>
                                            <!-- Grey spacer left -->
                                            <div style="width:10px;background:#888;"></div>
                                            <!-- U coil (white column) -->
                                            <div style="flex:1;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:4px 0;">
                                                <div style="width:10px;height:10px;background:#aaa;border-radius:50%;border:1px solid #555;"></div>
                                                <span style="font-size:18px;font-weight:bold;color:#333;">U</span>
                                                <div style="width:10px;height:10px;background:#aaa;border-radius:50%;border:1px solid #555;"></div>
                                            </div>
                                            <!-- Grey spacer mid1 -->
                                            <div style="width:10px;background:#888;"></div>
                                            <!-- V coil (white column) -->
                                            <div style="flex:1;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:4px 0;">
                                                <div style="width:10px;height:10px;background:#aaa;border-radius:50%;border:1px solid #555;"></div>
                                                <span style="font-size:18px;font-weight:bold;color:#333;">V</span>
                                                <div style="width:10px;height:10px;background:#aaa;border-radius:50%;border:1px solid #555;"></div>
                                            </div>
                                            <!-- Grey spacer mid2 -->
                                            <div style="width:10px;background:#888;"></div>
                                            <!-- W coil (white column) -->
                                            <div style="flex:1;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:4px 0;">
                                                <div style="width:10px;height:10px;background:#aaa;border-radius:50%;border:1px solid #555;"></div>
                                                <span style="font-size:18px;font-weight:bold;color:#333;">W</span>
                                                <div style="width:10px;height:10px;background:#aaa;border-radius:50%;border:1px solid #555;"></div>
                                            </div>
                                            <!-- Grey spacer right -->
                                            <div style="width:10px;background:#888;"></div>
                                            <!-- Right AUX LIMB -->
                                            <div style="width:26px;background:#888;border-left:2px solid #555;display:flex;align-items:center;justify-content:center;">
                                                <span style="writing-mode:vertical-rl;transform:rotate(0deg);font-size:8px;font-weight:bold;color:#fff;letter-spacing:3px;">AUXLIMB</span>
                                            </div>
                                        </div>
                                        <!-- Bottom label -->
                                        <div style="background:#bbb;border-top:2px solid #555;display:flex;justify-content:space-between;align-items:center;padding:3px 6px;">
                                            <span style="font-size:9px;font-weight:bold;">A- Part no.1</span>
                                            <span style="font-size:9px;font-weight:bold;">${label}</span>
                                        </div>
                                    </div>`).join('')}
                                </div>
                                <div style="display:flex;align-items:flex-start;gap:8px;margin-top:4px;flex-wrap:wrap;">
                                    <div style="flex:2;min-width:160px;">
                                        <div style="font-size:10px;font-weight:600;margin-bottom:3px;">Remarks for sensor location (if any):</div>
                                        <input type="text" id="remark_${rowId}" ${disabledAttr} placeholder="Optional remark"
                                            style="width:100%;padding:5px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                                    </div>
                                </div>
                                ${!isCustomer ? `
                                <div style="display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-top:8px;padding:8px;background:#f9f9f9;border:1px solid #eee;border-radius:4px;">
                                    <div style="flex:1;min-width:130px;">
                                        <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Operator</div>
                                        ${isProduction ? `
                                            <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                            <input type="hidden" id="technician_${rowId}" value="${window.currentUserName || ''}">
                                        ` : `
                                            <input type="text" id="technician_${rowId}" ${disabledAttr} placeholder="Name"
                                                style="width:100%;padding:5px;border:1px solid #ccc;font-size:10px;border-radius:3px;">
                                        `}
                                        <small id="techTime_${rowId}" style="font-size:9px;color:#666;display:block;margin-top:2px;"></small>
                                    </div>
                                    <div style="flex:1;min-width:130px;">
                                        <div style="font-size:10px;font-weight:600;margin-bottom:3px;text-align:center;">Shop Supervisor</div>
                                        ${isProduction ? `
                                            <div style="font-size:10px;font-weight:bold;padding:4px;background:#f0fff0;border-radius:3px;text-align:center;">${window.currentUserName || ''}</div>
                                            <input type="hidden" id="shopSup_${rowId}" value="${window.currentUserName || ''}">
                                        ` : `
                                            <input type="text" id="shopSup_${rowId}" ${isAdmin ? '' : 'readonly'} placeholder="—"
                                                style="width:100%;padding:5px;border:1px solid #ccc;font-size:10px;border-radius:3px;background:#f5f5f5;text-align:center;">
                                        `}
                                        <small id="shopTime_${rowId}" style="font-size:9px;color:#666;display:block;margin-top:2px;"></small>
                                    </div>
                                    <div>
                                        <button class="btn-login" id="save_${rowId}" style="width:auto;padding:6px 14px;font-size:11px;background:var(--green);"
                                            onclick="saveNewChecklistItem('vpd',${itemCounter},'${rowId}')">💾 Save</button>
                                    </div>
                                </div>` : ''}
                            </div>
                        </td>
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'section-header') {
                // Full-width section divider banner (no Sr.No column, spans all 8 cols)
                customRowHTML = `
                    <tr id="${rowId}">
                        <td colspan="8" style="background:#2c3e50; color:#fff; font-weight:bold; font-size:12px; padding:9px 14px; border:1px solid #1a252f; letter-spacing:0.5px; text-transform:uppercase;">
                            ${item.point}
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'mm-per-phase') {
                // Per-phase mm measurement: each phase gets a text-box in both Specified (col) and Actual (col)
                specifiedValueCell = `
                    <div style="display:flex; flex-direction:column;">
                        ${item.phases.map((phase, idx) => `
                            <div style="border:1px solid #333; ${idx > 0 ? 'border-top:none;' : ''} padding:5px 7px; min-height:32px;">
                                <input type="text"
                                    id="specVal_${rowId}_${idx}"
                                    ${disabledAttr}
                                    placeholder="......... mm"
                                    style="width:100%; padding:3px 5px; border:1px solid #ccc; font-size:10px; border-radius:2px; box-sizing:border-box;">
                                <div style="font-size:9px; color:#777; margin-top:2px;">${phase}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                actualValueCell = `
                    <div style="display:flex; flex-direction:column;">
                        ${item.phases.map((phase, idx) => `
                            <div style="border:1px solid #333; ${idx > 0 ? 'border-top:none;' : ''} padding:5px 7px; min-height:32px;">
                                <input type="text"
                                    id="actualVal_${rowId}_${idx}"
                                    ${disabledAttr}
                                    placeholder="......... mm"
                                    style="width:100%; padding:3px 5px; border:1px solid #ccc; font-size:10px; border-radius:2px; box-sizing:border-box;">
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (item.type === 'lead-assembly-table') {
                // Rows 34-38: Support assembly & dimension tables (HV/IV leads per phase)
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center; font-weight:bold; font-size:13px; padding:8px; vertical-align:top; border:1px solid #333;">${itemCounter}</td>
                        <td colspan="6" style="padding:0; border:1px solid #333;">
                            <!-- Phase sub-header -->
                            <div style="background:#f5f5f5; border-bottom:1px solid #ccc; padding:6px 10px; font-style:italic; font-weight:600; font-size:11px;">
                                ${item.point} <strong>(${item.phase})</strong>
                            </div>
                            <!-- Measurement sub-rows -->
                            <table style="width:100%; border-collapse:collapse; font-size:11px;">
                                <thead>
                                    <tr style="background:#eaeaea;">
                                        <th style="padding:4px 8px; text-align:left; border:1px solid #ddd; width:40%; font-size:10px;">Description</th>
                                        <th style="padding:4px 8px; text-align:center; border:1px solid #ddd; width:20%; font-size:10px;">Specified Value</th>
                                        <th style="padding:4px 8px; text-align:center; border:1px solid #ddd; width:20%; font-size:10px;">Actual Value</th>
                                        <th style="padding:4px 8px; border:1px solid #ddd; font-size:10px;">Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${item.rows.map((r, rIdx) => `
                                        <tr style="border-bottom:1px solid #eee;">
                                            <td style="padding:5px 8px; border:1px solid #ddd; font-size:11px;">${r.label}</td>
                                            <td style="padding:4px 6px; border:1px solid #ddd; text-align:center;">
                                                <div style="display:flex; align-items:center; gap:3px; justify-content:center;">
                                                    <input type="text" id="specVal_${rowId}_${rIdx}" ${disabledAttr}
                                                        placeholder="......."
                                                        style="width:80px; padding:3px 5px; border:1px solid #ccc; font-size:10px; border-radius:2px; text-align:center;">
                                                    <span style="font-size:10px; color:#555;">${r.unit}</span>
                                                </div>
                                            </td>
                                            <td style="padding:4px 6px; border:1px solid #ddd; text-align:center;">
                                                <div style="display:flex; align-items:center; gap:3px; justify-content:center;">
                                                    <input type="text" id="actualVal_${rowId}_${rIdx}" ${disabledAttr}
                                                        placeholder="......."
                                                        style="width:80px; padding:3px 5px; border:1px solid #ccc; font-size:10px; border-radius:2px; text-align:center;">
                                                    <span style="font-size:10px; color:#555;">${r.unit}</span>
                                                </div>
                                            </td>
                                            <td style="padding:4px 6px; border:1px solid #ddd;">
                                                <input type="text" id="remark_${rowId}_${rIdx}" ${disabledAttr}
                                                    placeholder="Optional"
                                                    style="width:100%; padding:3px 5px; border:1px solid #ccc; font-size:10px; border-radius:2px;">
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            ${!isCustomer ? `
                            <div style="border-top:1px solid #ddd; display:flex; align-items:stretch; background:#fafafa;">
                                <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px;">
                                    <div style="font-size:10px;font-weight:600;margin-bottom:5px;">Technician</div>
                                    <input type="text" id="lat_tech_${rowId}" ${disabledAttr} placeholder="Name"
                                        style="width:100%;padding:4px;border:1px solid #ccc;border-radius:2px;font-size:10px;">
                                    <div style="font-size:10px;color:#aaa;margin-top:5px;border-top:1px solid #ccc;padding-top:2px;">—</div>
                                </div>
                                <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px; text-align:center;">
                                    <div style="font-size:10px;font-weight:600;margin-bottom:22px;">Shop Supervisor</div>
                                    <div style="font-size:10px;color:#aaa;border-top:1px solid #ccc;padding-top:2px;">—</div>
                                </div>
                                <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px; text-align:center;">
                                    <div style="font-size:10px;font-weight:600;margin-bottom:22px;">Quality Supervisor</div>
                                    <div style="font-size:10px;color:#aaa;border-top:1px solid #ccc;padding-top:2px;">—</div>
                                </div>
                                <div style="padding:7px 10px; flex:1; border-right:1px solid #ddd;">
                                    <div style="font-size:10px;color:#999;margin-bottom:2px;">Optional</div>
                                    <textarea id="lat_rem_${rowId}" ${disabledAttr} placeholder="Remark"
                                        style="width:100%;height:44px;padding:3px;border:1px solid #ccc;font-size:10px;border-radius:2px;resize:none;"></textarea>
                                </div>
                                <div style="padding:7px 10px; display:flex; align-items:center;">
                                    <button class="btn-login" id="save_${rowId}" style="width:auto;padding:6px 10px;font-size:11px;background:var(--green);"
                                        onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}')">🔄 Update</button>
                                    <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                                </div>
                            </div>` : ''}
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'make-srno-table') {
                // Row 44: Make & Sr.No. of OCTC/OLTC per phase
                const signOffPanelMSR = `
                    <div style="border-top:1px solid #ddd; display:flex; align-items:stretch; background:#fafafa;">
                        <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:5px;">Technician</div>
                            <input type="text" id="msr_tech_${rowId}" ${disabledAttr} placeholder="Name" style="width:100%;padding:4px;border:1px solid #ccc;border-radius:2px;font-size:10px;">
                            <div style="font-size:10px;color:#aaa;margin-top:5px;border-top:1px solid #ccc;padding-top:2px;">—</div>
                        </div>
                        <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px; text-align:center;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:22px;">Shop Supervisor</div>
                            <div style="font-size:10px;color:#aaa;border-top:1px solid #ccc;padding-top:2px;">—</div>
                        </div>
                        <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px; text-align:center;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:22px;">Quality Supervisor</div>
                            <div style="font-size:10px;color:#aaa;border-top:1px solid #ccc;padding-top:2px;">—</div>
                        </div>
                        <div style="padding:7px 10px; flex:1; border-right:1px solid #ddd;">
                            <div style="font-size:10px;color:#999;margin-bottom:2px;">Optional</div>
                            <textarea id="msr_rem_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;height:44px;padding:3px;border:1px solid #ccc;font-size:10px;border-radius:2px;resize:none;"></textarea>
                        </div>
                        <div style="padding:7px 10px; display:flex; align-items:center;">
                            <button class="btn-login" id="save_${rowId}" style="width:auto;padding:6px 10px;font-size:11px;background:var(--green);" onclick="saveNewChecklistItem('coreCoil',${itemCounter},'${rowId}')">🔄 Update</button>
                            <div class="workflow-buttons" style="display:inline-block;margin-left:5px;"></div>
                        </div>
                    </div>`;
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:top;border:1px solid #333;">${itemCounter}</td>
                        <td colspan="6" style="padding:0;border:1px solid #333;">
                            <div style="padding:6px 10px;font-weight:600;font-size:11px;background:#f5f5f5;border-bottom:1px solid #ccc;">${item.point}</div>
                            <table style="width:100%;border-collapse:collapse;font-size:11px; text-align:center;">
                                <thead><tr style="background:#eaeaea;">
                                    <th style="padding:5px 8px;border:1px solid #ddd;width:25%;">Make</th>
                                    <th style="padding:5px 8px;border:1px solid #ddd;width:25%;">U Phase</th>
                                    <th style="padding:5px 8px;border:1px solid #ddd;width:25%;">V Phase</th>
                                    <th style="padding:5px 8px;border:1px solid #ddd;width:25%;">W Phase</th>
                                </tr></thead>
                                <tbody>
                                    <tr>
                                        <td style="padding:4px 6px;border:1px solid #ddd;">
                                            <input type="text" id="actualValue_${rowId}_Make" ${disabledAttr} placeholder="Make..." style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:2px;">
                                        </td>
                                        ${item.phases.map(ph => `
                                        <td style="padding:4px 6px;border:1px solid #ddd;">
                                            <input type="text" id="actualValue_${rowId}_${ph.replace(' ', '_')}" ${disabledAttr} placeholder="Sr. No." style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:2px;">
                                        </td>`).join('')}
                                    </tr>
                                </tbody>
                            </table>
                            ${!isCustomer ? signOffPanelMSR : ''}
                        </td>
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'nm-torque-table') {
                // Row 49: Tightness verification Nm per phase + F-1 to F-5 steel bands
                const signOffPanelNM = `
                    <div style="border-top:1px solid #ddd; display:flex; align-items:stretch; background:#fafafa;">
                        <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:5px;">Technician</div>
                            <input type="text" id="nm_tech_${rowId}" ${disabledAttr} placeholder="Name" style="width:100%;padding:4px;border:1px solid #ccc;border-radius:2px;font-size:10px;">
                            <div style="font-size:10px;color:#aaa;margin-top:5px;border-top:1px solid #ccc;padding-top:2px;">—</div>
                        </div>
                        <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px; text-align:center;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:22px;">Shop Supervisor</div>
                            <div style="font-size:10px;color:#aaa;border-top:1px solid #ccc;padding-top:2px;">—</div>
                        </div>
                        <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px; text-align:center;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:22px;">Quality Supervisor</div>
                            <div style="font-size:10px;color:#aaa;border-top:1px solid #ccc;padding-top:2px;">—</div>
                        </div>
                        <div style="padding:7px 10px; flex:1; border-right:1px solid #ddd;">
                            <div style="font-size:10px;color:#999;margin-bottom:2px;">Optional</div>
                            <textarea id="nm_rem_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;height:44px;padding:3px;border:1px solid #ccc;font-size:10px;border-radius:2px;resize:none;"></textarea>
                        </div>
                        <div style="padding:7px 10px; display:flex; align-items:center;">
                            <button class="btn-login" id="save_${rowId}" style="width:auto;padding:6px 10px;font-size:11px;background:var(--green);" onclick="saveNewChecklistItem('coreCoil',${itemCounter},'${rowId}')">🔄 Update</button>
                        </div>
                    </div>`;
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:top;border:1px solid #333;">${itemCounter}</td>
                        <td colspan="6" style="padding:0;border:1px solid #333;">
                            <div style="padding:6px 10px;font-weight:600;font-size:11px;background:#f5f5f5;border-bottom:1px solid #ccc;">${item.point}</div>
                            <table style="width:100%;border-collapse:collapse;font-size:11px; text-align:center;">
                                <thead><tr style="background:#eaeaea;">
                                    <th style="padding:5px;border:1px solid #ddd;">U Phase</th>
                                    <th style="padding:5px;border:1px solid #ddd;">V Phase</th>
                                    <th style="padding:5px;border:1px solid #ddd;">W Phase</th>
                                    <th style="padding:5px;border:1px solid #ddd;">F-1</th>
                                    <th style="padding:5px;border:1px solid #ddd;">F-2</th>
                                    <th style="padding:5px;border:1px solid #ddd;">F-3</th>
                                    <th style="padding:5px;border:1px solid #ddd;">F-4</th>
                                </tr></thead>
                                <tbody>
                                    <tr>
                                        ${['U Phase', 'V Phase', 'W Phase', 'F-1', 'F-2', 'F-3', 'F-4'].map(ph => `
                                        <td style="padding:4px;border:1px solid #ddd;">
                                            <input type="text" id="actualValue_${rowId}_${ph.replace(' ', '_').replace('-', '_')}" ${disabledAttr} placeholder="Nm" style="width:100%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:2px;">
                                        </td>`).join('')}
                                    </tr>
                                </tbody>
                            </table>
                            ${!isCustomer ? signOffPanelNM : ''}
                        </td>
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'flitch-torque') {
                // Row 51: Torque Application at Flitch Plate Hardware
                // Auto-sign: technician (production), shop supervisor, quality supervisor
                const autoTech = (window.currentUserRole === 'production') ? (window.currentUserName || '') : '';
                const autoShop = (window.currentUserRole === 'shop_supervisor') ? (window.currentUserName || '') : '';
                const autoQA = (window.currentUserRole === 'quality') ? (window.currentUserName || '') : '';

                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:top;border:1px solid #333;">${itemCounter}</td>
                        <td style="padding:8px;border:1px solid #333;">
                            <div style="font-weight:600;font-size:12px;margin-bottom:6px;">${item.point}</div>
                        </td>
                        <td style="padding:8px;border:1px solid #333;">
                            <input type="text" id="specifiedValue_${rowId}" ${disabledAttr} placeholder="......... Nm"
                                style="width:100%;padding:5px;border:1px solid #ccc;border-radius:3px;font-size:11px;">
                        </td>
                        <td style="padding:8px;border:1px solid #333;">
                            <input type="text" id="actualValue_${rowId}" ${disabledAttr} placeholder="......... Nm"
                                style="width:100%;padding:5px;border:1px solid #ccc;border-radius:3px;font-size:11px;">
                        </td>
                        <td style="padding:4px;border:1px solid #333;">
                            <div style="display:flex;flex-direction:column;gap:4px;">
                                <div style="display:flex;align-items:center;gap:4px;">
                                    <span style="font-size:9px;width:50px;font-weight:600;">Tech:</span>
                                    <input type="text" id="technician_${rowId}" ${disabledAttr} value="${autoTech}" placeholder="Technician"
                                        style="flex:1;padding:3px;border:1px solid #ccc;border-radius:2px;font-size:10px;">
                                </div>
                                <div style="display:flex;align-items:center;gap:4px;">
                                    <span style="font-size:9px;width:50px;font-weight:600;">Shop:</span>
                                    <input type="text" id="shopSup_${rowId}" ${disabledAttr} value="${autoShop}" placeholder="Shop Supervisor"
                                        style="flex:1;padding:3px;border:1px solid #ccc;border-radius:2px;font-size:10px;">
                                </div>
                                <div style="display:flex;align-items:center;gap:4px;">
                                    <span style="font-size:9px;width:50px;font-weight:600;">QA:</span>
                                    <input type="text" id="qaSup_${rowId}" ${disabledAttr} value="${autoQA}" placeholder="Quality Supervisor"
                                        style="flex:1;padding:3px;border:1px solid #ccc;border-radius:2px;font-size:10px;">
                                </div>
                            </div>
                        </td>
                        <td style="padding:4px;border:1px solid #333;">
                            <textarea id="remark_${rowId}" ${disabledAttr} placeholder="Remark"
                                style="width:100%;height:50px;padding:3px;border:1px solid #ccc;font-size:10px;border-radius:2px;resize:none;"></textarea>
                        </td>
                        <td style="padding:4px;border:1px solid #333;text-align:center;">
                            ${!isCustomer ? `<button class="btn-login" id="save_${rowId}" style="width:auto;padding:6px 10px;font-size:11px;background:var(--green);"
                                onclick="saveNewChecklistItem('coreCoil',${itemCounter},'${rowId}')">💾 Save</button>` : ''}
                        </td>
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'elec-test-table') {
                // Row 53: Electrical Tests with CS-1/CS-2 columns
                const tests = [
                    'Resistance / Current Balance Test.',
                    'Resistance Test.',
                    'Ratio &amp; Magnetic Current / Vector Group Test.',
                    'Step (at initial coil to core shield).'
                ];
                const signOffPanelET = `
                    <div style="border-top:1px solid #ddd; display:flex; align-items:stretch; background:#fafafa;">
                        <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:5px;">Technician</div>
                            <input type="text" id="et_tech_${rowId}" ${disabledAttr} placeholder="Name" style="width:100%;padding:4px;border:1px solid #ccc;border-radius:2px;font-size:10px;">
                            <div style="font-size:10px;color:#aaa;margin-top:5px;border-top:1px solid #ccc;padding-top:2px;">—</div>
                        </div>
                        <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px; text-align:center;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:22px;">Shop Supervisor</div>
                            <div style="font-size:10px;color:#aaa;border-top:1px solid #ccc;padding-top:2px;">—</div>
                        </div>
                        <div style="padding:7px 10px; border-right:1px solid #ddd; min-width:130px; text-align:center;">
                            <div style="font-size:10px;font-weight:600;margin-bottom:22px;">Quality Supervisor</div>
                            <div style="font-size:10px;color:#aaa;border-top:1px solid #ccc;padding-top:2px;">—</div>
                        </div>
                        <div style="padding:7px 10px; flex:1; border-right:1px solid #ddd;">
                            <div style="font-size:10px;color:#999;margin-bottom:2px;">Optional</div>
                            <textarea id="et_rem_${rowId}" ${disabledAttr} placeholder="Remark" style="width:100%;height:44px;padding:3px;border:1px solid #ccc;font-size:10px;border-radius:2px;resize:none;"></textarea>
                        </div>
                        <div style="padding:7px 10px; display:flex; align-items:center;">
                            <button class="btn-login" id="save_${rowId}" style="width:auto;padding:6px 10px;font-size:11px;background:var(--green);" onclick="saveNewChecklistItem('coreCoil',${itemCounter},'${rowId}')">🔄 Update</button>
                        </div>
                    </div>`;
                customRowHTML = `
                    <tr id="${rowId}">
                        <td style="text-align:center;font-weight:bold;font-size:13px;padding:8px;vertical-align:top;border:1px solid #333;">${itemCounter}</td>
                        <td colspan="6" style="padding:0;border:1px solid #333;">
                            <div style="padding:6px 10px;font-weight:600;font-size:11px;background:#f5f5f5;border-bottom:1px solid #ccc;">Electrical Tests</div>
                            <table style="width:100%;border-collapse:collapse;font-size:11px;">
                                <thead><tr style="background:#eaeaea;">
                                    <th style="padding:5px 8px;border:1px solid #ddd;width:50%;text-align:left;">Test Description</th>
                                    <th style="padding:5px 8px;border:1px solid #ddd;width:25%;text-align:center;">CS-1 Result</th>
                                    <th style="padding:5px 8px;border:1px solid #ddd;width:25%;text-align:center;">CS-2 Result</th>
                                </tr></thead>
                                <tbody>
                                    ${tests.map((t, i) => `
                                    <tr>
                                        <td style="padding:6px 8px;border:1px solid #ddd;font-size:11px;">${i + 1}) ${t}</td>
                                        <td style="padding:4px 6px;border:1px solid #ddd;text-align:center;">
                                            <input type="text" id="et_cs1_${rowId}_${i}" ${disabledAttr} placeholder="Result" style="width:95%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:2px;text-align:center;">
                                        </td>
                                        <td style="padding:4px 6px;border:1px solid #ddd;text-align:center;">
                                            <input type="text" id="et_cs2_${rowId}_${i}" ${disabledAttr} placeholder="Result" style="width:95%;padding:4px;border:1px solid #ccc;font-size:10px;border-radius:2px;text-align:center;">
                                        </td>
                                    </tr>`).join('')}
                                </tbody>
                            </table>
                            ${!isCustomer ? signOffPanelET : ''}
                        </td>
                    </tr>`;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'dof-washer-table') {
                // Row 31: DOF washer arrangement with multi-column table
                specifiedValueCell = `
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); border: 1px solid #333;">
                        <div style="border-right: 1px solid #333; padding: 4px; text-align: center; font-size: 10px; font-weight: bold; background: #f9f9f9;">OD DOF</div>
                        <div style="padding: 4px; text-align: center; font-size: 10px; font-weight: bold; background: #f9f9f9;">ID DOF</div>
                        ${[...Array(10)].map((_, idx) => `
                            <div style="border-right: 1px solid #333; border-top: 1px solid #333; padding: 2px;">
                                <input type="text" id="specifiedValue_${rowId}_od_dof_${idx}" ${disabledAttr} style="width: 100%; border: none; padding: 2px; font-size: 10px;">
                            </div>
                            <div style="border-top: 1px solid #333; padding: 2px;">
                                <input type="text" id="specifiedValue_${rowId}_id_dof_${idx}" ${disabledAttr} style="width: 100%; border: none; padding: 2px; font-size: 10px;">
                            </div>
                        `).join('')}
                    </div>
                `;

                actualValueCell = `
                    <div style="display: grid; grid-template-columns: 1fr; border: 1px solid #333;">
                        <div style="padding: 4px; text-align: center; font-size: 10px; font-weight: bold; background: #f9f9f9;">DOF</div>
                        ${[...Array(10)].map((_, idx) => `
                            <div style="border-top: 1px solid #333; padding: 2px;">
                                <input type="text" id="actualValue_${rowId}_dof_${idx}" ${disabledAttr} style="width: 100%; border: none; padding: 2px; font-size: 10px;">
                            </div>
                        `).join('')}
                    </div>
                `;

                // Custom Technician Cell with Sign column
                technicianCell = `
                    <div style="display: grid; grid-template-columns: 1fr; border: 1px solid #333;">
                        <div style="padding: 4px; text-align: center; font-size: 10px; font-weight: bold; background: #f9f9f9;">Sign</div>
                        ${[...Array(10)].map((_, idx) => `
                            <div style="border-top: 1px solid #333; padding: 2px;">
                                <input type="text" id="technician_${rowId}_sign_${idx}" ${disabledAttr} style="width: 100%; border: none; padding: 2px; font-size: 10px;">
                            </div>
                        `).join('')}
                    </div>
                `;
            } else if (item.type === 'spa-footer-table') {
                // Revision History + SPA Release for Next Stage footer
                customRowHTML = `
                    <tr id="${rowId}">
                        <td colspan="8" style="padding: 0;">
                            <table style="width:100%; border-collapse:collapse; font-size:11px; border:1px solid #333; margin-bottom:0;">
                                <thead>
                                    <tr style="background:#e8e8e8;">
                                        <th style="border:1px solid #333; padding:6px 8px; text-align:center; width:15%;">Revision No</th>
                                        <th style="border:1px solid #333; padding:6px 8px; text-align:center; width:55%;">Revision History</th>
                                        <th style="border:1px solid #333; padding:6px 8px; text-align:center; width:30%;">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="border:1px solid #333; padding:6px 8px; text-align:center;">0</td>
                                        <td style="border:1px solid #333; padding:6px 8px; text-align:center;">Original Issue</td>
                                        <td style="border:1px solid #333; padding:6px 8px; text-align:center;">11/17/2025</td>
                                    </tr>
                                    <tr><td style="border:1px solid #333; padding:20px 8px;" colspan="3">&nbsp;</td></tr>
                                    <tr><td style="border:1px solid #333; padding:20px 8px;" colspan="3">&nbsp;</td></tr>
                                </tbody>
                            </table>
                            <table style="width:100%; border-collapse:collapse; font-size:11px; border:1px solid #333; border-top:none; margin-top:0;">
                                <tbody>
                                    <tr style="background:#f0f0f0;">
                                        <td colspan="4" style="border:1px solid #333; padding:6px 10px; font-weight:bold; font-size:12px;">SPA release for Next Stage</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:6px 8px; font-size:10px; width:20%;">Format Prepared By</td>
                                        <td style="border:1px solid #333; padding:6px 8px; font-size:10px; width:30%;">Indrapal sahu</td>
                                        <td style="border:1px solid #333; padding:6px 8px; font-size:10px; width:20%;" rowspan="2">Sign of QA<br>Name/Date</td>
                                        <td style="border:1px solid #333; padding:6px 8px; font-size:10px; width:30%;" rowspan="2">
                                            <input type="text" id="spaRelease_qa_${rowId}" ${disabledAttr} placeholder="QA Sign / Date" style="width:100%;border:none;padding:4px;font-size:10px;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:6px 8px; font-size:10px;">Format Review By</td>
                                        <td style="border:1px solid #333; padding:6px 8px; font-size:10px;">Sunil Kumar Rai</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'fos-annexure-table') {
                // FOS (Fiber Optic Sensor) Annexure - FOS_A - exact physical document layout
                // Columns: Sr.No | FOS Number | Location of FOS (HV/LV/OIL/CORE) | Stage x5 (Power+Signal each)
                const stages = ['SPA', 'After SPA Lowering', 'CCA', 'After repacking', 'Outside tank'];

                const fosDataRows = [...Array(16)].map((_, idx) => `
                    <tr>
                        <td style="border:1px solid #333; padding:2px 4px; font-size:10px; text-align:center; width:30px;">${idx + 1}</td>
                        <td style="border:1px solid #333; padding:0; height:24px; width:120px;"><input type="text" id="fos_num_${rowId}_${idx}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                        <td style="border:1px solid #333; padding:0; height:24px; width:120px;"><input type="text" id="fos_loc_${rowId}_${idx}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                        ${stages.map((_, sIdx) => `
                            <td style="border:1px solid #333; padding:0; height:24px;"><input type="text" id="fos_${rowId}_${idx}_${sIdx}_pwr" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border:1px solid #333; padding:0; height:24px;"><input type="text" id="fos_${rowId}_${idx}_${sIdx}_sig" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                        `).join('')}
                    </tr>
                `).join('');

                const signRow = `
                    <tr>
                        <td colspan="3" style="border:1px solid #333; padding:6px; background:#f9f9f9; font-size:10px; font-weight:bold; text-align:center; color:#555;">Sign of Quality<br>Supervisor</td>
                        ${stages.map((_, sIdx) => `
                            <td colspan="2" style="border:1px solid #333; padding:4px; text-align:center; font-size:10px;">
                                ${(isQuality || isAdmin) ? `
                                <select id="fos_sign_${rowId}_${sIdx}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;text-align:center;background:transparent;">
                                    <option value="">-- Select --</option>
                                    <option value="Inspector 1">Inspector 1</option>
                                    <option value="Inspector 2">Inspector 2</option>
                                </select>
                                ` : `<span style="font-size:10px;">-</span>`}
                            </td>
                        `).join('')}
                    </tr>
                `;

                const fosSaveRow = !isCustomer ? `
                    <tr>
                        <td colspan="${3 + stages.length * 2}" style="border:1px solid #333; padding:6px; text-align:right; background:#f9f9f9;">
                            <button class="btn-login"
                                    id="save_${rowId}"
                                    style="width:auto; padding:6px 14px; font-size:11px; background: var(--green); margin-right: 6px;"
                                    onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                                💾 Save FOS Data
                            </button>
                            <button class="btn-login"
                                    id="save_${rowId}_2"
                                    style="width:auto; padding:6px 14px; font-size:11px; background: var(--green);"
                                    onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}_v2')">
                                💾 Save
                            </button>
                        </td>
                    </tr>
                ` : '';

                customRowHTML = `
                    <tr id="${rowId}">
                        <td colspan="8" style="padding:0;">
                            <table style="width:100%; border-collapse:collapse; font-size:10px; border:1px solid #333;">
                                <thead>
                                    <tr style="background:#e8e8e8;">
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;" rowspan="3">Sr.<br>No.</th>
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;" rowspan="3">FOS Number</th>
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;" rowspan="3">Location of FOS<br><span style="font-size:9px;">(HV/LV/OIL/CORE)</span></th>
                                        <th colspan="${stages.length * 2}" style="border:1px solid #333; padding:5px 4px; text-align:center; font-weight:bold;">Stage</th>
                                    </tr>
                                    <tr style="background:#e8e8e8;">
                                        ${stages.map(s => `<th colspan="2" style="border:1px solid #333; padding:4px; text-align:center; font-size:10px;">${s}</th>`).join('')}
                                    </tr>
                                    <tr style="background:#f0f0f0;">
                                        ${stages.map(() => `
                                            <th style="border:1px solid #333; padding:3px; text-align:center; font-size:9px; color:#0066cc;">Power</th>
                                            <th style="border:1px solid #333; padding:3px; text-align:center; font-size:9px; color:#0066cc;">Signal</th>
                                        `).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${fosDataRows}
                                    ${signRow}
                                    ${fosSaveRow}
                                </tbody>
                            </table>
                            <div style="border:1px solid #333; border-top:none; padding:8px 10px; font-size:10px;">
                                <div style="font-weight:bold; margin-bottom:4px;">Acceptance Criteria :</div>
                                <div>* Winding (SPA), CCA &amp; Repacking Stage Signal/Power &gt; 90 % required</div>
                                <div>* Out Side Tank minimum Signal/Power required &gt; 65%</div>
                            </div>
                            <div style="border:1px solid #333; border-top:none; padding:6px 10px; font-size:10px;">
                                <div style="font-weight:bold; margin-bottom:4px;">Remarks</div>
                                <textarea id="fos_remarks_${rowId}" ${disabledAttr} style="width:100%; height:60px; border:1px solid #ddd; padding:4px; font-size:10px; resize:vertical;" placeholder="Remarks..."></textarea>
                            </div>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'core-building-table') {
                // Core Building – exact mirror of reference photo
                const saveBtnCB = !isCustomer ? `
                    <button class="btn-login"
                            id="save_${rowId}"
                            style="width:auto; padding:6px 14px; font-size:11px; background: var(--green); float:right; margin-bottom:6px;"
                            onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                        💾 Save Core Building
                    </button>
                ` : '';

                const cbUserName = window.currentUserName || '';
                const cbRole = window.currentUserRole || '';
                // Shop Supervisor: production auto-fills their own name; admin sees read-only display of saved name
                const cbSsCell = cbRole === 'production'
                    ? `<td style="border:1px solid #333; padding:3px 5px; font-size:10px; vertical-align:middle; background:#f0fff0;"><strong>${cbUserName}</strong><input type="hidden" id="cb_{{ID}}_ss_${rowId}" value="${cbUserName}"></td>`
                    : cbRole === 'admin'
                        ? `<td style="border:1px solid #333; padding:2px;"><input type="text" id="cb_{{ID}}_ss_${rowId}" readonly placeholder="—" style="width:100%;border:none;padding:3px;font-size:10px;background:#f5f5f5;box-sizing:border-box;cursor:default;"></td>`
                        : `<td style="border:1px solid #333; padding:0;"><input type="text" id="cb_{{ID}}_ss_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>`;
                // Quality Inspector: quality auto-fills their own name; admin sees read-only display of saved name
                const cbQiCell = cbRole === 'quality'
                    ? `<td style="border:1px solid #333; padding:3px 5px; font-size:10px; vertical-align:middle; background:#f0f8ff;"><strong>${cbUserName}</strong><input type="hidden" id="cb_{{ID}}_qi_${rowId}" value="${cbUserName}"></td>`
                    : cbRole === 'admin'
                        ? `<td style="border:1px solid #333; padding:2px;"><input type="text" id="cb_{{ID}}_qi_${rowId}" readonly placeholder="—" style="width:100%;border:none;padding:3px;font-size:10px;background:#f5f5f5;box-sizing:border-box;cursor:default;"></td>`
                        : `<td style="border:1px solid #333; padding:0;"><input type="text" id="cb_{{ID}}_qi_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>`;

                customRowHTML = `
                    <tr id="${rowId}">
                        <td colspan="8" style="padding:0;">
                            ${saveBtnCB}
                            <!-- Main checklist table matching exact reference photo layout -->
                            <table style="width:100%; border-collapse:collapse; font-size:10px; border:1px solid #333;">
                                <thead>
                                    <tr style="background:#f0f0f0;">
                                        <th style="border:1px solid #333; padding:5px 4px; width:36px; text-align:center; vertical-align:middle;">Sr.<br>No.</th>
                                        <th style="border:1px solid #333; padding:5px 8px; text-align:center; vertical-align:middle;">Description</th>
                                        <th style="border:1px solid #333; padding:5px 4px; width:110px; text-align:center; vertical-align:middle;">Specified<br>Value</th>
                                        <th style="border:1px solid #333; padding:5px 4px; width:90px; text-align:center; vertical-align:middle;">Actual<br>Value</th>
                                        <!-- Checked By group -->
                                        <th colspan="3" style="border:1px solid #333; padding:5px 4px; text-align:center; vertical-align:middle;">Checked By (Signature)</th>
                                        <th style="border:1px solid #333; padding:5px 4px; width:60px; text-align:center; vertical-align:middle;">Save</th>
                                    </tr>
                                    <tr style="background:#f5f5f5;">
                                        <th style="border:1px solid #333;"></th>
                                        <th style="border:1px solid #333;"></th>
                                        <th style="border:1px solid #333;"></th>
                                        <th style="border:1px solid #333;"></th>
                                        <th style="border:1px solid #333; padding:4px; width:80px; text-align:center; font-size:9px;">Operator</th>
                                        <th style="border:1px solid #333; padding:4px; width:80px; text-align:center; font-size:9px;">Shop<br>Supervisor</th>
                                        <th style="border:1px solid #333; padding:4px; width:80px; text-align:center; font-size:9px;">Quality<br>Inspector</th>
                                        <th style="border:1px solid #333;"></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <!-- ── FRAME ASSEMBLY SECTION HEADING ── -->
                                    <tr>
                                        <td colspan="7" style="border:1px solid #333; padding:5px 8px; text-align:center; font-weight:bold; background:#eaeaea;">Frame Assembly</td>
                                    </tr>

                                    <!-- Row 1: Make of CRGO / Grade of CRGO -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">1</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Make of CRGO/Grade of CRGO</td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <!-- Three stacked inputs: Make / Grade / Thickness -->
                                            <table style="width:100%; border-collapse:collapse;">
                                                <tr><td style="border-bottom:1px solid #ccc; padding:3px 5px; font-size:9px; color:#555;">Make</td></tr>
                                                <tr><td style="border-bottom:1px solid #ccc; padding:3px 5px; font-size:9px; color:#555;">Grade</td></tr>
                                                <tr><td style="padding:3px 5px; font-size:9px; color:#555;">Thickness</td></tr>
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <table style="width:100%; border-collapse:collapse;">
                                                <tr><td style="border-bottom:1px solid #ccc; padding:0; height:22px;"><input type="text" id="cb_make_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td></tr>
                                                <tr><td style="border-bottom:1px solid #ccc; padding:0; height:22px;"><input type="text" id="cb_grade_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td></tr>
                                                <tr><td style="padding:0; height:22px;"><input type="text" id="cb_thickness_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td></tr>
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; height:66px;"><input type="text" id="cb_r1_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r1')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r1')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r1" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}_r1')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 2: Cleanliness check -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">2</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Check for cleanliness, paint, damages of Frame</td>
                                        <td style="border:1px solid #333; padding:4px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">Clean &amp; damage free<br>(Visual)</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r2_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r2_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r2')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r2')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r2" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}_r2')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 3: Perpendicularity -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">3</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Perpendicularity, Positioning &amp; Leveling of frames</td>
                                        <td style="border:1px solid #333; padding:4px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">With Spirit Level</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r3_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r3_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r3')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r3')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r3" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}_r3')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- ── TCP YOKE DIAGRAM (spans full width) ── -->
                                    <tr>
                                        <td colspan="8" style="border:1px solid #333; padding:10px 8px;">
                                            <svg viewBox="0 0 780 330" width="100%" style="display:block; font-family:Arial,sans-serif; max-width:860px; margin:0 auto;">

                                                <!-- TOP YOKE label above -->
                                                <text x="390" y="12" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">TOP Yoke</text>

                                                <!-- Top Yoke bar -->
                                                <rect x="30" y="16" width="720" height="34" fill="#d8d8d8" stroke="#333" stroke-width="1.5"/>

                                                <!-- D1 top-left, D2 top-right inside top bar -->
                                                <text x="38" y="38" font-size="10" font-weight="bold" fill="#333">D1</text>
                                                <polygon points="60,40 67,32 74,40" fill="#333"/>
                                                <text x="706" y="38" font-size="10" font-weight="bold" fill="#333">D2</text>
                                                <polygon points="696,40 703,32 710,40" fill="#333"/>

                                                <!-- H1 H2 H3 H4 labels inside top bar -->
                                                <text x="190" y="37" text-anchor="middle" font-size="10" fill="#333">H1</text>
                                                <text x="355" y="37" text-anchor="middle" font-size="10" fill="#333">H2</text>
                                                <text x="500" y="37" text-anchor="middle" font-size="10" fill="#333">H3</text>
                                                <text x="645" y="37" text-anchor="middle" font-size="10" fill="#333">H4</text>

                                                <!-- H arrows in top bar -->
                                                <line x1="125" y1="36" x2="250" y2="36" stroke="#555" stroke-width="1" marker-end="url(#a)" marker-start="url(#a)"/>
                                                <line x1="290" y1="36" x2="415" y2="36" stroke="#555" stroke-width="1" marker-end="url(#a)" marker-start="url(#a)"/>
                                                <line x1="450" y1="36" x2="555" y2="36" stroke="#555" stroke-width="1" marker-end="url(#a)" marker-start="url(#a)"/>
                                                <line x1="592" y1="36" x2="700" y2="36" stroke="#555" stroke-width="1" marker-end="url(#a)" marker-start="url(#a)"/>

                                                <!-- Bottom Yoke bar -->
                                                <rect x="30" y="278" width="720" height="34" fill="#d8d8d8" stroke="#333" stroke-width="1.5"/>

                                                <!-- D2 bottom-left, D1 bottom-right -->
                                                <text x="38" y="302" font-size="10" font-weight="bold" fill="#333">&#9650; D2</text>
                                                <text x="690" y="302" font-size="10" font-weight="bold" fill="#333">D1 &#9650;</text>

                                                <!-- BOTTOM YOKE label below -->
                                                <text x="390" y="325" text-anchor="middle" font-size="11" font-weight="bold" fill="#333">BOTTOM YOKE</text>

                                                <!-- Aux Limb LEFT bar -->
                                                <rect x="30" y="50" width="38" height="228" fill="#c8c8c8" stroke="#333" stroke-width="1"/>
                                                <text x="49" y="175" text-anchor="middle" font-size="9" font-weight="bold" fill="#333" transform="rotate(-90,49,175)">Aux Limb</text>

                                                <!-- Aux Limb RIGHT bar -->
                                                <rect x="682" y="50" width="38" height="228" fill="#c8c8c8" stroke="#333" stroke-width="1"/>
                                                <text x="701" y="175" text-anchor="middle" font-size="9" font-weight="bold" fill="#333" transform="rotate(90,701,175)">Aux Limb</text>

                                                <!-- Limb boundary dashed verticals -->
                                                <line x1="125" y1="50" x2="125" y2="278" stroke="#555" stroke-width="1.2" stroke-dasharray="5,3"/>
                                                <line x1="250" y1="50" x2="250" y2="278" stroke="#555" stroke-width="1.2" stroke-dasharray="5,3"/>
                                                <line x1="290" y1="50" x2="290" y2="278" stroke="#555" stroke-width="1.5"/>
                                                <line x1="415" y1="50" x2="415" y2="278" stroke="#555" stroke-width="1.2" stroke-dasharray="5,3"/>
                                                <line x1="450" y1="50" x2="450" y2="278" stroke="#555" stroke-width="1.5"/>
                                                <line x1="555" y1="50" x2="555" y2="278" stroke="#555" stroke-width="1.2" stroke-dasharray="5,3"/>
                                                <line x1="592" y1="50" x2="592" y2="278" stroke="#555" stroke-width="1.5"/>
                                                <line x1="646" y1="50" x2="646" y2="278" stroke="#555" stroke-width="1.2" stroke-dasharray="5,3"/>
                                                <line x1="682" y1="50" x2="682" y2="278" stroke="#555" stroke-width="1.2" stroke-dasharray="5,3"/>

                                                <!-- W1 W2 W3 W4 gap labels with arrows -->
                                                <text x="187" y="168" text-anchor="middle" font-size="10" fill="#555">W1</text>
                                                <line x1="125" y1="172" x2="250" y2="172" stroke="#aaa" stroke-width="1" marker-end="url(#a)" marker-start="url(#a)"/>
                                                <text x="332" y="168" text-anchor="middle" font-size="10" fill="#555">W2</text>
                                                <line x1="290" y1="172" x2="375" y2="172" stroke="#aaa" stroke-width="1" marker-end="url(#a)" marker-start="url(#a)"/>
                                                <text x="482" y="168" text-anchor="middle" font-size="10" fill="#555">W3</text>
                                                <line x1="450" y1="172" x2="515" y2="172" stroke="#aaa" stroke-width="1" marker-end="url(#a)" marker-start="url(#a)"/>
                                                <text x="619" y="168" text-anchor="middle" font-size="10" fill="#555">W4</text>
                                                <line x1="592" y1="172" x2="646" y2="172" stroke="#aaa" stroke-width="1" marker-end="url(#a)" marker-start="url(#a)"/>

                                                <!-- U V W phase labels -->
                                                <text x="270" y="178" text-anchor="middle" font-size="22" font-weight="bold" fill="#222">U</text>
                                                <text x="432" y="178" text-anchor="middle" font-size="22" font-weight="bold" fill="#222">V</text>
                                                <text x="572" y="178" text-anchor="middle" font-size="22" font-weight="bold" fill="#222">W</text>

                                                <!-- Diagonal cross lines (dashed) -->
                                                <line x1="68" y1="50" x2="125" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>
                                                <line x1="125" y1="50" x2="68" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>
                                                <line x1="125" y1="50" x2="290" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>
                                                <line x1="290" y1="50" x2="125" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>
                                                <line x1="290" y1="50" x2="450" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>
                                                <line x1="450" y1="50" x2="290" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>
                                                <line x1="450" y1="50" x2="592" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>
                                                <line x1="592" y1="50" x2="450" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>
                                                <line x1="592" y1="50" x2="682" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>
                                                <line x1="682" y1="50" x2="592" y2="278" stroke="#bbb" stroke-width="0.8" stroke-dasharray="4,3"/>

                                                <!-- Downward arrows on top yoke edge -->
                                                <polygon points="125,52 121,44 129,44" fill="#333"/>
                                                <polygon points="250,52 246,44 254,44" fill="#333"/>
                                                <polygon points="290,52 286,44 294,44" fill="#333"/>
                                                <polygon points="415,52 411,44 419,44" fill="#333"/>
                                                <polygon points="450,52 446,44 454,44" fill="#333"/>
                                                <polygon points="555,52 551,44 559,44" fill="#333"/>
                                                <polygon points="592,52 588,44 596,44" fill="#333"/>
                                                <polygon points="646,52 642,44 650,44" fill="#333"/>
                                                <polygon points="682,52 678,44 686,44" fill="#333"/>

                                                <!-- Bottom D labels with upward arrows -->
                                                <text x="125" y="274" text-anchor="middle" font-size="9" fill="#333">D3</text>
                                                <polygon points="125,276 121,284 129,284" fill="#333"/>
                                                <text x="250" y="274" text-anchor="middle" font-size="9" fill="#333">D4</text>
                                                <polygon points="250,276 246,284 254,284" fill="#333"/>
                                                <text x="290" y="274" text-anchor="middle" font-size="9" fill="#333">D5</text>
                                                <polygon points="290,276 286,284 294,284" fill="#333"/>
                                                <text x="415" y="274" text-anchor="middle" font-size="9" fill="#333">D6</text>
                                                <polygon points="415,276 411,284 419,284" fill="#333"/>
                                                <text x="450" y="274" text-anchor="middle" font-size="9" fill="#333">D7</text>
                                                <polygon points="450,276 446,284 454,284" fill="#333"/>
                                                <text x="555" y="274" text-anchor="middle" font-size="9" fill="#333">D8</text>
                                                <polygon points="555,276 551,284 559,284" fill="#333"/>
                                                <text x="592" y="274" text-anchor="middle" font-size="9" fill="#333">D9</text>
                                                <polygon points="592,276 588,284 596,284" fill="#333"/>
                                                <text x="646" y="274" text-anchor="middle" font-size="9" fill="#333">D10</text>
                                                <polygon points="646,276 642,284 650,284" fill="#333"/>

                                                <!-- Arrow marker def -->
                                                <defs>
                                                    <marker id="a" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                                                        <path d="M0,0 L4,2 L0,4 Z" fill="#555"/>
                                                    </marker>
                                                </defs>
                                            </svg>
                                        </td>
                                    </tr>

                                    <!-- ── MEASUREMENTS SECTION HEADING ── -->
                                    <tr>
                                        <td colspan="7" style="border:1px solid #333; padding:5px 8px; text-align:center; font-weight:bold; background:#eaeaea;">Measurements After Frame Fixing (All dimensions are in mm)</td>
                                    </tr>

                                    <!-- Diagonals row with 5 sub-pairs -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">15</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">
                                            Diagonals Measurement (±2 mm)<br>
                                            <span style="font-size:9px; color:#666;">(For 3 limb D7 to D10 Not Applicable)</span>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <table style="width:100%; border-collapse:collapse;">
                                                ${['D1, D2', 'D3, D4', 'D5, D6', 'D7, D8', 'D9, D10'].map((label, i) => `
                                                <tr style="${i < 4 ? 'border-bottom:1px solid #ccc;' : ''}">
                                                    <td style="padding:2px 5px; font-size:9px; color:#555; white-space:nowrap;">${label}</td>
                                                </tr>`).join('')}
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <table style="width:100%; border-collapse:collapse;">
                                                ${[0, 1, 2, 3, 4].map(i => `
                                                <tr style="${i < 4 ? 'border-bottom:1px solid #ccc;' : ''}">
                                                    <td style="padding:0; height:22px;"><input type="text" id="cb_diag_${rowId}_${i}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                                </tr>`).join('')}
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_diag_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbRole === 'production'
                        ? `<td style="border:1px solid #333; padding:3px 5px; font-size:10px; vertical-align:middle; background:#f0fff0;"><strong>${cbUserName}</strong><input type="hidden" id="cb_diag_ss_${rowId}" value="${cbUserName}"></td>`
                        : cbRole === 'admin'
                            ? `<td style="border:1px solid #333; padding:2px;"><input type="text" id="cb_diag_ss_${rowId}" readonly placeholder="—" style="width:100%;border:none;padding:3px;font-size:10px;background:#f5f5f5;box-sizing:border-box;cursor:default;"></td>`
                            : `<td style="border:1px solid #333; padding:0;"><input type="text" id="cb_diag_ss_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>`
                    }
                                        ${cbRole === 'quality'
                        ? `<td style="border:1px solid #333; padding:3px 5px; font-size:10px; vertical-align:middle; background:#f0f8ff;"><strong>${cbUserName}</strong><input type="hidden" id="cb_diag_qi_${rowId}" value="${cbUserName}"></td>`
                        : cbRole === 'admin'
                            ? `<td style="border:1px solid #333; padding:2px;"><input type="text" id="cb_diag_qi_${rowId}" readonly placeholder="—" style="width:100%;border:none;padding:3px;font-size:10px;background:#f5f5f5;box-sizing:border-box;cursor:default;"></td>`
                            : `<td style="border:1px solid #333; padding:0;"><input type="text" id="cb_diag_qi_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>`
                    }
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_diag" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}_diag')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 4: Bottom HV/LV frame to Top frame Height Measurement -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:top;">4</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:top;">
                                            Bottom HV/LV frame to Top frame<br>Height Measurement (± 2/0 mm)<br>
                                            <span style="font-size:9px;color:#777;">(For 3 limb H3 &amp; H4 Not Applicable)</span>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <table style="width:100%;border-collapse:collapse;">
                                                ${['H1', 'H2', 'H3', 'H4', 'W1', 'W2', 'W3', 'W4'].map((lbl, i) => `
                                                <tr style="${i < 7 ? 'border-bottom:1px solid #ccc;' : ''}">
                                                    <td style="padding:2px 5px;font-size:9px;color:#555;white-space:nowrap;">${lbl}</td>
                                                </tr>`).join('')}
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <table style="width:100%;border-collapse:collapse;">
                                                ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `
                                                <tr style="${i < 7 ? 'border-bottom:1px solid #ccc;' : ''}">
                                                    <td style="padding:0;height:22px;"><input type="text" id="cb_r4_av_${rowId}_${i}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                                </tr>`).join('')}
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r4_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r4')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r4')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r4" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r4')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 5: Locking of flitch plate -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">5</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">
                                            Locking of flitch plate with bottom frame &amp; tightening of flitch plate hardware.<br>
                                            <span style="font-size:9px;color:#777;">(For 3 limb W3 &amp; W4 Not Applicable)</span>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <table style="width:100%;border-collapse:collapse;">
                                                <tr style="border-bottom:1px solid #ccc;">
                                                    <td style="padding:4px 5px; font-size:9px; color:#555; text-align:center;">Visual</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:4px 5px; text-align:center;">
                                                        <select id="cb_r5_oknotok_${rowId}" ${disabledAttr} style="width:100%;padding:3px;font-size:10px;border:1px solid #ccc;border-radius:3px;background:#fff;">
                                                            <option value="">-- Select --</option>
                                                            <option value="Ok">Ok</option>
                                                            <option value="Not Ok">Not Ok</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <table style="width:100%;border-collapse:collapse;">
                                                <tr style="border-bottom:1px solid #ccc;">
                                                    <td style="padding:0;height:22px;"><input type="text" id="cb_r5_av1_${rowId}" ${disabledAttr} placeholder="..........Nm" style="width:100%;height:22px;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0;height:22px;"><input type="text" id="cb_r5_av2_${rowId}" ${disabledAttr} placeholder="..........Nm" style="width:100%;height:22px;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r5_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r5')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r5')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r5" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r5')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- ── INSULATION ASSEMBLY SECTION HEADING ── -->
                                    <tr>
                                        <td colspan="8" style="border:1px solid #333; padding:5px 8px; font-weight:bold; text-align:center; background:#eaeaea;">Insulation Assembly frames &amp; Flitch plates</td>
                                    </tr>

                                    <!-- Row 6: Insulation arrangement at bottom (HV/LV) frame -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:top;">6</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:top;">
                                            Insulation arrangement at bottom (HV/LV) frame<br>
                                            <span style="font-size:9px;color:#777;">(Bottom frame top edge to core insulation top edge) As per Drg.</span>
                                        </td>
                                        <td style="border:1px solid #333; padding:4px 5px; vertical-align:middle;">
                                            <div style="font-size:9px;color:#555;text-align:center;">Thickness</div>
                                            <input type="text" id="cb_r6_th_${rowId}" ${disabledAttr} placeholder="..........mm" style="width:100%;height:20px;border:1px solid #ccc;padding:2px 3px;font-size:9px;background:transparent;box-sizing:border-box;margin-top:2px;">
                                        </td>
                                        <td style="border:1px solid #333; padding:4px 5px; vertical-align:middle;">
                                            <div style="font-size:9px;color:#555;text-align:center;">Thickness</div>
                                            <input type="text" id="cb_r6_av_${rowId}" ${disabledAttr} placeholder="..........mm" style="width:100%;height:20px;border:1px solid #ccc;padding:2px 3px;font-size:9px;background:transparent;box-sizing:border-box;margin-top:2px;">
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r6_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r6')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r6')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r6" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r6')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 7: Insulation arrangement at flitch plates -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">7</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Insulation arrangement at flitch plates.</td>
                                        <td style="border:1px solid #333; padding:4px 5px; vertical-align:middle;">
                                            <div style="font-size:9px;color:#555;text-align:center;">Thickness</div>
                                            <input type="text" id="cb_r7_th_${rowId}" ${disabledAttr} placeholder="..........mm" style="width:100%;height:20px;border:1px solid #ccc;padding:2px 3px;font-size:9px;background:transparent;box-sizing:border-box;margin-top:2px;">
                                        </td>
                                        <td style="border:1px solid #333; padding:4px 5px; vertical-align:middle;">
                                            <input type="text" id="cb_r7_av_${rowId}" ${disabledAttr} placeholder="..........mm" style="width:100%;height:20px;border:1px solid #ccc;padding:2px 3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r7_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r7')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r7')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r7" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r7')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 8: Use of nomex at insulation joint -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">8</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Use of nomex at insulation joint</td>
                                        <td style="border:1px solid #333; padding:4px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">10 mm projection<br>at both ends.</td>
                                        <td style="border:1px solid #333; padding:4px 5px; text-align:center; vertical-align:middle;">
                                            <select id="cb_r8_av_${rowId}" ${disabledAttr} style="width:100%;padding:3px;font-size:10px;border:1px solid #ccc;border-radius:3px;background:#fff;">
                                                <option value="">-- Select --</option>
                                                <option value="Ok">Ok</option>
                                                <option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r8_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r8')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r8')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r8" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r8')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 9: Position of Step blocks -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">9</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Position of Step blocks.</td>
                                        <td style="border:1px solid #333; padding:4px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">As per Drg.</td>
                                        <td style="border:1px solid #333; padding:4px 5px; text-align:center; vertical-align:middle;">
                                            <select id="cb_r9_av_${rowId}" ${disabledAttr} style="width:100%;padding:3px;font-size:10px;border:1px solid #ccc;border-radius:3px;background:#fff;">
                                                <option value="">-- Select --</option>
                                                <option value="Ok">Ok</option>
                                                <option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r9_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r9')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r9')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r9" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r9')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- ── LAMINATIONS ASSEMBLY SECTION HEADING ── -->
                                    <tr>
                                        <td colspan="8" style="border:1px solid #333; padding:5px 8px; font-weight:bold; text-align:center; background:#eaeaea;">Laminations Assembly</td>
                                    </tr>

                                    <!-- Row 10: Surface Condition of Laminations -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">10</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Surface Condition of Laminations should be Rust free, Damage Free, Waviness Free.</td>
                                        <td style="border:1px solid #333; padding:4px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">Visual</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;">
                                            <select id="cb_r10_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">-- Select --</option>
                                                <option value="Ok">Ok</option>
                                                <option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r10_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r10')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r10')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r10" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r10')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 11: No. of laminations per packet -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">11</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">No. of laminations per packet</td>
                                        <td style="border:1px solid #333; padding:4px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">As per Drg.</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r11_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r11_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r11')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r11')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r11" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r11')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 12: No. of packets per layer -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">12</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">No. of packets per layer</td>
                                        <td style="border:1px solid #333; padding:4px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">As per Drg.</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r12_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r12_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r12')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r12')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r12" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r12')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 13: Position of First Lamination -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">13</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Position of First Lamination with respect to Yoke Clamp &amp; Insulation</td>
                                        <td style="border:1px solid #333; padding:4px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">Visual</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;">
                                            <select id="cb_r13_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">-- Select --</option>
                                                <option value="Ok">Ok</option>
                                                <option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r13_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r13')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r13')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r13" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r13')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 14: Air Gap at Lamination joint -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">14</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">
                                            Air Gap at Lamination joint<br>
                                            <span style="font-size:9px;color:#777;">Note: No overlapping.<br>(To be measured with Vernier caliper)</span>
                                        </td>
                                        <td style="border:1px solid #333; padding:4px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">0 to 2 mm</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r14_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r14_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r14')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r14')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r14" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r14')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- ── MEASUREMENTS AFTER 1ST LAYER ASSEMBLY HEADING ── -->
                                    <tr>
                                        <td colspan="8" style="border:1px solid #333; padding:5px 8px; text-align:center; font-weight:bold; background:#eaeaea;">Measurements After 1st Layer Assembly (All dimensions are in mm)</td>
                                    </tr>

                                    <!-- Row 16: Diagonals Measurement (2nd set) -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">16</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">
                                            Diagonals Measurement (±2 mm)<br>
                                            <span style="font-size:9px; color:#666;">(For 3 limb D7 to D10 Not Applicable)</span>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <table style="width:100%; border-collapse:collapse;">
                                                ${['D1, D2', 'D3, D4', 'D5, D6', 'D7, D8', 'D9, D10'].map((label, i) => `
                                                <tr style="${i < 4 ? 'border-bottom:1px solid #ccc;' : ''}">
                                                    <td style="padding:2px 5px; font-size:9px; color:#555; white-space:nowrap;">${label}</td>
                                                </tr>`).join('')}
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <table style="width:100%; border-collapse:collapse;">
                                                ${[0, 1, 2, 3, 4].map(i => `
                                                <tr style="${i < 4 ? 'border-bottom:1px solid #ccc;' : ''}">
                                                    <td style="padding:0; height:22px;"><input type="text" id="cb_diag2_${rowId}_${i}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                                </tr>`).join('')}
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_diag2_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbRole === 'production'
                        ? `<td style="border:1px solid #333; padding:3px 5px; font-size:10px; vertical-align:middle; background:#f0fff0;"><strong>${cbUserName}</strong><input type="hidden" id="cb_diag2_ss_${rowId}" value="${cbUserName}"></td>`
                        : cbRole === 'admin'
                            ? `<td style="border:1px solid #333; padding:2px;"><input type="text" id="cb_diag2_ss_${rowId}" readonly placeholder="—" style="width:100%;border:none;padding:3px;font-size:10px;background:#f5f5f5;box-sizing:border-box;cursor:default;"></td>`
                            : `<td style="border:1px solid #333; padding:0;"><input type="text" id="cb_diag2_ss_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>`
                    }
                                        ${cbRole === 'quality'
                        ? `<td style="border:1px solid #333; padding:3px 5px; font-size:10px; vertical-align:middle; background:#f0f8ff;"><strong>${cbUserName}</strong><input type="hidden" id="cb_diag2_qi_${rowId}" value="${cbUserName}"></td>`
                        : cbRole === 'admin'
                            ? `<td style="border:1px solid #333; padding:2px;"><input type="text" id="cb_diag2_qi_${rowId}" readonly placeholder="—" style="width:100%;border:none;padding:3px;font-size:10px;background:#f5f5f5;box-sizing:border-box;cursor:default;"></td>`
                            : `<td style="border:1px solid #333; padding:0;"><input type="text" id="cb_diag2_qi_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>`
                    }
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_diag2" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}_diag2')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- ── LAMINATION LAYER ASSEMBLY SECTION ── -->

                                    <!-- Row 16: Record each stack height (sub-rows a-n) -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:top;" rowspan="15">16</td>
                                        <td colspan="6" style="border:1px solid #333; padding:4px 8px; font-weight:bold; background:#f9f9f9;">
                                            Record each stack height.<br>
                                            <span style="font-size:9px; color:#777; font-weight:normal;">Note: When testing 4-frame cores test core to core at the same time as ducts/nomex layers</span>
                                        </td>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r16hdr" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r16hdr')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    ${[
                        { lbl: 'a', desc: '1st Duct or nomex layer laid out correctly', spec: 'As per Drg.', id: 'r16a', tested: false },
                        { lbl: 'b', desc: '1st Duct or nomex layer tested by using 1kV DC ohmmeter', spec: 'Acceptance criteria >5MΩ', id: 'r16b', tested: true },
                        { lbl: 'c', desc: '2nd Duct or nomex layer laid out correctly', spec: 'As per Drg.', id: 'r16c', tested: false },
                        { lbl: 'd', desc: '2nd Duct or nomex layer tested by using 1kV DC ohmmeter', spec: 'Acceptance criteria >5MΩ', id: 'r16d', tested: true },
                        { lbl: 'e', desc: '3rd Duct or nomex layer laid out correctly', spec: 'As per Drg.', id: 'r16e', tested: false },
                        { lbl: 'f', desc: '3rd Duct or nomex layer tested by using 1kV DC ohmmeter', spec: 'Acceptance criteria >5MΩ', id: 'r16f', tested: true },
                        { lbl: 'g', desc: '4th Duct or nomex layer laid out correctly', spec: 'As per Drg.', id: 'r16g', tested: false },
                        { lbl: 'h', desc: '4th Duct or nomex layer tested by using 1kV DC ohmmeter', spec: 'Acceptance criteria >5MΩ', id: 'r16h', tested: true },
                        { lbl: 'i', desc: '5th Duct or nomex layer laid out correctly', spec: 'As per Drg.', id: 'r16i', tested: false },
                        { lbl: 'j', desc: '5th Duct or nomex layer tested by using 1kV DC ohmmeter', spec: 'Acceptance criteria >5MΩ', id: 'r16j', tested: true },
                        { lbl: 'k', desc: '6th Duct or nomex layer laid out correctly', spec: 'As per Drg.', id: 'r16k', tested: false },
                        { lbl: 'l', desc: '6th Duct or nomex layer tested by using 1kV DC ohmmeter', spec: 'Acceptance criteria >5MΩ', id: 'r16l', tested: true },
                        { lbl: 'm', desc: '7th Duct or nomex layer laid out correctly', spec: 'As per Drg.', id: 'r16m', tested: false },
                        { lbl: 'n', desc: '7th Duct or nomex layer tested by using 1kV DC ohmmeter', spec: 'Acceptance criteria >5MΩ', id: 'r16n', tested: true },
                    ].map(row => `
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px 6px; font-size:10px; vertical-align:middle;"><strong>${row.lbl}</strong> — ${row.desc}</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">${row.spec}</td>
                                        <td style="border:1px solid #333; padding:2px; vertical-align:top;">
                                            ${row.tested ? `
                                            <div style="display:flex;flex-direction:column;gap:2px;padding:2px;">
                                                <select id="cb_${row.id}_type_${rowId}" ${disabledAttr} style="width:100%;border:1px solid #ccc;padding:2px 3px;font-size:10px;background:#fff;box-sizing:border-box;border-radius:2px;">
                                                    <option value="">— Select —</option>
                                                    <option value="Duct">Duct</option>
                                                    <option value="Nomex">Nomex</option>
                                                </select>
                                                <span style="font-size:9px;color:#555;padding:2px 3px;">F1-F2</span>
                                            </div>
                                            ` : `
                                            <select id="cb_${row.id}_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">— Select —</option>
                                                <option value="Ok">Ok</option>
                                                <option value="Not Ok">Not Ok</option>
                                                <option value="N/A">N/A</option>
                                            </select>
                                            `}
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_${row.id}_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, row.id)}
                                        ${cbQiCell.replace(/{{ID}}/g, row.id)}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_${row.id}" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_${row.id}')">💾 Save</button>` : ''}</td>
                                    </tr>`).join('')}


                                    <!-- Row 17: Final Unpressed stack height measurement -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">17</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Final Unpressed stack height measurement</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">
                                            Framed core: 03 to 05 mm<br>
                                            Non framed core: 2 to 3 mm
                                        </td>
                                        <td style="border:1px solid #333; padding:0;">
                                            <div style="display:flex;flex-direction:column;">
                                                <input type="text" id="cb_r17_av1_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;border-bottom:1px solid #ccc;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <input type="text" id="cb_r17_av2_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                            </div>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r17_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r17')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r17')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r17" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r17')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- ── FRAME ASSEMBLY SECTION (2nd pass) ── -->
                                    <tr>
                                        <td colspan="8" style="border:1px solid #333; padding:5px 8px; font-weight:bold; text-align:center; background:#eaeaea;">Frame Assembly</td>
                                    </tr>

                                    <!-- Row 18: Insulation arrangement at bottom frame -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">18</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Insulation arrangement at bottom frame.</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">Thickness <input type="text" id="cb_r18_th_${rowId}" ${disabledAttr} placeholder="mm" style="width:55px;height:18px;border:1px solid #ccc;padding:2px 3px;font-size:9px;background:transparent;box-sizing:border-box;"> mm</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r18_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r18_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r18')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r18')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r18" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r18')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 19: Insulation arrangement at flitch plates -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">19</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Insulation arrangement at flitch plates.</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">Thickness <input type="text" id="cb_r19_th_${rowId}" ${disabledAttr} placeholder="mm" style="width:55px;height:18px;border:1px solid #ccc;padding:2px 3px;font-size:9px;background:transparent;box-sizing:border-box;"> mm</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r19_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r19_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r19')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r19')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r19" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r19')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 20: Use of nomex at insulation joint -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">20</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Use of nomex at insulation joint</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">10mm projection<br>at both ends.</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;">
                                            <select id="cb_r20_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option>
                                                <option value="Ok">Ok</option>
                                                <option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r20_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r20')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r20')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r20" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r20')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 21: Position of Step blocks -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">21</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Position of Step blocks.</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">As per Drg.</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;">
                                            <select id="cb_r21_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option>
                                                <option value="Ok">Ok</option>
                                                <option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r21_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r21')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r21')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r21" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r21')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 22: Flitch plate to flitch plate width Measurement -->
                                    <tr>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">22</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Flitch plate to flitch plate width Measurement (± 2/0 mm)<br><span style="font-size:9px;color:#555;">(For 3 limb W3 & W4 Not Applicable)</span></td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">W1</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r22_w1_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r22_w1op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="4" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r22').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r22').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r22" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r22')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">W2</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r22_w2_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r22_w2op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">W3</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r22_w3_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r22_w3op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">W4</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r22_w4_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r22_w4op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 23: Bottom HV/LV frame to Top Height Measurement -->
                                    <tr>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">23</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Bottom HV/LV frame to Top Height Measurement (± 2/0 mm)<br><span style="font-size:9px;color:#555;">(For 3 limb H3 & H4 Not Applicable)</span></td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">H1</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r23_h1_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r23_h1op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="4" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r23').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r23').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r23" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r23')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">H2</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r23_h2_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r23_h2op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">H3</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r23_h3_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r23_h3op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">H4</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r23_h4_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r23_h4op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 24: Insulation arrangement at basefeet & Isolation tube filled at Hardware -->
                                    <tr>
                                        <td rowspan="6" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">24</td>
                                        <td rowspan="6" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Insulation arrangement at basefeet &amp; Isolation tube filled at Hardware.</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; text-align:center; vertical-align:middle;">Visual check for<br>Insulation/isolation</td>
                                        <td style="border:1px solid #333; padding:0;"></td>
                                        <td style="border:1px solid #333; padding:0;"></td>
                                        <td rowspan="6" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r24').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="6" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r24').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="6" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r24" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r24')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">Uphase</td>
                                        <td style="border:1px solid #333; padding:0;">
                                            <select id="cb_r24_uphase_ok_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r24_uphase_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">Vphase</td>
                                        <td style="border:1px solid #333; padding:0;">
                                            <select id="cb_r24_vphase_ok_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r24_vphase_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">Wphase</td>
                                        <td style="border:1px solid #333; padding:0;">
                                            <select id="cb_r24_wphase_ok_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r24_wphase_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">Aux. limb1</td>
                                        <td style="border:1px solid #333; padding:0;">
                                            <select id="cb_r24_aux1_ok_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r24_aux1_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">Aux. limb2</td>
                                        <td style="border:1px solid #333; padding:0;">
                                            <select id="cb_r24_aux2_ok_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r24_aux2_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 25: Base feet hardware tightning -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">25</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Base feet hardware tightning.<br><span style="font-size:9px;color:#555;">(Torque application as per Drg.)</span></td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">As per Drg.<br>F1</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r25_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r25_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r25')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r25')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r25" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r25')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 26: Steel band assembly -->
                                    <tr>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">26</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Steel band assembly (AS Per Drg.):-<br>- Tightening.<br>- Isolation arrangement &amp;<br>- Hardware tightening.<br><span style="font-size:9px;color:#555;">(Torque application as per Drg.)</span></td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">F1</td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <div style="display:flex;flex-direction:column;">
                                                <select id="cb_r26_f1_ok_${rowId}" ${disabledAttr} style="width:100%;border:none;border-bottom:1px solid #ccc;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                    <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                                </select>
                                                <input type="text" id="cb_r26_f1_nm_${rowId}" ${disabledAttr} placeholder="Nm" style="width:100%;border:none;padding:3px;font-size:9px;background:transparent;box-sizing:border-box;">
                                            </div>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r26_f1_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="4" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r26').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r26').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r26" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r26')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">F2</td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <div style="display:flex;flex-direction:column;">
                                                <select id="cb_r26_f2_ok_${rowId}" ${disabledAttr} style="width:100%;border:none;border-bottom:1px solid #ccc;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                    <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                                </select>
                                                <input type="text" id="cb_r26_f2_nm_${rowId}" ${disabledAttr} placeholder="Nm" style="width:100%;border:none;padding:3px;font-size:9px;background:transparent;box-sizing:border-box;">
                                            </div>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r26_f2_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">F3</td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <div style="display:flex;flex-direction:column;">
                                                <select id="cb_r26_f3_ok_${rowId}" ${disabledAttr} style="width:100%;border:none;border-bottom:1px solid #ccc;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                    <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                                </select>
                                                <input type="text" id="cb_r26_f3_nm_${rowId}" ${disabledAttr} placeholder="Nm" style="width:100%;border:none;padding:3px;font-size:9px;background:transparent;box-sizing:border-box;">
                                            </div>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r26_f3_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">F4</td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <div style="display:flex;flex-direction:column;">
                                                <select id="cb_r26_f4_ok_${rowId}" ${disabledAttr} style="width:100%;border:none;border-bottom:1px solid #ccc;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                    <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                                </select>
                                                <input type="text" id="cb_r26_f4_nm_${rowId}" ${disabledAttr} placeholder="Nm" style="width:100%;border:none;padding:3px;font-size:9px;background:transparent;box-sizing:border-box;">
                                            </div>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r26_f4_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 27: End Bracket Assembly -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">27</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">End Bracket Assembly (As Per Drg.):-<br>-Hardware tightening<br>-Isolation Arrangement<br><span style="font-size:9px;color:#555;">-Torque Application as per Drg.</span></td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">F1</td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <div style="display:flex;flex-direction:column;">
                                                <select id="cb_r27_f1_ok_${rowId}" ${disabledAttr} style="width:100%;border:none;border-bottom:1px solid #ccc;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                    <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                                </select>
                                                <input type="text" id="cb_r27_f1_nm_${rowId}" ${disabledAttr} placeholder="Nm" style="width:100%;border:none;padding:3px;font-size:9px;background:transparent;box-sizing:border-box;">
                                            </div>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r27_f1_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r27').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r27').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r27" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r27')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">F4</td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;">
                                            <div style="display:flex;flex-direction:column;">
                                                <select id="cb_r27_f4_ok_${rowId}" ${disabledAttr} style="width:100%;border:none;border-bottom:1px solid #ccc;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                    <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                                </select>
                                                <input type="text" id="cb_r27_f4_nm_${rowId}" ${disabledAttr} placeholder="Nm" style="width:100%;border:none;padding:3px;font-size:9px;background:transparent;box-sizing:border-box;">
                                            </div>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r27_f4_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 28: Application of Blue Lacquer/white varnish -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">28</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Application of Blue Lacquer/white varnish</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">Visual</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;">
                                            <select id="cb_r28_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r28_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r28')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r28')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r28" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r28')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 29: Core leg packing (Haldi wood) -->
                                    <tr>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">29</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Core leg packing(Haldi wood).<br>As per Drawing.</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">Visual</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;" colspan="2"></td>
                                        <td rowspan="4" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r29').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r29').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="4" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r29" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r29')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">U Phase</td>
                                        <td style="border:1px solid #333; padding:0;">
                                            <select id="cb_r29_u_ok_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r29_u_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>

                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">V Phase</td>
                                        <td style="border:1px solid #333; padding:0;">
                                            <select id="cb_r29_v_ok_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r29_v_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>

                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;">W Phase</td>
                                        <td style="border:1px solid #333; padding:0;">
                                            <select id="cb_r29_w_ok_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r29_w_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>

                                    </tr>

                                    <!-- Row 30: Core Diameter Measurement at Green belt -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">30</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Core Diameter Measurement at Green belt</td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:top;" colspan="2">
                                            <table style="width:100%;border-collapse:collapse;margin:0;padding:0;">
                                                <tr>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:2px 3px; font-size:9px; font-weight:bold; text-align:center;">Specified Value</td>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:2px 3px; font-size:9px; font-weight:bold; text-align:center;">Location</td>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:2px 3px; font-size:9px; font-weight:bold; text-align:center;">U Phase</td>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:2px 3px; font-size:9px; font-weight:bold; text-align:center;">V Phase</td>
                                                    <td style="border-bottom:1px solid #999; padding:2px 3px; font-size:9px; font-weight:bold; text-align:center;">W Phase</td>
                                                </tr>
                                                <tr>
                                                    <td rowspan="3" style="border-right:1px solid #999; padding:2px 3px; font-size:9px; text-align:center; vertical-align:middle;">
                                                        <div style="display:flex;align-items:center;gap:2px;justify-content:center;">
                                                            <input type="text" id="cb_r30_sv_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">
                                                            <span style="font-size:9px;color:#555;">mm</span>
                                                        </div>
                                                    </td>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:2px 3px; font-size:9px; text-align:center;">Top</td>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:0;"><input type="text" id="cb_r30_top_u_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;"></td>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:0;"><input type="text" id="cb_r30_top_v_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;"></td>
                                                    <td style="border-bottom:1px solid #999; padding:0;"><input type="text" id="cb_r30_top_w_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;"></td>
                                                </tr>
                                                <tr>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:2px 3px; font-size:9px; text-align:center;">Middle</td>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:0;"><input type="text" id="cb_r30_mid_u_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;"></td>
                                                    <td style="border-right:1px solid #999; border-bottom:1px solid #999; padding:0;"><input type="text" id="cb_r30_mid_v_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;"></td>
                                                    <td style="border-bottom:1px solid #999; padding:0;"><input type="text" id="cb_r30_mid_w_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;"></td>
                                                </tr>
                                                <tr>
                                                    <td style="border-right:1px solid #999; padding:2px 3px; font-size:9px; text-align:center;">Bottom</td>
                                                    <td style="border-right:1px solid #999; padding:0;"><input type="text" id="cb_r30_bot_u_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;"></td>
                                                    <td style="border-right:1px solid #999; padding:0;"><input type="text" id="cb_r30_bot_v_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;"></td>
                                                    <td style="padding:0;"><input type="text" id="cb_r30_bot_w_${rowId}" ${disabledAttr} style="width:100%;height:22px;border:none;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;"></td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td style="border:1px solid #333; padding:0; vertical-align:middle;"><input type="text" id="cb_r30_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r30')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r30')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r30" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r30')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 31: Spreader beam to be placed at every location -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">31</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Spreader beam to be placed at every location<br><span style="font-size:9px;color:#555;">(The spreader beam between 2 adjacent limbs, Top HV to LV yoke clamp 1 no for every 2limb)</span></td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r31_sv_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0; height:36px;"><input type="text" id="cb_r31_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r31_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r31')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r31')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r31" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r31')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Section Header: Isolation Test of Core Assembly -->
                                    <tr>
                                        <td colspan="8" style="border:1px solid #333; padding:6px 10px; font-weight:bold; background:#e8e8e8; text-align:center; font-size:11px;">Isolation Test of Core Assembly</td>
                                    </tr>

                                    <!-- Row 32: Between Btm. HV & Btm LV frame -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">32</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between Btm. HV & Btm LV frame</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r32_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r32_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r32_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r32').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r32').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r32" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r32')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r32_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r32_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r32_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 33: Between core & Btm.HV frame -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">33</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between core & Btm.HV frame</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r33_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r33_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r33_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r33').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r33').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r33" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r33')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r33_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r33_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r33_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 34: Between core & Btm. LV frame -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">34</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between core & Btm. LV frame</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r34_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r34_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r34_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r34').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r34').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r34" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r34')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r34_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r34_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r34_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 35: Between Top HV & Top LV frame -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">35</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between Top HV & Top LV frame</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r35_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r35_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r35_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r35').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r35').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r35" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r35')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r35_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r35_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r35_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 36: Between core & Top HV frame -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">36</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between core & Top HV frame</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r36_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r36_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r36_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r36').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r36').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r36" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r36')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r36_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r36_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r36_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 37: Between core & Top. LV frame -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">37</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between core & Top. LV frame</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r37_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r37_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r37_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r37').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r37').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r37" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r37')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r37_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r37_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r37_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 38: Between F1 & F2 -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">38</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between F1 & F2</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r38_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r38_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r38_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r38').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r38').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r38" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r38')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r38_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r38_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r38_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 39: Between F2 & F3 -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">39</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between F2 & F3</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r39_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r39_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r39_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r39').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r39').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r39" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r39')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r39_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r39_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r39_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 40: Between F3 & F4 -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">40</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between F3 &amp; F4</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r40_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r40_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r40_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r40').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r40').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r40" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r40')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r40_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r40_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r40_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 41: Between Basefeet 1 to core -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">41</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between Basefeet 1 to core</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r41_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r41_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r41_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r41').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r41').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r41" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r41')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r41_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r41_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r41_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 42: Between Basefeet 2 to core -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">42</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between Basefeet 2 to core</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r42_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r42_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r42_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r42').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r42').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r42" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r42')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r42_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r42_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r42_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 43: Between Basefeet 3 to core -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">43</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between Basefeet 3 to core</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r43_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r43_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r43_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r43').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r43').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r43" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r43')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r43_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r43_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r43_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 44: Between Basefeet 4 to core -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">44</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between Basefeet 4 to core</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r44_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r44_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r44_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r44').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r44').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r44" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r44')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r44_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r44_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r44_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 45: Between Basefeet 5 to core -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">45</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Between Basefeet 5 to core</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r45_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r45_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r45_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r45').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r45').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r45" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r45')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r45_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r45_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r45_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 46: Final Isolation Test Core & Frame -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">46</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Final Isolation Test Core &amp; Frame<br><span style="font-size:9px;color:#555;">(All ducts &amp; all phases shorted)</span></td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2kV AC<input type="text" id="cb_r46_sv_ac_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">mA</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r46_ac_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r46_ac_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r46').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r46').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r46" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r46')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; vertical-align:middle;"><div style="display:flex;align-items:center;gap:2px;white-space:nowrap;">2.5kV DC<input type="text" id="cb_r46_sv_dc_${rowId}" ${disabledAttr} style="width:45px;height:20px;border:1px solid #ccc;padding:2px;font-size:9px;background:transparent;box-sizing:border-box;">Ω</div></td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r46_dc_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r46_dc_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                    <!-- Row 47: Core Clean & free from damage -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">47</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Core Clean &amp; free from damage</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">Visual</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;">
                                            <select id="cb_r47_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Ok">Ok</option><option value="Not Ok">Not Ok</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r47_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r47')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r47')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r47" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r47')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 48: Final inspection of core assembly & release for next process -->
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">48</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Final inspection of core assembly &amp; release for next process</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">Visual</td>
                                        <td style="border:1px solid #333; padding:0; height:36px;">
                                            <select id="cb_r48_av_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;">
                                                <option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option>
                                            </select>
                                        </td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r48_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        ${cbSsCell.replace(/{{ID}}/g, 'r48')}
                                        ${cbQiCell.replace(/{{ID}}/g, 'r48')}
                                        <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r48" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r48')">💾 Save</button>` : ''}</td>
                                    </tr>

                                    <!-- Row 49: Received weight & Unused weight of CRGO lamination -->
                                    <tr>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">49</td>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Received weight of CRGO lamination (kg)</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">kg</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r49_recv_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r49_recv_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbSsCell.replace(/{{ID}}/g, 'r49').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:0; vertical-align:middle;">${cbQiCell.replace(/{{ID}}/g, 'r49').replace(/<td[^>]*>/, '').replace(/<\/td>/, '')}</td>
                                        <td rowspan="2" style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle;">${!isCustomer ? `<button class="btn-login" id="save_${rowId}_r49" style="width:auto;padding:4px 8px;font-size:10px;background:var(--green);" onclick="saveNewChecklistItem('${stage}',${itemCounter},'${rowId}_r49')">💾 Save</button>` : ''}</td>
                                    </tr>
                                    <tr>
                                        <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle;">Unused weight of CRGO lamination (kg)</td>
                                        <td style="border:1px solid #333; padding:3px 5px; font-size:9px; color:#555; vertical-align:middle;">kg</td>
                                        <td style="border:1px solid #333; padding:0; height:28px;"><input type="text" id="cb_r49_unused_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                        <td style="border:1px solid #333; padding:0;"><input type="text" id="cb_r49_unused_op_${rowId}" ${disabledAttr} style="width:100%;height:100%;border:none;padding:3px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                                    </tr>

                                </tbody>
                            </table>
                            <!-- Notes footer -->
                            <div style="border:1px solid #333; border-top:none; padding:6px 10px; font-size:9px; color:#555;">
                                <strong>Note:</strong><br>
                                1)* Insulation thickness, stack thickness to be measured with vernier caliper rest all dimensions are to be measured with measuring tape.<br>
                                2) ** indicates check points of Q.C.
                            </div>
                            <div style="border:1px solid #333; border-top:none; padding:4px 10px; font-size:9px; color:#555; text-align:right;">
                                Page1
                            </div>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;

            } else if (item.type === 'hi-lo-gap-table') {

                // Section 6: Diameter of Hi Lo gap wraps of coil - exact physical document layout
                const coilGroups = [
                    { name: 'Coil 1', rows: 5 },
                    { name: 'Coil 2', rows: 9 },
                    { name: 'Coil 3', rows: 9 },
                    { name: 'Coil 4', rows: 6 }
                ];
                const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

                const tableRows = coilGroups.map((coil, coilIdx) => {
                    const dataRows = [...Array(coil.rows)].map((_, rowIdx) => `
                        <tr>
                            <td style="border: 1px solid #333; padding: 2px 4px; font-size: 10px; text-align: center;">${romanNumerals[rowIdx]}</td>
                            <td style="border: 1px solid #333; padding: 0; height: 26px;"><input type="text" id="hilo_${rowId}_${coilIdx}_${rowIdx}_partno" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border: 1px solid #333; padding: 0; height: 26px;"><input type="text" id="hilo_${rowId}_${coilIdx}_${rowIdx}_strip_drg" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border: 1px solid #333; padding: 0; height: 26px;"><input type="text" id="hilo_${rowId}_${coilIdx}_${rowIdx}_strip_used" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border: 1px solid #333; padding: 0; height: 26px;"><input type="text" id="hilo_${rowId}_${coilIdx}_${rowIdx}_cyl_drg" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border: 1px solid #333; padding: 0; height: 26px;"><input type="text" id="hilo_${rowId}_${coilIdx}_${rowIdx}_cyl_used" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border: 1px solid #333; padding: 0; height: 26px;"><input type="text" id="hilo_${rowId}_${coilIdx}_${rowIdx}_asperdrg" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border: 1px solid #333; padding: 0; height: 26px;"><input type="text" id="hilo_${rowId}_${coilIdx}_${rowIdx}_dia" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border: 1px solid #333; padding: 0; height: 26px;"><input type="text" id="hilo_${rowId}_${coilIdx}_${rowIdx}_actual" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px 4px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border: 1px solid #333; padding: 0; height: 26px;">
                                ${(isQuality || isAdmin) ? `<select id="hilo_${rowId}_${coilIdx}_${rowIdx}_qa" ${disabledAttr} style="width:100%;height:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"><option value="">-- Select --</option><option value="Inspector 1">Inspector 1</option><option value="Inspector 2">Inspector 2</option></select>` : `<span style="font-size:10px;text-align:center;display:block;padding:4px;">-</span>`}
                            </td>
                        </tr>
                    `).join('');

                    const saveBtnCoil = !isCustomer ? `
                        <button class="btn-login"
                                id="save_${rowId}_coil_${coilIdx}"
                                style="width:auto; padding:4px 10px; font-size:11px; background: var(--green); float:right; margin-bottom:4px;"
                                onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                            💾 Save ${coil.name}
                        </button>
                    ` : '';

                    return `
                        <tr style="background:#f5f5f5;">
                            <td colspan="10" style="border:1px solid #333; padding:4px 8px; font-weight:bold; font-size:11px;">
                                ${coil.name}
                                ${saveBtnCoil}
                            </td>
                        </tr>
                        ${dataRows}
                    `;
                }).join('');

                customRowHTML = `
                    <tr id="${rowId}" style="border-bottom: none;">
                        <td style="font-weight: bold; vertical-align: top; padding: 6px;">${itemCounter}</td>
                        <td style="font-weight: bold; vertical-align: top; padding: 6px;">${item.point}</td>
                        <td colspan="6" style="border-bottom: none; padding: 4px 6px;">&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr style="border-top: none;">
                        <td colspan="9" style="padding: 0; border-top: none;">
                            <table style="width: 100%; border-collapse: collapse; border: 1px solid #333; font-size: 10px; margin: 0;">
                                <thead>
                                    <tr style="background: #f9f9f9;">
                                        <th style="border:1px solid #333; padding:5px 4px; width:30px; text-align:center;">S.No</th>
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;">Part No./ BOM</th>
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;">Strip</th>
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;">Strip Used</th>
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;">Cyl Drg No.</th>
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;">Cyl Used</th>
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;">As Per Drg<br>DIA</th>
                                        <th style="border:1px solid #333; padding:5px 4px; text-align:center;">Actual</th>
                                        <th style="border:1px solid #333; padding:5px 4px; width:100px; text-align:center;">Sign of Quality</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRows}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            } else if (item.type === 'brazed-joints-table') {
                // Row 36: Details of brazed joints - per-row save + QA supervisor dropdown
                const qualitySupervisors = ['-- Select --', 'Inspector 1', 'Inspector 2', 'Inspector 3'];
                const brazedRows = [...Array(10)].map((_, i) => {
                    const brazedRowId = `${rowId}_bj_${i}`;
                    const savePerRow = !isCustomer ? `
                        <button class="btn-login" id="save_${brazedRowId}"
                                style="width:auto;padding:2px 8px;font-size:9px;background:var(--green);"
                                onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${brazedRowId}')">
                            💾
                        </button>
                    ` : '';
                    const qaDropdown = (isQuality || isAdmin) ? `
                        <select id="braze_qa_${rowId}_${i}" ${disabledAttr}
                                style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;">
                            ${qualitySupervisors.map(s => `<option value="${s === '-- Select --' ? '' : s}">${s}</option>`).join('')}
                        </select>
                    ` : `<span style="font-size:10px;">-</span>`;

                    return `
                        <tr>
                            <td style="border:1px solid #333;padding:4px 6px;text-align:center;font-size:10px;">${i + 1}</td>
                            <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="braze_disc_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="braze_check_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="braze_date_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="braze_brazor_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border:1px solid #333;padding:4px 6px;">${qaDropdown}</td>
                            <td style="border:1px solid #333;padding:3px;text-align:center;width:36px;">${savePerRow}</td>
                        </tr>
                    `;
                }).join('');

                customRowHTML = `
                    <tr id="${rowId}">
                        <td colspan="8" style="padding:0;">
                            <table style="width:100%;border-collapse:collapse;font-size:10px;border:1px solid #333;">
                                <thead>
                                    <tr style="background:#f0f0f0;">
                                        <td colspan="7" style="border:1px solid #333;padding:5px 8px;font-weight:bold;font-size:11px;">
                                            ${itemCounter}&nbsp;&nbsp;Details of brazed joints
                                        </td>
                                    </tr>
                                    <tr style="background:#e8e8e8;">
                                        <th style="border:1px solid #333;padding:5px 4px;width:36px;text-align:center;">S.no.</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Brazed joint at Disc/Turn No.</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">check Brazing joint finishing, No Sharp surface</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Date/<br>Shift</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Sign of<br>Brazor</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Sign of Quality</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;width:36px;">Save</th>
                                    </tr>
                                </thead>
                                <tbody>${brazedRows}</tbody>
                            </table>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;

            } else if (item.type === 'shield-preparation-table') {
                // Row 37: Details of Shield end Preparation and placement — per-row save + QA supervisor
                const qualitySupervisors37 = ['-- Select --', 'Inspector 1', 'Inspector 2', 'Inspector 3'];
                const shieldRows = [...Array(10)].map((_, i) => {
                    const shieldRowId = `${rowId}_sh_${i}`;
                    const savePerRow = !isCustomer ? `
                        <button class="btn-login" id="save_${shieldRowId}"
                                style="width:auto;padding:2px 8px;font-size:9px;background:var(--green);"
                                onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${shieldRowId}')">
                            💾
                        </button>
                    ` : '';
                    const qaDropdown37 = (isQuality || isAdmin) ? `
                        <select id="shield_qasign_${rowId}_${i}" ${disabledAttr}
                                style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;">
                            ${qualitySupervisors37.map(s => `<option value="${s === '-- Select --' ? '' : s}">${s}</option>`).join('')}
                        </select>
                    ` : `<span style="font-size:10px;">-</span>`;

                    return `
                        <tr>
                            <td style="border:1px solid #333;padding:4px 6px;text-align:center;font-size:10px;">${i + 1}</td>
                            <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="shield_disc_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="shield_seg_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="shield_date_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="shield_opsign_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                            <td style="border:1px solid #333;padding:4px 6px;">${qaDropdown37}</td>
                            <td style="border:1px solid #333;padding:3px;text-align:center;width:36px;">${savePerRow}</td>
                        </tr>
                    `;
                }).join('');

                customRowHTML = `
                    <tr id="${rowId}">
                        <td colspan="8" style="padding:0;">
                            <table style="width:100%;border-collapse:collapse;font-size:10px;border:1px solid #333;">
                                <thead>
                                    <tr style="background:#f0f0f0;">
                                        <td colspan="7" style="border:1px solid #333;padding:5px 8px;font-weight:bold;font-size:11px;">
                                            ${itemCounter}&nbsp;&nbsp;Details of Shield end Preparation and placement.
                                        </td>
                                    </tr>
                                    <tr style="background:#e8e8e8;">
                                        <th style="border:1px solid #333;padding:5px 4px;width:36px;text-align:center;" rowspan="2">S.no.</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;" rowspan="2">Disc Number.</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;" rowspan="2">Segment number and marking on conductor</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;" rowspan="2">Date/<br>Shift</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Sign of</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Sign of</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;width:36px;" rowspan="2">Save</th>
                                    </tr>
                                    <tr style="background:#e8e8e8;">
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">operators</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Quality</th>
                                    </tr>
                                </thead>
                                <tbody>${shieldRows}</tbody>
                            </table>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;


            } else if (item.type === 'drum-details-table') {
                // Row 38: Drum Details and Vender name
                const drumRows = [...Array(10)].map((_, i) => `
                    <tr>
                        <td style="border:1px solid #333;padding:4px 6px;text-align:center;font-size:10px;">${i + 1}</td>
                        <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="drum_bobbin_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                        <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="drum_vendor_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                        <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="drum_length_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                        <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="drum_dir_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                        <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="drum_opsign_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                    </tr>
                `).join('');

                const drumSaveBtn = !isCustomer ? `
                    <button class="btn-login" id="save_${rowId}"
                            style="width:auto;padding:6px 14px;font-size:11px;background:var(--green);float:right;margin-bottom:6px;"
                            onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                        💾 Save Drum Data
                    </button>
                ` : '';

                customRowHTML = `
                    <tr id="${rowId}">
                        <td colspan="8" style="padding:0;">
                            ${drumSaveBtn}
                            <table style="width:100%;border-collapse:collapse;font-size:10px;border:1px solid #333;">
                                <thead>
                                    <tr style="background:#f0f0f0;">
                                        <td colspan="6" style="border:1px solid #333;padding:5px 8px;font-weight:bold;font-size:11px;">
                                            ${itemCounter}&nbsp;&nbsp;Drum Details and Vender name
                                        </td>
                                    </tr>
                                    <tr style="background:#e8e8e8;">
                                        <th style="border:1px solid #333;padding:5px 4px;width:36px;text-align:center;">S.no.</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Bobbin no.</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Vender</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Drum length</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Direction</th>
                                        <th style="border:1px solid #333;padding:5px 4px;text-align:center;">Operator Sign &amp; date</th>
                                    </tr>
                                </thead>
                                <tbody>${drumRows}</tbody>
                            </table>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;

            } else if (item.type === 'observation-table') {
                // Observations + Winding cleared footer
                const obsRows = [...Array(5)].map((_, i) => `
                    <tr>
                        <td style="border:1px solid #333;padding:4px 6px;text-align:center;font-size:10px;width:36px;">${i + 1}</td>
                        <td style="border:1px solid #333;padding:4px 6px;"><input type="text" id="obs_detail_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                        <td style="border:1px solid #333;padding:4px 6px;width:160px;"><input type="text" id="obs_sign_${rowId}_${i}" ${disabledAttr} style="width:100%;border:none;padding:2px;font-size:10px;background:transparent;box-sizing:border-box;"></td>
                    </tr>
                `).join('');

                const obsSaveBtn = !isCustomer ? `
                    <button class="btn-login" id="save_${rowId}"
                            style="width:auto;padding:6px 14px;font-size:11px;background:var(--green);float:right;margin-bottom:6px;"
                            onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                        💾 Save
                    </button>
                ` : '';

                customRowHTML = `
                    <tr id="${rowId}">
                        <td colspan="8" style="padding:0;">
                            ${obsSaveBtn}
                            <table style="width:100%;border-collapse:collapse;font-size:10px;border:1px solid #333;margin-bottom:0;">
                                <thead>
                                    <tr style="background:#e8e8e8;">
                                        <th style="border:1px solid #333;padding:5px 4px;width:36px;text-align:center;">S.no.</th>
                                        <th style="border:1px solid #333;padding:5px 8px;text-align:center;">Details of observation/Nonconfirmity or balance work</th>
                                        <th style="border:1px solid #333;padding:5px 8px;text-align:center;width:160px;">Sign &amp; date</th>
                                    </tr>
                                </thead>
                                <tbody>${obsRows}</tbody>
                            </table>
                            <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #333;border-top:none;margin-top:0;">
                                <tbody>
                                    <tr>
                                        <td style="border:1px solid #333;padding:8px 12px;font-weight:bold;font-size:12px;width:60%;text-align:center;">Winding cleared for Next Stage</td>
                                        <td style="border:1px solid #333;padding:8px 12px;font-size:10px;text-align:center;">
                                            <strong>Sign of QA</strong><br>
                                            <input type="text" id="obs_qa_sign_${rowId}" ${disabledAttr} placeholder="Name / Date" style="width:100%;border:none;border-bottom:1px dotted #333;padding:2px;font-size:10px;margin-top:4px;background:transparent;">
                                        </td>
                                    </tr>
                                    <tr style="background:#f5f5f5;">
                                        <td style="border:1px solid #333;padding:5px 8px;font-size:10px;">
                                            <strong>Format Prepared By</strong>&nbsp;&nbsp;Indrapal sahu
                                        </td>
                                        <td style="border:1px solid #333;padding:5px 8px;font-size:10px;text-align:right;">
                                            <strong>Format Review By</strong>&nbsp;&nbsp;Sunil Kumar Rai
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;

            } else if (item.type === 'final-signoff') {

                // Final sign-off section
                specifiedValueCell = `
                    <div style="font-size: 10px; padding: 8px; border: 1px solid #333;">
                        <div style="margin-bottom: 4px;"><strong>Format Prepared By:</strong> Indrapai sahu</div>
                        <div><strong>Format Review By:</strong> Sunil Kumar Rai</div>
                    </div>
                    `;

                actualValueCell = `
                    <div style="font-size: 11px; padding: 8px; text-align: center; border: 1px solid #333;">
                        <strong>Winding cleared for Next Stage</strong>
                    </div>
                    `;

                // Custom QA Cell (Sign of QA Name/Date)
                qaSupCell = `
                    <div style="border: 1px solid #333; padding: 8px;">
                        <div style="font-weight: bold; font-size: 10px; margin-bottom: 4px;">Sign of QA</div>
                        <div style="margin-bottom: 4px;">
                            <label style="font-size: 9px;">Name:</label>
                            <input type="text" id="final_qa_name_${rowId}" ${disabledAttr} style="width: 100%; border: 1px solid #ccc; padding: 2px; font-size: 10px; margin-top: 2px;">
                        </div>
                        <div>
                            <label style="font-size: 9px;">Date:</label>
                            <input type="text" id="final_qa_date_${rowId}" ${disabledAttr} style="width: 100%; border: 1px solid #ccc; padding: 2px; font-size: 10px; margin-top: 2px;">
                        </div>
                    </div>
                    `;

                technicianCell = '<span style="font-size: 10px; text-align: center; display: block;">-</span>';
                shopSupCell = '<span style="font-size: 10px; text-align: center; display: block;">-</span>';
                remarkCell = '<span style="font-size: 10px; text-align: center; display: block;">-</span>';
            } else {
                // Default: regular text input or dynamic dropdown
                if (item.actualInputType === 'dropdown') {
                    actualValueCell = `
                        <select id="actualValue_${rowId}" ${disabledAttr} style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 11px;">
                            <option value="">-- Select --</option>
                            <option value="Ok">Ok</option>
                            <option value="Not Ok">Not Ok</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="N/A">N/A</option>
                        </select>
                    `;
                } else {
                    actualValueCell = `
                        <input type="text"
                               id="actualValue_${rowId}"
                               ${disabledAttr}
                               placeholder="Enter value"
                               style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 11px;">
                    `;
                }
            }

            // Set default sign-off cells if not already set by custom logic
            if (!technicianCell) {
                technicianCell = !isCustomer ? `
                    <input type="text"
                           id="technician_${rowId}"
                           ${disabledAttr}
                           placeholder="Name"
                           style="width: 100%; padding: 4px; font-size: 10px; border: 1px solid #ddd; margin-bottom: 3px;">
                    <small id="techTime_${rowId}" style="font-size: 9px; color: #666; display: block;"></small>
                ` : '<span style="font-size: 10px; text-align: center; display: block;">-</span>';
            }

            if (!shopSupCell) {
                if (isProduction) {
                    const _ssName = window.currentUserName || '';
                    shopSupCell = `
                        <div style="font-size:10px; font-weight:bold; padding:4px 2px; background:#f0fff0; border-radius:3px; text-align:center;">${_ssName}</div>
                        <input type="hidden" id="shopSup_${rowId}" value="${_ssName}">
                        <small id="shopSupTime_${rowId}" style="font-size:9px; color:#666; display:block;"></small>
                    `;
                } else if (isAdmin) {
                    shopSupCell = `
                        <input type="text" id="shopSup_${rowId}" readonly
                               placeholder="—"
                               style="width:100%; padding:4px; font-size:10px; border:1px solid #ddd; border-radius:3px; background:#f5f5f5; color:#333; margin-bottom:3px; cursor:default;">
                        <small id="shopSupTime_${rowId}" style="font-size:9px; color:#666; display:block;"></small>
                    `;
                } else {
                    shopSupCell = '<span style="font-size:10px; text-align:center; display:block;">-</span>';
                }
            }

            if (!qaSupCell) {
                if (isQuality) {
                    const _qaName = window.currentUserName || '';
                    qaSupCell = `
                        <div style="font-size:10px; font-weight:bold; padding:4px 2px; background:#f0f8ff; border-radius:3px; text-align:center;">${_qaName}</div>
                        <input type="hidden" id="qaSup_${rowId}" value="${_qaName}">
                        <small id="qaSupTime_${rowId}" style="font-size:9px; color:#666; display:block;"></small>
                    `;
                } else if (isAdmin) {
                    qaSupCell = `
                        <input type="text" id="qaSup_${rowId}" readonly
                               placeholder="—"
                               style="width:100%; padding:4px; font-size:10px; border:1px solid #ddd; border-radius:3px; background:#f5f5f5; color:#333; margin-bottom:3px; cursor:default;">
                        <small id="qaSupTime_${rowId}" style="font-size:9px; color:#666; display:block;"></small>
                    `;
                } else {
                    qaSupCell = '<span style="font-size:10px; text-align:center; display:block;">-</span>';
                }
            }

            if (!remarkCell) {
                // Tanking stage uses simple text input for remarks
                if (stage === 'tanking') {
                    remarkCell = `
                    <input type="text"
                           id="remark_${rowId}"
                           ${disabledAttr}
                           placeholder="Optional"
                           style="width: 100%; padding: 5px; font-size: 11px; border: 1px solid #ddd; border-radius: 3px;">
                    `;
                } else {
                    remarkCell = `
                    <textarea id="remark_${rowId}"
                              ${disabledAttr}
                              placeholder="Optional"
                              style="width: 100%; height: 50px; padding: 4px; border: 1px solid #ddd; font-size: 10px; resize: none;"></textarea>
                    `;
                }
            }

            // Special handling for dismantling-hv-visual type (row 13)
            if (item.type === 'dismantling-hv-visual') {
                const hvVisualItems = [
                    'No loose paper taping',
                    'Tightness of hardware',
                    'Proper arrangement of T.G. Supports',
                    'Balance Work of T.G. if any',
                    'Looseness in wedges & coil pressing blocks',
                    'Proper tieing of leads'
                ];

                const hvVisualRows = hvVisualItems.map((desc, i) => {
                    const subRowId = `${rowId}_hv_${i}`;
                    return `
                        <tr>
                            <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle; font-size:10px;">${i + 1}</td>
                            <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle; font-size:10px;">${desc}</td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="specifiedValue_${subRowId}" ${disabledAttr} 
                                       placeholder="Enter value" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="methodCheck_${subRowId}" ${disabledAttr} 
                                       value="Visual" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="technician_${subRowId}" ${disabledAttr} 
                                       placeholder="Operator" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="shopSup_${subRowId}" ${disabledAttr} 
                                       placeholder="Shop Supervisor" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="remark_${subRowId}" ${disabledAttr} 
                                       placeholder="Remark" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                        </tr>
                    `;
                }).join('');

                customRowHTML = `
                    <tr id="${rowId}">
                        <td>${itemCounter}</td>
                        <td colspan="6" style="padding:0;">
                            <div style="border:1px solid #333; margin:4px 0;">
                                <div style="background:#f0f0f0; padding:6px 8px; font-weight:bold; font-size:11px; border-bottom:1px solid #333;">
                                    ${item.point}
                                </div>
                                <table style="width:100%; border-collapse:collapse; font-size:10px;">
                                    <thead>
                                        <tr style="background:#e8e8e8;">
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:40px;">Sr. No.</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center;">Description</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:120px;">Specified Value</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:100px;">Method of Check</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:100px;">Operator</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:120px;">Shop Supervisor</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:100px;">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${hvVisualRows}
                                    </tbody>
                                </table>
                                ${!isCustomer ? `<div style="padding:8px; text-align:center; background:#f9f9f9; border-top:1px solid #333;">
                                    <button class="btn-login" id="save_${rowId}" 
                                            style="width:auto; padding:6px 12px; font-size:11px; background:var(--green);" 
                                            onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                                        💾 Save HV Visual Checks
                                    </button>
                                </div>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            }

            // Special handling for dismantling-lv-visual type (row 16)
            if (item.type === 'dismantling-lv-visual') {
                const lvVisualItems = [
                    { desc: 'No loose paper taping', preFill: 'Visual' },
                    { desc: 'Tightness of hardware (F.G./Permali/M.S.)', preFill: '' },
                    { desc: 'Proper arrangement of T.G. Supports', preFill: 'Visual' },
                    { desc: 'Balance Work of T.G. if any', preFill: 'Visual' },
                    { desc: 'Looseness in wedges & coil pressing blocks', preFill: '' },
                    { desc: 'Proper tieing of leads', preFill: 'Visual' }
                ];

                const lvVisualRows = lvVisualItems.map((item, i) => {
                    const subRowId = `${rowId}_lv_${i}`;
                    return `
                        <tr>
                            <td style="border:1px solid #333; padding:4px; text-align:center; vertical-align:middle; font-size:10px;">${i + 1}</td>
                            <td style="border:1px solid #333; padding:4px 8px; vertical-align:middle; font-size:10px;">${item.desc}</td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="specifiedValue_${subRowId}" ${disabledAttr} 
                                       placeholder="Enter value" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="methodCheck_${subRowId}" ${disabledAttr} 
                                       value="${item.preFill}" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="technician_${subRowId}" ${disabledAttr} 
                                       placeholder="Operator" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="shopSup_${subRowId}" ${disabledAttr} 
                                       placeholder="Shop Supervisor" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                            <td style="border:1px solid #333; padding:0; vertical-align:middle;">
                                <input type="text" id="remark_${subRowId}" ${disabledAttr} 
                                       placeholder="Remark" 
                                       style="width:100%; height:100%; border:none; padding:3px; font-size:10px; background:transparent; box-sizing:border-box;">
                            </td>
                        </tr>
                    `;
                }).join('');

                customRowHTML = `
                    <tr id="${rowId}">
                        <td>${itemCounter}</td>
                        <td colspan="6" style="padding:0;">
                            <div style="border:1px solid #333; margin:4px 0;">
                                <div style="background:#f0f0f0; padding:6px 8px; font-weight:bold; font-size:11px; border-bottom:1px solid #333;">
                                    ${item.point}
                                </div>
                                <table style="width:100%; border-collapse:collapse; font-size:10px;">
                                    <thead>
                                        <tr style="background:#e8e8e8;">
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:40px;">Sr. No.</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center;">Description</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:120px;">Specified Value</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:100px;">Method of Check</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:100px;">Operator</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:120px;">Shop Supervisor</th>
                                            <th style="border:1px solid #333; padding:4px; text-align:center; width:100px;">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${lvVisualRows}
                                    </tbody>
                                </table>
                                ${!isCustomer ? `<div style="padding:8px; text-align:center; background:#f9f9f9; border-top:1px solid #333;">
                                    <button class="btn-login" id="save_${rowId}" 
                                            style="width:auto; padding:6px 12px; font-size:11px; background:var(--green);" 
                                            onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                                        💾 Save LV Visual Checks
                                    </button>
                                </div>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
                checklistHTML += customRowHTML;
                return;
            }

            // Special merged input row for dismantling rows 6, 9, and 12
            const singleInputDismantlingRows = [6, 9, 12];
            if (stage === 'dismantling' && singleInputDismantlingRows.includes(itemCounter)) {
                customRowHTML = `
                    <tr id="${rowId}">
                        <td>${itemCounter}</td>
                        <td>${item.pointPrefixInput ? `<input type="text" id="pointPrefix_${rowId}" ${disabledAttr} placeholder="" style="width: 80px; padding: 3px 5px; border: 1px solid #aaa; border-radius: 3px; font-size: 11px; margin-right: 4px;">` : ''}${item.point}</td>
                        <td colspan="3" style="padding:8px; vertical-align:top;">
                            <input type="text"
                                   id="actualValue_${rowId}"
                                   ${disabledAttr}
                                   placeholder=""
                                   style="width:100%; padding:8px; border:1px solid #ccc; border-radius:3px; font-size:11px;">
                        </td>
                        <td style="padding: 8px; vertical-align:top;">
                            ${remarkCell}
                        </td>
                        <td style="text-align: center; padding: 6px; vertical-align:top;">
                            ${!isCustomer ? `
                                <button class="btn-login"
                                        id="save_${rowId}"
                                        style="width:auto; padding:6px 10px; font-size:11px; background: var(--green); margin-bottom: 5px;"
                                        onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                                    🔄 Update
                                </button>
                                ${isAdmin ? `<br>
                                    <button class="btn-login"
                                            id="lock_${rowId}"
                                            style="width:auto; padding:6px 10px; font-size:11px; background: #e74c3c; margin-top: 5px; display: none;"
                                            onclick="showRowLockDialog('${rowId}')">
                                        🔒 Lock Row
                                    </button>
                                    <br>
                                    <button class="btn-login"
                                            id="rowUnlock_${rowId}"
                                            style="width:auto; padding:6px 10px; font-size:11px; background: #3498db; margin-top: 5px; display: none;"
                                            onclick="showRowUnlockDialog('${rowId}')">
                                        🔓 Unlock Row
                                    </button>
                                ` : ''}
                            ` : ''}
                        </td>
                    </tr>
                `;
            }

            // If a stage-specific handler built a complete row, use it and skip the generic builder
            if (customRowHTML !== null) {
                checklistHTML += customRowHTML;
                return;
            }

            // Determine grid columns for dismantling stage with special row handling
            const specialDismantlingRows = [3, 4, 7, 8, 10, 11, 14, 15, 19];
            const isDismantlingOnlyTechnician = stage === 'dismantling' && specialDismantlingRows.includes(itemCounter);
            const isDismantlingStage = stage === 'dismantling';

            let gridColumns = '1fr 1fr 1fr';
            let signoffHTML = `
                            <div style="border-right: 1px solid #ddd; padding: 8px;">
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px; text-align: center;">Technician</div>
                                ${technicianCell}
                            </div>
                            <div style="border-right: 1px solid #ddd; padding: 8px;">
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px; text-align: center;">Shop Supervisor</div>
                                ${shopSupCell}
                            </div>
                            <div style="padding: 8px;">
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px; text-align: center;">Quality Supervisor</div>
                                ${qaSupCell}
                            </div>
                        `;

            // For dismantling: remove Quality Supervisor column entirely
            if (isDismantlingStage) {
                gridColumns = isDismantlingOnlyTechnician ? '1fr' : '1fr 1fr';
                if (isDismantlingOnlyTechnician) {
                    // Only Technician column for special rows
                    signoffHTML = `
                            <div style="padding: 8px;">
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px; text-align: center;">Technician</div>
                                ${technicianCell}
                            </div>
                        `;
                } else {
                    // Technician and Shop Supervisor for other dismantling rows (no Quality Supervisor)
                    signoffHTML = `
                            <div style="border-right: 1px solid #ddd; padding: 8px;">
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px; text-align: center;">Technician</div>
                                ${technicianCell}
                            </div>
                            <div style="padding: 8px;">
                                <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px; text-align: center;">Shop Supervisor</div>
                                ${shopSupCell}
                            </div>
                        `;
                }
            }

            checklistHTML += `
                    <tr id="${rowId}">
                    <td style="position: relative;">
                        ${itemCounter}
                    </td>
                    <td>${item.pointPrefixInput ? `<input type="text" id="pointPrefix_${rowId}" ${disabledAttr} placeholder="" style="width: 80px; padding: 3px 5px; border: 1px solid #aaa; border-radius: 3px; font-size: 11px; margin-right: 4px;">` : ''}
                        <span ${isAdmin ? `contenteditable="true" onblur="updateMasterData('${stage}', 'point', ${itemCounter - 1}, this.innerText, ${sectionIndex})"` : ''}>
                            ${item.point}
                        </span>
                    </td>
                    <td style="font-size: 11px; color: #555; position: relative; min-width: 100px; padding-right: 25px;">
                        ${specifiedValueCell}
                        ${isEditMode ? `
                            <div style="position: absolute; top: 2px; right: 2px; z-index: 5;">
                                <button onclick="toggleMasterInputType('${stage}', ${sectionIndex}, ${itemIndex}, 'specified')" 
                                        style="font-size: 8px; padding: 1px 3px; background: rgba(238,238,238,0.8); border: 1px solid #ccc; cursor: pointer; border-radius: 2px;"
                                        title="Switch to ${item.specifiedInputType === 'dropdown' ? 'Text' : 'Dropdown'}">
                                    ${item.specifiedInputType === 'dropdown' ? 'Txt' : 'DD'}
                                </button>
                            </div>
                        ` : ''}
                    </td>
                    <td style="padding: 8px; position: relative; min-width: 100px; padding-right: 25px;">
                        ${actualValueCell.includes('<td') ? actualValueCell.replace(/^<td[^>]*>/, '').replace(/<\/td>$/, '') : actualValueCell}
                        ${isEditMode ? `
                            <div style="position: absolute; top: 2px; right: 2px; z-index: 5;">
                                <button onclick="toggleMasterInputType('${stage}', ${sectionIndex}, ${itemIndex}, 'actual')" 
                                        style="font-size: 8px; padding: 1px 3px; background: rgba(238,238,238,0.8); border: 1px solid #ccc; cursor: pointer; border-radius: 2px;"
                                        title="Switch to ${item.actualInputType === 'dropdown' ? 'Text' : 'Dropdown'}">
                                    ${item.actualInputType === 'dropdown' ? 'Txt' : 'DD'}
                                </button>
                            </div>
                        ` : ''}
                    </td>
                    <td style="padding: 0;" colspan="${stage === 'shunt_reactor' ? 3 : 1}">
                        <div style="display: grid; grid-template-columns: ${stage === 'shunt_reactor' ? '1fr 1fr 1fr' : gridColumns}; height: 100%; border-collapse: collapse;">
                            ${stage === 'shunt_reactor' ? `
                                <div style="border-right: 1px solid #ddd; padding: 8px;">
                                    ${technicianCell}
                                </div>
                                <div style="border-right: 1px solid #ddd; padding: 8px;">
                                    ${shopSupCell}
                                </div>
                                <div style="padding: 8px;">
                                    <div style="font-size: 10px; font-weight: bold; margin-bottom: 5px; text-align: center;">Quality</div>
                                    ${qaSupCell}
                                </div>
                            ` : signoffHTML}
                        </div>
                    </td>
                    <td style="padding: 8px;">
                        ${remarkCell}
                    </td>
                    <td style="text-align: center; padding: 6px;">
                        ${!isCustomer ? `
                            <button class="btn-login"
                                    id="save_${rowId}"
                                    style="width:auto; padding:6px 10px; font-size:11px; background: var(--green); margin-bottom: 5px;"
                                    onclick="saveNewChecklistItem('${stage}', ${itemCounter}, '${rowId}')">
                                🔄 Update
                            </button>
                            ${isAdmin ? `<br>
                                <button class="btn-login"
                                        id="lock_${rowId}"
                                        style="width:auto; padding:6px 10px; font-size:11px; background: #e74c3c; margin-top: 5px; display: none;"
                                        onclick="showRowLockDialog('${rowId}')">
                                    🔒 Lock Row
                                </button>
                                <br>
                                <button class="btn-login"
                                        id="rowUnlock_${rowId}"
                                        style="width:auto; padding:6px 10px; font-size:11px; background: #3498db; margin-top: 5px; display: none;"
                                        onclick="showRowUnlockDialog('${rowId}')">
                                    🔓 Unlock Row
                                </button>
                                ${isEditMode ? `
                                    <div style="margin-top: 10px; border-top: 1px dashed #ccc; padding-top: 10px;">
                                        <button class="btn-login" style="width:auto; padding:4px 8px; font-size:10px; background: #e74c3c;" 
                                                onclick="deleteMasterRow('${stage}', ${sectionIndex}, ${itemIndex})">
                                            🗑️ Delete Row
                                        </button>
                                    </div>
                                ` : ''}
                            ` : ''}
                        ` : ''}
                    </td>
                </tr>
                    `;
        });

        checklistHTML += `
                </tbody>
            </table>
            ${isEditMode ? `
                <div style="text-align: right; margin-top: 10px; margin-bottom: 20px;">
                    <button class="btn-login" style="width: auto; padding: 6px 15px; background: #27ae60; font-size: 12px;" 
                            onclick="addMasterRow('${stage}', ${sectionIndex})">
                        ➕ Add New Row to ${section.name} (Clones Layout)
                    </button>
                </div>
            ` : ''}
                    `;
    });
    // Render final content
    if (stage === 'shunt_reactor') {
        content.innerHTML = `
            <div class="checklist-paper" id="stageChecklist_${stage}" style="box-shadow: none;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; border: 1px solid #000;">
                    <tr>
                        <td style="padding: 10px; border-right: 1px solid #000; width: 60%;">
                            <label style="font-weight: bold; font-size: 14px;">W.O. No:</label>
                            <input type="text" id="stageWONo_${stage}" readonly value="${window.currentWO || ''}" 
                                   style="border: none; border-bottom: 1px dotted #000; width: 70%; background: transparent; font-size: 14px; padding-left: 5px;">
                        </td>
                        <td style="padding: 10px; width: 40%;">
                            <label style="font-weight: bold; font-size: 14px;">Date:</label>
                            <input type="text" id="stageDate_${stage}" ${disabledAttr} value="${new Date().toLocaleDateString('en-GB').split('/').join('-')}" 
                                   style="border: none; border-bottom: 1px dotted #000; width: 60%; background: transparent; font-size: 14px; padding-left: 5px;">
                        </td>
                    </tr>
                </table>
                ${checklistHTML}
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn-login" 
                        style="width:auto; padding:10px 20px; font-size:14px; background:var(--red);" 
                        onclick="exportStageChecklistPDF('${stage}')">
                    Download Shunt Reactor PDF
                </button>
            </div>
            ${isEditMode ? `
                <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
                    <button class="btn-login" style="width: auto; padding: 10px 20px; background: #3498db; font-size: 14px;" 
                            onclick="addNewSectionToStage()">
                        ➕ Add New Section Block
                    </button>
                </div>
            ` : ''}
        `;
        // Initialize resizable columns for admin edit mode
        if (isAdmin && isEditMode) {
            setTimeout(() => setupResizableColumns(stage), 80);
        }
        // Initialize block layout overlay (admin split/merge system)
        (function _tryBlkInit(attempts) {
            if (window.BlockLayout) { window.BlockLayout.init(stage); }
            else if (attempts > 0) { setTimeout(() => _tryBlkInit(attempts - 1), 200); }
        })(10);
    } else {
        content.innerHTML = `
                        <h3>${stageInfo.title}</h3>
                            ${stageInfo.subtitle ? `<p style="color: #666; font-size: 14px; margin-bottom: 20px;">${stageInfo.subtitle}</p>` : ''}
            
            <button class="btn-login" 
                    style="width:auto; padding:10px 20px; font-size:14px; background:var(--red); margin:15px 0;" 
                    onclick="exportStageChecklistPDF('${stage}')">
                Download ${stageInfo.title} PDF
            </button>
            
            <div class="checklist-paper" id="stageChecklist_${stage}">
                <h2 style="text-align:center; margin-bottom: 20px;">${stageInfo.title.toUpperCase()}</h2>
                
                <table class="form-table" style="margin-bottom: 15px;">
                    <tr>
                        <td><strong>W.O. No:</strong> <input type="text" id="stageWONo_${stage}" readonly value="${window.currentWO || ''}" style="border:none; border-bottom:1px dotted #000; width:200px; background:transparent;"></td>
                        <td><strong>Date:</strong> <input type="date" id="stageDate_${stage}" ${disabledAttr} value="${new Date().toISOString().split('T')[0]}" style="border:none; border-bottom:1px dotted #000;"></td>
                    </tr>
                </table>
                
                ${checklistHTML}
            </div>
            ${isEditMode ? `
                <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
                    <button class="btn-login" style="width: auto; padding: 10px 20px; background: #3498db; font-size: 14px;" 
                            onclick="addNewSectionToStage()">
                        ➕ Add New Section Block
                    </button>
                </div>
            ` : ''}
        `;
        // Initialize resizable columns for admin edit mode
        if (isAdmin && isEditMode) {
            setTimeout(() => setupResizableColumns(stage), 80);
        }
        // Initialize block layout overlay (admin split/merge system)
        (function _tryBlkInit(attempts) {
            if (window.BlockLayout) { window.BlockLayout.init(stage); }
            else if (attempts > 0) { setTimeout(() => _tryBlkInit(attempts - 1), 200); }
        })(10);
    }
}
/* ===============================
   ADMIN: RESIZABLE COLUMNS & ROWS
================================ */

// Apply saved column/row dimensions from master data to all tables on screen
function applyTableDimensions(stage) {
    const stageData = window.checklistMasterData?.[stage];
    if (!stageData) return;

    const tables = document.querySelectorAll('.form-table');
    tables.forEach((table, tIdx) => {
        // Apply table-layout: fixed so width styles are respected
        table.style.tableLayout = 'fixed';

        const colWidths = stageData.columnWidths?.[tIdx];
        if (colWidths) {
            Object.entries(colWidths).forEach(([colIdxStr, width]) => {
                const colIdx = parseInt(colIdxStr);
                const headers = table.querySelectorAll('th');
                if (headers[colIdx]) headers[colIdx].style.width = width + 'px';
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    if (row.cells[colIdx]) row.cells[colIdx].style.width = width + 'px';
                });
            });
        }

        const rowHeights = stageData.rowHeights?.[tIdx];
        if (rowHeights) {
            const rows = table.querySelectorAll('tr');
            rows.forEach((row, rowIdx) => {
                if (rowHeights[String(rowIdx)] !== undefined) {
                    row.style.height = rowHeights[String(rowIdx)] + 'px';
                }
            });
        }
    });
}

function setupResizableColumns(stage) {
    const tables = document.querySelectorAll('.form-table');

    // First apply saved dimensions
    applyTableDimensions(stage);

    tables.forEach((table, tableIdx) => {
        // Set table-layout: fixed so column widths are enforced
        table.style.tableLayout = 'fixed';

        /* ── COLUMN RESIZE ── */
        const headers = table.querySelectorAll('th');
        headers.forEach((th, colIdx) => {
            if (th.querySelector('.col-resize-handle')) return;
            th.style.position = 'relative';
            th.style.overflow = 'hidden';

            const colHandle = document.createElement('div');
            colHandle.className = 'col-resize-handle';
            colHandle.style.cssText = 'position:absolute;right:0;top:0;width:6px;height:100%;cursor:col-resize;background:rgba(52,152,219,0.5);z-index:20;transition:background 0.15s;';
            colHandle.title = 'Drag to resize column';
            colHandle.addEventListener('mouseenter', () => colHandle.style.background = 'rgba(52,152,219,1)');
            colHandle.addEventListener('mouseleave', () => colHandle.style.background = 'rgba(52,152,219,0.5)');

            colHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const startX = e.clientX;
                const startWidth = th.getBoundingClientRect().width;

                const overlay = document.createElement('div');
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;cursor:col-resize;z-index:99999;';
                document.body.appendChild(overlay);

                function onMove(e) {
                    const newWidth = Math.max(30, startWidth + (e.clientX - startX));
                    th.style.width = newWidth + 'px';
                    const rows = table.querySelectorAll('tr');
                    rows.forEach(row => {
                        if (row.cells[colIdx]) row.cells[colIdx].style.width = newWidth + 'px';
                    });
                }

                async function onUp() {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                    overlay.remove();

                    const finalWidth = Math.round(th.getBoundingClientRect().width);
                    if (!window.checklistMasterData?.[stage]) return;
                    if (!window.checklistMasterData[stage].columnWidths) window.checklistMasterData[stage].columnWidths = {};
                    if (!window.checklistMasterData[stage].columnWidths[tableIdx]) window.checklistMasterData[stage].columnWidths[tableIdx] = {};
                    // Use string key to survive JSON round-trip
                    window.checklistMasterData[stage].columnWidths[tableIdx][String(colIdx)] = finalWidth;
                    await saveMasterLayout();
                    console.log(`✅ Col ${colIdx} width → ${finalWidth}px (saved)`);
                }

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });

            th.appendChild(colHandle);
        });

        /* ── ROW RESIZE ── */
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, rowIdx) => {
            if (row.querySelector('.row-resize-handle')) return;

            const rowHandle = document.createElement('div');
            rowHandle.className = 'row-resize-handle';
            rowHandle.style.cssText = 'position:absolute;left:0;bottom:0;width:100%;height:5px;cursor:row-resize;background:rgba(231,76,60,0.4);z-index:20;transition:background 0.15s;';
            rowHandle.title = 'Drag to resize row';
            row.style.position = 'relative';
            rowHandle.addEventListener('mouseenter', () => rowHandle.style.background = 'rgba(231,76,60,0.9)');
            rowHandle.addEventListener('mouseleave', () => rowHandle.style.background = 'rgba(231,76,60,0.4)');

            rowHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const startY = e.clientY;
                const startHeight = row.getBoundingClientRect().height;

                const overlay = document.createElement('div');
                overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;cursor:row-resize;z-index:99999;';
                document.body.appendChild(overlay);

                function onMove(e) {
                    const newH = Math.max(20, startHeight + (e.clientY - startY));
                    row.style.height = newH + 'px';
                }

                async function onUp() {
                    document.removeEventListener('mousemove', onMove);
                    document.removeEventListener('mouseup', onUp);
                    overlay.remove();

                    const finalH = Math.round(row.getBoundingClientRect().height);
                    if (!window.checklistMasterData?.[stage]) return;
                    if (!window.checklistMasterData[stage].rowHeights) window.checklistMasterData[stage].rowHeights = {};
                    if (!window.checklistMasterData[stage].rowHeights[tableIdx]) window.checklistMasterData[stage].rowHeights[tableIdx] = {};
                    window.checklistMasterData[stage].rowHeights[tableIdx][String(rowIdx)] = finalH;
                    await saveMasterLayout();
                    console.log(`✅ Row ${rowIdx} height → ${finalH}px (saved)`);
                }

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
            });

            // Insert into first cell of row
            if (row.cells[0]) {
                row.cells[0].style.position = 'relative';
                row.cells[0].appendChild(rowHandle);
            }
        });
    });
}
window.setupResizableColumns = setupResizableColumns;
window.applyTableDimensions = applyTableDimensions;


function updateMasterData(stage, type, index, text, sectionIndex) {
    if (!window.checklistMasterData) return;

    if (type === 'section') {
        window.checklistMasterData[stage].sections[index].name = text.trim();
    } else if (type === 'point') {
        if (typeof sectionIndex !== 'undefined') {
            window.checklistMasterData[stage].sections[sectionIndex].items[index].point = text.trim();
        }
    }
}

async function fetchChecklistMaster() {
    try {
        const result = await apiCall('/checklist-master/master', 'GET');
        window.checklistMasterData = result;
        console.log('✅ Checklist Master Data Loaded from Server');
    } catch (err) {
        console.log('⚠️ No server checklist master found or error, using defaults.', err);
        // Fallback to static seed
        if (typeof getStageData === 'function') {
            window.checklistMasterData = getStageData();
        } else if (typeof getMasterStageData === 'function') {
            window.checklistMasterData = getMasterStageData();
        }
    }
    if (typeof renderCustomStages === 'function') {
        renderCustomStages();
    }
}
// NOTE: fetchChecklistMaster() is now called from auth.js after successful login
// to prevent a 401 error on page load before the user has authenticated.

/* ===============================
   DYNAMIC STAGES & SECTIONS
================================ */
function renderCustomStages() {
    const container = document.getElementById('customStagesContainer');
    const addBtn = document.getElementById('addStageBtn');
    if (!container) return;
    
    // Standard stages to ignore
    const standardStages = ['winding1', 'winding2', 'winding3', 'spa', 'coreCoil', 'tanking', 'coreBuilding', 'vpd', 'dismantling', 'dispatch', 'shunt_reactor', 'fos_annexure'];
    
    container.innerHTML = '';
    
    if (window.checklistMasterData) {
        Object.keys(window.checklistMasterData).forEach(key => {
            if (!standardStages.includes(key)) {
                const stageData = window.checklistMasterData[key];
                const btn = document.createElement('button');
                btn.className = 'stage-btn custom-stage-btn';
                btn.textContent = stageData.title || key;
                btn.onclick = function() {
                    showMainStage(key, this);
                };
                container.appendChild(btn);
            }
        });
    }

    // Only admin can add stages
    if (addBtn) {
        addBtn.style.display = (window.currentUserRole === 'admin') ? 'inline-block' : 'none';
    }
}

async function addNewStage() {
    if (window.currentUserRole !== 'admin') {
        alert("Only administrators can add new stages.");
        return;
    }

    const stageName = prompt("Enter new stage name (e.g., Pre-Dispatch Checks):");
    if (!stageName || !stageName.trim()) return;

    const key = stageName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    if (window.checklistMasterData && window.checklistMasterData[key]) {
        alert("A stage with a similar name already exists.");
        return;
    }

    if (!window.checklistMasterData) window.checklistMasterData = {};

    window.checklistMasterData[key] = {
        title: stageName.trim() + " Checklist",
        subtitle: "Custom Stage",
        sections: [
            {
                name: "General Checklist Items",
                items: [
                    { point: "New checklist point", specifiedValue: "" }
                ]
            }
        ]
    };

    renderCustomStages();
    await saveMasterLayout(false);
    alert(`Stage "${stageName}" added successfully.`);
}

function addNewSectionToStage() {
    if (window.currentUserRole !== 'admin' || !window.isEditMode) return;
    
    const stage = window.currentStage;
    if (!stage || !window.checklistMasterData || !window.checklistMasterData[stage]) return;

    const sectionName = prompt("Enter new section name:");
    if (!sectionName || !sectionName.trim()) return;

    window.checklistMasterData[stage].sections.push({
        name: sectionName.trim(),
        items: [
            { point: "New checklist point", specifiedValue: "" }
        ]
    });

    saveMasterLayout(false).then(() => {
        loadStageContent(stage); // Re-render the stage with the new section
    });
}

async function saveMasterLayout(showConfirm = false) {
    if (!window.checklistMasterData) {
        console.warn('No master data to save');
        return;
    }

    if (showConfirm) {
        if (!confirm('Are you sure you want to save this global checklist layout? This will affect all new checklists.')) return;
    }

    if (!window.currentUserId) {
        alert('❌ You must be logged in as Admin to save the layout.');
        return;
    }

    try {
        const res = await apiCall('/checklist-master/master', 'POST', window.checklistMasterData);
        if (showConfirm) alert('✅ Checklist master layout saved successfully!');
        await fetchChecklistMaster();
    } catch (err) {
        console.error('Save master layout error:', err);
        alert('❌ Failed to save layout: ' + err.message);
    }
}

async function addMasterRow(stage, sectionIndex) {
    if (!window.checklistMasterData) return;
    const stageData = window.checklistMasterData[stage];
    if (!stageData) return;

    const section = stageData.sections[sectionIndex];
    if (!section) return;

    // Clone the last item in this section to maintain layout
    const lastItem = section.items[section.items.length - 1];
    let newItem;

    if (lastItem) {
        // deep clone
        newItem = JSON.parse(JSON.stringify(lastItem));
        // Reset values for the new row
        newItem.point = "NEW: " + (newItem.point.includes('<br>') ? newItem.point.split('<br>')[0] : newItem.point);
        newItem.specifiedValue = newItem.specifiedValue || "";
    } else {
        // Fallback for empty sections
        newItem = {
            point: "New Inspection Point",
            specifiedValue: "Enter spec",
            type: "text"
        };
    }

    section.items.push(newItem);

    // Auto-save and reload
    await saveMasterLayout();
    loadStageContent(stage);
}

function toggleEditMode(stage) {
    window.isEditMode = !window.isEditMode;
    console.log(`🛠️ Edit Mode: ${window.isEditMode}`);
    if (stage) loadStageContent(stage);
}

async function deleteMasterRow(stage, sectionIndex, itemIndex) {
    if (!window.checklistMasterData) return;
    if (!confirm('Are you sure you want to delete this row from the master checklist? This will affect all future checklists.')) return;

    const stageData = window.checklistMasterData[stage];
    if (!stageData) return;

    stageData.sections[sectionIndex].items.splice(itemIndex, 1);

    // Auto-save and reload
    await saveMasterLayout();
    loadStageContent(stage);
}

async function toggleMasterInputType(stage, sectionIndex, itemIndex, fieldType) {
    if (!window.checklistMasterData) return;
    const stageData = window.checklistMasterData[stage];
    if (!stageData) return;

    const item = stageData.sections[sectionIndex].items[itemIndex];
    if (!item) return;

    const prop = fieldType === 'specified' ? 'specifiedInputType' : 'actualInputType';
    item[prop] = (item[prop] === 'dropdown' ? 'text' : 'dropdown');

    await saveMasterLayout();
    loadStageContent(stage);
}

/* ===============================
   SHUNT REACTOR: IMPRESSION CHECK
================================ */
function toggleImpression(rowId, phase) {
    if (window.currentUserRole === 'customer') return;
    const diag = document.getElementById(`${phase.toLowerCase()}_diag_${rowId}`);
    if (!diag) return;

    const colors = { 'U': '#3498db', 'V': '#e74c3c', 'W': '#f1c40f' };
    const currentColor = diag.style.background;

    if (currentColor && currentColor !== 'transparent' && currentColor !== '') {
        diag.style.background = 'transparent';
        diag.style.color = colors[phase];
    } else {
        diag.style.background = colors[phase];
        diag.style.color = '#fff';
    }
}


/* ===============================
   PDF EXPORT
================================ */
function exportStageChecklistPDF(stage) {
    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        alert('ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â PDF libraries not loaded. Please refresh the page.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const element = document.getElementById(`stageChecklist_${stage} `);
    if (!element) {
        alert('ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â Checklist content not found!');
        return;
    }

    html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        doc.save(`${stage}_Checklist_${window.currentWO || 'draft'}.pdf`);
    });
}
// ========================================
// AUDIT LOG UI FUNCTIONS
// ========================================
function loadAuditLogs() {
    const entity = document.getElementById('auditEntity').value;
    const entityId = document.getElementById('auditEntityId').value;
    const startDate = document.getElementById('auditStartDate').value;
    const endDate = document.getElementById('auditEndDate').value;

    const resultsDiv = document.getElementById('auditResults');
    resultsDiv.innerHTML = '<p style="text-align:center; color:#666;">Loading audit logs...</p>';

    getAuditLogs(entity, entityId, startDate, endDate)
        .then(response => {
            if (response.success) {
                renderAuditTable(response.data);
            } else {
                resultsDiv.innerHTML = `< p style = "color:red;" > Error: ${response.error}</p > `;
            }
        })
        .catch(error => {
            resultsDiv.innerHTML = `< p style = "color:red;" > Error loading logs: ${error.message}</p > `;
        });
}

function renderAuditTable(logs) {
    const resultsDiv = document.getElementById('auditResults');

    if (!logs || logs.length === 0) {
        resultsDiv.innerHTML = `
                    < div style = "text-align:center; padding:40px; color:#666;" >
                <h3>Ãƒ&deg;Ã…Â¸Ã¢â‚¬Å“Ã‚Â­ No Audit Logs Found</h3>
                <p>Try adjusting your filters or check back later.</p>
            </div >
                    `;
        return;
    }
    const tableHTML = `
                    < div style = "margin-bottom: 15px; color: #666;" >
                        <strong>Total Logs:</strong> ${logs.length}
        </div >
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <thead>
                                <tr style="background: #34495e; color: white;">
                                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Timestamp</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">User</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Role</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Action</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Entity</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Entity ID</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Changes</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${logs.map(log => `
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 12px; border: 1px solid #ddd;">
                                ${new Date(log.timestamp).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}
                            </td>
                            <td style="padding: 12px; border: 1px solid #ddd;">
                                <strong>${log.username}</strong>
                            </td>
                            <td style="padding: 12px; border: 1px solid #ddd;">
                                <span class="role-badge role-${log.role}">${log.role}</span>
                            </td>
                            <td style="padding: 12px; border: 1px solid #ddd;">
                                <span style="
                                    padding: 4px 8px; 
                                    border-radius: 4px; 
                                    font-size: 12px; 
                                    font-weight: bold;
                                    background: ${getActionColor(log.action)};
                                    color: white;
                                ">${log.action}</span>
                            </td>
                            <td style="padding: 12px; border: 1px solid #ddd;">${log.entity}</td>
                            <td style="padding: 12px; border: 1px solid #ddd;"><code>${log.entityId}</code></td>
                            <td style="padding: 12px; border: 1px solid #ddd;">
                                <details>
                                    <summary style="cursor: pointer; color: #3498db;">View Details</summary>
                                    <pre style="
                                        background: #f8f9fa; 
                                        padding: 10px; 
                                        border-radius: 4px; 
                                        margin-top: 10px;
                                        max-height: 200px;
                                        overflow: auto;
                                        font-size: 11px;
                                    ">${JSON.stringify(log.changes, null, 2)}</pre>
                                </details>
                            </td>
                        </tr>
                    `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;

    resultsDiv.innerHTML = tableHTML;
}

function getActionColor(action) {
    const colors = {
        'CREATE': '#27ae60',
        'UPDATE': '#3498db',
        'DELETE': '#e74c3c',
        'APPROVE': '#16a085',
        'REJECT': '#c0392b'
    };
    return colors[action] || '#95a5a6';
}

function clearAuditFilters() {
    document.getElementById('auditEntity').value = '';
    document.getElementById('auditEntityId').value = '';
    document.getElementById('auditStartDate').value = '';
    document.getElementById('auditEndDate').value = '';
    document.getElementById('auditResults').innerHTML = '';
}

// Show audit log menu item only for admin/quality roles
function initializeAuditAccess() {
    const userRole = window.currentUserRole; // ÃƒÂ¢Ã¢â‚¬Â Ã‚Â CHANGED from localStorage
    const auditNav = document.getElementById('auditLogNav');
    const questionsNav = document.getElementById('questionsNav');

    if (auditNav && (userRole === 'admin' || userRole === 'quality')) {
        auditNav.style.display = 'block';
    }
    // Show Questions nav for admin only
    if (questionsNav && userRole === 'admin') {
        questionsNav.style.display = 'block';
    }
}

// Removed duplicate minimal loadStageContent - using the full implementation above (lines 318-699)

// Call this when user logs in (add to existing login success handler)
// Add this line in your existing authentication success code:
// initializeAuditAccess();

// Export to window
window.showTab = showTab;
window.toggleSubmenu = toggleSubmenu;
window.showChecklistStage = showChecklistStage;
window.showMainStage = showMainStage;
window.switchStage = switchStage;
window.loadStageContent = loadStageContent;
window.exportStageChecklistPDF = exportStageChecklistPDF;
window.initializeAuditAccess = initializeAuditAccess;
window.loadAuditLogs = loadAuditLogs;
window.renderAuditTable = renderAuditTable;
window.clearAuditFilters = clearAuditFilters;
// T2.0 admin functions
window.toggleEditMode = toggleEditMode;
window.updateMasterData = updateMasterData;
window.toggleImpression = toggleImpression;
window.deleteMasterRow = deleteMasterRow;
window.addMasterRow = addMasterRow;
window.saveMasterLayout = saveMasterLayout;
window.getStageData = getStageData;

/* ===============================
   QUESTIONS MANAGEMENT – MCQ System
================================ */

var _allQuestions = window._allQuestions || [];
var _currentQFilter = window._currentQFilter || 'all';

// ── Tab switcher ──────────────────────────────────────────────────────────────
function _legacy_switchQTab(tab) {
    ['bank', 'add', 'links', 'results'].forEach(t => {
        const p = document.getElementById(`qpanel-${t}`);
        if (p) p.style.display = (t === tab) ? 'block' : 'none';
    });
    if (tab === 'bank') loadQuestions();
    if (tab === 'links') renderExamLinks();
    if (tab === 'results') loadExamResults();
}

// ── Section filter ────────────────────────────────────────────────────────────
function filterQSection(section) {
    _currentQFilter = section;
    renderQuestionList();
}

// ── Load all questions from server ────────────────────────────────────────────
async function _legacy_loadQuestions() {
    const container = document.getElementById('questionsList');
    if (!container) return;
    container.innerHTML = '<p style="color:#999; padding:20px; text-align:center;">Loading...</p>';
    try {
        const result = await apiCall('/questions');
        _allQuestions = result.data || [];
        renderQuestionList();
    } catch (error) {
        container.innerHTML = `<p style="color:#e74c3c;">❌ Failed to load questions: ${error.message}</p>`;
    }
}

// ── Render filtered question list ─────────────────────────────────────────────
function renderQuestionList() {
    const container = document.getElementById('questionsList');
    if (!container) return;

    const filtered = _currentQFilter === 'all'
        ? _allQuestions
        : _allQuestions.filter(q => q.section === _currentQFilter);

    if (filtered.length === 0) {
        container.innerHTML = '<p style="color:#999; text-align:center; padding:30px;">No questions in this section yet.</p>';
        return;
    }

    const SECTION_COLOR = { winding: '#7c3aed', core: '#0ea5e9', tanking: '#f59e0b' };
    const SECTION_LABEL = { winding: 'Winding', core: 'Core Building', tanking: 'Repacking & Tanking' };

    let html = `<table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead><tr>
            <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:left; width:40px;">#</th>
            <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:left;">Question</th>
            <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center; width:110px;">Section</th>
            <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:left;">Options (A/B/C/D)</th>
            <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center; width:80px;">Answer</th>
            <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center; width:80px;">Delete</th>
        </tr></thead><tbody>`;

    filtered.forEach((q, i) => {
        const color = SECTION_COLOR[q.section] || '#333';
        const label = SECTION_LABEL[q.section] || q.section;
        const opts = q.options || {};
        html += `<tr>
            <td style="border:1px solid #ddd; padding:10px; text-align:center; color:#666;">${i + 1}</td>
            <td style="border:1px solid #ddd; padding:10px;">${q.text}</td>
            <td style="border:1px solid #ddd; padding:10px; text-align:center;">
                <span style="background:${color}22; color:${color}; border:1px solid ${color}44; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:600;">${label}</span>
            </td>
            <td style="border:1px solid #ddd; padding:10px; font-size:12px; color:#444;">
                <b>A:</b> ${opts.A || '—'}<br>
                <b>B:</b> ${opts.B || '—'}<br>
                <b>C:</b> ${opts.C || '—'}<br>
                <b>D:</b> ${opts.D || '—'}
            </td>
            <td style="border:1px solid #ddd; padding:10px; text-align:center;">
                <span style="background:#dcfce7; color:#16a34a; border:1px solid #86efac; padding:4px 12px; border-radius:99px; font-weight:700; font-size:13px;">${q.correctOption}</span>
            </td>
            <td style="border:1px solid #ddd; padding:10px; text-align:center;">
                <button class="btn-login" style="width:auto;padding:4px 10px;font-size:11px;background:#e74c3c;" onclick="deleteQuestion('${q.id}')">🗑</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

// ── Add MCQ question ──────────────────────────────────────────────────────────
async function addQuestion() {
    const section = document.getElementById('qSection')?.value;
    const text = document.getElementById('qText')?.value?.trim();
    const optionA = document.getElementById('qOptA')?.value?.trim();
    const optionB = document.getElementById('qOptB')?.value?.trim();
    const optionC = document.getElementById('qOptC')?.value?.trim();
    const optionD = document.getElementById('qOptD')?.value?.trim();
    const correctOption = document.getElementById('qCorrect')?.value;

    if (!section) return alert('Please select a section.');
    if (!text) return alert('Please enter the question text.');
    if (!optionA || !optionB || !optionC || !optionD) return alert('Please fill in all four options (A, B, C, D).');
    if (!correctOption) return alert('Please select the correct option.');

    try {
        await apiCall('/questions', 'POST', { text, section, optionA, optionB, optionC, optionD, correctOption });

        // Clear form
        ['qText', 'qOptA', 'qOptB', 'qOptC', 'qOptD'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('qSection').value = '';
        document.getElementById('qCorrect').value = '';

        alert('✅ Question added successfully!');
        switchQTab('bank');
    } catch (error) {
        alert('Failed to add question: ' + error.message);
    }
}

// ── Delete question ───────────────────────────────────────────────────────────
async function deleteQuestion(id) {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
        await apiCall(`/questions/${id}`, 'DELETE');
        loadQuestions();
    } catch (error) {
        alert('Failed to delete question: ' + error.message);
    }
}

// ── Render exam links panel ───────────────────────────────────────────────────
async function renderExamLinks() {
    const container = document.getElementById('examLinksContainer');
    if (!container) return;

    container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Loading network info...</p>';

    // Fetch LAN IP from server
    let lanBase = null;
    try {
        const r = await fetch('/api/server-ip');
        const d = await r.json();
        lanBase = d.base; // e.g. http://10.1.19.69:3000
    } catch {} /* fall back to location.origin */

    // Fetch public tunnel URL (from start-public.ps1 / cloudflared)
    let publicBase = null;
    try {
        const pr = await fetch('/api/public-url');
        const pd = await pr.json();
        if (pd.active && pd.url) publicBase = pd.url;
    } catch {} /* no tunnel active */

    const localhostBase = window.location.origin;
    const phoneBase = lanBase || localhostBase; // prefer LAN IP for phone links

    const SECTIONS = [
        { key: 'winding', label: 'Winding', color: '#7c3aed', icon: '🔧' },
        { key: 'core', label: 'Core Building', color: '#0ea5e9', icon: '🏗' },
        { key: 'tanking', label: 'Tanking', color: '#f59e0b', icon: '🛢' }
    ];

    const QR_API = (url) => `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;

    container.innerHTML = `
        ${publicBase ? `
        <div style="background:#f0fdf4; border:2px solid #86efac; border-radius:10px; padding:14px 18px; margin-bottom:14px; font-size:13px;">
            🌐 <strong>Public Internet Mode is ACTIVE!</strong> These links work on <strong>any phone, any WiFi, anywhere.</strong>
            <br><br>📡 Public URL: <code style="background:#fff; padding:2px 8px; border-radius:4px; font-size:12px;">${publicBase}</code>
            &nbsp;&nbsp;<button class="btn-login" style="width:auto;padding:4px 12px;font-size:12px;background:#27ae60;" onclick="navigator.clipboard.writeText('${publicBase}').then(()=>alert('Copied!'))">📋 Copy</button>
        </div>` : ''}
        <div style="background:#e8f4fd; border:1px solid #b3d9f7; border-radius:10px; padding:14px 18px; margin-bottom:18px; font-size:13px;">
            📱 <strong>Same-WiFi links (always available):</strong> These work when the phone is on the <strong>same WiFi</strong> as this computer.
            ${lanBase
        ? `<br><br>✅ LAN link: <code style="background:#fff; padding:2px 8px; border-radius:4px; font-size:12px;">${lanBase}</code>`
        : '<br><br>⚠️ Could not detect LAN IP — showing localhost links (only work on this computer).'
}
        </div>
    ` + SECTIONS.map(s => {
        const qCount = _allQuestions.filter(q => q.section === s.key).length;
        const defaultCount = Math.min(3, qCount); // start with 3 or max available

        // All URLs include ?count= from the start
        const phoneUrl = `${phoneBase}/exam/${s.key}?count=${defaultCount}`;
        const publicUrl = publicBase ? `${publicBase}/exam/${s.key}?count=${defaultCount}` : null;
        const qrUrl = QR_API(publicUrl || phoneUrl);

        return `
        <div style="border:2px solid ${s.color}33; border-radius:12px; padding:20px; background:${s.color}08;" id="section-card-${s.key}">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:24px;">${s.icon}</span>
                    <div>
                        <div style="font-weight:700; font-size:16px; color:${s.color};">${s.label} Section Exam</div>
                        <div style="font-size:12px; color:#666;">${qCount} question${qCount === 1 ? '' : 's'} in bank</div>
                    </div>
                </div>
                <!-- Count setter -->
                <div style="display:flex; align-items:center; gap:8px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:8px 14px;">
                    <label style="font-size:12px; font-weight:600; color:#555; white-space:nowrap;">❓ Questions in exam:</label>
                    <input type="number" id="count-${s.key}" value="${defaultCount}" min="1" max="${qCount || 99}"
                        style="width:60px; padding:6px 8px; border:2px solid ${s.color}55; border-radius:8px; font-size:15px; font-weight:700; text-align:center; color:${s.color}; outline:none;"
                        oninput="updateExamCount('${s.key}', this.value, '${phoneBase}', ${publicBase ? `'${publicBase}'` : 'null'})"
                    >
                    <span style="font-size:11px; color:#999;">/ ${qCount} max</span>
                </div>
            </div>

            <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
                <!-- QR Code -->
                <div style="flex-shrink:0; text-align:center;" id="qr-wrap-${s.key}">
                    <img src="${qrUrl}" alt="QR Code" id="qr-img-${s.key}" style="width:160px;height:160px;border:3px solid ${publicUrl ? '#86efac' : s.color + '33'};border-radius:8px;display:block;">
                    <div style="font-size:11px; margin-top:6px; font-weight:600; color:${publicUrl ? '#16a34a' : '#666'};">${publicUrl ? '🌐 Public — scan from anywhere!' : '📷 Same WiFi only'}</div>
                    <button class="btn-login" style="width:auto;padding:5px 14px;font-size:12px;background:#475569;margin-top:8px;"
                        onclick="(function(k){ const el=document.getElementById('publink-'+k)||document.getElementById('link-'+k); if(!el)return; const url=el.value; const img=document.getElementById('qr-img-'+k); if(img){img.style.opacity='0.4'; img.src='https://api.qrserver.com/v1/create-qr-code/?size=160x160&data='+encodeURIComponent(url); img.onload=function(){img.style.opacity='1';};} })('${s.key}')">
                        🔄 Refresh QR
                    </button>
                </div>

                <!-- Link + buttons -->
                <div style="flex:1; min-width:200px; display:flex; flex-direction:column; gap:10px; justify-content:center;">
                    <div>
                        <div style="font-size:11px; font-weight:600; color:#444; margin-bottom:4px; text-transform:uppercase; letter-spacing:.5px;">📱 Phone / Network Link</div>
                        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                            <input type="text" value="${phoneUrl}" readonly id="link-${s.key}"
                                style="flex:1; min-width:160px; padding:9px 12px; border:1px solid #ddd; border-radius:8px; font-size:12px; background:#f8f8f8; font-family:monospace;">
                            <button class="btn-login" style="width:auto;padding:9px 16px;font-size:13px;background:${s.color};"
                                onclick="navigator.clipboard.writeText(document.getElementById('link-${s.key}').value).then(()=>alert('✅ Link copied! Paste it in the phone browser.'))">
                                📋 Copy
                            </button>
                            <button class="btn-login" style="width:auto;padding:9px 14px;font-size:13px;background:#27ae60;"
                                onclick="window.open(document.getElementById('link-${s.key}').value, '_blank')">
                                🚀 Open
                            </button>
                        </div>
                    </div>

                    ${publicBase ? `
                    <div style="margin-top:4px;">
                        <div style="font-size:11px; font-weight:600; color:#16a34a; margin-bottom:4px; text-transform:uppercase; letter-spacing:.5px;">🌐 Public Internet Link (any phone, any WiFi)</div>
                        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                            <input type="text" value="${publicBase}/exam/${s.key}?count=${defaultCount}" readonly id="publink-${s.key}"
                                style="flex:1; min-width:160px; padding:8px 12px; border:2px solid #86efac; border-radius:8px; font-size:12px; background:#f0fdf4; font-family:monospace;">
                            <button class="btn-login" style="width:auto;padding:8px 14px;font-size:13px;background:#16a34a;"
                                onclick="navigator.clipboard.writeText(document.getElementById('publink-${s.key}').value).then(()=>alert('✅ Public link copied!'))">📋 Copy</button>
                            <button class="btn-login" style="width:auto;padding:8px 12px;font-size:13px;background:#0ea5e9;"
                                onclick="window.open(document.getElementById('publink-${s.key}').value, '_blank')">🚀 Open</button>
                        </div>
                    </div>` : `
                    <div style="font-size:12px; color:#666; background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:8px 12px;">
                        💡 The phone must be on the <strong>same WiFi</strong> as this computer to use the link above.
                        <br>To share with <strong>any phone on any WiFi</strong>, run <code>start-public.ps1</code> from the project folder.
                    </div>`}
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── Live-update link + QR when count changes ──────────────────────────────────
function updateExamCount(sectionKey, rawVal, phoneBase, publicBase) {
    const count = Math.max(1, parseInt(rawVal, 10) || 1);
    const QR_API = (url) => `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;

    const phoneUrl = `${phoneBase}/exam/${sectionKey}?count=${count}`;
    const publicUrl = publicBase ? `${publicBase}/exam/${sectionKey}?count=${count}` : null;
    const qrTarget = publicUrl || phoneUrl;

    // Update LAN link input
    const linkEl = document.getElementById(`link-${sectionKey}`);
    if (linkEl) linkEl.value = phoneUrl;

    // Update public link input + copy button
    const pubLinkEl = document.getElementById(`publink-${sectionKey}`);
    if (pubLinkEl && publicUrl) pubLinkEl.value = publicUrl;

    // Update QR code image
    const qrImg = document.getElementById(`qr-img-${sectionKey}`);
    if (qrImg) qrImg.src = QR_API(qrTarget);
}


async function loadExamResults() {
    const container = document.getElementById('examResultsList');
    if (!container) return;
    container.innerHTML = '<p style="color:#999; padding:20px; text-align:center;">Loading results...</p>';

    try {
        const result = await apiCall('/questions/results');
        const results = result.data || [];

        if (results.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center; padding:30px;">No exam results yet.</p>';
            return;
        }

        const SECTION_LABEL = { winding: 'Winding', core: 'Core Building', tanking: 'Repacking & Tanking' };

        let html = `<table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead><tr>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5;">#</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:left;">Operator</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center;">Section</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center;">Score</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center;">%</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center;">Result</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center;">Date</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center;">Answer Key</th>
            </tr></thead><tbody>`;

        results.forEach((r, i) => {
            const pass = r.percentage >= 60;
            const date = new Date(r.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            const label = SECTION_LABEL[r.section] || r.section;
            html += `<tr>
                <td style="border:1px solid #ddd; padding:10px; text-align:center; color:#666;">${i + 1}</td>
                <td style="border:1px solid #ddd; padding:10px; font-weight:600;">${r.operatorName}</td>
                <td style="border:1px solid #ddd; padding:10px; text-align:center;">${label}</td>
                <td style="border:1px solid #ddd; padding:10px; text-align:center;">${r.score} / ${r.total}</td>
                <td style="border:1px solid #ddd; padding:10px; text-align:center; font-weight:700;">${r.percentage}%</td>
                <td style="border:1px solid #ddd; padding:10px; text-align:center;">
                    <span style="padding:3px 12px; border-radius:99px; font-size:12px; font-weight:700;
                        background:${pass ? '#dcfce7' : '#fee2e2'}; color:${pass ? '#16a34a' : '#dc2626'};">
                        ${pass ? '✓ Pass' : '✗ Fail'}
                    </span>
                </td>
                <td style="border:1px solid #ddd; padding:10px; text-align:center; font-size:12px; color:#666;">${date}</td>
                <td style="border:1px solid #ddd; padding:10px; text-align:center;">
                    <button class="btn-login" style="width:auto;padding:4px 12px;font-size:12px;background:#3498db;" onclick="viewAnswerKey('${r.examId}')">📋 View</button>
                </td>
            </tr>`;
        });
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<p style="color:#e74c3c;">❌ Failed to load results: ${error.message}</p>`;
    }
}

// ── View answer key modal ─────────────────────────────────────────────────────
async function viewAnswerKey(examId) {
    const modal = document.getElementById('answerKeyModal');
    const content = document.getElementById('answerKeyContent');
    if (!modal || !content) return;

    modal.style.display = 'flex';
    content.innerHTML = '<p style="text-align:center; color:#999; padding:30px;">Loading...</p>';

    try {
        const result = await apiCall(`/questions/results/${examId}`);
        const r = result.data;

        let html = `
        <div style="margin-bottom:16px; padding:16px; background:#f8fafc; border-radius:8px; display:flex; gap:30px; flex-wrap:wrap;">
            <div><b>Operator:</b> ${r.operatorName}</div>
            <div><b>Section:</b> ${r.section}</div>
            <div><b>Score:</b> ${r.score} / ${r.total} (${r.percentage}%)</div>
            <div><b>Result:</b> <span style="font-weight:700; color:${r.percentage >= 60 ? '#16a34a' : '#dc2626'}">${r.percentage >= 60 ? 'PASS' : 'FAIL'}</span></div>
            <div><b>Date:</b> ${new Date(r.submittedAt).toLocaleString('en-IN')}</div>
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead><tr>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:left; width:40px;">#</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:left;">Question</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:left;">Operator's Answer</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:left;">Correct Answer</th>
                <th style="border:1px solid #ddd; padding:10px; background:#f5f5f5; text-align:center; width:80px;">Result</th>
            </tr></thead><tbody>`;

        r.answerKey.forEach((a, i) => {
            const opts = a.options || {};
            const bg = a.correct ? '#f0fdf4' : '#fff5f5';
            html += `<tr style="background:${bg};">
                <td style="border:1px solid #ddd; padding:10px; text-align:center; color:#666;">${i + 1}</td>
                <td style="border:1px solid #ddd; padding:10px;">${a.questionText}</td>
                <td style="border:1px solid #ddd; padding:10px;">
                    ${a.chosen ? `<b>${a.chosen}:</b> ${opts[a.chosen] || '—'}` : '<em style="color:#999;">Not answered</em>'}
                </td>
                <td style="border:1px solid #ddd; padding:10px;"><b>${a.correctOption}:</b> ${opts[a.correctOption] || '—'}</td>
                <td style="border:1px solid #ddd; padding:10px; text-align:center;">
                    <span style="padding:3px 10px; border-radius:99px; font-size:11px; font-weight:700;
                        background:${a.correct ? '#dcfce7' : '#fee2e2'}; color:${a.correct ? '#16a34a' : '#dc2626'};">
                        ${a.correct ? '✓' : '✗'}
                    </span>
                </td>
            </tr>`;
        });
        html += '</tbody></table>';
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = `<p style="color:#e74c3c;">❌ Failed to load answer key: ${error.message}</p>`;
    }
}

function closeAnswerKey() {
    const modal = document.getElementById('answerKeyModal');
    if (modal) modal.style.display = 'none';
}


window.addQuestion = addQuestion;
window.deleteQuestion = deleteQuestion;

window.filterQSection = filterQSection;
window.renderExamLinks = renderExamLinks;
window.loadExamResults = loadExamResults;
window.viewAnswerKey = viewAnswerKey;
window.closeAnswerKey = closeAnswerKey;
window.updateExamCount = updateExamCount;

