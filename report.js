document.addEventListener('DOMContentLoaded', () => {
    const listsArea = document.getElementById('lists-area');
    const reportPopup = document.getElementById('report-card-popup');

    const tables = {
        L3: document.getElementById('table-L3'),
        L4: document.getElementById('table-L4'),
        L5: document.getElementById('table-L5')
    };

    let selectedStudent = null; // Ifata umunyeshuri uri kurebwa ubu

    // 1. Uburyo bwo kuzana no gutonda abanyeshuri hakurikijwe Trade yakanze
    window.viewTradeReports = function(trade) {
        // Guhatira buto kwaka (Active tab)
        document.querySelectorAll('.trade-btn').forEach(btn => btn.classList.remove('active-trade'));
        if (event && event.target) event.target.classList.add('active-trade');

        listsArea.style.display = 'block';
        reportPopup.style.display = 'none'; // Siba indangamanota yari ifunguye mbanziriza

        const students = getStudents(); // Ituruka muri app.js
        
        // Siba ibirimo mu mbonerahamwe zose z'ama levels ubanze (Reset)
        for (let lvl in tables) {
            tables[lvl].innerHTML = `<tr><td colspan="4" style="text-align:center; color:#64748b;">Nta munyeshuri urandikwa muri iyi Level...</td></tr>`;
        }

        // Amadosiye y'agateganyo yo gukoranyirizamo abanyeshuri bagabanyije mu ma Levels
        let grouped = { L3: [], L4: [], L5: [] };

        students.forEach((student, originalIndex) => {
            if (student.trade === trade) {
                // Kubara impuzandengo ye niba afite amanota
                let avg = 0;
                if (student.marks && Object.keys(student.marks).length > 0) {
                    avg = parseFloat(calculateAverage(student.marks));
                }

                grouped[student.level].push({
                    id: originalIndex,
                    name: student.name,
                    average: avg,
                    grade: getGrade(avg)
                });
            }
        });

        // Gutondekanya abanyeshuri muri buri Level kuva ku wa mbere (High Average to Low)
        for (let lvl in grouped) {
            if (grouped[lvl].length > 0) {
                grouped[lvl].sort((a, b) => b.average - a.average); // LOGIQUE YO GUTONDA KUVA KU WA MBERE!
                
                tables[lvl].innerHTML = ''; // Siba ya nyandiko ya "Nta kirimo"
                
                grouped[lvl].forEach((student, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td><strong># ${index + 1}</strong></td>
                        <td><span class="student-link" onclick="openStudentReport(${student.id})">${student.name}</span></td>
                        <td><strong style="color:#10b981;">${student.average}%</strong></td>
                        <td><span style="font-weight:600; color:${student.average >= 50 ? '#10b981':'#ef4444'}">${student.average >= 50 ? 'Yatsinze':'Yatsinzwe'}</span></td>
                    `;
                    tables[lvl].appendChild(tr);
                });
            }
        }
    };

    // 2. Gufungura Indangamanota y'Umunyeshuri unyuze ku kanda ku izina rye
    window.openStudentReport = function(originalIndex) {
        const student = getStudents()[originalIndex];
        selectedStudent = student;

        document.getElementById('rep-name').textContent = student.name;
        document.getElementById('rep-trade').textContent = student.trade;
        document.getElementById('rep-level').textContent = student.level;

        const tableBody = document.getElementById('rep-table-body');
        tableBody.innerHTML = '';

        let marks = student.marks || {};
        if (Object.keys(marks).length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red; font-weight:bold;">Nta manota na kamwe karashyirwa kuri uyu munyeshuri na mwarimu!</td></tr>';
            document.getElementById('rep-average').textContent = '0%';
            document.getElementById('rep-grade').textContent = 'N/A';
            reportPopup.style.display = 'block';
            reportPopup.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Shushanya amasomo (Modules) n'amanota yabyo
        for (let subject in marks) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${subject.replace(/_/g, ' ')}</td>
                <td><strong>${marks[subject]}%</strong></td>
                <td>${getGrade(marks[subject])}</td>
            `;
            tableBody.appendChild(tr);
        }

        const avg = calculateAverage(marks);
        document.getElementById('rep-average').textContent = avg + '%';
        document.getElementById('rep-grade').textContent = getGrade(avg);

        reportPopup.style.display = 'block';
        reportPopup.scrollIntoView({ behavior: 'smooth' }); // Hatira paji kumanuka hasi umwarimu ahite ayibona vuba
    };

    // 3. Logique yo gukora no gukura (Download) PDF y'indangamanota
    window.downloadReportPDF = function() {
        if (!selectedStudent) return;
        
        const element = document.getElementById('report-pdf-area');
        const options = {
            margin:       10,
            filename:     `Report_Card_${selectedStudent.name.replace(/ /g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save();
    };
});
