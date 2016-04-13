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
    statut: String,
    cout_horaire: Number,
    role: String, // Admin, Collaborateur, Manager
    email: String
});

module.exports = mongoose.model('Collaborateur', schemaCollaborator);