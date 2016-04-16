var express = require('express');
var router = express.Router();
var RoleCollaborator = require('../models/RoleCollaborator.js');

/* GET RoleCollaborator listing. */
router.get('/', function(req, res, next) {
    RoleCollaborator.find(function (err, rolesCollaborator) {
        if (err)
            return next(err);
        res.json(rolesCollaborator);

    });
});

/* POST RoleCollaborator */
router.post('/', function(req, res, next) {
    RoleCollaborator.create(req.body, function (err) {
        if (err)
            return next(err);
        res.json(req.body);
    });
});

module.exports = router;
