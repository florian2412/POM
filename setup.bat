echo '## Installation de POM ##'

echo '## Installation du serveur REST en local sur le port 3000 ##'
cd server/ && npm install&

echo '## Installation du client POM en local sur le port 9000 ##'
cd client/ && npm install& && bower install&