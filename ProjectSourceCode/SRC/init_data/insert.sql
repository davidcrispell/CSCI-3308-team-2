-- Insert users
INSERT INTO users (name, email, password) VALUES
  ('John Doe', 'fake@gmail.com', '1234') 
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password) VALUES
  ('User Two', 'q@q', '$2a$10$CDWcitKAzQV2nGb0v7GrROAYI1F7cQP46DKPW6Y9RkRl/ghRHclrm')
ON CONFLICT (email) DO NOTHING;

-- Seed calendar_days for both users
INSERT INTO calendar_days (user_id, date, notes) VALUES
  (1, '2023-10-03', 'Sample Workout logged'),
  (2, '2025-07-20', ''),
  (2, '2025-07-21', ''),
  (2, '2025-07-22', ''),
  (2, '2025-07-23', ''),
  (2, '2025-07-24', ''),
  (2, '2025-07-25', 'chest day – lever chest press\ntriceps dip\ncardio – run\nweightlifting – lever chest press\ngit push – I sit'),
  (2, '2025-07-26', '')
ON CONFLICT DO NOTHING;

-- Seed workoutlogs
INSERT INTO workoutlogs (
  user_id, calendar_day_id, workoutname, exercise_name, date, workoutduration,
  exercise_categories, sets, reps, weight, distance
) VALUES (
  1, 1, 'Sample Workout', 'Running', '2023-10-03', 30,
  'Cardio', NULL, NULL, NULL, 3.0
);

-- Seed cardio, weightlifting, bodyweight logs
INSERT INTO cardiologs (
  workoutname, date, workoutduration, exercise_categories, distance
) VALUES (
  'Evening Run', '2023-10-02', 45, 'Cardio', 5.0
);

INSERT INTO weightliftinglogs (
  workoutname, date, workoutduration, exercise_categories, exercise_name,
  sets, reps, weight
) VALUES (
  'Morning Workout', '2023-10-01', 60, 'Chest', 'Bench Press', 4, 10, 75.0
);

INSERT INTO bodyweightlogs (
  workoutname, exercise_name, sets, reps
) VALUES (
  'Bodyweight Routine', 'Push-ups', 3, 15
);
