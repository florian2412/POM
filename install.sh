echo '## Démarrage de POM ##'

echo '## Lancement du serveur REST en local sur le port 3000 ##'
cd server/ && npm start&

echo '## Lancement du client POM en local sur le port 9000 ##'
cd client/ && grunt serve&

#curl -H "Content-Type: application/json" -d '{"nom":"Projet initial","chef_projet":"Florian","statut":"En cours","ligne_budgetaire":"30000"}' -X POST http://localhost:3000/projects