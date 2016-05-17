echo '##mongodump -d databaseName -o databaseBackup##'

echo '## Chargement du jeu de données ##'
set here=%cd%
echo %here%
cd C:\Program Files\MongoDB\Server\3.2\bin && .\mongorestore.exe -d dbPOM %here%\data\dbPOMbackup\dbPOM &