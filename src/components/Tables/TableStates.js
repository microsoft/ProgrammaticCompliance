import React, { useEffect, useState } from 'react';
import { Icon, Text, Spinner, SpinnerSize, Link, Stack } from '@fluentui/react';
import '../../styles/Tables.css';
import { tableText } from '../../static/staticStrings.js';

const TableStates = (props) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    if (props.type === "ACF" && props.variant !== "EmptyLoad") {
      setTitle(tableText.acfTitle)
      setSubtitle(tableText.acfDescription)
    }
    if (props.type === "MCSB" && props.variant !== "EmptyLoad") {
      setTitle(tableText.mcsbTitle)
      setSubtitle(tableText.mcsbDescription)
    }
    if (props.type === "Policy" && props.variant !== "EmptyLoad") {
      setTitle(tableText.policyTitle)
      setSubtitle(tableText.policyDescription)
    }
  }, [props]);

  const iconStyles = {
    fontSize: '24px',
    color: '#0078D4'
  };

  return (
    <div className="cardStyle">
      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between">
        <Stack horizontal verticalAlign="center">
          <div>
            <h2 variant="mediumPlus" className="titleStyle">
              {title}
            </h2>
            <Text variant="medium" className="subtitleStyle">
              {subtitle}
            </Text>
          </div>
        </Stack>
      </Stack>
      <p></p>

      <div className="centerStyle">
        {props.variant === 'Onload' && (
          <>
            <br></br>
            <Icon iconName="Search" style={iconStyles} aria-label="Search"/> <br></br>
            <Text variant="mediumPlus" className="messageTitle">
              {tableText.onloadTitle}
            </Text>
            <br></br>
            <Text variant="medium" className="message">
              {tableText.onloadDescription}
            </Text>
            <p></p>
            <p></p>
          </>
        )}

        {props.variant === 'Empty' && (
          <>
            <br></br>
            <Icon iconName="CodeEdit" style={iconStyles} aria-hidden="true"/>
            <Text variant="medium" className="message"><br></br>
              {tableText.unsupportedDescription}
              <Link href={"https://learn.microsoft.com/azure/compliance/"} target="_blank" rel="noopener noreferrer">here</Link>
              .
            </Text>
            <p></p>
            <p></p>
          </>
        )}

        {props.variant === 'Loading' && (
          <>
            <Spinner size={SpinnerSize.large} />
            <p></p>
            <Text variant="mediumPlus" className="message">
              {tableText.loading}
            </Text>
            <p></p>
            <p></p>
          </>
        )}
        
        {props.variant === 'NoService' && (
          <>
            <br></br>
            <Icon iconName="Search" style={iconStyles} aria-label="Search"/> <br></br>
            <Text variant="mediumPlus" className="messageTitle">
              {tableText.onloadTitle}
            </Text>
            <br></br>
            <Text variant="medium" className="message">
              {tableText.noService}
            </Text>
            <p></p>
            <p></p>
          </>
        )}
        
        {props.variant === 'EmptyLoad' && (
          <>
            <Icon iconName="CodeEdit" style={iconStyles} aria-hidden="true"/> <br></br>
            <Text variant="mediumPlus" className="messageTitle">
              {tableText.onloadTitle}
            </Text>
            <Text variant="medium" className="message"><br></br>
              {tableText.unsupportedDescription}
              <Link href={"https://learn.microsoft.com/azure/compliance/"} target="_blank" rel="noopener noreferrer">here</Link>
              .
            </Text>
            <p></p>
            <p></p>
          </>
        )}
      </div>
    </div>
  );
};

export default TableStates;
