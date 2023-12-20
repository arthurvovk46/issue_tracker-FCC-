const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('./server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  let test_id;
  
  suite('Create an issue', () => {

    test("1) Create an issue with every field", (done) => {

      const newIssue = {
        issue_title: 'Test Issue',
        issue_text : 'This is a test issue',
        created_by : 'Tester',
        assigned_to: 'Jack',
        status_text: 'Testing'
      };

      chai.request(server)
        .keepOpen()
        .post("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(    res.status, 200);
          assert.equal(    res.body.issue_title, 'Test Issue');
          assert.equal(    res.body.issue_text, 'This is a test issue');
          assert.isNotNull(res.body.created_on);
          assert.isNotNull(res.body.updated_on);
          assert.equal(    res.body.created_by, 'Tester');
          assert.equal(    res.body.assigned_to, 'Jack');
          assert.isTrue(   res.body.open);
          assert.equal(    res.body.status_text, 'Testing');
          assert.isString( res.body._id);
          test_id = res.body._id;
          done();
        });
    });

    test("2) Create an issue with only required fields", (done) => {

      const newIssue = {
        issue_title: 'Test Issue',
        issue_text : 'This is a test issue',
        created_by : 'Tester',
      };

      chai.request(server)
        .keepOpen()
        .post("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(    res.status, 200);
          assert.equal(    res.body.issue_title, 'Test Issue');
          assert.equal(    res.body.issue_text, 'This is a test issue');
          assert.isNotNull(res.body.created_on);
          assert.isNotNull(res.body.updated_on);
          assert.equal(    res.body.created_by, 'Tester');
          assert.equal(    res.body.assigned_to, '');
          assert.isTrue(   res.body.open);
          assert.equal(    res.body.status_text, '');
          assert.isString( res.body._id);
          done();
        });
    });

    test("3) Create an issue with missing required fields", (done) => {

      const newIssue = {
        issue_title: 'Test Issue',
        issue_text : 'This is a test issue',
      };

      chai.request(server)
        .keepOpen()
        .post("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });

  suite('Retrieve an issue', () => {

    test("4) View issues on a project", (done) => {

      chai.request(server)
        .keepOpen()
        .get("/api/issues/test_project")
        .end((err, res) => {

          assert.equal(    res.status, 200);
          assert.isArray(  res.body);
          assert.isOk(     res.body);
          assert.isString( res.body[0].issue_title);
          assert.isString( res.body[0].issue_text);
          assert.isNotNull(res.body[0].created_on);
          assert.isNotNull(res.body[0].updated_on);
          assert.isString( res.body[0].created_by);
          assert.isString( res.body[0].assigned_to);
          assert.isTrue(   res.body[0].open);
          assert.isString( res.body[0].status_text);
          assert.isString( res.body[0]._id);
          done();
        });
    });

    test("5) View issues on a project with one filter", (done) => {

      chai.request(server)
        .keepOpen()
        .get("/api/issues/test_project?created_by=Tester")
        .end((err, res) => {

          assert.equal(    res.status, 200);
          assert.isArray(  res.body);
          assert.isOk(     res.body);
          assert.isString( res.body[0].issue_title);
          assert.isString( res.body[0].issue_text);
          assert.isNotNull(res.body[0].created_on);
          assert.isNotNull(res.body[0].updated_on);
          assert.equal(    res.body[0].created_by, 'Tester');
          assert.isString( res.body[0].assigned_to);
          assert.isTrue(   res.body[0].open);
          assert.isString( res.body[0].status_text);
          assert.isString( res.body[0]._id);
          done();
        });
    });

    test("6) View issues on a project with multiple filters", (done) => {

      chai.request(server)
        .keepOpen()
        .get("/api/issues/test_project?created_by=Tester&status_text=Testing")
        .end((err, res) => {

          assert.equal(    res.status, 200);
          assert.isArray(  res.body);
          assert.isOk(     res.body);
          assert.isString( res.body[0].issue_title);
          assert.isString( res.body[0].issue_text);
          assert.isNotNull(res.body[0].created_on);
          assert.isNotNull(res.body[0].updated_on);
          assert.equal(    res.body[0].created_by, 'Tester');
          assert.isString( res.body[0].assigned_to);
          assert.isTrue(   res.body[0].open);
          assert.equal(    res.body[0].status_text, 'Testing');
          assert.isString( res.body[0]._id);
          done();
        });
    });
  });

  suite('Update an issue', () => {

    test("7) Update one field on an issue", (done) => {

      const newIssue = {
        _id : test_id,
        issue_title: 'New Test Issue'
      };

      chai.request(server)
        .keepOpen()
        .put("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, test_id);
          done();
        });
    });

    test("8) Update multiple fields on an issue", (done) => {

      const newIssue = {
        _id : test_id,
        assigned_to: 'Rosy',
        status_text: 'Triaged'
      };

      chai.request(server)
        .keepOpen()
        .put("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, test_id);
          done();
        });
    });

    test("9) Update an issue with missing _id", (done) => {

      const newIssue = { issue_text : 'This is a new test issue' };

      chai.request(server)
        .keepOpen()
        .put("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    test("10) Update an issue with no fields to update", (done) => {

      const newIssue = { _id : test_id };

      chai.request(server)
        .keepOpen()
        .put("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id, test_id);
          done();
        });
    });

    test("11) Update an issue with an invalid _id", (done) => {

      const newIssue = { 
        _id : '6570ce45ea7eb5775d5b7---',
        issue_text : 'This is a new test issue'
      };

      chai.request(server)
        .keepOpen()
        .put("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'invalid _id');
          assert.equal(res.body._id, '6570ce45ea7eb5775d5b7---');
          done();
        });
    });
  });

  suite('Delete an issue', () => {

    test("12) Delete an issue", (done) => {

      const newIssue = { _id : test_id };

      chai.request(server)
        .keepOpen()
        .delete("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted');
          assert.equal(res.body._id, test_id);
          done();
        });
    });

    test("13) Delete an issue with an invalid _id", (done) => {

      const newIssue = { _id : '6570ce45ea7eb5775d5b7---' };

      chai.request(server)
        .keepOpen()
        .delete("/api/issues/test_project")
        .send(newIssue)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'invalid _id');
          assert.equal(res.body._id, '6570ce45ea7eb5775d5b7---');
          done();
        });
    });

    test("14) Delete an issue with missing _id", (done) => {

      chai.request(server)
        .keepOpen()
        .put("/api/issues/test_project")
        .send({})
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
