param ([String] $TenantId, [String] $ApplicationId, [string[]] $ManagementGroupIds)

$CurrentErrorActionPreference = $ErrorActionPreference

Write-Host "=== Determining how many policies to install ==="
$CustomPoliciesDefinitionsAlreadyInstalledSet = @()
foreach ($ManagementGroupId in $ManagementGroupIds) {
    $CustomPoliciesDefinitionsAlreadyInstalledInMgmtGroup = Get-AzPolicyDefinition -ManagementGroupName $ManagementGroupId -Custom
    $CustomPoliciesDefinitionsAlreadyInstalledNamesInMgmtGroup = $CustomPoliciesDefinitionsAlreadyInstalledInMgmtGroup.Name
    $CustomPoliciesDefinitionsAlreadyInstalledSet += $CustomPoliciesDefinitionsAlreadyInstalledNamesInMgmtGroup
}

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

Write-Host "===== ALL POLICY DEFINITIONS HAVE BEEN CREATED/UPDATED ====="
$ErrorActionPreference = $CurrentErrorActionPreference