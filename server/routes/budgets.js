var express = require('express');
var router = express.Router();

var Budget = require('../models/Budget.js');

router.get('/', getAllBudget);
router.post('/', createBudget);
router.get('/:id', getBudget);
router.delete('/:id', deleteBudget);

function getAllBudget(req, res, next) {
    Budget.find(function (err, budgets) {
        if (err)
            return next(err);
        res.json(budgets);
    });
};

function getBudget(req, res, next) {
    Budget.findById(req.params.id, function (err, budgets) {
        if (err)
            return next(err);
        res.json(budgets);
    });
};

function createBudget(req, res, next) {
    Budget.create(req.body, function (err) {
        if (err)
            return next(err);
        res.json(req.body);
    });
};


function deleteBudget(req, res, next) {
    Budget.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err)
            return next(err);
        res.json(post);
    });
};

module.exports = router;
