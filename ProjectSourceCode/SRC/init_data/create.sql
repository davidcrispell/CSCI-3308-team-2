-- Table for storing user information
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);


-- Table for storing workout logs
CREATE TABLE IF NOT EXISTS workoutlogs (
  id SERIAL PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  date DATE NOT NULL, 
  workoutduration SMALLINT NOT NULL,
  exercise_categories VARCHAR(100) NOT NULL
);

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