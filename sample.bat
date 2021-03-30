@ECHO OFF
start cmd.exe /k "cd /d \ && dir && mongod --dbpath /data/db --replSet "rs0"" && ^
start cmd.exe /k mongo && ^
start cmd.exe /k "cd /d C:/Users/adcor/caic-final && npm run server"

ECHO Congratulations! Your first batch file executed successfully.
PAUSE