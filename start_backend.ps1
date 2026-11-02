# Machina Backend Launcher
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       STARTING MACHINA BACKEND           " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Start Java Decision Engine
Write-Host "[1/3] Starting Java Decision Engine on port 8080..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-cp", "bin", "Server" -WorkingDirectory "$PSScriptRoot\java-decision-engine" -NoNewWindow
Start-Sleep -Seconds 2

# 2. Start Python ML Service
Write-Host "[2/3] Starting Python ML Service on port 8000..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "app:app", "--port", "8000" -WorkingDirectory "$PSScriptRoot\ml-service" -NoNewWindow
Start-Sleep -Seconds 3

# 3. Start Express Gateway
Write-Host "[3/3] Starting Express Gateway on port 3000..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\gateway" -NoNewWindow
Start-Sleep -Seconds 2

Write-Host "==========================================" -ForegroundColor Green
Write-Host "All Backend Services Running Successfully!" -ForegroundColor Green
Write-Host "Health Check: http://localhost:3000/health" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
