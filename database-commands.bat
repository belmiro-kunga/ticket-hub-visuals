@echo off
chcp 65001 >nul
title Ticket Hub - Comandos do Banco de Dados

:menu
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    TICKET HUB DATABASE                      ║
echo ║                  Comandos do PostgreSQL                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo [1] Iniciar banco de dados PostgreSQL
echo [2] Parar banco de dados PostgreSQL
echo [3] Ver logs do banco de dados
echo [4] Conectar ao banco via psql
echo [5] Backup do banco de dados
echo [6] Restaurar backup do banco
echo [7] Resetar banco de dados (CUIDADO!)
echo [8] Ver status dos containers
echo [9] Limpar volumes do banco (REMOVE TODOS OS DADOS!)
echo [0] Voltar ao menu principal
echo.
set /p choice="Escolha uma opção (0-9): "

if "%choice%"=="1" goto start_db
if "%choice%"=="2" goto stop_db
if "%choice%"=="3" goto logs_db
if "%choice%"=="4" goto connect_db
if "%choice%"=="5" goto backup_db
if "%choice%"=="6" goto restore_db
if "%choice%"=="7" goto reset_db
if "%choice%"=="8" goto status_db
if "%choice%"=="9" goto clean_volumes
if "%choice%"=="0" goto end
goto menu

:start_db
echo.
echo Iniciando banco de dados PostgreSQL...
docker-compose up -d postgres
echo.
echo Aguardando banco ficar disponível...
timeout /t 10 /nobreak >nul
docker-compose exec postgres pg_isready -U ticket_admin -d ticket_hub
if %errorlevel%==0 (
    echo ✅ Banco de dados PostgreSQL iniciado com sucesso!
    echo 📊 Acesso: localhost:5432
    echo 🔑 Usuário: ticket_admin
    echo 🗄️ Database: ticket_hub
) else (
    echo ❌ Erro ao iniciar o banco de dados
)
pause
goto menu

:stop_db
echo.
echo Parando banco de dados PostgreSQL...
docker-compose stop postgres
echo ✅ Banco de dados parado!
pause
goto menu

:logs_db
echo.
echo Mostrando logs do banco de dados (Ctrl+C para sair)...
docker-compose logs -f postgres
pause
goto menu

:connect_db
echo.
echo Conectando ao banco de dados via psql...
echo (Digite \q para sair do psql)
docker-compose exec postgres psql -U ticket_admin -d ticket_hub
pause
goto menu

:backup_db
echo.
set /p backup_name="Digite o nome do backup (sem extensão): "
if "%backup_name%"=="" set backup_name=backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%
echo.
echo Criando backup: %backup_name%.sql
docker-compose exec postgres pg_dump -U ticket_admin -d ticket_hub > backups\%backup_name%.sql
if %errorlevel%==0 (
    echo ✅ Backup criado com sucesso: backups\%backup_name%.sql
) else (
    echo ❌ Erro ao criar backup
)
pause
goto menu

:restore_db
echo.
echo Backups disponíveis:
dir /b backups\*.sql 2>nul
echo.
set /p backup_file="Digite o nome do arquivo de backup (com .sql): "
if "%backup_file%"=="" (
    echo ❌ Nome do arquivo não pode estar vazio
    pause
    goto menu
)
echo.
echo ⚠️  ATENÇÃO: Isso irá substituir todos os dados atuais!
set /p confirm="Tem certeza? (s/N): "
if /i not "%confirm%"=="s" goto menu
echo.
echo Restaurando backup: %backup_file%
docker-compose exec -T postgres psql -U ticket_admin -d ticket_hub < backups\%backup_file%
if %errorlevel%==0 (
    echo ✅ Backup restaurado com sucesso!
) else (
    echo ❌ Erro ao restaurar backup
)
pause
goto menu

:reset_db
echo.
echo ⚠️  ATENÇÃO: Isso irá apagar TODOS os dados do banco!
echo Esta ação não pode ser desfeita!
echo.
set /p confirm="Digite 'RESET' para confirmar: "
if not "%confirm%"=="RESET" (
    echo Operação cancelada.
    pause
    goto menu
)
echo.
echo Resetando banco de dados...
docker-compose down postgres
docker volume rm ticket-hub-visuals_postgres_data 2>nul
docker-compose up -d postgres
echo.
echo Aguardando banco ficar disponível...
timeout /t 15 /nobreak >nul
echo ✅ Banco de dados resetado! Os scripts de inicialização foram executados automaticamente.
pause
goto menu

:status_db
echo.
echo Status dos containers:
docker-compose ps
echo.
echo Verificando conectividade do banco...
docker-compose exec postgres pg_isready -U ticket_admin -d ticket_hub
pause
goto menu

:clean_volumes
echo.
echo ⚠️  ATENÇÃO: Isso irá remover TODOS os volumes e dados!
echo Esta ação não pode ser desfeita!
echo.
set /p confirm="Digite 'DELETE' para confirmar: "
if not "%confirm%"=="DELETE" (
    echo Operação cancelada.
    pause
    goto menu
)
echo.
echo Parando containers e removendo volumes...
docker-compose down -v
docker volume prune -f
echo ✅ Volumes removidos!
pause
goto menu

:end
echo.
echo Voltando ao menu principal...
timeout /t 2 /nobreak >nul
exit /b
