document.addEventListener('DOMContentLoaded', () => {
    const students = getStudents();
    
    const totalStudentsEl = document.getElementById('total-students');
    const schoolAverageEl = document.getElementById('school-average');
    const failingStudentsEl = document.getElementById('failing-students');
    const topStudentsList = document.getElementById('top-students-list');

    // 1. Umubare w'abanyeshuri bose
    totalStudentsEl.textContent = students.length;

    let totalClassMarks = 0;
    let studentsWithMarksCount = 0;
    let failingCount = 0;
    let ratedStudents = [];

    students.forEach(student => {
        const avg = parseFloat(calculateAverage(student.marks));
        
        if (Object.keys(student.marks).length > 0) {
            totalClassMarks += avg;
            studentsWithMarksCount++;
            
            if (avg < 50) {
                failingCount++;
            }
            
            ratedStudents.push({
                name: student.name,
                trade: student.trade,
                average: avg,
                grade: getGrade(avg)
            });
        }
    });

    // 2. Impuzandengo y'ikigo
    if (studentsWithMarksCount > 0) {
        schoolAverageEl.textContent = (totalClassMarks / studentsWithMarksCount).toFixed(1) + '%';
    } else {
        schoolAverageEl.textContent = '0%';
    }

    // 3. Abatsinzwe
    failingStudentsEl.textContent = failingCount;

    // 4. Guhitamo Top 5 students (Kurutisha kuva ku hejuru)
    ratedStudents.sort((a, b) => b.average - a.average);
    const top5 = ratedStudents.slice(0, 5);

    if (top5.length > 0) {
        topStudentsList.innerHTML = '';
        top5.forEach((student, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.trade}</td>
                <td><strong style="color:#10b981;">${student.average}%</strong></td>
                <td>${student.grade}</td>
            `;
            topStudentsList.appendChild(tr);
        });
    }
});
