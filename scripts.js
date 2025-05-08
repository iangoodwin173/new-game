let currentLevelIndex = 0;
const totalLevels = 10;

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
  showQuestion();
}

document.addEventListener('DOMContentLoaded', () => {
  const utcDateString = new Date().toISOString().split("T")[0]; // e.g. "2025-05-08"
  const lastPlayed = localStorage.getItem("lastPlayedDate");

  if (lastPlayed === utcDateString) {
    // Already played today
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <h1>Faux Fact</h1>
      <p>You’ve already played today’s challenge.</p>
      <p>Come back tomorrow for a new set of facts!</p>
    `;
    main.style.display = 'block';
    document.getElementById('modal').style.display = 'none';
  } else {
    // Not played today — wait for play button
    document.getElementById('playButton').addEventListener('click', () => {
      localStorage.setItem("lastPlayedDate", utcDateString);
      closeModal();
    });
  }
});

function getRandomFacts() {
  const shuffledReal = [...realFacts].sort(() => Math.random() - 0.5);
  const shuffledFake = [...fakeFacts].sort(() => Math.random() - 0.5);

  const facts = [
    ...shuffledReal.slice(0, 3).map(fact => ({ text: fact, isFake: false })),
    { text: shuffledFake[0], isFake: true }
  ];

  return facts.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  const factList = document.getElementById('fact-list');
  const feedback = document.getElementById('feedback');

  factList.innerHTML = '';
  feedback.classList.add('hidden');
  feedback.textContent = '';

  document.querySelector('h1').textContent = `Level ${currentLevelIndex + 1}`;

  const facts = getRandomFacts();

  facts.forEach((fact) => {
    const li = document.createElement('li');
    li.textContent = fact.text;
    li.addEventListener('click', () => handleAnswer(fact, li, facts));
    factList.appendChild(li);
  });
}

function handleAnswer(selectedFact, selectedElement, facts) {
  const feedback = document.getElementById('feedback');
  const allItems = document.querySelectorAll('#fact-list li');

  const correctFact = facts.find(f => f.isFake);

  // Disable all answers
  allItems.forEach((li, i) => {
    li.style.pointerEvents = 'none';
    if (facts[i].isFake) {
      li.classList.add('correct');
    }
  });

  if (selectedFact.isFake) {
    feedback.textContent = "🎉 Correct! Moving to the next level...";
    feedback.style.color = "#10b981";
    feedback.classList.remove('hidden');

    setTimeout(() => {
      currentLevelIndex++;
      if (currentLevelIndex < totalLevels) {
        showQuestion();
      } else {
        feedback.textContent = "🏆 You made it to the end! You're a fact master!";
        feedback.style.color = "#10b981";
      }
    }, 1500);
  } else {
    selectedElement.classList.add('incorrect');
    feedback.textContent = `❌ Incorrect! You made it to: Level ${currentLevelIndex + 1}`;
    feedback.style.color = "#ef4444";
    feedback.classList.remove('hidden');
  }
}

// Theme toggle
const themeToggle = document.getElementById("theme-switch");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});
