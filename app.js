// Toza LocalStorage gufata amakuru niba ari nshya
function getStudents() {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
}

function saveStudents(students) {
    localStorage.setItem('students', JSON.stringify(students));
}

function calculateAverage(marks) {
    if (!marks || Object.keys(marks).length === 0) return 0;
    let total = 0;
    let count = 0;
    for (let subject in marks) {
        total += parseFloat(marks[subject]);
        count++;
    }
    return (total / count).toFixed(1);
}

function getGrade(average) {
    if (average >= 80) return 'A (Excellent)';
    if (average >= 70) return 'B (Very Good)';
    if (average >= 50) return 'C (Pass)';
    return 'F (Fail)';
}

// ==========================================
// 🔐 LOGIQUE Y'UMUTEKANO (SECURITY ACCESS CONTROL)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Genzura niba umuntu yarinjiye mbere
    checkCurrentAccess();

    // Gufata form yo kwinjira niba ihari
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', handleLoginSubmit);
    }
});

// Guhindura ibice bigaragara mu gihe uhinduye Role kuri Select
function handleRoleChange() {
    const role = document.getElementById('role-select').value;
    const teacherFields = document.getElementById('teacher-credentials');
    const emailInput = document.getElementById('teacher-email');
    const passInput = document.getElementById('teacher-password');

    if (role === 'Teacher') {
        teacherFields.style.display = 'block';
        emailInput.required = true;
        passInput.required = true;
    } else {
        teacherFields.style.display = 'none';
        emailInput.required = false;
        passInput.required = false;
    }
}

// Gucunga login form submission
function handleLoginSubmit(e) {
    e.preventDefault();
    const role = document.getElementById('role-select').value;
    const errorMsg = document.getElementById('security-error');
    errorMsg.innerText = "";

    if (role === 'Student') {
        localStorage.setItem('userRole', 'Student');
        localStorage.setItem('isLoggedIn', 'true');
        applyRoleAccess();
    } else if (role === 'Teacher') {
        const email = document.getElementById('teacher-email').value;
        const password = document.getElementById('teacher-password').value;

        // 🔑 EMAIL NA PASSWORD RUSANGE BY'ABAREZI (Ushobora kubihindura hano)
        const correctEmail = "mwarimu@ikigo.rw";
        const correctPassword = "kenny2026"; 

        if (email === correctEmail && password === correctPassword) {
            localStorage.setItem('userRole', 'Teacher');
            localStorage.setItem('isLoggedIn', 'true');
            applyRoleAccess();
        } else {
            errorMsg.innerText = "Email cyangwa Password by'Abarezi si byo!";
        }
    }
}

// Kugenzura no gushyira mu bikorwa imiterere y'injira
function checkCurrentAccess() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        applyRoleAccess();
    } else {
        // Niba atarinjira, overlay iguma ihari ngo abanze ahitemo
        const overlay = document.getElementById('security-overlay');
        if (overlay) overlay.style.display = 'flex';
    }
}

// Guhisha cyangwa kwerekana ibice bitandukanye hashingiwe kuri Role
function applyRoleAccess() {
    const overlay = document.getElementById('security-overlay');
    if (overlay) overlay.style.display = 'none'; // Hisha login iyo byemewe

    const role = localStorage.getItem('userRole') || 'Student';
    const teacherLinks = document.querySelectorAll('.teacher-link');

    if (role === 'Student') {
        // Hisha ibice umunyeshuri atemerewe gukorera access (Abanyeshuri, Amanota, Amatangazo)
        teacherLinks.forEach(link => link.style.display = 'none');

        // Niba umunyeshuri agerageje gufungura paji z'abarezi bitari mu Dashboard, asubizwe inyuma
        const currentPage = window.location.pathname.split("/").pop();
        const restrictedPages = ['students.html', 'marks.html', 'announcements.html'];
        if (restrictedPages.includes(currentPage)) {
            alert("Ntabwo wemerewe kureba iki gice!");
            window.location.href = 'index.html'; // Subira kuri Dashboard
        }
    } else if (role === 'Teacher') {
        // Emeza ko byose bigaragarira umurezi
        teacherLinks.forEach(link => link.style.display = 'block');
    }
}

// To Logout (Sohoka mu Sisitemu)
function logoutSystem() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
}
