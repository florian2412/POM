var express = require('express');
var router = express.Router();

var Budget = require('../models/Budget.js');

router.get('/', getAllBudget);
router.post('/', createBudget);
router.get('/:id', getBudget);
router.delete('/:id', deleteBudget);

function getAllBudget(req, res, next) {
    Budget.find(function (err, budgets) {
        if (err){ return next(err);}
        if(!budgets) res.json({"success" : false, "message": "Impossible de récupérer tous les budgets.", "data" : budgets});
        else res.json({"success":true, "message": "Récupération de tous les budgets.", "data" : budgets});
    });
};

function getBudget(req, res, next) {
    Budget.findById(req.params.id, function (err, budgets) {
        if (err){ return next(err);}
        if (!budgets) res.json({"success" : false, "message": "Impossible de récupérer le budget.", "data" : budgets});
        else res.json({"success" : true, "message": "Récupération du budget réussie.", "data" : budgets});    
    });
};

function createBudget(req, res, next) {
    Budget.create(req.body, function (err) {
        if (err){
            res.json({"success" : false, "message": "Echec de la création du budget.", "data" : req.body});
            return next(err);
        }
        res.json({"success" : true, "message": "Création du budget réussie.", "data" : req.body});
    });
};

function deleteBudget(req, res, next) {
    Budget.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err){return next(err);}
        if(!post) res.json({"success" : false, "message": "Echec de la suppression du budget.", "data" : post});
        else res.json({"success" : true, "message": "Suppression du budget réussie.", "data" : post});      
    });
};

module.exports = router;
