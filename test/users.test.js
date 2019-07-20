// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// const mongoose = require("mongoose");
const User = require('../api/users/users.model.js');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);
// Our parent block
describe('Users', () => {

  beforeEach((done) => {
    // Before each test we empty the database
    User.remove({}, (err) => {
      done();
    });
  });


  /*
   * Test the /GET route
   */
  describe('/GET users', () => {
    it('it should GET all the userss', (done) => {
      chai
          .request(app)
          .get('/api/users')
          .end((err, res) => {
            res.should.have.status(200);
            // res.body.should.be.a('array');
            // res.body.length.should.be.eql(0);
            done();
          });
    });
  });

});