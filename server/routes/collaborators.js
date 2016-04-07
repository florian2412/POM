var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//var mongoose = require('mongoose');
var Collaborator = require('../models/Collaborator.js');


/* GET collaborators listing. */
router.get('/', function(req, res, next) {
    Collaborator.find(function (err, collaborators) {
        if (err)
            return next(err);
        res.json(collaborators);
    });
});

/* POST /collaborators */
router.post('/', function(req, res, next) {
    Collaborator.create(req.body, function (err) {
        if (err)
            return next(err);

        // On retourne le body de la réponse
        res.json(req.body);
    });
});

/* GET /collaborators/id */
router.get('/:id', function(req, res, next) {
    Collaborator.findById(req.params.id, function (err, collaborators) {
        if (err)
            return next(err);
        res.json(collaborators);
    });
});

/* PUT /collaborators/:id */
router.put('/:id', function(req, res, next) {
    Collaborator.findByIdAndUpdate(req.params.id, req.body, function (err, collaborators) {
        if (err)
            return next(err);
        res.json(collaborators);
    });
});

/* DELETE /collaborators/:id */
router.delete('/:id', function(req, res, next) {
    Collaborator.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err)
            return next(err);
        res.json(post);
    });
});

module.exports = router;
