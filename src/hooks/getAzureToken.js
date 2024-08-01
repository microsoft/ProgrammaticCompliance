import { useEffect, useState } from "react";
import { msalConfig, tokenConfig } from "../authConfig";
import { InteractionStatus } from "@azure/msal-browser";

const loginRedirectIfNotAuthenticated = async (
  { isAuthenticated, inProgress, accounts, instance },
  setAzureToken
) => {
  if (!isAuthenticated && inProgress === InteractionStatus.None) {
    try {
      await instance.loginRedirect({
        authority: msalConfig.auth.authority,
        scopes: [tokenConfig.appPermissionScope],
      });
    } catch (error) {
      console.error("Error during loginRedirect:", error);
    }
  } else if (isAuthenticated && inProgress === InteractionStatus.None) {
    const azureToken = await getAzureToken({ accounts, instance });
    if (azureToken) {
      const isMember = await checkGroupMembership(azureToken, instance);
      if (isMember) {
        setAzureToken(azureToken);
      } else {
        console.error("User is not a member of the required group.");
      }
    } else {
      console.error("Failed to acquire Azure AD token.");
    }
  }
};

const getAzureToken = async ({ accounts, instance }) => {
  const params = {
    authority: msalConfig.auth.authority,
    scopes: [tokenConfig.appPermissionScope],
    account: accounts[0],
  };
  try {
    const accessToken = (await instance.acquireTokenSilent(params)).accessToken;
    return accessToken;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const checkGroupMembership = async (accessToken) => {
  try {
    const groupId = "383b265c-41cf-4d25-bf74-84c82c315a06";
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/memberOf?$filter=id eq \'${groupId}\'`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data.error) {
      window.location.href =
        "https://programmatic-compliance-gh1.azurewebsites.net/unauthorized";
      throw new Error(`memberOf returned error!`);
    }

    console.log("Successfully authenticated to security group!");
    return data.value;
  } catch (error) {
    window.location.href =
      "https://programmatic-compliance-gh1.azurewebsites.net/unauthorized";
    console.error("Error checking group membership:", error);
    return false;
  }
};

export const useAuthorizeUser = ({
  isAuthenticated,
  inProgress,
  accounts,
  instance,
}) => {
  const [azureToken, setAzureToken] = useState("");

  useEffect(() => {
    loginRedirectIfNotAuthenticated(
      { isAuthenticated, inProgress, accounts, instance },
      setAzureToken
    );
  }, [isAuthenticated, inProgress, instance]);

  return { azureToken };
};
