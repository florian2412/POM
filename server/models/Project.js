var mongoose = require('mongoose');

var schemaProject = mongoose.Schema({
    name: String,
    cp: String,
    statut : String,
    dateDebut: { type: Date, default: Date.now },
    dateFin: { type: Date, default: Date.now },
    budget: Number,
    collaborateurs: [ {name: String} ],
});

module.exports = mongoose.model('Project', schemaProject);