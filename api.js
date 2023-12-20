'use strict';
const mongoose = require("mongoose");
let Issue;

module.exports = (app) => {
  
  app.route('/api/issues/:project')
    .get(async (req, res) => {
      //retrieve parameters
      let { project } = req.params;
      let { issue_title,
           issue_text,
           created_by,
           assigned_to,
           status_text,
           _id } = req.query;
      //searching for project
      try {
        // Attempt to retrieve the existing model for the project
        Issue = mongoose.model(project);
        
      } catch (error) {
        //catch error by project absence
        console.error(`Model '${project}' not found.`);
      }
      //retrieve process
      try {
        //set up query object
        let query = {};
        //filling query object
        if (issue_title) query.issue_title = issue_title;
        if (issue_text)  query.issue_text  = issue_text;
        if (created_by)  query.created_by  = created_by;
        if (assigned_to) query.assigned_to = assigned_to;
        if (status_text) query.status_text = status_text;
        if (_id)         query._id         = _id;
        // Find issues using the constructed query
        let issues = await Issue.find(query);

        res.json(issues);
        
      } catch (error) {
        //catch error by retrieving
        console.error(error);
      }
    })
    .post((req, res) => {
      //retrieve parameters
      let { project } = req.params;
      let { issue_title,
           issue_text,
           created_by,
           assigned_to,
           status_text } = req.body;
      //searching for project
      try {
        // Attempt to retrieve the existing model for the project
        Issue = mongoose.model(project);
        
      } catch (error) {
        // If the model doesn't exist, create a new one
        Issue = mongoose.model(
          project,
          new mongoose.Schema(
            { issue_title : { type: String , required: true },
              issue_text  : { type: String , required: true },
              created_on  : { type: Date   , default : Date.now },
              updated_on  : { type: Date   , default : Date.now },
              created_by  : { type: String , required: true },
              assigned_to : { type: String },
              open        : { type: Boolean, default : true },
              status_text : { type: String }
            },
            { collection: project }
        ));
      }
      //create process
      const createIssue = async (
        issue_title,
        issue_text,
        created_by,
        assigned_to = "",
        status_text = "") => {
        
        try {
          //if required field isn't provided
          if (!issue_title ||
              !issue_text  ||
              !created_by) {
            
            res.json({ error: 'required field(s) missing' });
            
          } else {
            //create issue
            let issue = new Issue({
              issue_title : issue_title,
              issue_text  : issue_text,
              created_by  : created_by,
              assigned_to : assigned_to,
              status_text : status_text
            });
            let data = await issue.save();
          
            res.send(data);
          }
        } catch (err) {
          //catch error by creating
          console.error(err);
          throw err; 
        }
      };
      //attempt to create issue
      createIssue(
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text);
    })
    .put(async (req, res) => {
      //retrieve parameters
      let { project } = req.params;
      let { issue_title,
           issue_text,
           created_by,
           assigned_to,
           status_text,
           _id } = req.body;
      //searching for project
      try {
        // Attempt to retrieve the existing model for the project
        Issue = mongoose.model(project);
        
      } catch (error) {
        //catch error by project absence
        console.error(`Model '${project}' not found.`);
      }
      //update process
      try {
        //set up query object
        let query = { updated_on: new Date().toISOString() };
        //if no _id provided
        if (!_id) {
          
          res.json({ error: 'missing _id' });
          //if updating fields aren't provided
        } else if (!issue_title &&
            !issue_text &&
            !created_by &&
            !assigned_to &&
            !status_text) {

          res.json({ error: 'no update field(s) sent', _id: _id });
          
        } else {
          //filling query object
          if (issue_title) query.issue_title = issue_title;
          if (issue_text)  query.issue_text  = issue_text;
          if (created_by)  query.created_by  = created_by;
          if (assigned_to) query.assigned_to = assigned_to;
          if (status_text) query.status_text = status_text;
          //attempt to update
          let result = await Issue.findOneAndUpdate({ _id: _id }, query);
          
          result == null
            ? res.json({ error: 'could not update', _id: _id })
            : res.json({ result: 'successfully updated', _id: _id });
        }
    } catch (error) {
      //catch error by updating
      res.json({ error: 'invalid _id', _id: _id })
    }
    })
    .delete(async (req, res) => {
      //retrieve parameters
      let { project } = req.params;
      let { _id } = req.body;
      //searching for project
      try {
        // Attempt to retrieve the existing model for the project
        Issue = mongoose.model(project);

      } catch (error) {
        //catch error by project absence
        console.error(`Model '${project}' not found.`);
      }
      //delete process
      try {
        //if no _id provided
        if (!_id) {

          res.json({ error: 'missing _id' });
        
        } else {
          //attempt to delete
          let result = await Issue.findOneAndDelete({ _id: _id });
          
          result == null
            ? res.json({ error: 'could not delete', _id: _id })
            : res.json({ result: 'successfully deleted', _id: _id });
        }
      } catch (error) {
        //catch error by deleting
        res.json({ error: 'invalid _id', _id: _id })
      }
    });
};
