--Table for storing workout logs
CREATE TABLE workoutlogs (
  id INT PRIMARY KEY
  workoutname VARCHAR(100) NOT NULL,
  date DATE NOT NULL, 
  workoutduration SMALLINT NOT NULL,
  exercise_categories VARCHAR(100) NOT NULL
  );

CREATE table cardiologs (
  id INT PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  workoutduration SMALLINT NOT NULL,
  exercise_categories VARCHAR(100) NOT NULL,
  distance FLOAT NOT NULL
);

CREATE TABLE weigthliftinglogs (
  id INT PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  exercise_name VARCHAR(100) NOT NULL,
  sets SMALLINT NOT NULL,
  reps SMALLINT NOT NULL,
  weight FLOAT NOT NULL
);

CREATE TABLE bodyweightlogs (
  id INT PRIMARY KEY,
  workoutname VARCHAR(100) NOT NULL,
  exercise_name VARCHAR(100) NOT NULL,
  sets SMALLINT NOT NULL,
  reps SMALLINT NOT NULL
);