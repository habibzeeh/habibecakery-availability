document.addEventListener('DOMContentLoaded', () => {
  const fc = window.FullCalendar;

  const cal = new fc.Calendar(document.getElementById('calendar'), {
    timeZone: 'Europe/London',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',  // clean: only arrows
      center: 'title',    // we won't use it; replaced by our combo select
      right: ''           // no Month/Week
    },
    eventSources: [
      { url: 'https://ics.habibecakery.co', format: 'ics' }
    ],
    datesSet: () => syncCombo(cal)
  });

  cal.render();
  injectCombo(cal);
});

/* ---------- Helpers ---------- */

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function injectCombo(cal){
  // We’ll mount the combo next to the left nav arrows
  const left = document.querySelector('.fc .fc-toolbar.fc-header-toolbar .fc-toolbar-chunk:first-child');
  const center = document.querySelector('.fc .fc-toolbar.fc-header-toolbar .fc-toolbar-chunk:nth-child(2)');
  if (!left) return;

  // Clear the native title entirely
  if (center) center.innerHTML = '';

  // Single combined select: "Mon YYYY"
  const combo = document.createElement('select');
  combo.className = 'hc-select hc-select-combo';

  const currentYear = new Date().getFullYear();
  const start = new Date(currentYear - 1, 0, 1);
  for (let i = 0; i < 36; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const opt = document.createElement('option');
    opt.value = `${d.getFullYear()}-${d.getMonth()}`;
    opt.textContent = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    combo.appendChild(opt);
  }

  combo.addEventListener('change', () => {
    const [y, m] = combo.value.split('-').map(v => parseInt(v, 10));
    cal.gotoDate(new Date(y, m, 1));
  });

  // Put the combo directly after the next button
  left.appendChild(combo);

  // Initial sync
  syncCombo(cal);
}

function syncCombo(cal){
  const d = cal.getDate();
  const m = d.getMonth();
  const y = d.getFullYear();
  const combo = document.querySelector('.hc-select-combo');
  if (combo) combo.value = `${y}-${m}`;
}
