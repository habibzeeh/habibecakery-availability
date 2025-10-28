document.addEventListener('DOMContentLoaded', () => {
  const fc = window.FullCalendar;

  const cal = new fc.Calendar(document.getElementById('calendar'), {
    timeZone: 'Europe/London',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',   // arrows only
      center: 'title',     // we'll replace with month/year textlike pickers
      right: ''            // no view buttons
    },
    eventSources: [
      { url: 'https://ics.habibecakery.co', format: 'ics' }
    ],
    datesSet: () => syncPickers(cal)
  });

  cal.render();
  injectPickers(cal);
});

/* ---------------- Helpers ---------------- */

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function injectPickers(cal){
  const chunks = document.querySelectorAll('.fc .fc-toolbar.fc-header-toolbar .fc-toolbar-chunk');
  if (!chunks || chunks.length < 2) return;

  const leftChunk   = chunks[0]; // arrows
  const centerChunk = chunks[1]; // native title area
  centerChunk.innerHTML = '';    // remove native title entirely

  // Desktop + Mobile: SAME UI → Month + Year (textlike) right after arrows
  const wrap = document.createElement('div');
  wrap.className = 'hc-monthpicker';

  const monthSel = document.createElement('select');
  monthSel.className = 'hc-select hc-select-month textlike';
  MONTH_NAMES.forEach((name, i) => {
    const opt = document.createElement('option');
    opt.value = i; opt.textContent = name;
    monthSel.appendChild(opt);
  });

  const yearSel = document.createElement('select');
  yearSel.className = 'hc-select hc-select-year textlike caret'; // only year shows caret
  const currentYear = new Date().getFullYear();
  for(let y = currentYear - 1; y <= currentYear + 2; y++){
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y;
    yearSel.appendChild(opt);
  }

  monthSel.addEventListener('change', () => {
    cal.gotoDate(new Date(parseInt(yearSel.value,10), parseInt(monthSel.value,10), 1));
  });
  yearSel.addEventListener('change', () => {
    cal.gotoDate(new Date(parseInt(yearSel.value,10), parseInt(monthSel.value,10), 1));
  });

  wrap.appendChild(monthSel);
  wrap.appendChild(yearSel);
  leftChunk.appendChild(wrap);

  syncPickers(cal);
}

function syncPickers(cal){
  const d = cal.getDate();
  const m = d.getMonth();
  const y = d.getFullYear();

  const monthSel = document.querySelector('.hc-select-month');
  const yearSel  = document.querySelector('.hc-select-year');

  if(monthSel) monthSel.value = String(m);
  if(yearSel)  yearSel.value  = String(y);
}
