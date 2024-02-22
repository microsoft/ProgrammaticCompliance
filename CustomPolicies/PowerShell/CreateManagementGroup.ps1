param ([String] $BaseName, [int] $Start, [int] $End)

while ($Start -lt $End) {
    $Name = "$BaseName" + "$Start"
    Write-Host "Creating the management group $Name"
    New-AzManagementGroup -GroupName $Name
    if ($LASTEXITCODE -ne 0) {
        Write-Error -Message "Cannot create $Name. Please investigate..." -ErrorAction Stop
    }
    $Start++
}