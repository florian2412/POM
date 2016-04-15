/*
var express = require('express');
var router = express.Router();

var Task = require('../models/Task.js');



router.get('/', function(req, res, next) {
    Task.find(function (err, tasks) {
        if (err)
            return next(err);
        res.json(tasks);

    });
});


router.post('/', function(req, res, next) {
    Task.create(req.body, function (err) {
        if (err)
            return next(err);
        res.json(req.body);
    });
});

router.get('/:id', function(req, res, next) {
    Task.findById(req.params.id, function (err, tasks) {
        if (err)
            return next(err);
        res.json(tasks);
    });
});


router.put('/:id', function(req, res, next) {
    Task.findByIdAndUpdate(req.params.id, req.body, function (err, tasks) {
        if (err)
            return next(err);
        res.json(tasks);
    });
});


router.delete('/:id', function(req, res, next) {
    Task.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err)
            return next(err);
        res.json(post);
    });
});

module.exports = router;
*/