param ([String] $TenantId, [String] $ApplicationId, [string[]] $ManagementGroupIds)

$CurrentErrorActionPreference = $ErrorActionPreference

$CustomPoliciesDefinitionsAlreadyInstalledSet = @()
foreach ($ManagementGroupId in $ManagementGroupIds) {
    $CustomPoliciesDefinitionsAlreadyInstalledInMgmtGroup = Get-AzPolicyDefinition -ManagementGroupName $ManagementGroupId -Custom
    $CustomPoliciesDefinitionsAlreadyInstalledNamesInMgmtGroup = $CustomPoliciesDefinitionsAlreadyInstalledInMgmtGroup.Name
    $CustomPoliciesDefinitionsAlreadyInstalledSet += $CustomPoliciesDefinitionsAlreadyInstalledNamesInMgmtGroup
}

Write-Output "=== Determining how many policies to install ==="
$ErrorActionPreference = 'Stop'
Set-Location -Path ../Policies
$PoliciesToInstallCount = 0
$OfferingsDirectories = Get-ChildItem ./PolicyDefinitions | Select-Object Name
$Offerings = $OfferingsDirectories.Name
foreach ($Offering in $Offerings) {
    $PolicyDefinitionsFiles = Get-ChildItem "./PolicyDefinitions/${Offering}" | Measure-Object
    $PoliciesToInstallCount += $PolicyDefinitionsFiles.Count
}
$CustomPoliciesDefinitionsAlreadyInstalledSetMeasure = $CustomPoliciesDefinitionsAlreadyInstalledSet | Measure-Object
$CustomPoliciesDefinitionsAlreadyInstalledSetCount = $CustomPoliciesDefinitionsAlreadyInstalledSetMeasure.Count
$PoliciesToInstallCount -= $CustomPoliciesDefinitionsAlreadyInstalledSetCount

Write-Host "There are $PoliciesToInstallCount policy definitions to create"
Start-Sleep -Seconds 5

Write-Host "Login with armclient and obtain the token credentials"
if ($ApplicationId.Length -eq 0) {
    armclient login
}
else {
    armclient spn $TenantId $ApplicationId
}

Write-Host "===== Creating the policies definitions ====="

$ManagementGroupIdIndex = 0
$ManagementGroupId=''
$SuccessfullyCreatedPolicyDefinitionsCount = 0
foreach ($Offering in $Offerings) {
    $PolicyDefinitionsFiles = Get-ChildItem "./PolicyDefinitions/${Offering}"
    $PolicyDefinitionsFilesCount = $PolicyDefinitionsFiles.Count
    $PolicyDefinitionFileIndex = 0
    while ($PolicyDefinitionFileIndex -lt $PolicyDefinitionsFilesCount) {
        $PolicyDefinitionFile = $PolicyDefinitionsFiles[$PolicyDefinitionFileIndex]
        $PolicyDefinitionName = $PolicyDefinitionFile.BaseName
        if ($CustomPoliciesDefinitionsAlreadyInstalledSet -contains $PolicyDefinitionName) {
            $PolicyDefinitionFileIndex++
            continue
        }
        $ManagementGroupId = $ManagementGroupIds[$ManagementGroupIdIndex]
        armclient PUT `
            "/providers/Microsoft.Management/managementGroups/${ManagementGroupId}/providers/Microsoft.Authorization/policyDefinitions/${PolicyDefinitionName}?api-version=2023-04-01" `
            $PolicyDefinitionFile
        if ($LASTEXITCODE -ne 0) {
            Write-Error -Message "Cannot create $PolicyDefinitionName in $ManagementGroupId. Investigating..." -ErrorAction Continue
            if ($ManagementGroupIdIndex -lt $ManagementGroupIds.Count) {
                $CustomPoliciesDefinitionsAlreadyInstalledInMgmtGroup = Get-AzPolicyDefinition -ManagementGroupName $ManagementGroupId -Custom
                $CustomPoliciesDefinitionsAlreadyInstalledInMgmtGroupNames = $CustomPoliciesDefinitionsAlreadyInstalledInMgmtGroup.Name
                $NamesCount = $CustomPoliciesDefinitionsAlreadyInstalledInMgmtGroupNames.Count
                if ($NamesCount -eq 500) {
                    Write-Host "The management group $ManagementGroupId already has 500 policies definitions. Checking next management group...."
                    $ManagementGroupIdIndex++
                }
                else {
                    Write-Error -Message @"
                        `nThe script was able to install $SuccessfullyCreatedPolicyDefinitionsCount out of $PoliciesToInstallCount policy definitions
                        Please rerun the script to finish the creation of the rest of the policy definitions
"@ -ErrorAction Stop
                }
            }
            else {
                Write-Error -Message "`nThe list of management groups are exhausted. Consider adding more management groups" -ErrorAction Stop
            }        
        }
        else {
            $SuccessfullyCreatedPolicyDefinitionsCount++
            $PolicyDefinitionFileIndex++
        }
    }
}

$InitiativesAlreadyInstalledSet = @()
foreach ($ManagementGroupId in $ManagementGroupIds) {
    $InitiativesAlreadyInstalledInMgmtGroup = Get-AzPolicySetDefinition -ManagementGroupName $ManagementGroupId -Custom
    $InitiativesAlreadyInstalledNamesInMgmtGroup = $InitiativesAlreadyInstalledInMgmtGroup.Name
    $InitiativesAlreadyInstalledSet += $InitiativesAlreadyInstalledNamesInMgmtGroup
}
Write-Host "===== Creating/Updating the initiatives ====="
$InitiativesFiles = Get-ChildItem ./Initiatives
$InitiativesMeasure = $InitiativesFiles | Measure-Object
$InitiativesCount = $InitiativesMeasure.Count
$InitiativesAlreadyInstalledSetMeasure = $InitiativesAlreadyInstalledSet | Measure-Object
$InitiativesAlreadyInstalledSetCount = $InitiativesAlreadyInstalledSetMeasure.Count
$InitiativesToCreateCount = $InitiativesCount - $InitiativesAlreadyInstalledSetCount
Write-Host "There are $InitiativesToCreateCount initiatives to create"
Start-Sleep 5
$SuccessfullyCreatedInitiativesCount = 0
$InitiativeIndex = 0
while ($InitiativeIndex -lt $InitiativesCount) {
    $InitiativeFile = $InitiativesFiles[$InitiativeIndex]
    $InitiativeName = $InitiativeFile.BaseName
    if ($InitiativesAlreadyInstalledSet -contains $InitiativeName) {
        $InitiativeIndex++
        continue
    }
    $ManagementGroupId = $ManagementGroupIds[$ManagementGroupIdIndex]
    armclient PUT `
        "/providers/Microsoft.Management/managementGroups/${ManagementGroupId}/providers/Microsoft.Authorization/policySetDefinitions/${InitiativeName}?api-version=2023-04-01" `
        $InitiativeFile
    if ($LASTEXITCODE -ne 0) {
        Write-Error -Message "Cannot create $InitiativeName in $ManagementGroupId. Investigating..." -ErrorAction Continue
        if ($ManagementGroupIdIndex -lt $ManagementGroupIds.Count) {
            $InitiativesAlreadyInstalledInMgmtGroup = Get-AzSetPolicyDefinition -ManagementGroupName $ManagementGroupId -Custom
            $InitiativesAlreadyInstalledInMgmtGroupNames = $InitiativesAlreadyInstalledInMgmtGroup.Name
            $NamesCount = $InitiativesAlreadyInstalledInMgmtGroupNames.Count
            if ($NamesCount -eq 500) {
                Write-Host "The management group $ManagementGroupId already has 500 policies definitions. Checking next management group...."
                $ManagementGroupIdIndex++
            }
            else {
                Write-Error -Message @"
                    `nThe script was able to install $SuccessfullyCreatedInitiativesCount out of $InitiativesToCreateCount initiatives
                    Please rerun the script to finish the creation of the rest of the policy definitions
"@ -ErrorAction Stop
            }
        }
        else {
            Write-Error -Message "`nThe list of management groups are exhausted. Consider adding more management groups" -ErrorAction Stop
        }      
    }
    else {
        $SuccessfullyCreatedInitiativesCount++
        $InitiativeIndex++
    }
}

Write-Host "===== ALL INITIATIVES AND POLICY DEFINITIONS HAVE BEEN CREATED/UPDATED ====="
$ErrorActionPreference = $CurrentErrorActionPreference