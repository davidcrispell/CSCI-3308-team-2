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
    '1234'
  );
