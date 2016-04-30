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
    role: String, // admin, collaborateur, manager
    email: String,
    date_creation: { type: Date, default: Date.now },
    date_derniere_modif: { type: Date }
});

module.exports = mongoose.model('Collaborateur', schemaCollaborator);