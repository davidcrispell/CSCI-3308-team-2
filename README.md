# CSCI-3308-Final-Project
Repository for group final project in CSCI 3308 that centers on making a fitness app.


You can access all head pages from all other pages

From the home page, users are prompted to access the **Signup**, **Registration**, **Exercises** **Calendar**, **Milestones**, and **Movement Library** pages.

From **Signup**, you are prompted to access **Registration** and vice versa.
"Already have an account? -> signup" and "Need to sign up? -> registration"


In **Exercises**, the user is prompted to create or log workouts. 
In **Milestones**, the user can view their progress across various trees: calisthenics, cardio, weightlifting, and fitness metrics. 
These trees should be animated graphs, duolingo style (but simpler) with progression of various achievements (calisthenics skills, cardio stats ,etc). These pages should pull data from the workout logs table in our sql
In **Movement Library**, there is a searchable library of exercises powered by [ExerciseDB](https://www.exercisedb.dev/). Use the search bar to find movements by name, muscle group or equipment and view detailed instructions.
In **Calendar**, there is a calendar populated with user workout data, notes, anything we decide is useful (all pulled from db). 
Under **Signup/Registration**, the user is prompted to log in to their account or create a new one.

## Running
Install dependencies and start the server:
```bash
cd ProjectSourceCode
npm install
npm start
```
