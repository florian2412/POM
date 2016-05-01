var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var settings = require('../settings.json');

router.get('/', getAllSettings);
router.get('/roles', getRoles);
router.get('/fonctions', getFonctions);
router.get('/statuts', getStatuts);

function getAllSettings(req, res, next) {
    res.json(settings);
};

function getRoles(req, res, next) {
	res.json(settings.roles);
};

function getFonctions(req, res, next) {
    res.json(settings.fonctions);
};

function getStatuts(req, res, next) {
    res.json(settings.statuts);
};

module.exports = router;

