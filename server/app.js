var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var config = require('./config.json');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// API 
app.use('/projects', require('./routes/projects'));
app.use('/collaborators', require('./routes/collaborators'));
app.use('/budgets', require('./routes/budgets'));
app.use('/version', require('./routes/version'));
app.use('/settings', require('./routes/settings'));


// Gestion CORS
app.all('*', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    if ('OPTIONS' == req.method)
        return res.send(200);
    next();
});



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


// Connexion BDD Mongo avec module mongoose
var mongoose = require('mongoose');

if(config.cloudMode) {
    mongoose.connect(config.connectionStringDev + config.mongodbPortDev + "/" + config.mongoDBNameDev, function(err) {
        if(err) {
            console.log('Connection error !', err);
        } else {
            console.log('Connection successful at http://' + config.connectionStringDev + config.mongodbPortDev + "/" + config.mongoDBNameDev);
        }
    });
}
else {
    mongoose.connect(config.connectionString + config.mongodbPort + "/" + config.mongoDBName, function(err) {
        if(err) {
            console.log('Connection error !', err);
        } else {
            console.log('Connection successful at http://' + config.connectionString + config.mongodbPort + "/" + config.mongoDBName);
        }
    });
}

// Start server
app.listen(config.serverPort, function () {
    console.log('Server listening at ' + config.apiUrl);
});