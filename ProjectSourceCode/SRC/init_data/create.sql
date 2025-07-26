-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Create calendar_days
CREATE TABLE IF NOT EXISTS calendar_days (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  notes TEXT
);

-- Create workoutlogs
CREATE TABLE IF NOT EXISTS workoutlogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  calendar_day_id INTEGER REFERENCES calendar_days(id) ON DELETE CASCADE,
  workoutname VARCHAR(100) NOT NULL,
  exercise_name VARCHAR(100),
  date DATE NOT NULL,
  workoutduration SMALLINT,
  exercise_categories VARCHAR(100) NOT NULL,
  sets SMALLINT,
  reps SMALLINT,
  weight FLOAT,
  distance FLOAT
);

-- Cardio, weightlifting, bodyweight logs
CREATE TABLE IF NOT EXISTS cardiologs (
  id SERIAL PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  workoutduration SMALLINT NOT NULL,
  exercise_categories VARCHAR(100) NOT NULL,
  distance FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS weightliftinglogs (
  id SERIAL PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  workoutduration SMALLINT,
  exercise_categories VARCHAR(100),
  exercise_name VARCHAR(100) NOT NULL,
  sets SMALLINT NOT NULL,
  reps SMALLINT NOT NULL,
  weight FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS bodyweightlogs (
  id SERIAL PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  exercise_name VARCHAR(100) NOT NULL,
  sets SMALLINT NOT NULL,
  reps SMALLINT NOT NULL
);
