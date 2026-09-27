document.addEventListener('DOMContentLoaded', () => {
    const marksForm = document.getElementById('marks-form');
    const levelSelect = document.getElementById('level-select');
    const studentSelect = document.getElementById('student-select');
    const subjectSelect = document.getElementById('subject-select');
    const studentMarksInput = document.getElementById('student-marks');
    const marksTeacherBox = document.getElementById('marks-teacher-box');
    const formTradeTitle = document.getElementById('form-trade-title');

    let currentTrade = ""; 

    const rtbCurriculum = {
        SOD: {
            L3: ['HTML_and_CSS_Basics', 'JavaScript_Fundamentals', 'UI_UX_Design', 'Version_Control_Git_GitHub', 'VueJS_Framework'],
            L4: ['PHP_Programming', 'Data_Structures_and_Algorithms', 'Database_Management_MySQL', 'Introduction_to_MVC_Laravel'],
            L5: ['Mobile_Application_Development', 'Blockchain_System_Architecture_Solidity', 'Software_Testing_and_QA', 'Final_Capstone_Project']
        },
        TOR: {
            L3: ['Tour_Guiding_Operations', 'Travel_Agency_Marketing', 'Customer_Care_Hospitality', 'Cultural_Heritage_Tourism'],
            L4: ['Advanced_Tour_Guiding', 'Sustainable_Tourism_Development', 'Destination_Marketing', 'Travel_Agency_Management'],
            L5: ['Hospitality_Management', 'Tourism_Policy_and_Planning', 'Event_Management_Operations', 'Final_Project_Attachment']
        },
        CSA: {
            L3: ['Fundamentals_of_Electricity_Electronics', 'Computer_System_Maintenance', 'Assemble_PCB_and_Computer_Systems', 'Operating_Systems_Configuration'],
            L4: ['Electronic_Circuit_Design', 'SolidWorks_Designs', 'Computer_Network_Maintenance', 'Peripheral_Devices_Troubleshooting'],
            L5: ['Cloud_Infrastructure_Server_Admin', 'Embedded_Systems_and_Microcontrollers', 'Final_Project_Attachment']
        },
        ACC: {
            L3: ['Basics_of_Accounting_Bookkeeping', 'Financial_Mathematics', 'Introduction_to_Business_Economics', 'Business_Law_and_Communication'],
            L4: ['Financial_Accounting', 'Cost_Accounting', 'Taxation_System', 'Computerized_Accounting_QuickBooks'],
            L5: ['Management_Accounting_Auditing', 'Financial_Statements_Analysis', 'Financial_Decision_Making', 'Final_Attachment']
        }
    };

    window.selectTeacherTrade = function(trade) {
        currentTrade = trade;
        document.querySelectorAll('.trade-btn').forEach(btn => btn.classList.remove('active-trade'));
        if (event && event.target) event.target.classList.add('active-trade');

        formTradeTitle.textContent = `Kwinjiza Amanota muri ${trade === 'TOR' ? 'Tourism Operations (TOR)' : trade}`;
        marksTeacherBox.style.display = 'block';

        levelSelect.disabled = false;
        levelSelect.value = "";
        studentSelect.innerHTML = '<option value="">-- Banza uhitemo Level --</option>';
        studentSelect.disabled = true;
        subjectSelect.innerHTML = '<option value="">-- Banza uhitemo Level --</option>';
        subjectSelect.disabled = true;
        studentMarksInput.value = '';
    };

    levelSelect.addEventListener('change', () => {
        const selectedLevel = levelSelect.value;
        if (!selectedLevel || !currentTrade) return;

        const students = getStudents();
        studentSelect.innerHTML = '<option value="">-- Hitamo Umunyeshuri --</option>';
        
        let hasStudents = false;
        students.forEach((student, index) => {
            if (student.trade === currentTrade && student.level === selectedLevel) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = student.name;
                studentSelect.appendChild(option);
                hasStudents = true;
            }
        });

        studentSelect.disabled = false;
        if (!hasStudents) studentSelect.innerHTML = '<option value="">Nta munyeshuri uri muli ' + selectedLevel + '...</option>';

        subjectSelect.innerHTML = '<option value="">-- Hitamo Isomo --</option>';
        const modules = rtbCurriculum[currentTrade][selectedLevel];
        if (modules) {
            modules.forEach(mod => {
                const option = document.createElement('option');
                option.value = mod;
                option.textContent = mod.replace(/_/g, ' '); 
                subjectSelect.appendChild(option);
            });
            subjectSelect.disabled = false;
        }
        studentMarksInput.value = '';
    });

    // LOGIQUE YA AUTO-PREFILL YO KUGIRANGO MWARIMU AKORE UPDATE BITAVUNANYE!
    function checkAndPreFillMarks() {
        const studentIndex = studentSelect.value;
        const subjectKey = subjectSelect.value;

        if (studentIndex !== "" && subjectKey !== "") {
            const students = getStudents();
            const student = students[studentIndex];
            
            if (student.marks && student.marks[subjectKey] !== undefined) {
                // Niba asanganywe amanota, ayazane mu gasanduku ubu!
                studentMarksInput.value = student.marks[subjectKey];
                document.querySelector('#marks-form .btn-submit').textContent = "Vugurura Amanota (Update)";
            } else {
                studentMarksInput.value = '';
                document.querySelector('#marks-form .btn-submit').textContent = "Bika Amanota (Save)";
            }
        }
    }

    studentSelect.addEventListener('change', checkAndPreFillMarks);
    subjectSelect.addEventListener('change', checkAndPreFillMarks);

    if (marksForm) {
        marksForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const studentIndex = studentSelect.value;
            const subjectKey = subjectSelect.value;
            const marksValue = studentMarksInput.value;

            if (studentIndex !== "" && currentTrade !== "") {
                const students = getStudents();
                
                if (!students[studentIndex].marks) students[studentIndex].marks = {};

                // Isimbure cyangwa yandike amanota nshya
                students[studentIndex].marks[subjectKey] = marksValue;
                saveStudents(students); 

                studentMarksInput.value = '';
                document.querySelector('#marks-form .btn-submit').textContent = "Bika Amanota (Save)";
                alert(`Amanota yabitswe/yahinduwe neza!`);
            }
        });
    }
});
