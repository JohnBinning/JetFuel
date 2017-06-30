const express = require('express');
const app = express();
const shortid = require('shortid');
const bodyParser = require('body-parser');
const environment = 'test';
const knex = require('../db/knex');
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
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        return knex.seed.run()
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
