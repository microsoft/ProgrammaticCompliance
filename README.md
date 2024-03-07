# Setup instructions ☀️
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## System requirements 🖥️
* Download and install Node.js, which includes npm, from the [official website](https://nodejs.org/) for your operating system. Use the LTS to avoid any fresh issues with the current version.
* To verify that Node.js and npm are installed correctly, open a terminal and run the following commands to check their versions:
```
node -v
npm -v
```
***Note from Julia:** I'm using v18.17.1 and 9.8.1 respectively.* 

## Cloning Git respository 🦾
* Access the project repository ([here](https://github.com/TestOrgMSFT/Programmatic_Compliance/tree/jul-fetchAPI)) to make sure you have access.
* Navigate to a directory via terminal that you wish to save this project in and clone the repo into it:
```
git clone https://github.com/TestOrgMSFT/Programmatic_Compliance.git
```
* Navigate into the newly cloned directory:
 ```
 cd Programmatic_Compliance
 ```
 * Then, run the following commands to fetch the correct remote branch:
```
git fetch
git switch jul-fetchAPI
```
* Verify that you are on the working branch by running `git branch` and checking that the `jul-fetchAPI` branch is highlighted or selected in some way.

## Installing (or Updating) dependencies 🔄
Install project dependencies and wait for them to complete:

```
npm install
```
***Note from Julia:** Ignore errors/warnings generated here. Trying to fix them with the suggested commands may change the versions of some dependencies and break their relationship. Learned this part from personal experience, and the process of undoing the versioning is unnecessarily confusing...I will fix these later once we lock down a design framework.*

## (To override auth) Parameters for API access 👾
We will now manually override the authentication flow in case you are unable to use a Microsoft domain-joined browser.
* Navigate to /src/components/Filtering in your code editor of choice and navigate to the `FilterBar.js` file. Find this section:

```
 let KEY = 'cc003c0178774095828768551275b0f8'
 let TOKEN = `Bearer ${authToken}`
```
* Generate the bearer token. Open terminal, and run:
```
az login
az account get-access-token --resource api://01540a6b-6e38-40b8-b67f-1d9d78dfc691 --query accessToken
```
This will return a long string starting with "ey".

* Copy the key and replace the second line with:
```
let TOKEN = 'Bearer {AUTH TOKEN HERE}'
```
***Note from Julia:** Be sure to keep the "Bearer" portion of the template intact, and just append the auth key afterward with a space inbetween. e.g. "let TOKEN = 'Bearer eyHelloThereIamYourToken!0123456789'*

* Navigate to the `index.js` file and delete the `<MsalProvider>` tag, as well as the closing tag `</MsalProvider>`. This will disable the auth mechanism from starting.

Save changes made to both files, and now you're ready to skip authentication!

## Launching development server 🚀
Installation is complete! 

Navigate to the project directory in terminal when all changes have been made. Then, run
```
npm start
```
to open the site at [http://localhost:3000](http://localhost:3000). Manually navigate to this URL to view it in your browser if it doesn't open automatically. 

***Note from Julia:** The first load takes longer to permeate, so the screen may stay blank for a bit.*

## Authenticating 🔐
After the page loads, you will be redirected to a Microsoft sign-on page. This will only work using your `@microsoft` account, so log in with that one.  

Congrats! 🎉 You're in!

## Troubleshooting 🆘
If the site fails to load, contact Julia with error logs. Copy & paste the terminal output if there are errors there. If not, "Inspect" the webpage in your browser, navigate to the "Output" tab, and screenshot that.

# Tenant configuration - custom policy definitions creation
> [!NOTE]
> The custom policies creation process is strictly for a non-production/testing environment (tenants or subscriptions) and destined for any user allowed in private preview. Once the policies are made available as built-in it is recommended to use the cleanup scripts to delete all the custom policies created during the private preview phase.


* Download the latest version of [PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4)

## Local Machine configuration
* Set the working directory to the PowerShell scripts directory
```
Set-Location -Path .\CustomPolicies\PowerShell
```
* Run the environment set up script with the powershell elevated privileges
```
.\EnvConfig.ps1
```

## Log into the tenant where all the custom policies will be installed
One can configure a service principal and give it enough privileges to create the custom policies.
To run the login script with service principal use
```
.\Login.ps1 -ApplicationId <Service Principal client ID> -TenantId <Tenant ID>
```
To run the login script with the interactive auth run the script with just the tenant id as a parameter as follow
```
.\Login.ps1 -TenantId <Tenant ID>
```

## Create the custom policies
> [!NOTE]
> There is a limitation to create 500 policy definitions per subscription or management group. With this in mind, since there are over 4000 policy definitions to create, the intent is to create about 9 management groups that will host the policy definitions. Once the policy definitions are builtin this step will no longer be needed.
* Create the management groups in which the custom policies will be created
```
.\CreateManagementGroup.ps1 -BaseName <base name of choice for the management group> -Start <starting index> -End <end index not inclusive>
```

* Create the custom policy definitions resources.
    - with a service principal
    ```
    .\PoliciesCreate.ps1 -TenantId <the tenant id> -ApplicationId <the service principal id> -ManagementGroupIds <the array of the created management groups (comma separated)>
    ```
    - with an interactive login
    ```
    .\PoliciesCreate.ps1 -TenantId <the tenant id> -ManagementGroupIds <the array of the created management groups (comma separated)>
    ```

* Delete the custom policy definitions resources when they are not needed.
    - with a service principal
    ```
    .\PoliciesCleanUp.ps1 -TenantId <the tenant id> -ApplicationId <the service principal id> -ManagementGroupIds <the array of the created management groups (comma separated)>
    ```
    - with an interactive login
    ```
    .\PoliciesCleanUp.ps1 -TenantId <the tenant id> -ManagementGroupIds <the array of the created management groups (comma separated)>
    ```
# Azure WebApp creation that hosts the UX
## App registration and roles configurations
* Select _App registrations_ under _Microsoft Entra ID_
* Select _New registration_
* Give a name to the app for instance _myapp_
* Under _Redirect URI_ select _Web_ and _https://webapp.azurewebsites.net_ as a value. Note that the URI is the URL assigned to the webapp that will be deployed in the subsequent steps. We can come back and update the URI after the webapp is created.
* Click on _Register_
![alt text](image-1.png)
* Elevate your access to manage all the managements groups [here](https://learn.microsoft.com/en-us/azure/role-based-access-control/elevate-access-global-admin?tabs=azure-portal)
* In case there are users who need access to the app first add them to the [tenant](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-external-users) then navigate to the root management group portal and assign the reader role to them.  
> [!IMPORTANT]
> One can create a custom role to only assign the permissions to read the policy definitions and the policy metadata resources. Assign that custom role to the user so that the user does not have access to all the resources under the root management group.
![alt text](image-2.png)

## Azure Webapp deployment
> [!NOTE]
> Terraform is the infrastructure script deployment tool used to set up the UX. One can use the portal to create the WebApp as well and deploy the UX code as well. 

* Install the latest version of [Terraform](https://developer.hashicorp.com/terraform/install)
* Install Az CLI [here](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)
* Navigate to the terraform scripts root folder.
```
Set-Location -Path .\pipeline\terraform
```
* Create a storage account that hosts the terraform state file (using the bash script code or through the portal) 
* Create a container in the storage account created above that hosts the terraform state file
* Create a ```.tfvars``` file to set up the terraform variables. Make sure the resource group that hosts the UX webapp is different from the resource group of the storage account created in the next step. The *react_app_client_id* value is the value of the app id configured in the above step. All the other variables values will be your own choice.
![alt text](image-3.png)
* Login to your tenant and ensure that you are using the target subscription of your choice
```
az login
az account set -s <subscription id>
az account show
```
* Initialize the terraform backend
```
terraform init -backend-config="resource_group_name=${BACKEND_STORAGE_ACCOUNT_RG}" -backend-config="storage_account_name=${BACKEND_STORAGE_ACCOUNT_NAME}" -backend-config="container_name=${BACKEND_STORAGE_CONTAINER_NAME}"
```
BACKEND_STORAGE_ACCOUNT_RG is the resource group of the storage account that hosts the terraform state file
BACKEND_STORAGE_ACCOUNT_NAME is the storage account that hosts the terraform state file
BACKEND_STORAGE_CONTAINER_NAME is the container of the storage account that hosts the terraform state file

* Run terraform plan
```
terraform plan -out plan.tfplan
```
> [!NOTE]
> It's a good practice to save the terraform plan file so that when one runs the terraform apply command terraform doesn't try to generate another plan.

* Create the infrastructure
```
terraform apply plan.tfplan
```
> [!IMPORTANT]
> Please update the _Redirect URI_ on the app registration with the actual URL of the webapp created.

## Deploy the UX code to the webapp created
* Create a zip file that contains the source code at the root of the project
```
npm install
npm run build
Compress-Archive -Path * -DestinationPath deployment.zip
```

* Deploy the zip file to the webapp
```
az webapp deployment source config-zip --resource-group <WEBAPP_RESOURCE_GROUP> --name <WEBAPP_NAME> --src deployment.zip
```

Congratulations you have successfully deployed the code to the webapp. Let the testing begin
