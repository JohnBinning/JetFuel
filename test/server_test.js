const express = require('express');
const app = express();
const shortid = require('shortid');
const bodyParser = require('body-parser');
const environment = 'test';
const knex = require('knex');

process.env.NODE_ENV = 'test';

const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../serverT');

chai.use(chaiHttp);

describe('Client Routes', () => {
  // before((done) => {
  //
  // // Run migrations and seeds for test database
  //   done()
  // });

  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });

  it('should return a homepage', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
    .get('/tired')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });

});

describe('API routes', () => {

  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });

  it('should return a specific folder by id', (done) => {
    chai.request(server)
    .get('/api/v1/folders/1')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body[0].should.be.a('object');
      response.body[0].name.should.equal('recipes');
      done();
    });
  });

  it('should return a 404 if a specific folder cannot be found by name', (done) => {
    chai.request(server)
    .get('/api/v1/folders/200007')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });

  describe('GET /api/v1/folders', () => {

    it('should return all of the folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(5);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('recipes');
        done();
      });
    });

  });

  describe(' POST /api/v1/folders', () => {
    it('should create a new folder', (done) => {
    chai.request(server)
    .post('/api/v1/folders')
    .send({ name: 'frontend' })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal(6);
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(6);
        response.body[5].should.have.property('id');
        response.body[3].id.should.equal(4);
        done();
        });
      });
    });
  })

  describe(' GET /api/v1/links', () => {

    it('should return all of the links', (done) => {
      chai.request(server)
      .get('/api/v1/links')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(6);
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('url');
        response.body[0].should.have.property('folder_id');
        response.body[0].should.have.property('shortened_url');
        response.body[0].should.have.property('visits');
        response.body[0].name.should.equal('the cake is a lie');
        response.body[0].url.should.equal('www.bettycrocker.com/recipes/black-forest-cake/4e66caed-4e29-4154-a92d-27332162baa4');
        response.body[0].folder_id.should.equal(1);
        response.body[0].shortened_url.should.equal('http://localhost:3000/S16l-hWNZ');
        response.body[0].visits.should.equal(4);
        done();
      });
    });
  });

  describe(' GET /api/v1/folders/:id/links', () => {
    it('should return all of the links associated with the folder_id', (done) => {
      chai.request(server)
      .get('/api/v1/folders/5/links')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('url');
        response.body[0].should.have.property('folder_id');
        response.body[0].should.have.property('shortened_url');
        response.body[0].should.have.property('visits');
        response.body[0].name.should.equal('dwight pencil cup');
        response.body[0].url.should.equal('3.bp.blogspot.com/-hGy0r-Zej60/UTZetVp5iTI/AAAAAAAABxE/pUwniVN5TY4/s1600/pencilcup.jpg');
        response.body[0].folder_id.should.equal(5);
        response.body[0].shortened_url.should.equal('http://localhost:3000/Hih83no2Kj2');
        response.body[0].visits.should.equal(7);
        done();
      });
    });
  });

  describe(' POST /api/v1/links', () => {

    it('should create a new link', (done) => {
    chai.request(server)
    .post('/api/v1/links')
    .send({
      name: 'frontend',
      url: 'frontend.turing.io',
      folder_id: '4'
     })
    .end((err, response) => {
      response.should.have.status(201);
      response.body.should.be.a('object');
      response.body.should.have.property('id');
      response.body.id.should.equal(7);
      chai.request(server)
      .get('/api/v1/links')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(7);
        response.body[5].should.have.property('id');
        response.body[4].should.have.property('url');
        response.body[3].should.have.property('name');
        response.body[2].should.have.property('shortened_url');
        response.body[1].should.have.property('folder_id');
        response.body[5].id.should.equal(6);
        response.body[4].url.should.equal('3.bp.blogspot.com/-hGy0r-Zej60/UTZetVp5iTI/AAAAAAAABxE/pUwniVN5TY4/s1600/pencilcup.jpg');
        response.body[3].name.should.equal('vinegar weedkiller recipe');
        response.body[2].shortened_url.should.equal('http://localhost:3000/Sy1rzlzVb');
        response.body[1].folder_id.should.equal(3);
        done();
        });
      });
    });

    it('should not create a record with missing data', (done) => {
      chai.request(server)
      .post('/api/v1/links')
      .send({
        name: 'craig',
        url: 'craig.com',
        visits: '4'
      })
      .end((err, response) => {
        response.should.have.status(422);
        response.body.error.should.equal('Expected format: { name: <String>, url: <String>, folder_id: <Integer> }. You are missing a folder_id property.');
        done();
      });
    });
  });

});
