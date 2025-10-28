document.addEventListener('DOMContentLoaded', () => {
  const fc = window.FullCalendar;

  const cal = new fc.Calendar(document.getElementById('calendar'), {
    timeZone: 'Europe/London',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',                // we'll replace this with the dropdown
      right: 'dayGridMonth,timeGridWeek'
    },
    eventSources: [
      { url: 'https://ics.habibecakery.co', format: 'ics' }
    ],
    datesSet: () => syncMonthYearSelectors(cal) // keep dropdowns in sync on nav/view change
  });

  cal.render();
  injectMonthYearSelectors(cal);
});

/* ----- Helpers ----- */

const MONTH_NAMES = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
];

function injectMonthYearSelectors(cal){
  // Find the center chunk (where the title normally is)
  const center = document.querySelector('.fc .fc-toolbar.fc-header-toolbar .fc-toolbar-chunk:nth-child(2)');
  if(!center) return;

  // Clear native title
  center.innerHTML = '';

  // Build wrapper
  const wrap = document.createElement('div');
  wrap.className = 'hc-monthpicker';

  // Month select
  const monthSel = document.createElement('select');
  monthSel.className = 'hc-select hc-select-month';
  MONTH_NAMES.forEach((name, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = name;
    monthSel.appendChild(opt);
  });

  // Year select (range: currentYear-1 .. currentYear+2)
  const yearSel = document.createElement('select');
  yearSel.className = 'hc-select hc-select-year';
  const currentYear = new Date().getFullYear();
  for(let y = currentYear - 1; y <= currentYear + 2; y++){
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSel.appendChild(opt);
  }

  // Change handlers → jump to selected month/year
  monthSel.addEventListener('change', () => {
    const y = parseInt(yearSel.value, 10);
    const m = parseInt(monthSel.value, 10);
    cal.gotoDate(new Date(y, m, 1));
  });
  yearSel.addEventListener('change', () => {
    const y = parseInt(yearSel.value, 10);
    const m = parseInt(monthSel.value, 10);
    cal.gotoDate(new Date(y, m, 1));
  });

  // Mount
  wrap.appendChild(monthSel);
  wrap.appendChild(yearSel);
  center.appendChild(wrap);

  // Initial sync with calendar date
  syncMonthYearSelectors(cal);
}

function syncMonthYearSelectors(cal){
  const d = cal.getDate(); // current date in view
  const monthSel = document.querySelector('.hc-select-month');
  const yearSel  = document.querySelector('.hc-select-year');
  if(!monthSel || !yearSel) return;

  monthSel.value = String(d.getMonth());
  yearSel.value  = String(d.getFullYear());
}
