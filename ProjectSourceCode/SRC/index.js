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
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// ------------------ Middleware ------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// ------------------ View Engine ------------------
const { engine } = require('express-handlebars');
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


// Workouts GET
app.get('/workouts', auth, (req, res) => {
  res.render('Pages/workouts', /*{ user: req.session.user }*/);
});

// Milestones page
app.get('/milestones', auth, (req, res) => {
  res.render('Pages/milestones');
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