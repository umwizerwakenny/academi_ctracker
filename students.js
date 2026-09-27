document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('student-form');
    const listsArea = document.getElementById('student-lists-area');
    
    const tables = {
        L3: document.getElementById('tbody-L3'),
        L4: document.getElementById('tbody-L4'),
        L5: document.getElementById('tbody-L5')
    };

    let editIndex = null;
    let activeTradeView = ""; // Ifata trade turi kureba ubu

    window.filterStudentLists = function(trade) {
        activeTradeView = trade;
        document.querySelectorAll('.trade-btn').forEach(btn => btn.classList.remove('active-trade'));
        if(event && event.target) event.target.classList.add('active-trade');

        listsArea.style.display = 'block';
        renderCategorizedStudents();
    };

    function renderCategorizedStudents() {
        if (!activeTradeView) return;

        // Reset tables zose
        for (let lvl in tables) {
            tables[lvl].innerHTML = `<tr><td colspan="3" style="text-align:center; color:#64748b;">Nta munyeshuri urandikwa...</td></tr>`;
        }

        const students = getStudents();
        let counts = { L3: 0, L4: 0, L5: 0 };

        students.forEach((student, originalIndex) => {
            if (student.trade === activeTradeView) {
                const targetTable = tables[student.level];
                if (targetTable) {
                    if (counts[student.level] === 0) targetTable.innerHTML = '';
                    counts[student.level]++;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${counts[student.level]}</td>
                        <td><strong>${student.name}</strong></td>
                        <td>
                            <button onclick="editStudent(${originalIndex})" style="background:#f59e0b; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-right:5px;">Hindura</button>
                            <button onclick="deleteStudent(${originalIndex})" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Siba</button>
                        </td>
                    `;
                    targetTable.appendChild(tr);
                }
            }
        });
    }

    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('student-name').value.trim();
            const trade = document.getElementById('student-trade').value;
            const level = document.getElementById('student-level').value;

            const students = getStudents();

            if (editIndex === null) {
                students.push({ name, trade, level, marks: {} });
                alert('Umunyeshuri yanditswe neza!');
            } else {
                students[editIndex].name = name;
                students[editIndex].trade = trade;
                students[editIndex].level = level;
                alert('Amakuru yahinduwe neza!');
                editIndex = null;
                document.querySelector('.form-section .btn-submit').textContent = "Bika Umunyeshuri";
            }

            saveStudents(students);
            studentForm.reset();
            activeTradeView = trade; // Hata paji kwerekana iyo trade yanditswemo
            renderCategorizedStudents();
        });
    }

    window.editStudent = function(index) {
        const students = getStudents();
        document.getElementById('student-name').value = students[index].name;
        document.getElementById('student-trade').value = students[index].trade;
        document.getElementById('student-level').value = students[index].level;
        
        editIndex = index;
        document.querySelector('.form-section .btn-submit').textContent = "Vugurura (Update)";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
const teacher = JSON.parse(localStorage.getItem('activeTeacher'));
logActivity(teacher.name, `Yanditse umunyeshuri mushya witwa: ${name}`);

    window.deleteStudent = function(index) {
        if (confirm('Ese urashaka gusiba uyu munyeshuri?')) {
            const students = getStudents();
            students.splice(index, 1);
            saveStudents(students);
            renderCategorizedStudents();
        }
    };
});
