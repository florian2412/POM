/**
 *
 * Modèle de données pour un Projet stocké dans Mongo
 *
 */

var mongoose = require('mongoose');

var schemaProject = mongoose.Schema({
    nom: String,
    chef_projet: mongoose.Schema.ObjectId,
    date_debut: { type: Date, default: Date.now },
    date_fin_theorique: Date,
    date_fin_reelle: Date,
    statut : String, // En cours, Terminé, Annulé, Supprimé
    collaborateurs: [ mongoose.Schema.ObjectId ],
    infos_techniques: {
        creation: { type: Date, default: Date.now },
        modification:  { type: Date, default: Date.now }
    },
    ligne_budgetaire: mongoose.Schema.ObjectId

});

module.exports = mongoose.model('Project', schemaProject);

