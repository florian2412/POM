var express = require('express');
var router = express.Router();
var RoleCollaborator = require('../models/RoleCollaborator.js');

router.get('/',getAllRoles);
router.post('/', createRole);

/* GET RoleCollaborator listing. */
function getAllRoles(req, res, next) {
    RoleCollaborator.find(function (err, rolesCollaborator) {
        if (err)
            return next(err);
        res.json(rolesCollaborator);

    });
};

/* POST RoleCollaborator */
function createRole(req, res, next) {
    RoleCollaborator.create(req.body, function (err) {
        if (err)
            return next(err);
        res.json(req.body);
    });
};

module.exports = router;
