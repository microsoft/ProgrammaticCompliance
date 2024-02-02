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

Write-Host "===== Environmment successfully configured ====="

$ErrorActionPreference = 'Continue'
Write-Output "=== Login to the provided subscription $SubscriptionId and $TenantId ==="
Connect-AzAccount -TenantId $TenantId -SubscriptionId $SubscriptionId
$Query = @"
        policyresources 
        | where type == 'microsoft.authorization/policydefinitions' 
        | where properties.displayName startswith 'MCSB Baseline item'
        | where properties.policyType == 'Custom'
        | project name
        | order by name
"@
Write-Host $Query
$CustomPoliciesDefinitionsAlreadyInstalledFirstSet = Search-AzGraph -Query $Query -First 1000
$CustomPoliciesDefinitionsAlreadyInstalledFirstSetNames = $CustomPoliciesDefinitionsAlreadyInstalledFirstSet.name
$CustomPoliciesDefinitionsAlreadyInstalledSecondSet = Search-AzGraph -Query $Query -First 1000 -Skip 1000
$CustomPoliciesDefinitionsAlreadyInstalledSecondSetNames = $CustomPoliciesDefinitionsAlreadyInstalledSecondSet.name
$CustomPoliciesDefinitionsAlreadyInstalledThirdSet =  Search-AzGraph -Query $Query -First 1000 -Skip 2000
$CustomPoliciesDefinitionsAlreadyInstalledThirdSetNames = $CustomPoliciesDefinitionsAlreadyInstalledThirdSet.name
$CustomPoliciesDefinitionsAlreadyInstalledFourthSet = Search-AzGraph -Query $Query -First 1000 -Skip 3000
$CustomPoliciesDefinitionsAlreadyInstalledFourthSetNames = $CustomPoliciesDefinitionsAlreadyInstalledFourthSet.name 

Write-Host "=== Login with armclient and obtain token credentials ==="
armclient login

Write-Output "=== Determining how many policies to install ==="
$ErrorActionPreference = 'Stop'
Set-Location -Path ../Policies
$Initiatives = Get-ChildItem ./Initiatives | Measure-Object
$InitiativesCount = $Initiatives.Count
$PoliciesToInstallCount = 0
$OfferingsDirectories = Get-ChildItem ./PolicyDefinitions | Select-Object Name
$Offerings = $OfferingsDirectories.Name
foreach ($Offering in $Offerings) {
    $PolicyDefinitionsFiles = Get-ChildItem "./PolicyDefinitions/${Offering}" | Measure-Object
    $PoliciesToInstallCount = $PoliciesToInstallCount + $PolicyDefinitionsFiles.Count
}
$PoliciesToInstallCount = $PoliciesToInstallCount `
    - $CustomPoliciesDefinitionsAlreadyInstalledFirstSetNames.Count `
    - $CustomPoliciesDefinitionsAlreadyInstalledSecondSetNames.Count `
    - $CustomPoliciesDefinitionsAlreadyInstalledThirdSetNames.Count `
    - $CustomPoliciesDefinitionsAlreadyInstalledFourthSetNames.Count


Write-Host "There are $PoliciesToInstallCount policy definitions and $InitiativesCount initiatives to create/update"
Start-Sleep -Seconds 5
Write-Host "===== Creating the policies definitions ====="

$SuccessfullyCreatedPolicyDefinitionsCount = 0
foreach ($Offering in $Offerings) {
    $PolicyDefinitionsFiles = Get-ChildItem "./PolicyDefinitions/${Offering}"
    foreach ($PolicyDefinitionFile in $PolicyDefinitionsFiles) {
        $PolicyDefinitionName = $PolicyDefinitionFile.BaseName
        if ( ($CustomPoliciesDefinitionsAlreadyInstalledFirstSetNames -contains $PolicyDefinitionName) -or
             ($CustomPoliciesDefinitionsAlreadyInstalledSecondSetNames -contains $PolicyDefinitionName) -or 
             ($CustomPoliciesDefinitionsAlreadyInstalledThirdSetNames -contains $PolicyDefinitionName) -or 
             ($CustomPoliciesDefinitionsAlreadyInstalledFourthSetNames -contains $PolicyDefinitionName)) {
                continue
        }
        armclient PUT `
            "/providers/Microsoft.Management/managementGroups/${ManagementGroupId}/providers/Microsoft.Authorization/policyDefinitions/${PolicyDefinitionName}?api-version=2023-04-01" `
            $PolicyDefinitionFile
        if ($LASTEXITCODE -ne 0) {
                Write-Error -Message @"
                The script was able to install $SuccessfullyCreatedPolicyDefinitionsCount out of $PoliciesToInstallCount policy definitions
                The script did not update any initiative
                Please rerun the script to finish the creation of the rest of the policy definitions
"@ -ErrorAction Stop
        }
        $SuccessfullyCreatedPolicyDefinitionsCount = $SuccessfullyCreatedPolicyDefinitionsCount + 1
    }
}

Write-Host "===== Creating/Updating the initiatives ====="
$InitiativesFiles = Get-ChildItem ./Initiatives
$SuccessfullyCreatedInitiativesCount = 0
foreach ($InitiativeFile in $InitiativesFiles) {
    $InitiativeName = $InitiativeFile.BaseName
    armclient PUT `
        "/providers/Microsoft.Management/managementGroups/${ManagementGroupId}/providers/Microsoft.Authorization/policySetDefinitions/${InitiativeName}?api-version=2023-04-01" `
        $InitiativeFile
    if ($LASTEXITCODE -ne 0) {
        $ErrorMessage = "`nThe script was able create/update ${SuccessfullyCreatedInitiativesCount} out of ${InitiativesCount} the initiatives"
        Write-Error -Message $ErrorMessage -ErrorAction Stop 
    
    }
    $SuccessfullyCreatedInitiativesCount = $SuccessfullyCreatedInitiativesCount + 1
}

Write-Host "===== ALL INITIATIVES AND POLICY DEFINITIONS HAVE BEEN CREATED/UPDATED ====="
$ErrorActionPreference = $CurrentErrorActionPreference