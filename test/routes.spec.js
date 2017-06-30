const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const folders = require('./testfolders.js');
const links = require('./testlinks.js');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.equal('We\'re going to test all the routes!');
      done();
    });
  });

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
    .get('/sad')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {

  before((done) => {
    // Run migrations and seeds for test database
    done()
  });

  beforeEach((done) => {
    // Would normally run run your seed(s), which includes clearing all records
    // from each of the tables
    server.locals.folders = folders;
    server.locals.links = links;
    done();
  });

  describe('GET /api/v1/folders', () => {
    it('should return all of the folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('name');
        response.body[0].lastname.should.equal('baseball');
        response.body[1].should.have.property('name');
        response.body[1].program.should.equal('interesting herons');
        response.body[2].should.have.property('name');
        response.body[2].enrolled.should.equal('best grass species');
        done();
      });
    });
  });

  describe('GET /api/v1/folders/3', () => {
    it('should return all links in folder 3', (done) => {
      chai.request(server)
      .get('api/v1/folders/3')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body.should.have.property('lastname');
        response.body.lastname.should.equal('Babbage');
        response.body.should.have.property('program');
        response.body.program.should.equal('BE');
        response.body.should.have.property('enrolled');
        response.body.enrolled.should.equal(false);
        done();
      });
    });
  });

  describe('POST /api/v1/students', () => {
    it('should create a new student', (done) => {
      chai.request(server)
      .post('/api/v1/students') // Notice the change in the verb
      .send({                   // Here is the information sent in the body or the request
        lastname: 'Knuth',
        program: 'FE',
        enrolled: true
      })
      .end((err, response) => {
        response.should.have.status(201); // Different status here
        response.body.should.be.a('object');
        response.body.should.have.property('lastname');
        response.body.lastname.should.equal('Knuth');
        response.body.should.have.property('program');
        response.body.program.should.equal('FE');
        response.body.should.have.property('enrolled');
        response.body.enrolled.should.equal(true);
        chai.request(server) // Can also test that it is actually in the database
        .get('/api/v1/students')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
          response.body[3].should.have.property('lastname');
          response.body[3].lastname.should.equal('Knuth');
          response.body[3].should.have.property('program');
          response.body[3].program.should.equal('FE');
          response.body[3].should.have.property('enrolled');
          response.body[3].enrolled.should.equal(true);
          done();
        });
      });
    });

    it('should not create a record with missing data', (done) => {
      chai.request(server)
      .post('/api/v1/students')
      .send({
        lastname: 'Knuth',
        program: 'FE' // Missing the enrolled property and value
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.error.should.equal('You are missing data!');
        done();
      });
    });
  });
});
