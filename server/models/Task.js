/**
 *
 * Modèle de données pour une Tache stocké dans Mongo
 *
 */

var mongoose = require('mongoose');
//var Collaborator = require('../models/Collaborator.js');

var schemaTask = mongoose.Schema({
    libelle: String,
    date_debut: Date,
    date_fin: Date,
    statut : String,
    projet: mongoose.Schema.ObjectId,
    collaborateurs: [ mongoose.Schema.ObjectId ],
  	//collaborateurs1 : [ Collaborator.schema ]
});

module.exports = mongoose.model('Task', schemaTask);

