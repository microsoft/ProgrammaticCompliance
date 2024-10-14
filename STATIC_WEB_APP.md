## Option 2: Deploying React Website to Azure Static Web App Using SWA CLI

Follow these steps to deploy your React website to an Azure Static Web App using the `swa` CLI tool.

### 1. Install the Azure Static Web Apps CLI

First, install the Static Web Apps CLI globally:

```bash
npm install -g @azure/static-web-apps-cli
```

This tool will help you simulate, develop, and deploy static websites to Azure Static Web Apps.

### 2. Build the Programmatic Compliance Application

Build the Programmatic Compliance Application using the commands below:

```bash
npm install
npm run build
```

This will generate the production build in a `dist` folder.

### 3. Deploy Using Azure SWA CLI

To deploy your React app to Azure Static Web Apps, use the `swa` CLI. Make sure you’re logged in to Azure first:

```bash
az login
```

Then, deploy the website using the `swa deploy` command:

```bash
swa deploy ./dist --app-name <appName> --resource-group <resource-group-name> --env production
```

Explanation:
- `<appName>` is the name of your Azure Static Web App.
- `<resource-group-name>` is the Azure resource group where the app will be created.
- `--env production` ensures the app is available on the the Static Web App's production hostname. 

### 4. Access Your Deployed App

Once the deployment is complete, the CLI will return a URL where your static website is hosted. You can access your website at this URL.

If you need to find the URL later, you can retrieve it by running the following command:

```bash
az staticwebapp show --name <appName> --resource-group <resource-group-name> --query "defaultHostname"
```

This command will return the URL for your deployed app.

### 5. Simulate Local Deployment (Optional)

The SWA CLI also allows you to simulate the app locally to test before deploying. You can run:

```bash
swa start ./dist
```

This will serve your site locally at `http://localhost:4280`, so you can view it in a browser before deploying to Azure.

### (Optional) 6. Continuous Deployment (CI/CD) Setup

If you want to automate future deployments via GitHub or other CI/CD pipelines, Azure Static Web Apps supports [continuous deployment workflows](https://docs.microsoft.com/en-us/azure/static-web-apps/build-configuration). You can easily set this up by integrating GitHub Actions or other CI tools for automated builds and deployments.

## Conclusion

Using the `@azure/static-web-apps-cli`, you can deploy your React app to Azure Static Web Apps with minimal configuration. This method is ideal if you're looking for a managed, serverless hosting platform with easy CI/CD integration.