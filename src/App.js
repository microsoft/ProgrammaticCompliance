import React, { useState, useEffect, useRef } from 'react';
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
  const [userToken, setUserToken] = useState("");
  const { azureToken } = useAuthorizeUser({ isAuthenticated, inProgress, accounts, instance });

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

  /**
   * UNCOMMENT BELOW TO PRINT AZ ACCESS TOKEN
   */

  // useEffect(() => {
  //   console.log('AZURE TOKEN: ', azureToken);
  // }, [azureToken])

  useEffect(() => {
    const getUserTokenIfAuthenticated = async () => {
      if (isAuthenticated && inProgress === InteractionStatus.None) {
        getUserToken();
      }
    };

    getUserTokenIfAuthenticated();
  }, [isAuthenticated, inProgress, accounts, instance]);


  /**
   * The site will automatically refresh to keep data fresh after 15 minutes of inactivity
   */
  const idleTimeoutRef = useRef(null);

  const resetIdleTimeout = () => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = setTimeout(() => {
      window.location.reload();
    }, 900000);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    const handleUserActivity = () => {
      resetIdleTimeout();
    };

    for (const event of events) {
      document.addEventListener(event, handleUserActivity);
    }

    resetIdleTimeout();

    return () => {
      for (const event of events) {
        document.removeEventListener(event, handleUserActivity);
      }
      clearTimeout(idleTimeoutRef.current);
    };
  }, []);

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
      <header role="banner">
        <Header />
      </header>
      <main>
        <div className="container">
          <h1 className="siteTitle">
            {appText.siteTitle}
          </h1>
          <section aria-label="Site description">
            <p className="siteDescription">
              {appText.siteDescription}&nbsp;
              <Link onClick={toggleIsCalloutVisible} id="readMoreButton">
                {appText.readMoreButton}
              </Link>
            </p>
          </section>
          {azureToken && <FilterBar azureToken={azureToken} aria-label="Main" />}
          <br></br>
          <br></br>
          <Link
            href={"https://privacy.microsoft.com/en-us/privacystatement"} target="_blank" rel="noopener noreferrer"
          >
            Microsoft Privacy Statement
          </Link>
        </div>
      </main>

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
          <Text block variant="small" style={{ fontSize: 14 }}>
            {appText.disclaimer1} <br></br><br></br>
            {appText.disclaimer2} <br></br><br></br>
            {appText.disclaimer3} <br></br><br></br>
              <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer">
                {Microsoft Privacy Statement}
              </a>
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