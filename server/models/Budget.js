/**
 *
 * Modèle de données pour une partie d'une Ligne_budgetaire d'un Projet stocké dans MongoDB
 *
 */

var mongoose = require('mongoose');

var schemaBudget = mongoose.Schema({
    libelle: String,
    montant: Number,
    description: String
});

module.exports = mongoose.model('Budget', schemaBudget);