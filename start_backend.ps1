# Machina Backend Launcher
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       STARTING MACHINA BACKEND           " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Locate JDK java and javac binaries
$javaCandidates = @(
    "$env:JAVA_HOME\java.exe",
    "$env:JAVA_HOME\bin\java.exe",
    "C:\Program Files\Java\jdk-25.0.2\bin\java.exe",
    "C:\Program Files\Java\jdk-24\bin\java.exe"
)
$javaExe = ($javaCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1)
if (-not $javaExe) { $javaExe = "java" }

$javacCandidates = @(
    "$env:JAVA_HOME\javac.exe",
    "$env:JAVA_HOME\bin\javac.exe",
    "C:\Program Files\Java\jdk-25.0.2\bin\javac.exe",
    "C:\Program Files\Java\jdk-24\bin\javac.exe"
)
$javacExe = ($javacCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1)
if (-not $javacExe) { $javacExe = "javac" }

# 0. Compile Java Decision Engine
Write-Host "[0/3] Compiling Java Decision Engine using $javacExe..." -ForegroundColor Yellow
if (-not (Test-Path "$PSScriptRoot\java-decision-engine\bin")) {
    New-Item -ItemType Directory -Path "$PSScriptRoot\java-decision-engine\bin" | Out-Null
}
Push-Location "$PSScriptRoot\java-decision-engine"
Get-ChildItem -Recurse -Filter *.java src | ForEach-Object { $_.FullName } | Out-File -Encoding ascii sources.txt
& $javacExe -d bin '@sources.txt'
Remove-Item sources.txt -ErrorAction SilentlyContinue
Pop-Location

# 1. Start Java Decision Engine
Write-Host "[1/3] Starting Java Decision Engine on port 8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\java-decision-engine'; Write-Host '--- JAVA DECISION ENGINE (Port 8080) ---' -ForegroundColor Cyan; & '$javaExe' -cp bin Server"
Start-Sleep -Seconds 2

# 2. Start Python ML Service (uses venv if available)
$pythonExe = if (Test-Path "$PSScriptRoot\ml-service\venv\Scripts\python.exe") {
    "$PSScriptRoot\ml-service\venv\Scripts\python.exe"
} else {
    "python"
}
Write-Host "[2/3] Starting Python ML Service on port 8000 using $pythonExe..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ml-service'; Write-Host '--- PYTHON ML SERVICE (Port 8000) ---' -ForegroundColor Cyan; & '$pythonExe' -m uvicorn app:app --port 8000"
Start-Sleep -Seconds 3

# 3. Start Express Gateway
Write-Host "[3/3] Starting Express Gateway on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\gateway'; Write-Host '--- EXPRESS API GATEWAY (Port 3000) ---' -ForegroundColor Cyan; node server.js"
Start-Sleep -Seconds 2

Write-Host "==========================================" -ForegroundColor Green
Write-Host "All Backend Services Running Successfully!" -ForegroundColor Green
Write-Host "Health Check: http://localhost:3000/health" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
