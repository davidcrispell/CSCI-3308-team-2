

// Initialize FullCalendar

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    var events = Array.isArray(window.workoutLogs)
      ? window.workoutLogs.map(log => ({
          title: log.workoutname,
          start: log.date,
          extendedProps: { notes: log.notes }
        }))

      : [];
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: events,
      eventClick: function(info) {
        if (info.event.extendedProps.notes) {
          alert(info.event.title + '\n' + info.event.extendedProps.notes);
        }
      }

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

// Show logs for a specific day when clicked
document.addEventListener('DOMContentLoaded', function () {
  const days = document.querySelectorAll('.week-day');
  const weekData = window.weekData || [];
  if (days.length && weekData.length) {
    days.forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        const data = weekData[idx];
        const modalEl = document.getElementById('day_modal');
        if (!modalEl || !data) return;
        modalEl.querySelector('.modal-title').textContent = data.date;
        const body = modalEl.querySelector('.modal-body');
        if (!data.logs.length) {
          body.innerHTML = '<p>No workouts logged.</p>';
        } else {
          const items = data.logs
            .map((log) => {
              const details = [];
              if (log.exercise_name) details.push(log.exercise_name);
              if (log.exercise_categories) details.push(log.exercise_categories);
              if (log.workoutduration) details.push(log.workoutduration + ' min');
              if (log.sets) details.push(log.sets + ' sets');
              if (log.reps) details.push(log.reps + ' reps');
              if (log.weight) details.push(log.weight + ' lbs');
              if (log.distance) details.push(log.distance + ' miles');
              return (
                '<li><strong>' +
                log.workoutname +
                '</strong> - ' +
                details.join(', ') +
                '</li>'
              );
            })
            .join('');
          body.innerHTML = '<ul>' + items + '</ul>';
        }
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      });
    });
  }
});

// Adjust form fields shown based on workout category
document.addEventListener('DOMContentLoaded', function () {
  const category = document.getElementById('category');
  if (!category) return;

  const cardioFields = document.querySelectorAll('.cardio-field');
  const strengthFields = document.querySelectorAll('.strength-field');
  const weightFields = document.querySelectorAll('.weightlifting-field');

  const update = () => {
    const val = category.value;

    cardioFields.forEach((el) => {
      el.style.display = val === 'Cardio' ? '' : 'none';
      if (val !== 'Cardio') {
        el.querySelectorAll('input').forEach((i) => (i.value = ''));
      }
    });

    strengthFields.forEach((el) => {
      el.style.display = val === 'Weightlifting' || val === 'Calisthenics' ? '' : 'none';
      if (val !== 'Weightlifting' && val !== 'Calisthenics') {
        el.querySelectorAll('input').forEach((i) => (i.value = ''));
      }
    });

    weightFields.forEach((el) => {
      el.style.display = val === 'Weightlifting' ? '' : 'none';
      if (val !== 'Weightlifting') {
        el.querySelectorAll('input').forEach((i) => (i.value = ''));
      }
    });

    const duration = document.getElementById('duration');
    if (duration) duration.required = val === 'Cardio';
  };

  category.addEventListener('change', update);
  update();
});

