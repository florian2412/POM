# POM - Plan, Organize & Manage

Les instructions d'installations ont été vérifiés pour Windows.
Nous ne pouvons pas vous garantir que les mêmes manipulations fonctionneront correctement
sous un système UNIX.
 
## Pré requis :
	- NodeJS
	- MongoDB avec une instance du service démarrée
	- Git (Optionnel : Si vous voulez récupérer les sources via Github)

[Lien NodeJS téléchargement](https://nodejs.org/en/)

[Lien MongoDB documentation d'installation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

[Lien GIT téléchargement](https://git-scm.com/download/win)

# 1. Installation et lancement simplifié de POM

## IMPORTANT
###### Avant de commencer, veuillez vérifier que le répertoire du projet POM et le répertoire d'installation de MongoDB soit sur le même disque, en général le disque C et que le chemin du projet ne contienne pas d'espaces.

## Installation :	
- Lancer le fichier setup.bat pour installer POM, le serveur et tous leurs composants

## Chargement de la base de données de démo :
- Lancer le fichier loadDataset.bat, une nouvelle base de données de POM se charge

## Lancement du serveur (API) et du client (POM) :
- Lancer le fichier launch.bat

##### Deux invités de commandes doivent s'ouvrir et lancer l'application dans votre navigateur favori
##### Vous pouvez maintenant accéder à l'application via l'URL suivante : [POM](http://localhost:9000)

## (Optionnel) Mise à jour des composants de POM
- Lancer le fichier update.bat

# 2. Installation et lancement manuel de POM
	
## Installation :
###### Dans client :
	npm install (peut prendre du temps)
	bower install

###### Dans server :
	npm install (peut prendre du temps)
		
## Lancement du serveur (API) :
###### Dans server :
	npm start
		
Si toutes les commande précédentes se sont bien passées, vous êtes normalement connecté en local à la base de données MongoDB sur le port 27017.

L'API est également lancée en local et écoute sur le port 3000.
	
Dans la console, vous devriez voir :
```
$ npm start

> pom-api@0.0.1 start C:\Users\FlorianXPS\Desktop\Projet TDA\TEST INSTALLATION\POM\server
> node ./app.js

Server listening at http://localhost:3000/
Connection successful at http://localhost:27017/dbPOM
```
	
## Lancement du client :
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
		
###### Vous pouvez maintenant utiliser l'application [POM](http://localhost:9000) dans votre navigateur par défaut.