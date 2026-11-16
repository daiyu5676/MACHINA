# Machina Full-Stack Launcher (DB, Java, ML, Gateway, Frontend)
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       STARTING MACHINA FULL STACK        " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Locate JDK java and javac binaries (bypasses any broken Oracle javapath redirects in PATH)
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

# 0. Check MongoDB
Write-Host "[1/5] Checking MongoDB on port 27017..." -ForegroundColor Yellow
$mongoRunning = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $iar = $tcp.BeginConnect("127.0.0.1", 27017, $null, $null)
    $success = $iar.AsyncWaitHandle.WaitOne(1000, $false)
    if ($success -and $tcp.Connected) {
        $tcp.EndConnect($iar)
        $mongoRunning = $true
    }
    $tcp.Close()
} catch {}

if ($mongoRunning) {
    Write-Host "  MongoDB is active on port 27017." -ForegroundColor Green
} else {
    Write-Host "  MongoDB is not running on port 27017." -ForegroundColor DarkYellow
    Write-Host "  (MACHINA will run in fallback mode: Predictions work in-memory without DB)." -ForegroundColor Gray
    Write-Host "  (To enable persistent history: start mongod or MongoDB service, or use Docker)." -ForegroundColor Gray
}

# 1. Compile Java Decision Engine
Write-Host "[2/5] Compiling Java Decision Engine using $javacExe..." -ForegroundColor Yellow
if (-not (Test-Path "$PSScriptRoot\java-decision-engine\bin")) {
    New-Item -ItemType Directory -Path "$PSScriptRoot\java-decision-engine\bin" | Out-Null
}
Push-Location "$PSScriptRoot\java-decision-engine"
Get-ChildItem -Recurse -Filter *.java src | ForEach-Object { $_.FullName } | Out-File -Encoding ascii sources.txt
& $javacExe -d bin '@sources.txt'
Remove-Item sources.txt -ErrorAction SilentlyContinue
Pop-Location

# 2. Start Java Decision Engine
Write-Host "[2/5] Starting Java Decision Engine on port 8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\java-decision-engine'; Write-Host '--- JAVA DECISION ENGINE (Port 8080) ---' -ForegroundColor Cyan; & '$javaExe' -cp bin Server"

# 3. Start Python ML Service (FastAPI)
$pythonExe = if (Test-Path "$PSScriptRoot\ml-service\venv\Scripts\python.exe") {
    "$PSScriptRoot\ml-service\venv\Scripts\python.exe"
} else {
    "python"
}
Write-Host "[3/5] Starting Python ML Service on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ml-service'; Write-Host '--- PYTHON ML SERVICE (Port 8000) ---' -ForegroundColor Cyan; & '$pythonExe' -m uvicorn app:app --port 8000"

# 4. Start Express Gateway
Write-Host "[4/5] Starting Express Gateway on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\gateway'; Write-Host '--- EXPRESS API GATEWAY (Port 3000) ---' -ForegroundColor Cyan; node server.js"

# 5. Start React Frontend (Vite)
Write-Host "[5/5] Starting React Frontend on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '--- REACT FRONTEND (Port 5173) ---' -ForegroundColor Cyan; npm run dev"

Write-Host "==========================================" -ForegroundColor Green
Write-Host " All Services Started in Separate Windows! " -ForegroundColor Green
Write-Host "  - Frontend Dashboard: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  - API Gateway Health: http://localhost:3000/health" -ForegroundColor Cyan
Write-Host "  - Python ML Service:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  - Java Engine:        http://localhost:8080/health" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Green
