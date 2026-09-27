document.addEventListener('DOMContentLoaded', () => {
    const annForm = document.getElementById('ann-form') || document.getElementById('announcement-form');
    const annList = document.getElementById('announcements-list');

    function getAnns() { return JSON.parse(localStorage.getItem('anns')) || []; }
    function saveAnns(anns) { localStorage.setItem('anns', JSON.stringify(anns)); }

    function displayAnns() {
        const anns = getAnns();
        annList.innerHTML = anns.length === 0 ? '<p style="text-align:center; color:#64748b;">Nta matangazo arahari.</p>' : '';
        anns.reverse().forEach(ann => {
            const div = document.createElement('div');
            div.style = 'background:white; padding:20px; border-radius:8px; margin-bottom:15px; box-shadow:0 2px 4px rgba(0,0,0,0.05);';
            div.innerHTML = `<h3>📢 ${ann.title}</h3><p style="color:#64748b; font-size:13px; margin:5px 0;">Yashizweho: ${ann.date}</p><p style="margin-top:10px; color:#334155;">${ann.content}</p>`;
            annList.appendChild(div);
        });
    }

    if(annForm) {
        annForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('ann-title').value;
            const content = document.getElementById('ann-content').value;
            const anns = getAnns();
            anns.push({ title, content, date: new Date().toLocaleDateString('rw-RW') });
            saveAnns(anns);
            annForm.reset();
            displayAnns();
            alert('Itangazo ryashyizweho!');
        });
    }
    displayAnns();
});
