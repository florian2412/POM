/**
 *
 * Modèle de données pour une Tache stocké dans Mongo
 *
 */

var mongoose = require('mongoose');

var schemaTask = mongoose.Schema({
    libelle: String,
    date_debut: Date,
    date_fin: Date,
    statut : String,
    projet: String,
    collaborateurs: [ String ]
});

module.exports = mongoose.model('Task', schemaTask);

