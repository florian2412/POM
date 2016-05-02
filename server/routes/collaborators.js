var express = require('express');
var router = express.Router();
var _ = require('lodash');
var bcrypt = require('bcryptjs');

var Collaborator = require('../models/Collaborator.js');
var Project = require('../models/Project.js');

var api_key  = 'key-1e5b8a89092328c8991dd07bf0c04f17';
var d        = 'miagepom.aqlli.com'; //sous domaine temporaire pour le projet -  valide pendant 4 mois
var from_    = "Mailgun Sandbox" + "<" + "postmaster@sandbox5f0051cc48324952845e2c6072ac3024.mailgun.org>";
const crypto = require('crypto');
var mailgun  = require('mailgun-js')({apiKey: api_key, domain: d});

router.get('/', getAllCollaborators);
router.post('/', createCollaborator);
router.get('/:id', getCollaborator);
router.put('/:id', updateCollaborator);
router.delete('/:id', deleteCollaborator);
router.post('/authenticate',authenticate);
router.get('/role/:role', getRoleCollaborators);
router.post('/resetPassword', sendNewPass);
router.get('/:id/projects', getProjectsCollaborator);

/* GET collaborators listing. */
function getAllCollaborators(req, res, next) {
    Collaborator.find(function (err, collaborators) {
        if (err)
            return next(err);
        res.json(collaborators);
    });
};

/* GET collaborators tasks listing. */
function getProjectsCollaborator(req, res, next) {
    Project.find({
            "collaborateurs":req.params.id
        },
        function (err, collaborators) {
            if (err)
                return next(err);
            res.json(collaborators);
        });
};

/* GET /collaborators/id */
/*function getTasksCollaborator(req, res, next) {
 console.log("OUIII");
 Collaborator.findById(req.params.id, function (err, collaborators) {
 if (err)
 return next(err);
 res.json(collaborators);
 });
 };*/

/* GET with query collaborators listing. */
function getRoleCollaborators(req, res, next) {
    Collaborator.find({"role" : req.params.role}, function (err, collaborators) {
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
            res.json({"success":false, "message": "Ce pseudo est déjà utilisé."});
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
            res.json({"success":true, "message": "Création du collaborateur réussie.", "data": req.body});
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
        if (coll && bcrypt.compareSync(req.body.mot_de_passe, coll.mot_de_passe)){
            var filtered_coll = _.omit(coll.toJSON(),'mot_de_passe');
            res.json({"success": true,"message": "Connexion réussie", "collaborator" : filtered_coll});
        }
        else return res.json({"success": false,"message":"Mot de passe incorrect"});
    });
};

/* envoie d'un nouveau mot de passe*/
function sendNewPass( req, res, next){

    Collaborator.findOne({"pseudo" : req.body.pseudo}, function (err, coll) {
        if (err) return next(err);
        if (!coll) return res.json({"success": false, "message": "Cet utilisateur n'existe pas. Impossible de réinitialiser son mot de passe."});
        resetPassword(coll);
        res.json({"success": true, "message": "Le nouveau mot de passe a été envoyé à l'adresse : " + coll.email});
    });

    function resetPassword(user){
        var newPass = crypto.randomBytes(6).toString('hex'); //generation du pwd
        var message = "Bonjour " + user.pseudo + ' , votre nouveau mot de passe est: ' + newPass;
        var data = {
            from: from_,
            to: user.email,
            subject: 'Votre nouveau mot de passe | POM',
            text: message
        };
        mailgun.messages().send( data, function ( error, body) {
            if( body && !error){ //update user password
                // Re-hash password
                newPass = bcrypt.hashSync(newPass, 10);
                Collaborator.findByIdAndUpdate({"_id" : user._id},{mot_de_passe: newPass}, function(err, coll){
                    if (err) return next(err);
                    if (coll) return res.json({"success": true, "message": "Envoi du nouveau mot de passe réussi."});
                    else res.json({"success": false, "message": "Utilisateur introuvable."});
                });
            }
        });
    }
};

module.exports = router;
