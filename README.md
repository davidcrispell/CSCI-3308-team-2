# CSCI-3308-Final-Project
Repository for group final project in CSCI 3308 that centers on making a fitness app.


You can access all head pages from all other pages

From the home page, users are prompted to access the **Signup**, **Registration**, **Calendar**, **Milestones**, and **Movement Library** pages.

The home page also allows users to quickly log a workout using a simple modal form. Logged workouts are stored in the database and tied to the current user so they can be viewed later on the calendar and milestones pages.

From **Signup**, you are prompted to access **Registration** and vice versa.
"Already have an account? -> signup" and "Need to sign up? -> registration"


In **Milestones**, the user can view their progress across various trees: calisthenics, cardio, weightlifting, and fitness metrics.
These trees should be animated graphs, duolingo style (but simpler) with progression of various achievements (calisthenics skills, cardio stats ,etc). These pages pull data from each user's workout logs in the database.
In **Movement Library**, there is a searchable library of exercises powered by [ExerciseDB](https://www.exercisedb.dev/). Use the search bar to find movements by name, muscle group or equipment and view detailed instructions.
In **Calendar**, there is a calendar populated with user workout data pulled from the database.
Under **Signup/Registration**, the user is prompted to log in to their account or create a new one.

## Running
Install dependencies and start the server:
```bash
cd ProjectSourceCode
npm install
npm start
```
