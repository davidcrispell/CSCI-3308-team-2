-- Table for storing user information
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Table for storing per-day calendar details
CREATE TABLE IF NOT EXISTS calendar_days (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  notes TEXT
);

-- Table for storing workout logs
CREATE TABLE IF NOT EXISTS workoutlogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  calendar_day_id INTEGER REFERENCES calendar_days(id) ON DELETE CASCADE,
  workoutname VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  workoutduration SMALLINT,  -- nullable
  exercise_categories VARCHAR(100) NOT NULL,
  sets SMALLINT,
  reps SMALLINT,
  weight FLOAT,
  distance FLOAT
);

-- Table for storing cardio workouts
CREATE TABLE IF NOT EXISTS cardiologs (
  id SERIAL PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  workoutduration SMALLINT NOT NULL,
  exercise_categories VARCHAR(100) NOT NULL,
  distance FLOAT NOT NULL
);

-- Table for storing weightlifting workouts
CREATE TABLE IF NOT EXISTS weightliftinglogs (
  id SERIAL PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  workoutduration SMALLINT,  -- changed to nullable
  exercise_categories VARCHAR(100),
  exercise_name VARCHAR(100) NOT NULL,
  sets SMALLINT NOT NULL,
  reps SMALLINT NOT NULL,
  weight FLOAT NOT NULL
);

-- Table for storing bodyweight exercises
CREATE TABLE IF NOT EXISTS bodyweightlogs (
  id SERIAL PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  exercise_name VARCHAR(100) NOT NULL,
  sets SMALLINT NOT NULL,
  reps SMALLINT NOT NULL
);
-- Ensure workoutduration is nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='workoutlogs' AND column_name='workoutduration'
          AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE workoutlogs ALTER COLUMN workoutduration DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='weightliftinglogs' AND column_name='workoutduration'
          AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE weightliftinglogs ALTER COLUMN workoutduration DROP NOT NULL;
  END IF;
END$$;
