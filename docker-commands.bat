@echo off
chcp 65001 >nul
title Ticket Hub - Docker Commands

:menu
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      TICKET HUB DOCKER                      ║
echo ║                    Comandos de Desenvolvimento               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo [1] Construir imagem Docker
echo [2] Iniciar aplicação completa (Frontend + Database)
echo [3] Iniciar apenas Frontend
echo [4] Iniciar apenas Database
echo [5] Parar aplicação
echo [6] Ver logs da aplicação
echo [7] Ver logs do banco de dados
echo [8] Acessar shell do container
echo [9] Conectar ao banco PostgreSQL
echo [10] Limpar containers e imagens
echo [11] Reconstruir e iniciar
echo [12] Ver status dos containers
echo [13] Gerenciar banco de dados
echo [0] Sair
echo.
set /p choice="Escolha uma opção (0-13): "

if "%choice%"=="1" goto build
if "%choice%"=="2" goto start_all
if "%choice%"=="3" goto start_frontend
if "%choice%"=="4" goto start_database
if "%choice%"=="5" goto stop
if "%choice%"=="6" goto logs
if "%choice%"=="7" goto logs_db
if "%choice%"=="8" goto shell
if "%choice%"=="9" goto connect_db
if "%choice%"=="10" goto clean
if "%choice%"=="11" goto rebuild
if "%choice%"=="12" goto status
if "%choice%"=="13" goto database_menu
if "%choice%"=="0" goto end
goto menu

:build
echo.
echo Construindo imagem Docker...
docker-compose build --no-cache
echo ✅ Imagem construída com sucesso!
pause
goto menu

:start_all
echo.
echo Iniciando aplicação completa (Frontend + Database)...
docker-compose up -d
echo.
echo Aguardando serviços ficarem disponíveis...
timeout /t 10 /nobreak >nul
echo ✅ Aplicação iniciada!
echo 🌐 Frontend: http://localhost:8080
echo 🗄️ Database: localhost:5432
echo 📊 Para ver logs: docker-compose logs -f
pause
goto menu

:start_frontend
echo.
echo Iniciando apenas o Frontend...
docker-compose up -d ticket-hub-visuals
echo ✅ Frontend iniciado!
echo 🌐 Acesse: http://localhost:8080
pause
goto menu

:start_database
echo.
echo Iniciando apenas o Database...
docker-compose up -d postgres
echo.
echo Aguardando banco ficar disponível...
timeout /t 10 /nobreak >nul
docker-compose exec postgres pg_isready -U ticket_admin -d ticket_hub
if %errorlevel%==0 (
    echo ✅ Database iniciado!
    echo 🗄️ PostgreSQL: localhost:5432
) else (
    echo ❌ Erro ao iniciar o banco de dados
)
pause
goto menu

:stop
echo.
echo Parando aplicação...
docker-compose down
echo ✅ Aplicação parada!
pause
goto menu

:logs
echo.
echo Mostrando logs do Frontend (Ctrl+C para sair)...
docker-compose logs -f ticket-hub-visuals
pause
goto menu

:logs_db
echo.
echo Mostrando logs do Database (Ctrl+C para sair)...
docker-compose logs -f postgres
pause
goto menu

:shell
echo.
echo Acessando shell do container...
docker-compose exec ticket-hub-visuals sh
pause
goto menu

:connect_db
echo.
echo Conectando ao PostgreSQL...
echo (Digite \q para sair do psql)
docker-compose exec postgres psql -U ticket_admin -d ticket_hub
pause
goto menu

:clean
echo.
echo ⚠️  Isso irá remover containers, imagens e volumes não utilizados
set /p confirm="Continuar? (s/N): "
if /i not "%confirm%"=="s" goto menu
echo.
echo Limpando recursos Docker...
docker-compose down
docker system prune -f
echo ✅ Limpeza concluída!
pause
goto menu

:rebuild
echo.
echo Reconstruindo e iniciando aplicação...
docker-compose down
docker-compose build --no-cache
docker-compose up -d
echo ✅ Aplicação reconstruída e iniciada!
echo 🌐 Frontend: http://localhost:8080
echo 🗄️ Database: localhost:5432
pause
goto menu

:status
echo.
echo Status dos containers:
docker-compose ps
echo.
echo Uso de recursos:
docker stats --no-stream
pause
goto menu

:database_menu
echo.
echo Abrindo menu de gerenciamento do banco de dados...
call database-commands.bat
goto menu

:end
echo.
echo Saindo...
timeout /t 2 /nobreak >nul
exit
