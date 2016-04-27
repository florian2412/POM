var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//var mongoose = require('mongoose');
var Project = require('../models/Project.js');

//router.get('/:id/tasks', getProjectsCollaborator);

/* GET projects listing. */
router.get('/', function(req, res, next) {
    Project.find(function (err, projects) {
        if (err)
			return next(err);
        res.json(projects);
        
   	});
});

/* GET project collaborator tasks. */
/*
function getProjectsCollaboratorTasks(req, res, next) {
    Project.find({
            "collaborateurs":req.params.id
        },
        function (err, collaborators) {
            if (err)
                return next(err);
            res.json(collaborators);
        });
};
*/

/* POST /projects */
router.post('/', function(req, res, next) {
  Project.create(req.body, function (err) {
      if (err)
          return next(err);
      res.json(req.body);
  });
});

/* GET /projects/id */
router.get('/:id', function(req, res, next) {
  Project.findById(req.params.id, function (err, projects) {
    if (err) 
    	return next(err);
    res.json(projects);
  });
});

/* PUT /projects/:id */
router.put('/:id', function(req, res, next) {
  Project.findByIdAndUpdate(req.params.id, req.body, function (err, projects) {
    if (err) 
    	return next(err);
    res.json(projects);
  });
});

/* DELETE /projects/:id */
router.delete('/:id', function(req, res, next) {
  Project.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) 
    	return next(err);
    res.json(post);
  });
});

/* GET collaborators tasks listing. */
/*router.delete('/:id', function(req, res, next) {
function getTasksCollaborator(req, res, next) {
    Project.find({
            "taches.collaborateurs":req.params.id
        },
        function (err, collaborators) {
            if (err)
                return next(err);
            res.json(collaborators);
        });
};
*/

module.exports = router;
