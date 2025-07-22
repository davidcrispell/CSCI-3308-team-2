--initialize the databases with default values for workout logs.

INSERT INTO weightliftinglogs
  (
    id,
    workoutname,
    date,
    workoutduration,
    workoutlog_id,
    exercise_categories,
    exercise_name,
    sets,
    reps,
    weight
  )
VALUES    
  (
    1,
    'Morning Workout',
    '2023-10-01',
    60,
    1,
    'Strength Training',
    'Bench Press',
    4,
    10,
    75.0
  );

INSERT INTO cardiologs
  (
    id,
    workoutname,
    date,
    workoutduration,
    workoutlog_id,
    exercise_categories
    distance
  )
VALUES
  (

  );


INSERT INTO bodyweightlogs
    (
        id,
        workoutname,
        date,
        workoutduration,
        workoutlog_id,
        exercise_categories
    )
VALUES
    (
    
    );
-- Table for storing user information
INSERT INTO users
  (
    id,
    name,
    email,
    password
  )
VALUES
  (
    1,
    'John Doe',
    'fake@gmail.com',
    '1234'
  );