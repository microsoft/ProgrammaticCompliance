param ([String] $BaseName, [int] $Total)

$Start = 0
while ($Start -lt $Total) {
    $Name = "$BaseName" + "$Start"
    Write-Host "Creating the management group $Name"
    New-AzManagementGroup -GroupName $Name
    if ($LASTEXITCODE -ne 0) {
        Write-Error -Message "Cannot create $Name. Please investigate..." -ErrorAction Stop
    }
    $Start++
}