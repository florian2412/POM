var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dbPOM', function(err) {
    if(err)
        console.log('connection error', err);
    else
        console.log('connection successful');
});


// Schema Project
var schemaProject = mongoose.Schema({
    name: String,
    cp: String,
    statut : String,
    dateDebut: { type: Date, default: Date.now },
    dateFin: { type: Date, default: Date.now },
    budget: Number,
    collaborateurs: [ {name: String} ],
});

// Collection Project
var Projects = mongoose.model('Projet', schemaProject);

// Test projets
var collaborateurs = [{name:'Tava'}, {name:'Pierrick'}, {name:'Florian'}];
var projet1 = new Projects({ name: 'Projet 1', cp: 'Tavahiura', status: "En cours", budget: 20000, collaborateurs: collaborateurs });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  //Success !
  console.log("Connection à la base de données réussie !");



  projet1.save(function (err, projectInserted) {
	if (err) 
		return console.error(err);

  	console.log(projectInserted);
  });



	Projects.find(function (err, projects) {
  		if (err) 
  			return console.error(err);
  		else
  			console.log(projects);
  	})


	Projects.find(function (err, projects) {
		if(err)
			return console.error(err);
		else
			console.log(projects);
	});


});



