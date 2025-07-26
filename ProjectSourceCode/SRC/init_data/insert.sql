-- Insert initial data into weightliftinglogs
INSERT INTO weightliftinglogs
(
  workoutname,
  date,
  workoutduration,
  exercise_categories,
  exercise_name,
  sets,
  reps,
  weight
)
VALUES
(
  'Morning Workout',
  '2023-10-01',
  60,
  'Chest',
  'Bench Press',
  4,
  10,
  75.0
);

-- Insert initial data into cardiologs
INSERT INTO cardiologs
  (
    workoutname,
    date,
    workoutduration,
    exercise_categories,
    distance
  )
VALUES
  (
    'Evening Run',
    '2023-10-02',
    45,
    'Cardio',
    5.0
  );

-- Insert initial data into bodyweightlogs
INSERT INTO bodyweightlogs
  (
    workoutname,
    exercise_name,
    sets,
    reps
  )
VALUES
  (
    'Bodyweight Routine',
    'Push-ups',
    3,
    15
  );

-- Insert dummy user
INSERT INTO users
  (
    name,
    email,
    password
  )
VALUES
  (
    'John Doe',
    'fake@gmail.com',
    '1234'
  ),
  (
    'User Two',
    'q@q',
    '$2a$10$CDWcitKAzQV2nGb0v7GrROAYI1F7cQP46DKPW6Y9RkRl/ghRHclrm'
  );

-- Calendar for user 1
INSERT INTO calendar_days (user_id, date, notes)
VALUES (1, '2023-10-03', 'Sample Workout logged');

-- Workout log for user 1
INSERT INTO workoutlogs
  (
    user_id,
    calendar_day_id,
    workoutname,
    date,
    workoutduration,
    exercise_categories,
    sets,
    reps,
    weight,
    distance
  )
VALUES
  (
    1,
    1,
    'Sample Workout',
    '2023-10-03',
    30,
    'Cardio',
    NULL,
    NULL,
    NULL,
    3.0
  );
INSERT INTO calendar_days (user_id, date, notes)
VALUES
  (2, '2025-07-20', ''),
  (2, '2025-07-21', ''),
  (2, '2025-07-22', ''),
  (2, '2025-07-23', ''),
  (2, '2025-07-24', ''),
  (2, '2025-07-25', 'chest day – lever chest press
triceps dip
cardio – run
weightlifting – lever chest press
git push – I sit'),
  (2, '2025-07-26', '');
