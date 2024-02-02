param ($SubscriptionId, $TenantId, $ManagementGroupId)

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
    Write-Host "Armclient is not installed. Installing now..."
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
    "PSResourceGet not found. Please install PowerShell 7 and rerun the script"
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

Write-Host "===== Environmment successfully configured ====="

Write-Host "=== Login to the provided subscription $SubscriptionId and $TenantId ==="
Connect-AzAccount -TenantId $TenantId -SubscriptionId $SubscriptionId
$Query = @"
policyresources 
| where type == 'microsoft.authorization/policydefinitions' 
| where properties.displayName startswith 'MCSB Baseline item' 
| where id startswith '/providers/Microsoft.Management/managementGroups/${ManagementGroupId}' 
| project name
"@
$CustomPoliciesDefinitionsAlreadyInstalled = Search-AzGraph -Query $Query -First 1000
$CustomPoliciesDefinitionsAlreadyInstalledNames = $CustomPoliciesDefinitionsAlreadyInstalled.name
$CustomPoliciesDefinitionsAlreadyInstalledNamesCount = $CustomPoliciesDefinitionsAlreadyInstalledNames.Count
$Query = @"
policyresources 
| where type == 'microsoft.authorization/policysetdefinitions' 
| where properties.displayName startswith 'Compliance Standards to' 
| where id startswith '/providers/Microsoft.Management/managementGroups/${ManagementGroupId}' 
| project name
"@
$CustomInitiativesAlreadyInstalled = Search-AzGraph -Query $Query -First 500
$CustomInitiativesAlreadyInstalledNames = $CustomInitiativesAlreadyInstalled.name
$CustomInitiativesAlreadyInstalledNamesCount = $CustomInitiativesAlreadyInstalledNames.Count
$ErrorActionPreference = 'Continue'

Write-Host "=== Login with armclient and obtain token credentials ==="
armclient login

Write-Host "=== Determining how many policies to delete ==="
$ErrorActionPreference = 'Stop'

Write-Host "There are ${CustomPoliciesDefinitionsAlreadyInstalledNamesCount} policy definitions and ${CustomInitiativesAlreadyInstalledNamesCount} initiatives to delete"

Start-Sleep -Seconds 5

Write-Host "===== Delete the policies definitions ====="

$SuccessfullyDeletedPolicyDefinitionsCount = 0
foreach ($CustomPolicyDefinitionInstalled in $CustomPoliciesDefinitionsAlreadyInstalledNames) {    
    armclient DELETE `
        "/providers/Microsoft.Management/managementGroups/${ManagementGroupId}/providers/Microsoft.Authorization/policyDefinitions/${CustomPolicyDefinitionInstalled}?api-version=2023-04-01"
    if ($LASTEXITCODE -ne 0) {
        Write-Error -Message @"
        The script was able to delete $SuccessfullyDeletedPolicyDefinitionsCount out of ${$CustomPoliciesDefinitionsAlreadyInstalledNames.count} policy definitions
        The script did not delete any initiative
        Please rerun the script to finish the deletion of the rest of the policy definitions and the initiative
"@ -ErrorAction Stop
    }
    $SuccessfullyDeletedPolicyDefinitionsCount = $SuccessfullyDeletedPolicyDefinitionsCount + 1        
}

Write-Host "===== Delete the initiatives ====="
$SuccessfullyDeletedInitiativesCount = 0
foreach ($CustomInitiative in $CustomInitiativesAlreadyInstalledNames) {
    armclient DELETE `
        "/providers/Microsoft.Management/managementGroups/${ManagementGroupId}/providers/Microsoft.Authorization/policySetDefinitions/${CustomInitiative}?api-version=2023-04-01"
    if ($LASTEXITCODE -ne 0) {
        $ErrorMessage = "`nThe script was able to delete ${SuccessfullyDeletedInitiativesCount} out of ${$CustomInitiativesAlreadyInstalledNames.count} the initiatives"
        Write-Error -Message $ErrorMessage -ErrorAction Stop
    }
    $SuccessfullyDeletedInitiativesCount = $SuccessfullyDeletedInitiativesCount + 1
}

Write-Host "===== ALL INITIATIVES AND POLICY DEFINITIONS HAVE BEEN DELETED ====="
$ErrorActionPreference = $CurrentErrorActionPreference