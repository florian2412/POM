echo '## Démarrage de POM ##'

echo '## Lancement du serveur REST en local sur le port 3000 ##'
cd server/ && npm start&

echo '## Lancement du client POM en local sur le port 9000 ##'
cd client/ && grunt serve&

cd ../