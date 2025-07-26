// ********************** Initialize server **********************************
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_USER = 'postgres';
process.env.POSTGRES_PASSWORD = 'pwd';
process.env.POSTGRES_DB = 'users_db';

const server = require('../SRC/index');

// ********************** Import Libraries ***********************************
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

// === DB SETUP BLOCK ===
const pgp = require('pg-promise')();
const db = pgp({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
// === END DB SETUP BLOCK ===

before(async () => {
  await db.none(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
    ['Existing User', 'fake@gmail.com', '$2a$10$CDWcitKAzQV2nGb0v7GrROAYI1F7cQP46DKPW6Y9RkRl/ghRHclrm']
  );
  await db.none(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
    ['Login User', 'q@q', '$2a$10$CDWcitKAzQV2nGb0v7GrROAYI1F7cQP46DKPW6Y9RkRl/ghRHclrm']
  );
});

describe('Login Page', () => {
  it('GET /login should render HTML', done => {
    chai
      .request(server)
      .get('/login')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });
});

describe('Register API', () => {
  it('should redirect to /login after successful registration', done => {
    chai
      .request(server)
      .post('/register')
      .type('form')
      .send({
        name: 'Test User',
        email: `user${Date.now()}@test.com`,
        password: 'secure123',
      })
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(/\/login/);
        done();
      });
  });

  it('should redirect back to /register when email already exists', done => {
    chai
      .request(server)
      .post('/register')
      .type('form')
      .send({
        name: 'Existing User',
        email: 'fake@gmail.com',
        password: 'whatever',
      })
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(/\/register$/);
        done();
      });
  });
});

describe('Integration: Register inserts user', () => {
  it('should insert a new user into the users table', done => {
    const testEmail = `autotestuser${Date.now()}@example.com`;
    chai
      .request(server)
      .post('/register')
      .type('form')
      .send({
        name: 'Integration Test User',
        email: testEmail,
        password: 'securePassword123',
      })
      .end(async (err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(/\/login/);
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

describe('Login API', () => {
  it('should redirect to / after successful login', done => {
    chai
      .request(server)
      .post('/login')
      .type('form')
      .send({
        email: 'q@q',
        password: 'q',
      })
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(/\/$/);
        done();
      });
  });

  it('should redirect back to /login with invalid password', done => {
    chai
      .request(server)
      .post('/login')
      .type('form')
      .send({
        email: 'q@q',
        password: 'wrongpassword',
      })
      .end((err, res) => {
        expect(res).to.redirect;
        expect(res).to.redirectTo(/\/login$/);
        done();
      });
  });
});

after(() => {
  server.close();
  pgp.end();
});
