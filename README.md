# POM - Plan, Organize & Manage

Les instructions d'installations ont été vérifiés pour Window.
Nous ne pouvons pas vous garantir que les mêmes manipulations fonctionneront correctement
sous un système UNIX.
 
# Pré requis :
	- NodeJS
	- MongoDB avec une instance du service démarrée
	- Git (Optionnel : Si vous voulez récupérer les sources via Github)

# Installation :
###### Dans client :
	npm install (peut prendre du temps)
	bower install

###### Dans server :
	npm install (peut prendre du temps)
		
# Lancement du serveur (API) :
###### Dans server :
	npm start
		
Si toutes les commande précédentes se sont bien passées, vous êtes normalement connecté en local à la base de donnée MongoDB sur le port 27017.

L'API est également lancée en local et écoute sur le port 3000.
	
Dans la console, vous devriez voir :
```
$ npm start

> pom-api@0.0.1 start C:\Users\FlorianXPS\Desktop\Projet TDA\TEST INSTALLATION\POM\server
> node ./app.js

Server listening at http://localhost:3000/
Connection successful at http://localhost:27017/dbPOM
```
	
# Lancement du client :
###### Dans client :
	grunt serve
		
Comme pour le serveur, si tout s'est bien passé, l'application POM est lancé sur le port 9000 en local sur votre ordinateur dans votre navigateur favori.
	
Dans la console, vous devriez voir quelque chose de similaire : 
```
$ grunt serve
Running "serve" task

Running "clean:server" (clean) task
>> 0 paths cleaned.

Running "wiredep:app" (wiredep) task

Running "concurrent:server" (concurrent) task

Running "copy:styles" (copy) task
Copied 3 files

Done, without errors.


Execution Time (2016-05-15 12:46:44 UTC)
loading tasks               208ms  ████████████████████████ 69%
loading grunt-contrib-copy   60ms  ███████ 20%
copy:styles                  33ms  ████ 11%
Total 302ms

Running "postcss:server" (postcss) task
>> 3 processed stylesheets created.

Running "connect:livereload" (connect) task
Started connect web server on http://localhost:9000

Running "watch" task
Waiting...
```
		
###### Vous pouvez maintenant utiliser l'application POM dans votre navigateur par défaut.