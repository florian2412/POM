/**
 * Created by fpussacq on 07/04/16.
 */
var mongoose = require('mongoose');

var schemaCollaborateur = mongoose.Schema({
    nom: String,
    prenom: String,
    pseudo: String,
    mot_de_passe: String, // TODO Voir pour crypter
    manager: String,
    status: String,
    cout_horaire: Number
});

module.exports = mongoose.model('Collaborateur', schemaCollaborateur);