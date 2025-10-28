document.addEventListener('DOMContentLoaded', () => {
  const fc = window.FullCalendar;

  const cal = new fc.Calendar(document.getElementById('calendar'), {
    timeZone: 'Europe/London',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',                     // we replace this with our pickers
      right: 'dayGridMonth,timeGridWeek'   // hidden on mobile via CSS
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
  const center = document.querySelector('.fc .fc-toolbar.fc-header-toolbar .fc-toolbar-chunk:nth-child(2)');
  if(!center) return;
  center.innerHTML = '';

  // Desktop: Month + Year selects
  const wrap = document.createElement('div');
  wrap.className = 'hc-monthpicker';

  const monthSel = document.createElement('select');
  monthSel.className = 'hc-select hc-select-month';
  MONTH_NAMES.forEach((name, i) => {
    const opt = document.createElement('option');
    opt.value = i; opt.textContent = name;
    monthSel.appendChild(opt);
  });

  const yearSel = document.createElement('select');
  yearSel.className = 'hc-select hc-select-year';
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
  center.appendChild(wrap);

  // Mobile: single combined select "Mon YYYY"
  const combo = document.createElement('select');
  combo.className = 'hc-select hc-select-combo';
  // Generate ~36 months around current year for convenience
  const start = new Date(currentYear - 1, 0, 1);
  for(let i = 0; i < 36; i++){
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
  center.appendChild(combo);

  // Initial sync
  syncPickers(cal);
}

function syncPickers(cal){
  const d = cal.getDate();
  const m = d.getMonth();
  const y = d.getFullYear();

  const monthSel = document.querySelector('.hc-select-month');
  const yearSel  = document.querySelector('.hc-select-year');
  const combo    = document.querySelector('.hc-select-combo');

  if(monthSel) monthSel.value = String(m);
  if(yearSel)  yearSel.value  = String(y);
  if(combo)    combo.value    = `${y}-${m}`;
}
