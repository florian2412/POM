echo ## Mise à jour de POM ##
echo ## Mise à jour serveur REST ##
cd server/ 
call npm update
cd ..
echo ## Mise à jour du client POM ##
cd client/ 
call npm update 
call bower update
