Write-Host "===== ENVIRONMENT CONFIGURATION ====="
$CurrentErrorActionPreference = $ErrorActionPreference

Set-ExecutionPolicy Bypass -Scope Process -Force

$ErrorActionPreference = 'Stop'
try {
    
    Get-Command choco | Out-Null
    Write-Host "Chocolatey is installed... Continuing"
}
catch {
    Write-Host "Chocolatey is not installed. Installing it now..." 
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}
try {
    Get-Command armclient | Out-Null
    Write-Host "Armclient is already installed... Continuing"
}
catch {
    Write-Output "Armclient is not installed. Installing now..."
    choco install armclient
}

if (-not (Get-Module -Name Microsoft.PowerShell.PSResourceGet -ListAvailable)) {
    Write-Host "PSResourceGet not found. Please install PowerShell 7 and rerun the script"
    exit 1
}

if (Get-Module -Name Az.ResourceGraph -ListAvailable) {
    Write-Host "Az.ResourceGaph is already installed. Continuing..."
}
else {
    Write-Host "The module Az.ResourceGraph is not installed. Installing now..."
    Install-Module -Name Az.ResourceGraph -Force
}

$ErrorActionPreference = $CurrentErrorActionPreference
Write-Host "===== Environmment successfully configured ====="
