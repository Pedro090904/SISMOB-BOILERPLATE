param (
    [Parameter(Mandatory=$true, HelpMessage="Digite a mensagem de commit")]
    [string]$mensagem
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Iniciando sincronização com repositórios" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# 1. Adicionar os arquivos
Write-Host "[1/3] Adicionando arquivos (git add .)..." -ForegroundColor Yellow
git add .

# 2. Fazer o commit
Write-Host "[2/3] Criando commit: '$mensagem'..." -ForegroundColor Yellow
git commit -m "$mensagem"

# 3. Fazer o push para o Origin (GitLab / Repo Semob)
Write-Host "`n[3/3] Enviando para o GitLab (origin)..." -ForegroundColor Yellow
git push origin main

# 4. Fazer o push para o GitHub
Write-Host "`n[3/3] Enviando para o GitHub..." -ForegroundColor Yellow
git push github main

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host " Tudo pronto! Código enviado com sucesso!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
