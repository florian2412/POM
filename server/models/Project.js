/**
 *
 * Modèle de données pour un Projet stocké dans MongoDB
 *
 */

var mongoose = require('mongoose');
var Task = require('../models/Task.js');

var schemaProject = mongoose.Schema({

    nom: String,

    chef_projet: mongoose.Schema.ObjectId,

    date_debut: { type: Date },

    date_fin_theorique: { type: Date },

    date_fin_reelle: { type: Date },

    statut : String, // En cours, Terminé, Annulé, Supprimé, Initial

    collaborateurs: [ mongoose.Schema.ObjectId ],

    ligne_budgetaire: {
        id: mongoose.Schema.ObjectId,
        montant_restant: Number
    },

    description: String,

    date_creation: { type: Date, default: Date.now },

    taches: [ Task.schema ]

});

module.exports = mongoose.model('Project', schemaProject);

