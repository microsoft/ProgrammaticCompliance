import React, { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from '@azure/msal-browser';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Text, FontWeights, Link, Callout, FocusZone, FocusZoneTabbableElements, mergeStyleSets, DirectionalHint, Stack, DefaultButton } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';

import { msalConfig, tokenConfig } from "./authConfig.js";
import FilterBar from './components/Filtering/FilterBar.js';
import Header from './Header.js';
import { appText } from './static/staticStrings.js';

import "./styles/Modal.css";
import './styles/index.css';
import { useAuthorizeUser } from './hooks/getAzureToken.js';

function MainApp() {

  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  const isAuthenticated = useIsAuthenticated();
  const { inProgress, instance, accounts } = useMsal();
  const [userToken, setUserToken] = useState("");   // Who am I?
  const { azureToken } = useAuthorizeUser({ isAuthenticated, inProgress, accounts, instance }); // ARG API auth token

  const getUserToken = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        authority: msalConfig.auth.authority,
        scopes: [tokenConfig.managementEndpoint],
        account: accounts[0],
      }, {
        onTokenFailure: async (error) => {
          if (error.errorMessage.includes("interaction_required")) {
            try {
              await instance.loginRedirect({
                authority: msalConfig.auth.authority,
                scopes: [tokenConfig.managementEndpoint],
              });
            } catch (loginError) {
              console.error("Error during loginRedirect:", loginError);
            }
          } else {
            console.error("Error fetching data:", error);
          }
        },
      });
      setUserToken(response.accessToken);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   console.log('UNCOMMENT TO GET TOKEN FOR POSTMAN: ', azureToken);
  // }, [azureToken])

  useEffect(() => {
    const getUserTokenIfAuthenticated = async () => {
      if (isAuthenticated && inProgress === InteractionStatus.None) {
        getUserToken();
      }
    };

    getUserTokenIfAuthenticated();
  }, [isAuthenticated, inProgress, accounts, instance]);

  const styles = mergeStyleSets({
    callout: {
      width: 1024,
      maxWidth: '85%',
      padding: '20px 30px',
    },
    title: {
      marginBottom: 12,
      fontWeight: FontWeights.semilight,
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 20,
    },
  });

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="siteTitle">
          {appText.siteTitle}
        </h1>
        <p className="siteDescription" aria-label="Complementary">
          <em>This experience is for <strong>internal use only</strong> at this moment. Please send any questions, comments, or feedback to <a href="mailto:pcompvteam@microsoft.com">pcompvteam@microsoft.com</a>.</em><p></p>
          {appText.siteDescription}&nbsp;
          <Link onClick={toggleIsCalloutVisible} id="readMoreButton">
            {appText.readMoreButton}
          </Link>
        </p>
        <FilterBar azureToken={azureToken} aria-label="Main"/>
        <p></p>
        <p></p>
      </div>

      {isCalloutVisible && (
        <Callout
          className={styles.callout}
          role="dialog"
          gapSpace={0}
          target="#readMoreButton"
          onDismiss={toggleIsCalloutVisible}
          setInitialFocus
          isBeakVisible={true}
          beakWidth={20}
          directionalHint={DirectionalHint.bottomCenter}
        >
          <Text as="h1" block variant="large" className={styles.title}>
            Disclaimer
          </Text>
          <Text block variant="small">
            {appText.disclaimer1} <br></br><br></br>
            {appText.disclaimer2} <br></br><br></br>
            {appText.disclaimer3}
          </Text>
          <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
            <Stack className={styles.buttons} gap={8} horizontal>
              <DefaultButton onClick={toggleIsCalloutVisible}>I Understand</DefaultButton>
            </Stack>
          </FocusZone>
        </Callout>
      )}

    </>
  );
}

function Healthy() {
  return (
    <p className="siteTitle">
      {appText.healthy}
    </p>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="health" element={<Healthy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;