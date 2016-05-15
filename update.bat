echo '## Mise à jour de POM ##'

echo '## Mise à jour serveur REST ##'
cd server/ && npm update&

echo '## Mise à jour du client POM ##'
cd client/ && npm update& && bower update&