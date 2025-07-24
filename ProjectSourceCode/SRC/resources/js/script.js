

// Initialize FullCalendar

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
    });
    calendar.render();
  }
});

// Set current date for any empty date inputs
document.addEventListener('DOMContentLoaded', function() {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(inp => {
    if (!inp.value) {
      inp.value = today;
    }
  });
});

// Exercise search for workout logging
document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('exercisename');
  const list = document.getElementById('exercise_suggestions');
  if (input && list) {
    input.addEventListener('input', async (e) => {
      const q = e.target.value.trim();
      if (q.length < 2) {
        list.innerHTML = '';
        return;
      }
      try {
        const res = await fetch('/api/exercises?q=' + encodeURIComponent(q));
        const data = await res.json();
        list.innerHTML = '';
        (data.exercises || []).forEach(ex => {
          const opt = document.createElement('option');
          opt.value = ex.name;
          list.appendChild(opt);
        });
      } catch (err) {
        console.error('Search error', err);
      }
    });
  }
});

