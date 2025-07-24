// ---------------------------------------------------
// CSCI 3308 - Fitness Project Starter index.js
// ---------------------------------------------------

const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs');
const exercisedb = require('./exercisedb');
require('dotenv').config();

// ------------------ Express Setup ------------------
const app = express();
const PORT = 3000;

// ------------------ Database Setup ------------------
const db = pgp({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// ------------------ Middleware ------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use('/resources', express.static(path.join(__dirname, 'resources')));

const staticPath = path.join(__dirname, 'ProjectSource/SRC/resources');
console.log('Serving static files from', staticPath);
app.use('/resources', express.static(staticPath));

// ------------------ View Engine ------------------
const { engine } = require('express-handlebars');
const { stat } = require('fs');
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'Views'));

// ------------------ Auth Middleware ------------------
const auth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

// ------------------ Routes ------------------

// Home page (protected)
app.get('/', auth, (req, res) => {
  res.render('Pages/home', { user: req.session.user });
});


// Register GET
app.get('/register', (req, res) => {
  res.render('Pages/register');
});

// Register POST
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.none('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [
      name,
      email,
      hash,
    ]);
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    res.redirect('/register');
  }
});

// Login GET
app.get('/login', (req, res) => {
  res.render('Pages/login');
});

// Alias for Signup links
app.get('/signup', (req, res) => {
  res.render('Pages/login');
});

// Login POST
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = { id: user.id, name: user.name, email: user.email };
      res.redirect('/'); // or res.redirect('/dashboard') if you have one
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/login');
  }
});

// Cardio workout routes
app.get('/cardio', auth, (req, res) => {
  res.render('Pages/cardio');
});

app.post('/cardio', auth, async (req, res) => {
  const { workoutname, date, workoutduration, distance } = req.body;
  try {
    await db.none(
      'INSERT INTO cardiologs (workoutname, date, workoutduration, exercise_categories, distance) VALUES ($1, $2, $3, $4, $5)',
      [workoutname, date, workoutduration, 'cardio', distance]
    );
    res.redirect('/cardio');
  } catch (err) {
    console.error('Cardio log error:', err);
    res.redirect('/cardio');
  }
});

// Bodyweight workout routes
app.get('/bodyweight', auth, (req, res) => {
  res.render('Pages/bodyweight');
});

app.post('/bodyweight', auth, async (req, res) => {
  const { workoutname, exercisename, sets, reps } = req.body;
  try {
    await db.none(
      'INSERT INTO bodyweightlogs (workoutname, exercise_name, sets, reps) VALUES ($1, $2, $3, $4)',
      [workoutname, exercisename, sets, reps]
    );
    res.redirect('/bodyweight');
  } catch (err) {
    console.error('Bodyweight log error:', err);
    res.redirect('/bodyweight');
  }
});

// Weightlifting workout routes
app.get('/weightlifting', auth, (req, res) => {
  res.render('Pages/weightlifting');
});

app.post('/weightlifting', auth, async (req, res) => {
  const { workoutname, exercisename, sets, reps, weight } = req.body;
  try {
    await db.none(
      'INSERT INTO weightliftinglogs (workoutname, date, workoutduration, exercise_categories, exercise_name, sets, reps, weight) VALUES ($1, CURRENT_DATE, 0, $2, $3, $4, $5, $6)',
      [workoutname, 'Weightlifting', exercisename, sets, reps, weight]
    );
    res.redirect('/weightlifting');
  } catch (err) {
    console.error('Weightlifting log error:', err);
    res.redirect('/weightlifting');
  }
});

// Milestones page
app.get('/milestones', auth, async (req, res) => {
  try {
    const counts = await db.any(
      `SELECT exercise_categories AS category, COUNT(*) AS count
       FROM workoutlogs
       WHERE user_id = $1
       GROUP BY exercise_categories`,
      [req.session.user.id]
    );
    const progress = {
      Cardio: 0,
      Weightlifting: 0,
      Calisthenics: 0,
    };
    counts.forEach((c) => {
      progress[c.category] = parseInt(c.count, 10);
    });

    const pct = (val) => Math.min(100, val * 10);

    res.render('Pages/milestones', {
      cardio: pct(progress.Cardio),
      weightlifting: pct(progress.Weightlifting),
      calisthenics: pct(progress.Calisthenics),
    });
  } catch (err) {
    console.error('Milestones error:', err);
    res.render('Pages/milestones', {
      cardio: 0,
      weightlifting: 0,
      calisthenics: 0,
    });
  }
});

// Movement library using ExerciseDB
app.get('/movement-library', auth, async (req, res) => {
  const query = req.query.q || '';
  try {
    const exercises = query ? await exercisedb.searchExercises(query) : [];
    res.render('Pages/movement_library', { exercises, query });
  } catch (err) {
    console.error('ExerciseDB error:', err.message);
    res.render('Pages/movement_library', { exercises: [], query, error: 'Failed to fetch exercises' });
  }
});

app.get('/exercise/:id', auth, async (req, res) => {
  try {
    const exercise = await exercisedb.getExerciseById(req.params.id);
    res.render('Pages/exercise_detail', { exercise });
  } catch (err) {
    console.error('ExerciseDB fetch error:', err.message);
    res.redirect('/movement-library');
  }
});

// API endpoint for live exercise search
app.get('/api/exercises', auth, async (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.json({ exercises: [] });
  try {
    const results = await exercisedb.searchExercises(q);
    const exercises = results.slice(0, 10).map(e => ({ id: e.id, name: e.name }));
    res.json({ exercises });
  } catch (err) {
    console.error('Exercise search API error:', err.message);
    res.status(500).json({ exercises: [] });
  }
});

// Calendar page
app.get('/calendar', auth, async (req, res) => {
  try {
    const logs = await db.any(
      'SELECT * FROM workoutlogs WHERE user_id = $1 ORDER BY date DESC',
      [req.session.user.id]
    );
    res.render('Pages/calendar', { logs, logsJson: JSON.stringify(logs) });
  } catch (err) {
    console.error('Fetch calendar error:', err);
    res.render('Pages/calendar', { logs: [] });
  }
});

// Log a workout
app.post('/log-workout', auth, async (req, res) => {
  const {
    workoutname,
    date,
    workoutduration,
    category,
    sets,
    reps,
    weight,
    distance,
  } = req.body;

  try {
    await db.none(
      `INSERT INTO workoutlogs
       (user_id, workoutname, date, workoutduration, exercise_categories, sets, reps, weight, distance)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        req.session.user.id,
        workoutname,
        date,
        workoutduration,
        category,
        sets || null,
        reps || null,
        weight || null,
        distance || null,
      ]
    );
    res.redirect('/calendar');
  } catch (err) {
    console.error('Workout log error:', err);
    res.redirect('/');
  }
});
   

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/');
    res.render('Pages/logout');
  });
});

// ------------------ Server ------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
