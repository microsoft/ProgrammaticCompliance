param ([string[]] $ManagementGroupIds)

Write-Host "===== Deletion of the custom initiatives and the policies definitions ====="

foreach ($ManagementGroupId in $ManagementGroupIds) {
    $CustomPolicyDefinitions = Get-AzPolicyDefinition -ManagementGroupName $ManagementGroupId -Custom
    $CustomPolicyDefinitionsNames = $CustomPolicyDefinitions.Name
    $CustomPolicyDefinitionsNamesCount = $CustomPolicyDefinitionsNames.Count
    Write-Host "There are $CustomPolicyDefinitionsNamesCount policy definitions to delete in the management group $ManagementGroupId"
    Start-Sleep 5
    foreach ($CustomPolicyDefinitionName in $CustomPolicyDefinitionsNames) {
        armclient DELETE `
        "/providers/Microsoft.Management/managementGroups/${ManagementGroupId}/providers/Microsoft.Authorization/policyDefinitions/${CustomPolicyDefinitionName}?api-version=2023-04-01"
        if ($LASTEXITCODE -ne 0) {
            Write-Error -Message "An error occured while deleting policy definition $CustomPolicyDefinitionName in the management group $ManagementGroupId." -ErrorAction Stop
        }
    }
    $CustomInitiatives = Get-AzPolicySetDefinition -ManagementGroupName $ManagementGroupId -Custom
    $CustomInitiativesNames = $CustomInitiatives.Name
    $CustomInitiativesNamesCount = $CustomInitiativesNames.Count
    Write-Host "There are $CustomInitiativesNamesCount initiatives to delete in the management group $ManagementGroupId"
    Start-Sleep 5
    foreach ($CustomInitiativeName in $CustomInitiativesNames) {
        armclient DELETE `
        "/providers/Microsoft.Management/managementGroups/${ManagementGroupId}/providers/Microsoft.Authorization/policySetDefinitions/${CustomInitiativeName}?api-version=2023-04-01"
        if ($LASTEXITCODE -ne 0) {
            Write-Error -Message "An error occured while deleting the initiative $CustomInitiativeName in the management group $ManagementGroupId." -ErrorAction Stop
        }
    }
}

Write-Host "===== ALL INITIATIVES AND POLICY DEFINITIONS HAVE BEEN DELETED ====="
$ErrorActionPreference = $CurrentErrorActionPreference