import { Icon, Link, Spinner, SpinnerSize, Stack, Text } from "@fluentui/react";
import { FC, useEffect, useState } from "react";
import { tableText } from "../../static/staticStrings";
import "../../styles/Tables.css";

export interface TableStatesProps {
  type: 'ACF' | 'MCSB' | 'Policy';
  variant: 'Onload' | 'Empty' | 'Loading' | 'NoService' | 'EmptyLoad';
}

const TableStates: FC<TableStatesProps> = ({ type, variant }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    if (type === "ACF" && variant !== "EmptyLoad") {
      setTitle(tableText.acfTitle);
      setSubtitle(tableText.acfDescription);
    }
    if (type === "MCSB" && variant !== "EmptyLoad") {
      setTitle(tableText.mcsbTitle);
      setSubtitle(tableText.mcsbDescription);
    }
    if (type === "Policy" && variant !== "EmptyLoad") {
      setTitle(tableText.policyTitle);
      setSubtitle(tableText.policyDescription);
    }
  }, [type, variant]);

  const iconStyles = {
    fontSize: "24px",
    color: "#0078D4",
  };

  return (
    <div className="cardStyle">
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
        <Stack horizontal verticalAlign="center">
          <div>
            <h2 className="titleStyle">
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
        {variant === "Onload" && (
          <>
            <br></br>
            <Icon
              iconName="Search"
              style={iconStyles}
              aria-label="Search"
            />{" "}
            <br></br>
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

        {variant === "Empty" && (
          <>
            <br></br>
            <Icon iconName="CodeEdit" style={iconStyles} aria-hidden="true" />
            <Text variant="medium" className="message">
              <br></br>
              {tableText.unsupportedDescription}
              <Link
                href={"https://learn.microsoft.com/azure/compliance/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
              .
            </Text>
            <p></p>
            <p></p>
          </>
        )}

        {variant === "Loading" && (
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

        {variant === "NoService" && (
          <>
            <br></br>
            <Icon
              iconName="Search"
              style={iconStyles}
              aria-label="Search"
            />{" "}
            <br></br>
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

        {variant === "EmptyLoad" && (
          <>
            <br></br>
            <Icon
              iconName="CodeEdit"
              style={iconStyles}
              aria-hidden="true"
            />{" "}
            <br></br>
            <Text variant="mediumPlus" className="messageTitle">
              {tableText.onloadTitle}
            </Text>
            <Text variant="medium" className="message">
              <br></br>
              {tableText.unsupportedDescription}
              <Link
                href={"https://learn.microsoft.com/azure/compliance/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
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
