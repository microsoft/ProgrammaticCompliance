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
Download the latest version of [PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4)

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

