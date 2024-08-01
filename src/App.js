import React, { useState, useEffect, useRef } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import {
  PublicClientApplication,
  InteractionStatus,
} from "@azure/msal-browser";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Text,
  FontWeights,
  Link,
  Callout,
  FocusZone,
  FocusZoneTabbableElements,
  mergeStyleSets,
  DirectionalHint,
  Stack,
  DefaultButton,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import FilterBar from "./components/Filtering/FilterBar.js";
import Header from "./Header.js";
import { appText } from "./static/staticStrings.js";
import { useNavigate, redirect } from "react-router-dom";

import "./styles/Modal.css";
import "./styles/index.css";
import { useAuthorizeUser } from "./hooks/getAzureToken.js";

function MainApp() {
  const navigate = useNavigate();
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);

  const BASEPOINT = "https://programmatic-compliance-gh1.azurewebsites.net";
  const [getToken, setToken] = React.useState("");

  useEffect(() => {
    fetchToken(); // backend app token route
  }, []);

  const fetchToken = async () => {
    try {
      // Make a GET request using fetch
      const response = await fetch(BASEPOINT + "/auth/acquireToken");

      // Check if the request was successful
      if (!response.ok) {
        const errorJson = {
          status: 500,
          message: "Server is poopy.",
        };
        throw new Error(JSON.stringify(errorJson));
      }

      // Check if the user is authorized
      if (response.status == 401) {
        const errorJson = {
          status: 401,
          message: "User is not permitted to view this page.",
        };
        throw new Error(JSON.stringify(errorJson));
      }

      // Parse the JSON response
      const tokenMetadata = await response.json();

      // Update state with the fetched data
      setToken(tokenMetadata.accessToken);
    } catch (error) {
      // Note: I think this endpoint returns 500 when the user isn't authorized for some reason. Maybe it's configurable inside the
      // Azure Portal but I'm not sure so I'm just adding this case here.
      console.error(
        "User is not permitted to see the page. Redirecting to login...",
        error
      );
    }
  };

  const isAuthenticated = useIsAuthenticated();
  const { inProgress, instance, instance2, accounts } = useMsal();
  const { azureToken } = useAuthorizeUser({
    isAuthenticated,
    inProgress,
    accounts,
    instance,
  });

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
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];

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
      maxWidth: "85%",
      padding: "20px 30px",
    },
    title: {
      marginBottom: 12,
      fontWeight: FontWeights.semilight,
    },
    buttons: {
      display: "flex",
      justifyContent: "flex-end",
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
          <h1 className="siteTitle">{appText.siteTitle}</h1>
          <section aria-label="Site description">
            <p className="siteDescription">
              {appText.siteDescription}&nbsp;
              <Link onClick={toggleIsCalloutVisible} id="readMoreButton">
                {appText.readMoreButton}
              </Link>
            </p>
          </section>
          {getToken && <FilterBar azureToken={getToken} aria-label="Main" />}
          <br></br>
          <br></br>
          <Link
            href={"https://go.microsoft.com/fwlink/?LinkId=521839"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Privacy Statement
          </Link>
          <p></p>
          <p></p>
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
            {appText.disclaimer1} <br></br>
            <br></br>
            {appText.disclaimer2} <br></br>
            <br></br>
            {appText.disclaimer3} <br></br>
            <br></br>
            <a
              href="https://go.microsoft.com/fwlink/?LinkId=521839"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"Microsoft Privacy Statement"}
            </a>
          </Text>
          <FocusZone
            handleTabKey={FocusZoneTabbableElements.all}
            isCircularNavigation
          >
            <Stack className={styles.buttons} gap={8} horizontal>
              <DefaultButton onClick={toggleIsCalloutVisible}>
                I Understand
              </DefaultButton>
            </Stack>
          </FocusZone>
        </Callout>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
