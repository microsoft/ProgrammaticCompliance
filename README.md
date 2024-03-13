# Tenant configuration - custom policy definitions creation
> [!NOTE]
> The custom policies creation process is strictly for a non-production/testing environment (tenants or subscriptions) and destined for any user allowed in private preview. Once the policies are made available as built-ins, it is recommended to use the cleanup scripts to delete all the custom policies created during the private preview phase.


* Download the latest version of [PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4)

* Clone the project to your local repository.
> [!NOTE]
> Just in case that you don't have git downloaded. Execute the following command
> ```
> winget search Git.Git
> winget install --id Git.Git -e --source winget
> ```

```
git clone git@github.com:microsoft/ProgrammaticCompliance.git
Set-Location -Path .\ProgrammaticCompliance
git checkout develop
git branch
```
You should be under _develop_ branch.

## Local Machine configuration
* Set the working directory to the PowerShell scripts directory:
```
Set-Location -Path .\CustomPolicies\PowerShell
```
* Run the environment set up script with the powershell elevated privileges:
```
.\EnvConfig.ps1
```

## Log into the tenant where all the custom policies will be installed
You can configure a service principal and give it enough privileges to create the custom policies.
* To run the login script with service principal use:
```
.\Login.ps1 -ApplicationId <Service Principal client ID> -TenantId <Tenant ID>
```
* To run the login script with the interactive auth, run the script with just the tenant ID as a parameter:
```
.\Login.ps1 -TenantId <Tenant ID>
```

## Create the custom policies
> [!NOTE]
> There is a limitation to create 500 policy definitions per subscription or management group. With this in mind, since there are over 4000 policy definitions to create, the intent is to create about 9 management groups that will host the policy definitions. Once the policy definitions are built-in this step will no longer be needed.
* Create the management groups in which the custom policies will be created:
```
.\CreateManagementGroup.ps1 -BaseName <Base name of choice for the management group> -Start <Start index> -End <End index (not inclusive)>
```

* Create the custom policy definitions resources
    - with a service principal:
    ```
    .\PoliciesCreate.ps1 -TenantId <Tenant ID> -ApplicationId <Service Principal ID> -ManagementGroupIds <Array of the created management group names (comma separated)>
    ```
    - with an interactive login:
    ```
    .\PoliciesCreate.ps1 -TenantId <Tenant ID> -ManagementGroupIds <Array of the created management group names (comma separated)>
    ```

* Delete the custom policy definitions resources when they are not needed
    - with a service principal:
    ```
    .\PoliciesCleanUp.ps1 -TenantId <Tenant ID> -ApplicationId <Service Principal ID> -ManagementGroupIds <Array of the created management group names (comma separated)>
    ```
    - with an interactive login:
    ```
    .\PoliciesCleanUp.ps1 -TenantId <Tenant ID> -ManagementGroupIds <Array of the created management group names (comma separated)>
    ```
# Azure WebApp creation that hosts the UX
## App registration and roles configurations
* Select _App registrations_ under _Microsoft Entra ID_
* Select _New registration_
* Give a name to the app e.g. _myapp_
* Under _Redirect URI_ select _Web_ and input _https://webapp.azurewebsites.net_ as a value. Note that the URI is the URL assigned to the webapp that will be deployed in the subsequent steps. We can come back and update the URI after the webapp is created.
* Click on _Register_
![alt text](image-1.png)
* Elevate your access to manage all the management groups by following the steps [here](https://learn.microsoft.com/en-us/azure/role-based-access-control/elevate-access-global-admin?tabs=azure-portal)
* In case there are other users who need access to the app, first add them to your [tenant](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-external-users) if they aren't members already, then navigate to the root management group portal and assign the "Reader" role to them.  
> [!IMPORTANT]
> You can create a custom role to only assign the permissions to read the policy definitions and the policy metadata resources. Assign that custom role to the user so that they do not have access to all of the other resources under the root management group.
![alt text](image-2.png)

## Azure Webapp deployment
> [!NOTE]
> Terraform is the infrastructure script deployment tool used to set up the UX. You could also use the portal to create the webapp and deploy the UX code. 

* Install the latest version of [Terraform](https://developer.hashicorp.com/terraform/install)
* Install Az CLI [here](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)
* Navigate to the terraform scripts root folder:
```
Set-Location -Path .\pipeline\terraform
```
* Create a storage account that hosts the terraform state file (using the bash script code or through the portal) 
* Create a container in the storage account created above that hosts the terraform state file
* Create a ```.tfvars``` file to set up the terraform variables. Make sure the resource group that hosts the UX webapp is different from the resource group of the storage account created in the next step. Below is an example of a ```.tfvars``` file. 
![alt text](image.png)
* Login to your tenant and ensure that you are using the target subscription of your choice:
```
az login
az account set -s <subscription id>
az account show
```
* Initialize the terraform backend:
```
terraform init -backend-config="resource_group_name=${BACKEND_STORAGE_ACCOUNT_RG}" -backend-config="storage_account_name=${BACKEND_STORAGE_ACCOUNT_NAME}" -backend-config="container_name=${BACKEND_STORAGE_CONTAINER_NAME}"
```
`BACKEND_STORAGE_ACCOUNT_RG` is the resource group of the storage account that hosts the terraform state file  
`BACKEND_STORAGE_ACCOUNT_NAME` is the storage account that hosts the terraform state file  
`BACKEND_STORAGE_CONTAINER_NAME` is the container of the storage account that hosts the terraform state file

* Create the terraform plan:
```
terraform plan -out plan.tfplan
```
> [!NOTE]
> It's good practice to save the terraform plan file so that when you run the terraform apply command, terraform doesn't try to regenerate another plan.

* Create the infrastructure:
```
terraform apply plan.tfplan
```
> [!IMPORTANT]
> Please update the _Redirect URI_ in the _App registration and roles configurations_ step with the actual URL assigned to the webapp once it is created.

## Installations prior to webapp deployment
The following steps should be done in your terminal, from the directory into which you cloned the Git repository.
* Download and install Node.js, which includes npm, [here](https://nodejs.org/) for your operating system. Use the LTS to avoid any fresh issues with the current version
* To verify that Node.js and npm are installed correctly, open a terminal and run the following commands to check their versions:
```
node -v
npm -v
```
> [!NOTE]
> This UX was built using Node.js v18.17.1 and npm v9.8.1.

* Create a ```.env``` file with the following contents
```
REACT_APP_CLIENT_ID=<your value goes here>
REACT_APP_TENANT_ID=<your value goes here>
REACT_WEBAPP_URL=<your value goes here>
```
The above values are the id of the tenant which hosts the webapp and the app registration and the id of the app registration configured in the  _App registration and roles configurations_ step.
> [!NOTE]
> The name of the above file is indeed ```.env``` - the name convention for a react environment variables file. 

* After verifying the previous step, use npm to install project dependencies and wait until completion:

```
npm install
```
> [!NOTE]
> Ignore generated warnings. Following the suggested commands may change the versions of various dependencies and break their relationship.

## Deploy the UX code to the webapp created
* Build and create a zip file that contains the source code at the root of the project:
```
npm run build
Compress-Archive -Path * -DestinationPath deployment.zip
```

* Deploy the zip file to the webapp:
```
az webapp deployment source config-zip --resource-group <WEBAPP_RESOURCE_GROUP> --name <WEBAPP_NAME> --src deployment.zip
```

Congratulations! You have now successfully deployed the code to your webapp. Let the testing begin!
