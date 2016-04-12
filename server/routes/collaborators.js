var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var Collaborator = require('../models/Collaborator.js');

router.get('/', getAllCollaborators);
router.post('/', createCollaborator);
router.get('/:id', getCollaborator);
router.put('/:id', updateCollaborator);
router.delete('/:id', deleteCollaborator);
router.post('/authenticate',authenticate);


/* GET collaborators listing. */
function getAllCollaborators(req, res, next) {
    Collaborator.find(function (err, collaborators) {
        if (err)
            return next(err);
        res.json(collaborators);
    });
};

/* POST /collaborators */
function createCollaborator(req, res, next) {
    Collaborator.findOne({"pseudo" : req.body.pseudo}, function(err, coll){
        if (err) return next(err);
        if (coll) {
                // username already exists
                next(new Error("Ce pseudo est déjà utilisé : " + req.body.pseudo));
            } else {
                createColl();
            }
    });
    function createColl(){
        var collaborator = _.omit(req.body, 'mot_de_passe');
        // add hashed password to user object
        collaborator.mot_de_passe = bcrypt.hashSync(req.body.mot_de_passe, 10);
        Collaborator.create(collaborator, function (err) {
            if (err)
                return next(err);
            // On retourne le body de la réponse
            res.json(req.body);
        });
    }
    
};

/* GET /collaborators/id */
function getCollaborator(req, res, next) {
    Collaborator.findById(req.params.id, function (err, collaborators) {
        if (err)
            return next(err);
        res.json(collaborators);
    });
};

/* PUT /collaborators/:id */
function updateCollaborator(req, res, next) {
    Collaborator.findByIdAndUpdate(req.params.id, req.body, function (err, collaborators) {
        if (err)
            return next(err);
        res.json(collaborators);
    });
};

/* DELETE /collaborators/:id */
function deleteCollaborator(req, res, next) {
    Collaborator.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err)
            return next(err);
        res.json(post);
    });
};

/* authentication */

/* POST authenticate */
function authenticate(req, res, next) {
    Collaborator.findOne({"pseudo" : req.body.pseudo}, function (err, coll) {
      if (err) return next(err);
      if (!coll) return res.json({"success": false, "message":"Pseudo incorrect"});  
      if (coll && bcrypt.compareSync(req.body.mot_de_passe, coll.mot_de_passe))
        res.json({"success": true,"message": "Connexion réussie", "collaborator" : coll});  
      else return res.json({"success": false,"message":"Mot de passe incorrect"});  
    });
};


module.exports = router;
