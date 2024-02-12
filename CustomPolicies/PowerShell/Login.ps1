param ([String] $ApplicationId, [String] $TenantId)

if ($ApplicationId.Length -eq 0) {
    Connect-AzAccount -TenantId $TenantId
} else {
    $ApplicationPassword = Read-Host "Enter the application secret" -AsSecureString
    $Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $ApplicationId, $ApplicationPassword
    Connect-AzAccount -ServicePrincipal -TenantId $TenantId -Credential $Credential
}

Get-AzContext