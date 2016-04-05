var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dbPOM');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  //Success !
  console.log("Connection à la base de données réussie !");

	

  silence.save(function (err, silence) {
	if (err) 
		return console.error(err);
  	console.log(silence.name);
  });



 /* ColKitten.find(function (err, kittens) {
  	if (err) 
  		return console.error(err);
  	console.log(kittens);
  })*/


	console.log(ColKitten.find());

});


var resource = mongoose.Schema({
    name: String,
    age: String


});



var ColKitten = mongoose.model('Kitten', kittySchema);

var silence = new ColKitten({ name: 'Silence', age: '17ans' });
