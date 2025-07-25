-- Insert initial data into weightliftinglogs (columns matching schema)
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
  60, -- example duration in minutes
  'Chest', -- example category
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

-- Insert initial data into users
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
    '$2b$10$8d.kcQ43ru0HFH.OIabNTeEOnlRr/3L4gjLv7ppffV2BxF.GtCoDW' -- Fixed dummy user account, the issue was bcrypt so I hashed 1234
  );

-- Sample workout log linked to user
-- Sample calendar day and workout log linked to user
INSERT INTO calendar_days (user_id, date, notes)
VALUES (1, '2023-10-03', 'Sample Workout logged');

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

