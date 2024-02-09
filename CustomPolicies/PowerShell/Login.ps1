param ([String] $ApplicationId, [String] $ApplicationSecret, [String] $TenantId)
$SecurePassword = ConvertTo-SecureString -String $ApplicationSecret -AsPlainText -Force
$Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $ApplicationId, $SecurePassword
Connect-AzAccount -ServicePrincipal -TenantId $TenantId -Credential $Credential
Get-AzContext