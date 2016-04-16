/**
 *
 * Modèle de données pour les roles des collaborateurs (admin, manager, collaborateur, etc) stocké dans Mongo
 *
 */

var mongoose = require('mongoose');

var schemaRoleCollaborator = mongoose.Schema({
    libelle_long: String,
    libelle_court: String
});

module.exports = mongoose.model('RoleCollaborator', schemaRoleCollaborator);

