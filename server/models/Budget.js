/**
 *
 * Modèle de données pour une LigneBudgetaire stocké dans MongoDB
 *
 */

var mongoose = require('mongoose');

var schemaBudget = mongoose.Schema({
    libelle: String,
    montant_depart: Number,
    montant_restant: Number,
    description: String
});

module.exports = mongoose.model('Budget', schemaBudget);

