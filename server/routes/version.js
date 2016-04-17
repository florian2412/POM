var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('../config.json');

router.get('/', getVersion);

function getVersion(req, res, next) {
    res.json(config.version);
};

module.exports = router;

