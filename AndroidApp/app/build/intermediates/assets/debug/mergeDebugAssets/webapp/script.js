/*
 * script.js (Android asset)
 *
 * The same JavaScript used in the web version of the 10K Beginner Training
 * Tracker. It manages rendering of the plan, editing, progress tracking and
 * pause/resume functionality. State is stored in the WebView's local
 * storage so progress persists across app restarts.
 */

const DEFAULT_PLAN = [
  { week: 1, days: [
    'Rest',
    '35 minutes Easy Run',
    'Workout No 1',
    '45 minutes Easy Run',
    'Workout No 2',
    'Rest/Foam Rolling',
    '70 minutes Easy Run']
  },
  { week: 2, days: [
    'Rest',
    '35 minutes Easy Run',
    'Workout No 1',
    '45 minutes Easy Run',
    'Workout No 2',
    'Rest/Foam Rolling',
    '70 minutes Easy Run']
  },
  { week: 3, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 1',
    '45 minutes Easy Run',
    'Workout No 3',
    'Rest/Foam Rolling',
    '70 minutes Easy Run']
  },
  { week: 4, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 1',
    '45 minutes Easy Run',
    'Workout No 3',
    'Rest/Foam Rolling',
    '70 minutes Easy Run']
  },
  { week: 5, days: [
    'Rest',
    '45 minutes Easy Run',
    'Rest/Foam Rolling',
    '15 minutes Easy Run + (1 minute Uphill/ Flyover Sprint and Downhill Walk) × 8',
    'Rest/Foam Rolling',
    'Workout No 3',
    '80 minutes Easy Run']
  },
  { week: 6, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 2',
    '45 minutes Easy Run',
    'Workout No 3',
    'Rest/Foam Rolling',
    '80 minutes Easy Run']
  },
  { week: 7, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 2',
    '45 minutes Easy Run',
    'Workout No 3',
    'Rest/Foam Rolling',
    '80 minutes Easy Run']
  },
  { week: 8, days: [
    'Rest',
    '45 minutes Easy Run',
    'Rest/Foam Rolling',
    '15 minutes Easy Run + (1 minute Uphill/ Flyover Sprint and Downhill Walk) × 8',
    'Rest/Foam Rolling',
    'Workout No 3',
    '70 minutes Easy Run']
  },
  { week: 9, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 2',
    '45 minutes Easy Run',
    'Workout No 3',
    'Rest/Foam Rolling',
    '80 minutes Easy Run']
  },
  { week: 10, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 1',
    '45 minutes Easy Run',
    'Workout No 2',
    'Rest/Foam Rolling',
    '90 minutes Easy Run']
  },
  { week: 11, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 1',
    '45 minutes Easy Run',
    'Workout No 2',
    'Rest/Foam Rolling',
    '80 minutes Easy Run']
  },
  { week: 12, days: [
    'Rest',
    '45 minutes Easy Run',
    'Rest/Foam Rolling',
    '15 minutes Easy Run + (1 minute Uphill/ Flyover Sprint and Downhill Walk) × 8',
    'Rest/Foam Rolling',
    'Workout No 3',
    '80 minutes Easy Run']
  },
  { week: 13, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 1',
    '45 minutes Easy Run',
    'Workout No 3',
    'Rest/Foam Rolling',
    '90 minutes Easy Run']
  },
  { week: 14, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 1',
    '45 minutes Easy Run',
    'Workout No 2',
    'Rest/Foam Rolling',
    '80 minutes Easy Run']
  },
  { week: 15, days: [
    'Rest',
    '45 minutes Easy Run',
    'Workout No 2',
    '45 minutes Easy Run',
    'Workout No 3',
    'Rest/Foam Rolling',
    '80 minutes Easy Run']
  },
  { week: 16, days: [
    'Rest',
    '45 minutes Easy Run',
    'Rest/Foam Rolling',
    '45 minutes Easy Run',
    'Rest/Foam Rolling',
    'Rest/Foam Rolling',
    '70 minutes Easy Run']
  },
  { week: 17, days: [
    'Rest',
    '45 minutes Easy Run',
    'Rest/Foam Rolling',
    '45 minutes Easy Run',
    'Rest/Foam Rolling',
    'Rest/Foam Rolling',
    '60 minutes Easy Run']
  },
  { week: 18, days: [
    'Rest',
    '35 minutes Easy Run',
    'Rest/Foam Rolling',
    '35 minutes Easy Run',
    'Rest/Foam Rolling',
    'Rest/Foam Rolling',
    'RACE DAY']
  }
];

const WORKOUT_DETAILS = {
  warmup: {
    title: 'Warm‑Up Routine',
    items: [
      { name: 'Toe Walk', link: 'https://youtu.be/S97dOr-Kb50' },
      { name: 'Heel Walk', link: 'https://youtu.be/JQ6t4dBIPo0' },
      { name: 'Butt Kicks', link: 'https://youtu.be/vXVPvY1UbJI' },
      { name: 'Hip Circles', link: 'https://youtu.be/yFi1FDOFXq0' },
      { name: 'Leg Swings', link: 'https://youtu.be/0AxnU-Q9HVs' }
    ],
    note: 'Perform each movement for 30–60 seconds as part of your warm‑up routine.'
  },
  workout1: {
    title: 'Workout No 1',
    items: [
      { name: 'Squat – 12 reps × 3 sets', link: 'https://youtu.be/YaXPRqUwItQ' },
      { name: 'Calf Raise – 12 reps × 3 sets', link: 'https://youtu.be/c5Kv6-fnTj8' },
      { name: 'Lunges – 12 reps × 3 sets', link: 'https://youtu.be/wrwwXE_x-pQ' }
    ],
    note: 'Rest 1–2 minutes between each set.'
  },
  workout2: {
    title: 'Workout No 2',
    items: [
      { name: 'Frog Bridge – 10 reps × 3 sets', link: 'https://youtu.be/aqtXNYdY9VE' },
      { name: 'Glute Bridge – 10 reps × 3 sets', link: 'https://youtu.be/YRqoIM0u0PY' },
      { name: 'Butt Scoot – 10 reps forward & backward × 3 sets', link: 'https://youtu.be/ch8zF3_ny4k' }
    ],
    note: 'Rest 1–2 minutes between each set.'
  },
  workout3: {
    title: 'Workout No 3',
    items: [
      { name: 'Side Lying Leg Raise – 14 reps × 3 sets', link: 'https://youtu.be/-rDiQXjeXO0' },
      { name: 'Clamshell – 14 reps × 3 sets', link: 'https://youtu.be/-xFPT4CGJFY' },
      { name: 'Fire Hydrant – 14 reps × 3 sets', link: 'https://youtu.be/X5iIUqd_U7k' }
    ],
    note: 'Rest 1–2 minutes between each set.'
  },
  foamrolling: {
    title: 'Foam Rolling',
    items: [
      { name: 'Full body foam rolling routine', link: 'https://youtu.be/S4ASJs6CGNE' }
    ],
    note: 'Use a foam roller regularly for better recovery.'
  }
};

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

let trainingPlan = [];
let completionState = {};
let paused = false;

function init() {
  const storedPlan = localStorage.getItem('trainingPlan');
  trainingPlan = storedPlan ? JSON.parse(storedPlan) : JSON.parse(JSON.stringify(DEFAULT_PLAN));
  const storedCompletion = localStorage.getItem('completionState');
  completionState = storedCompletion ? JSON.parse(storedCompletion) : {};
  paused = localStorage.getItem('paused') === 'true';
  renderPlanTable();
  renderProgressBar();
  renderWorkouts();
  updatePausedUI();
  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  document.getElementById('resetBtn').addEventListener('click', resetProgress);
}

function renderPlanTable() {
  const container = document.getElementById('plan-container');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.classList.add('plan-table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const emptyTh = document.createElement('th');
  emptyTh.textContent = 'Week';
  headerRow.appendChild(emptyTh);
  DAY_NAMES.forEach(dayName => {
    const th = document.createElement('th');
    th.textContent = dayName;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  trainingPlan.forEach((weekObj, weekIdx) => {
    const tr = document.createElement('tr');
    const weekTd = document.createElement('th');
    weekTd.textContent = 'Week ' + weekObj.week;
    tr.appendChild(weekTd);
    weekObj.days.forEach((activity, dayIdx) => {
      const td = document.createElement('td');
      const key = `${weekIdx}-${dayIdx}`;
      if (completionState[key]) {
        td.classList.add('completed');
      }
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('cell-content');
      contentDiv.contentEditable = true;
      contentDiv.innerText = activity;
      contentDiv.addEventListener('blur', (e) => {
        trainingPlan[weekIdx].days[dayIdx] = e.target.innerText.trim();
        localStorage.setItem('trainingPlan', JSON.stringify(trainingPlan));
      });
      td.appendChild(contentDiv);
      const checkboxWrapper = document.createElement('div');
      checkboxWrapper.classList.add('checkbox-wrapper');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!completionState[key];
      checkbox.disabled = paused;
      checkbox.addEventListener('change', (e) => {
        completionState[key] = e.target.checked;
        if (e.target.checked) {
          td.classList.add('completed');
        } else {
          td.classList.remove('completed');
        }
        localStorage.setItem('completionState', JSON.stringify(completionState));
        renderProgressBar();
      });
      checkboxWrapper.appendChild(checkbox);
      td.appendChild(checkboxWrapper);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

function renderProgressBar() {
  let total = 0;
  let done = 0;
  trainingPlan.forEach((week, weekIdx) => {
    week.days.forEach((activity, dayIdx) => {
      if (activity.trim() !== '') {
        total += 1;
        const key = `${weekIdx}-${dayIdx}`;
        if (completionState[key]) done += 1;
      }
    });
  });
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const fill = document.getElementById('progress-fill');
  fill.style.width = percent + '%';
  const label = document.getElementById('progress-label');
  label.textContent = percent + '% complete';
}

function togglePause() {
  paused = !paused;
  localStorage.setItem('paused', paused);
  updatePausedUI();
}

function updatePausedUI() {
  const pauseBtn = document.getElementById('pauseBtn');
  const status = document.getElementById('pauseStatus');
  pauseBtn.textContent = paused ? 'Resume Training' : 'Pause Training';
  if (paused) {
    status.classList.remove('hidden');
  } else {
    status.classList.add('hidden');
  }
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.disabled = paused;
  });
}

function resetProgress() {
  const confirmReset = window.confirm('Are you sure you want to reset all progress? This will keep your custom edits but clear your completion state.');
  if (!confirmReset) return;
  completionState = {};
  localStorage.removeItem('completionState');
  paused = false;
  localStorage.setItem('paused', paused);
  renderPlanTable();
  renderProgressBar();
  updatePausedUI();
}

function renderWorkouts() {
  function renderBlock(containerId, detailKey) {
    const container = document.getElementById(containerId);
    const details = WORKOUT_DETAILS[detailKey];
    if (!details) return;
    const title = document.createElement('h3');
    title.textContent = details.title;
    container.appendChild(title);
    const list = document.createElement('ul');
    details.items.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.link;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item.name;
      li.appendChild(a);
      list.appendChild(li);
    });
    container.appendChild(list);
    if (details.note) {
      const note = document.createElement('p');
      note.classList.add('muted');
      note.textContent = details.note;
      container.appendChild(note);
    }
  }
  renderBlock('warmup-routine', 'warmup');
  renderBlock('workout1', 'workout1');
  renderBlock('workout2', 'workout2');
  renderBlock('workout3', 'workout3');
  renderBlock('foamrolling', 'foamrolling');
}

document.addEventListener('DOMContentLoaded', init);