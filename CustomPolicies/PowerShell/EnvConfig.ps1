Write-Host "===== ENVIRONMENT CONFIGURATION ====="
$CurrentErrorActionPreference = $ErrorActionPreference

$ErrorActionPreference = 'Stop'
try {
    
    Get-Command choco | Out-Null
    Write-Host "Chocolatey is installed... Continuing"
}
catch {
    Write-Host "Chocolatey is not installed. Installing it now..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
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

if (Get-Module -Name Az -ListAvailable) {
    Write-Host "The module Az is already installed. Continuing..."
    Write-Host "Updating module Az to the latest version..."
    Update-Module -Name Az -Force
}
else {
    Write-Host "The module Az is not installed. Installing now..."
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
    Install-Module -Name Az -Repository PSGallery -Force
}


if (-not (Get-Module -Name Microsoft.PowerShell.PSResourceGet -ListAvailable)) {
    Write-Host "PSResourceGet not found. Please install PowerShell 7 and rerun the script"
    exit 1
}

if (Get-Module -Name Az.ResourceGraph -ListAvailable) {
    Write-Host "Az.ResourceGaph is already installed. Continuing..."
    Write-Host "Updating the module Az.Resource to the latest version..."
    Update-Module -Name Az.ResourceGraph -Force
}
else {
    Write-Host "The module Az.ResourceGraph is not installed. Installing now..."
    Install-Module -Name Az.ResourceGraph -Force
}

$ErrorActionPreference = $CurrentErrorActionPreference
Write-Host "===== Environmment successfully configured ====="
