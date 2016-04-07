

var mongoose = require('mongoose');

var schemaProject = mongoose.Schema({
    nom: String,
    chef_projet: String,
    date_debut: { type: Date, default: Date.now },
    date_fin_theorique: Date,
    date_fin_reelle: Date,
    statut : String, // En cours, Terminé, Annulé, Supprimé
    collaborateurs: [ String ],
    infos_techniques: {
        creation: Date,
        modification: Date
    },
    ligne_budgetaire: String

});

module.exports = mongoose.model('Project', schemaProject);