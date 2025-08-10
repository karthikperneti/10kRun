/*
 * script.js
 *
 * This file implements all of the interactivity for the 10K Beginner Training
 * Tracker. The core responsibilities include rendering the default plan,
 * allowing users to customise individual training sessions, marking sessions as
 * complete, persisting state with localStorage, handling pause/resume
 * functionality and computing the overall completion percentage.
 */

// A default 18 week plan inspired by the attached 10K Beginner training PDF.
// Each entry represents a week and contains the activities for Monday
// through Sunday (in that order). Users can freely edit these strings.
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

// Details of the workouts, warm‑up and foam rolling as extracted from the PDF.
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

// Names of the days of the week used as table headers.
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Application state variables. They will be populated on loadPlan().
let trainingPlan = [];
let completionState = {};
let paused = false;

/**
 * Initialise the app by loading the plan from localStorage (or the default)
 * and rendering the UI. This function also attaches event listeners to
 * dynamic elements like buttons after the DOM has loaded.
 */
function init() {
  // Load stored plan or use default.
  const storedPlan = localStorage.getItem('trainingPlan');
  trainingPlan = storedPlan ? JSON.parse(storedPlan) : JSON.parse(JSON.stringify(DEFAULT_PLAN));

  // Load completion state, mapping 'weekIdx-dayIdx' keys to boolean.
  const storedCompletion = localStorage.getItem('completionState');
  completionState = storedCompletion ? JSON.parse(storedCompletion) : {};

  // Load paused state.
  paused = localStorage.getItem('paused') === 'true';

  // Render UI components.
  renderPlanTable();
  renderProgressBar();
  renderWorkouts();
  updatePausedUI();

  // Attach event listeners to control buttons.
  document.getElementById('pauseBtn').addEventListener('click', togglePause);
  document.getElementById('resetBtn').addEventListener('click', resetProgress);
}

/**
 * Render the training plan as an HTML table. The table is built from
 * `trainingPlan` and each cell contains an editable text area and a
 * completion checkbox. Editing and completion events update the stored
 * state and recompute the progress.
 */
function renderPlanTable() {
  const container = document.getElementById('plan-container');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.classList.add('plan-table');
  // Build header row.
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  // Top-left empty cell (for week label column)
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

  // Build body rows.
  const tbody = document.createElement('tbody');
  trainingPlan.forEach((weekObj, weekIdx) => {
    const tr = document.createElement('tr');
    // Week label column
    const weekTd = document.createElement('th');
    weekTd.textContent = 'Week ' + weekObj.week;
    tr.appendChild(weekTd);
    weekObj.days.forEach((activity, dayIdx) => {
      const td = document.createElement('td');
      // Determine unique key for this cell.
      const key = `${weekIdx}-${dayIdx}`;
      // Set completed state class.
      if (completionState[key]) {
        td.classList.add('completed');
      }
      // Create content container.
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('cell-content');
      contentDiv.contentEditable = true;
      contentDiv.innerText = activity;
      // When editing finishes (on blur), update plan and persist.
      contentDiv.addEventListener('blur', (e) => {
        trainingPlan[weekIdx].days[dayIdx] = e.target.innerText.trim();
        localStorage.setItem('trainingPlan', JSON.stringify(trainingPlan));
      });
      td.appendChild(contentDiv);
      // Completion checkbox wrapper.
      const checkboxWrapper = document.createElement('div');
      checkboxWrapper.classList.add('checkbox-wrapper');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!completionState[key];
      // Disable checkbox if paused.
      checkbox.disabled = paused;
      checkbox.addEventListener('change', (e) => {
        completionState[key] = e.target.checked;
        // Add or remove completed class for styling.
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

/**
 * Calculate the total number of activities and the number completed
 * to compute the percentage finished. Update the progress bar accordingly.
 */
function renderProgressBar() {
  // Determine the total number of non-empty sessions.
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

/**
 * Toggle the paused state. When paused, checkboxes are disabled and the
 * progress percentage does not update until resumed. The paused state
 * persists in localStorage.
 */
function togglePause() {
  paused = !paused;
  localStorage.setItem('paused', paused);
  updatePausedUI();
}

/**
 * Update UI elements to reflect the current paused state. This toggles
 * button text, status message visibility and checkbox disabled state.
 */
function updatePausedUI() {
  const pauseBtn = document.getElementById('pauseBtn');
  const status = document.getElementById('pauseStatus');
  pauseBtn.textContent = paused ? 'Resume Training' : 'Pause Training';
  if (paused) {
    status.classList.remove('hidden');
  } else {
    status.classList.add('hidden');
  }
  // Update each checkbox disabled property.
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.disabled = paused;
  });
}

/**
 * Reset the completion state and optionally restore the plan to its default.
 * This function clears localStorage entries for completionState and paused,
 * resets completion checkboxes, updates UI and progress bar accordingly. The
 * user is asked for confirmation to avoid accidental resets.
 */
function resetProgress() {
  const confirmReset = window.confirm('Are you sure you want to reset all progress? This will keep your custom edits but clear your completion state.');
  if (!confirmReset) return;
  completionState = {};
  localStorage.removeItem('completionState');
  // Keep paused state false after reset.
  paused = false;
  localStorage.setItem('paused', paused);
  // Re-render table to clear checkboxes and remove completed classes.
  renderPlanTable();
  renderProgressBar();
  updatePausedUI();
}

/**
 * Render workout and warm‑up sections by constructing lists of exercises with
 * video links. This section resides below the training table and gives
 * quick access to instructions extracted from the PDF. If you do not wish
 * to view these details you can collapse or ignore this section.
 */
function renderWorkouts() {
  // Helper to render a block given a key in WORKOUT_DETAILS.
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

// When the DOM content has loaded, initialise the app.
document.addEventListener('DOMContentLoaded', init);