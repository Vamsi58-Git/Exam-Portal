document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-test');
  const qArea = document.getElementById('question-area');
  const timerEl = document.getElementById('timer');
  const submitBtn = document.getElementById('submit-test');
  const detailsForm = document.getElementById('test-details');

  const questions = [
    { id: 1, q: "What is DBMS full form?", opts: ["Data Base Management System", "Dynamic Binary...", "Document Base...", "Data Backup..."], ans: 0 },
    { id: 2, q: "Which language is used for web structure?", opts: ["C++", "Python", "HTML", "Assembly"], ans: 2 },
    { id: 3, q: "Which is not OOP concept?", opts: ["Inheritance", "Polymorphism", "Looping", "Abstraction"], ans: 2 }
  ];

  let idx = 0, answers = {}, timeLeft = 1800, timer;

  function renderQ() {
    const q = questions[idx];
    qArea.innerHTML = `
      <div><strong>Q${idx + 1}.</strong> ${q.q}</div>
      <div>
        ${q.opts.map((o, i) =>
          `<div class="option ${answers[q.id] === i ? 'selected' : ''}" data-i="${i}">
            ${String.fromCharCode(65 + i)}. ${o}
          </div>`
        ).join('')}
      </div>
      <div>
        <button class="btn" ${idx === 0 ? 'disabled' : ''} id="prev">Previous</button>
        <button class="btn" id="${idx < questions.length - 1 ? 'next' : 'finish'}">
          ${idx < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    `;

    qArea.querySelectorAll('.option').forEach(o => o.onclick = () => {
      answers[q.id] = +o.dataset.i;
      renderQ();
    });

    qArea.querySelector('#next')?.addEventListener('click', () => { idx++; renderQ(); });
    qArea.querySelector('#prev')?.addEventListener('click', () => { idx--; renderQ(); });
    qArea.querySelector('#finish')?.addEventListener('click', finalize);
  }

  function startTimer() {
    timerEl.textContent = formatTime(timeLeft);
    timer = setInterval(() => {
      if (--timeLeft <= 0) {
        finalize();
      } else {
        timerEl.textContent = formatTime(timeLeft);
      }
    }, 1000);
  }

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function finalize() {
    clearInterval(timer);
    const score = questions.filter(q => answers[q.id] === q.ans).length;
    alert(`You scored ${score} out of ${questions.length}`);
  }

  startBtn.onclick = () => {
    if (!detailsForm.roll.value || !detailsForm.name.value) {
      return alert('Please fill all required details.');
    }
    startBtn.disabled = true;
    document.getElementById('test-details-wrap').style.display = 'none';
    document.getElementById('test-run-wrap').style.display = 'block';
    renderQ();
    startTimer();
  };

  submitBtn.onclick = () => {
    if (confirm('Submit test?')) {
      finalize();
    }
  };
});
