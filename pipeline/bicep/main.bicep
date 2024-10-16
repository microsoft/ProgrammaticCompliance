@description('Name of the storage account which hosts the static website')
param storageAccountName string

@description('Location for the storage account')
param location string = resourceGroup().location

@description('SKU for the storage account')
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
  'Standard_ZRS'
  'Premium_LRS'
])
param sku string = 'Standard_LRS'

@description('Name of the index file. Default is index.html')
param indexFile string = 'index.html'

@description('Name of the 404 file. Default is 404.html')
param notFoundFile string = '404.html'

var storageAccountContributorRoleId = '17d1049b-9a84-46fb-8f53-869881c3d3ab'

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: sku
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
  }
}

resource storageAccountBlobService 'Microsoft.Storage/storageAccounts/blobServices@2021-04-01' = {
  parent: storageAccount
  name: 'default'
  properties: {
    deleteRetentionPolicy: {
      enabled: false
    }
  }
}

resource webContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-04-01' = {
  parent: storageAccountBlobService
  name: '$web'
  properties: {
    publicAccess: 'Blob'
  }
}

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${storageAccountName}-identity'
  location: location
}

resource rbac_storageAccountContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(subscription().subscriptionId, resourceGroup().name, storageAccountName, storageAccountContributorRoleId)
  scope: storageAccount
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', storageAccountContributorRoleId)
    description: 'Allow the managed identity to manage the storage account'
  }
}

resource enableStaticWebsite 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  dependsOn: [
    webContainer
    rbac_storageAccountContributor
  ]
  name: '${storageAccountName}-script'
  location: resourceGroup().location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.63.0'
    environmentVariables: [
      {
        name: 'AZURE_STORAGE_ACCOUNT'
        value: storageAccount.name
      }
      {
        name: 'INDEX_FILE'
        value: indexFile
      }
      {
        name: 'NOT_FOUND_FILE'
        value: notFoundFile
      }
    ]
    scriptContent: '''
      az storage blob service-properties update \
        --account-name ${AZURE_STORAGE_ACCOUNT} \
        --static-website true \
        --index-document ${INDEX_FILE} \
        --404-document ${NOT_FOUND_FILE} \
        --auth-mode login
    '''
    timeout: 'PT30M' 
    retentionInterval: 'P1D'  
    cleanupPreference: 'OnSuccess'
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identity.id}': {}
    }
  }
}

output storageAccountEndpoint string = storageAccount.properties.primaryEndpoints.web
