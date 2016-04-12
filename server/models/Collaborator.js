/**
 *
 * Modèle de données pour un Collaborateur stocké dans Mongo
 *
 */

var mongoose = require('mongoose');

var schemaCollaborator = mongoose.Schema({
    nom: String,
    prenom: String,
    pseudo: String,
    mot_de_passe: String,
    manager: mongoose.Schema.ObjectId,
    status: String,
    cout_horaire: Number,
    roles: [String] // Admin, Collaborateur, Manager
});

module.exports = mongoose.model('Collaborateur', schemaCollaborator);