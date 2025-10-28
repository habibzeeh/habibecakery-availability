document.addEventListener('DOMContentLoaded', () => {
  const fc = window.FullCalendar;

  const cal = new fc.Calendar(document.getElementById('calendar'), {
    timeZone: 'Europe/London',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek' 
    },
    eventSources: [
      {
        url: 'https://ics.habibecakery.co',
        format: 'ics'
      }
    ]
  });

  cal.render();
});
