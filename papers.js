document.addEventListener('DOMContentLoaded', () => {
    const paperForm = document.getElementById('paper-form');

    const containers = {
        SWD: document.getElementById('container-SWD'),
        CSA: document.getElementById('container-CSA'),
        Tourism: document.getElementById('container-Tourism'),
        Accounting: document.getElementById('container-Accounting')
    };

    // Imfashanyamakuru y'agateganyo yo kubika amakuru muri session
    let sessionPapers = JSON.parse(sessionStorage.getItem('local_papers')) || [];

    function displayPapers() {
        // Toza amashami yose kwerekana "Nta kirimo" mbanziriza
        for (let trade in containers) {
            if (containers[trade]) {
                containers[trade].innerHTML = `<p style="color:#64748b; font-size:14px; grid-column: 1/-1;">Nta kizamini kirashyirwaho muri iri shami.</p>`;
            }
        }

        let counts = { SWD: 0, CSA: 0, Tourism: 0, Accounting: 0 };

        sessionPapers.forEach((paper, index) => {
            const targetContainer = containers[paper.trade];
            
            if (targetContainer) {
                if (counts[paper.trade] === 0) {
                    targetContainer.innerHTML = '';
                }
                counts[paper.trade]++;

                const card = document.createElement('div');
                card.className = 'paper-card';
                card.innerHTML = `
                    <h3 style="font-size:16px; color:#0f172a;">📝 ${paper.title}</h3>
                    <p style="margin: 5px 0; color:#64748b; font-size:13px;"><strong>Umwaka:</strong> ${paper.year}</p>
                    <a href="${paper.fileUrl}" download="${paper.fileName}" class="btn-download">📥 Download</a>
                    <button onclick="deletePaper(${index})" style="background:none; color:#ef4444; border:none; cursor:pointer; font-size:12px; margin-top:10px; display:inline-block;">Siba</button>
                `;
                targetContainer.appendChild(card);
            }
        });
    }

    if (paperForm) {
        paperForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('paper-title').value.trim();
            const trade = document.getElementById('paper-trade').value;
            const year = document.getElementById('paper-year').value;
            const fileInput = document.getElementById('paper-file');
            
            if (fileInput.files.length === 0) return;
            const file = fileInput.files[0];

            // Kurema Blob URL y'agateganyo itemba neza cyane idafite umupaka wa MB!
            const objectUrl = URL.createObjectURL(file);

            sessionPapers.push({
                title: title,
                trade: trade,
                year: year,
                fileUrl: objectUrl,
                fileName: file.name
            });

            sessionStorage.setItem('local_papers', JSON.stringify(sessionPapers));
            paperForm.reset();
            displayPapers();
            alert('Ikizamini cyashyizwe munsi ya ' + trade + ' neza!');
        });
    }

    window.deletePaper = function(index) {
        if (confirm('Ese urashaka gusiba iki kizamini?')) {
            sessionPapers.splice(index, 1);
            sessionStorage.setItem('local_papers', JSON.stringify(sessionPapers));
            displayPapers();
        }
    };

    displayPapers();
});
