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
const server = require('../server')

chai.use(chaiHttp);

describe('Client Routes', () => {
  before((done) => {

  // Run migrations and seeds for test database
    done()
  });

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

  it('should do something that lets us sleep', () => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });
  })
