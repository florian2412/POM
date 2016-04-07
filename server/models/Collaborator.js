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
    mot_de_passe: String, // TODO Voir pour crypter
    manager: String,
    status: String,
    cout_horaire: Number
});

module.exports = mongoose.model('Collaborateur', schemaCollaborator);