import { useEffect, useState } from "react";
import { msalConfig, tokenConfig } from "../authConfig";
import { InteractionStatus } from "@azure/msal-browser";

const loginRedirectIfNotAuthenticated = async ({ isAuthenticated, inProgress, accounts, instance}, setAzureToken) => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      try {
        await instance.loginRedirect({
          authority: msalConfig.auth.authority,
          scopes: [tokenConfig.managementEndpoint],

        });
      } catch (error) {
        console.error("Error during loginRedirect:", error);
      }
    } else if (isAuthenticated && inProgress === InteractionStatus.None) {
      const azureToken = await getAzureToken({ accounts, instance});
      setAzureToken(azureToken);
    }
  };

const getAzureToken = async ({ accounts, instance}) => {
    const params = {
        authority: `https://login.microsoftonline.com/2b9c99c2-a72e-42e2-b97e-8fad5a0dee02`,
        scopes: [`https://management.azure.com/.default`],
        account: accounts[0],
      }
      try {
        const accessToken = (await instance.acquireTokenSilent(params)).accessToken;
        return accessToken;
      } catch (err) {
        console.log(err);
        return null;
      }
}

export const useAuthorizeUser = ({ isAuthenticated, inProgress, accounts, instance}) => {
    const [azureToken, setAzureToken] = useState("");

    useEffect(() => {
        loginRedirectIfNotAuthenticated({ isAuthenticated, inProgress, accounts, instance}, setAzureToken);
    }, [isAuthenticated, inProgress, instance]);

    return { azureToken }
}