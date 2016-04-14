/**
 *
 * Modèle de données pour un Projet stocké dans MongoDB
 *
 */

var mongoose = require('mongoose');

var schemaProject = mongoose.Schema({
    nom: String,
    chef_projet: mongoose.Schema.ObjectId,
    date_debut: Date,
    date_fin_theorique: Date,
    date_fin_reelle: Date,
    statut : String, // En cours, Terminé, Annulé, Supprimé, Initalisation
    collaborateurs: [ mongoose.Schema.ObjectId ],
    ligne_budgetaire: mongoose.Schema.ObjectId,
    description: String,

    infos_techniques: {
        creation: { type: Date, default: Date.now },
        modification:  { type: Date, default: Date.now }
    }

});

module.exports = mongoose.model('Project', schemaProject);

