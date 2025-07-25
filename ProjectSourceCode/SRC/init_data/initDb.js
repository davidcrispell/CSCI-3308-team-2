const fs = require('fs');
const path = require('path');
const db = require('../database'); // adjust if your pg-promise setup is elsewhere

const sql = fs.readFileSync(path.join(__dirname, 'create.sql'), 'utf8');

db.none(sql)
  .then(() => {
    console.log('Database initialized');
  })
  .catch(err => {
    console.error('Database init failed:', err);
    process.exit(1); // optional, if you want to stop server on failure
  });