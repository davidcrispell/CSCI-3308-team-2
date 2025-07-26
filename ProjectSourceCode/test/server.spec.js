// ********************** Initialize server **********************************

//UPDATED PATH FOR TESTING LAB
const server = require('../SRC/index'); // Make sure this path is correct

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// === DB SETUP BLOCK ===
const pgp = require('pg-promise')();
require('dotenv').config();

const db = pgp({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
// === END DB SETUP BLOCK ===

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Positive: Server!', () => {
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** UNIT TESTS FOR /register **************************

describe('Positive: Register API', () => {
  it('Positive: should respond with "User created" when registering a new user', done => {
    chai
      .request(server)
      .post('/register')
      .set('x-test', 'true') // important to get text response instead of redirect
      .type('form')
      .send({
        name: 'Test User',
        email: `user${Date.now()}@test.com`, // unique email every time
        password: 'secure123'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('User created');
        done();
      });
  });

  it('Negative: should respond with 500 "Registration failed" when email already exists', done => {
    chai
      .request(server)
      .post('/register')
      .set('x-test', 'true') // important to get text response instead of redirect
      .type('form')
      .send({
        name: 'Existing User',
        email: 'fake@gmail.com', // email already in DB
        password: 'whatever'
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.text).to.equal('Registration failed');
        done();
      });
  });
});

// describe('Negative: Register API Negative Tests', () => {
//   it('Negative: should return 400 and error message when required fields are missing', done => {
//     chai
//       .request(server)
//       .post('/register')
//       .set('x-test', 'true') // triggers test mode for JSON/errors instead of redirects
//       .type('form')
//       .send({
//         name: '',      // empty name
//         email: '',     // empty email
//         password: ''   // empty password
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.text).to.equal('Missing fields');
//         done();
//       });
//   });
// });

// *********************** INTEGRATION TEST FOR /register **************************

describe('Positive: Integration Test: Register API inserts user', () => {
  it('should insert a new user into the users table', done => {
    const testEmail = `autotestuser${Date.now()}@example.com`;

    chai
      .request(server)
      .post('/register')
      .set('x-test', 'true')
      .type('form')
      .send({
        name: 'Integration Test User',
        email: testEmail,
        password: 'securePassword123'
      })
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('User created');

        const insertedUser = await db.oneOrNone(
          'SELECT * FROM users WHERE email = $1',
          [testEmail]
        );

        expect(insertedUser).to.not.be.null;
        expect(insertedUser.name).to.equal('Integration Test User');
        done();
      });
  });
});

// ********************************************************************************

describe('Testing Redirect', () => {
  it('\\test route should redirect to /login with 302 HTTP status code', done => {
    chai
      .request(server)
      .get('/test')
      .redirects(0)  // disable following redirects
      .end((err, res) => {
        res.should.have.status(302);
        res.should.redirectTo(/^.*\/login$/);
        done();
      });
  });
});

describe('Testing Render', () => {
  it('test "/login" route should render with an html response', done => {
    chai
      .request(server)
      .get('/login')
      .end((err, res) => {
        res.should.have.status(200); // Expect success status code
        res.should.be.html; // Expect HTML response
        done();
      });
  });
});

// *********************** LOGIN API TESTS **************************

describe('Positive: Login API', () => {
  it('should redirect to / after successful login with correct credentials', done => {
    chai
      .request(server)
      .post('/login')
      .type('form')
      .send({
        email: 'fake@gmail.com',       // existing user from your INSERT.sql
        password: '1234'               // plaintext password matching bcrypt hash in DB
      })
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(/\/$/);  // redirect to home page
        done();
      });
  });
});

describe('Negative: Login API', () => {
  it('should redirect back to /login with invalid password', done => {
    chai
      .request(server)
      .post('/login')
      .type('form')
      .send({
        email: 'fake@gmail.com',        // existing user
        password: 'wrongpassword'       // incorrect password
      })
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(/\/login$/); // redirect back to login page
        done();
      });
  });
});
