# Test Plan

This document outlines the user acceptance tests for the basic features of the fitness application.

## Environment
* **Platform:** local Docker containers
* **Database:** PostgreSQL initialized with `init_data` scripts
* **Tester Accounts:** dummy users created through the registration form

## Features Tested

### 1. User Registration
- **Input:** Valid username, e‑mail and password.
- **Expected Result:** User is stored in the `users` table and redirected to the login page.
- **Invalid Case:** Duplicate e‑mail should result in HTTP 400 and display an error message.

### 2. User Login
- **Input:** Existing user credentials.
- **Expected Result:** Session is created and the user is redirected to the home page.
- **Invalid Case:** Wrong password keeps the user on the login page with an error.

### 3. Logging a Cardio Workout
- **Input:** Workout name, date, duration and distance.
- **Expected Result:** Entry is stored in `cardiologs` table and shown on refresh.

## Test Data
Example registration credentials:
```
name: TestUser
email: test@example.com
password: secret
```

Example cardio entry:
```
workoutname: Test Run
date: 2024-01-01
workoutduration: 30
distance: 3.2
```

## Testers
Two classmates outside the development team will execute the above cases and report any issues encountered during interaction with the application.
