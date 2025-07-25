

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
              if (log.workoutduration) details.push(log.workoutduration + ' min');
              if (log.exercise_categories) details.push(log.exercise_categories);
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

// Adjust workout log fields based on selected category
document.addEventListener('DOMContentLoaded', function () {
  const category = document.getElementById('category');
  if (!category) return;

  const durationDiv = document.getElementById('duration_div');
  const setsDiv = document.getElementById('sets_div');
  const repsDiv = document.getElementById('reps_div');
  const weightDiv = document.getElementById('weight_div');
  const distanceDiv = document.getElementById('distance_div');

  const durationInput = document.getElementById('duration');
  const setsInput = document.getElementById('sets');
  const repsInput = document.getElementById('reps');
  const weightInput = document.getElementById('weight');
  const distanceInput = document.getElementById('distance');

  function updateFields() {
    const val = category.value;

    // Reset required flags
    [durationInput, setsInput, repsInput, weightInput, distanceInput].forEach((i) => {
      if (i) i.required = false;
    });

    if (val === 'Cardio') {
      if (durationDiv) durationDiv.style.display = '';
      if (distanceDiv) distanceDiv.style.display = '';
      if (setsDiv) setsDiv.style.display = 'none';
      if (repsDiv) repsDiv.style.display = 'none';
      if (weightDiv) weightDiv.style.display = 'none';

      if (durationInput) durationInput.required = true;
      if (distanceInput) distanceInput.required = true;
    } else if (val === 'Weightlifting') {
      if (durationDiv) durationDiv.style.display = 'none';
      if (distanceDiv) distanceDiv.style.display = 'none';
      if (setsDiv) setsDiv.style.display = '';
      if (repsDiv) repsDiv.style.display = '';
      if (weightDiv) weightDiv.style.display = '';

      if (setsInput) setsInput.required = true;
      if (repsInput) repsInput.required = true;
    } else {
      // Calisthenics or other
      if (durationDiv) durationDiv.style.display = 'none';
      if (distanceDiv) distanceDiv.style.display = 'none';
      if (weightDiv) weightDiv.style.display = 'none';
      if (setsDiv) setsDiv.style.display = '';
      if (repsDiv) repsDiv.style.display = '';

      if (setsInput) setsInput.required = true;
      if (repsInput) repsInput.required = true;
    }
  }

  category.addEventListener('change', updateFields);
  updateFields();
});

