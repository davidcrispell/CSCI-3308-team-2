// ********************** Initialize server **********************************
const app = require('../SRC/index');

// ********************** Import Libraries ***********************************
const chai = require('chai');
const chaiHttp = require('chai-http');
const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs');
chai.should();
chai.use(chaiHttp);
const {expect} = chai;

// setup database connection
const db = pgp({
  host: process.env.POSTGRES_HOST || 'db',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// ********************** DEFAULT WELCOME TESTCASE ****************************
describe('Server!', () => {
  it('Returns the default welcome message', done => {
    chai
      .request(app)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        expect(res.body.message).to.equal('Welcome!');
        done();
      });
  });
});

// *********************** Register API TESTCASES **************************
describe('Register API', () => {
  before(async () => {
    await db.none('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  });

  it('positive: registers a new user', done => {
    const user = {name: 'TestUser', email: 'test@example.com', password: 'secret'};
    chai
      .request(app)
      .post('/register')
      .type('form')
      .send(user)
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        // verify user inserted
        const inserted = await db.oneOrNone('SELECT * FROM users WHERE email=$1', [user.email]);
        expect(inserted).to.not.be.null;
        done();
      });
  });

  it('negative: reject duplicate registration', done => {
    const user = {name: 'TestUser', email: 'test@example.com', password: 'secret'};
    chai
      .request(app)
      .post('/register')
      .type('form')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
});

// *********************** Login and auth integration tests *****************
describe('Login and protected route', () => {
  let agent;
  const creds = {email: 'test@example.com', password: 'secret'};

  beforeEach(() => {
    agent = chai.request.agent(app);
  });

  afterEach(() => {
    agent.close();
  });

  it('should reject access to home when not authenticated', done => {
    agent
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200); // redirected to login page returns 200 with render
        res.text.should.include('Login');
        done();
      });
  });

  it('allows login then access protected page', async () => {
    await agent.post('/login').type('form').send(creds);
    const res = await agent.get('/');
    expect(res).to.have.status(200);
    expect(res.text).to.include('Welcome');
  });
});
