echo ## Installation du serveur de POM ##
echo ## Installation du serveur REST en local sur le port 3000 ##
cd server/ 
call npm install
cd ..
echo ## Installation de POM ##
echo ## Installation du client POM en local sur le port 9000 ##
cd client/
call npm install
call bower install