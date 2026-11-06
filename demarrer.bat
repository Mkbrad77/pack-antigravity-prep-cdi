@echo off
chcp 65001 >nul
echo ====================================================================
echo   Cockpit Preparation CDI ^& Certifications (AWS CLF, DEA, dbt)
echo   Candidat : Auren (Ingenieur EPITA - Objectif CDI Avril 2027)
echo ====================================================================
echo.
if not exist "node_modules" (
    echo [1/2] Installation initiale des dependances locales...
    call npm install
)
echo [2/2] Demarrage du serveur local SQLite et de l'interface sur http://127.0.0.1:5173 ...
start "" "http://127.0.0.1:5173"
call npm run start
