/**
 *
 * Modèle de données pour une Tache stocké dans Mongo
 *
 */

var mongoose = require('mongoose');

var schemaTask = mongoose.Schema({
    libelle: String,
    code: String,
    description: String,
    date_debut: Date,
    date_fin_theorique: Date,
    date_fin_reelle: Date,
    statut: String,
    projet_id: mongoose.Schema.ObjectId,
    collaborateurs: [ mongoose.Schema.ObjectId ],
    date_creation: { type: Date, default: Date.now },
    date_derniere_modif : { type: Date }
});

module.exports = mongoose.model('Task', schemaTask);

