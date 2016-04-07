/**
 *
 * Modèle de données pour une Tache stocké dans Mongo
 *
 */

var mongoose = require('mongoose');

var Project = require('../models/Project.js');

var schemaTask = mongoose.Schema({
    libelle: String,
    date_debut: Date,
    date_fin: Date,
    statut : String,
    //projet: Project,
    collaborateurs: [ String ]
});

module.exports = mongoose.model('Task', schemaTask);

