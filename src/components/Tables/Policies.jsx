import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  Icon,
  IconButton,
  initializeIcons,
  Link,
  SelectionMode,
  Stack,
  Sticky,
  StickyPositionType,
  Text,
  TooltipHost,
} from "@fluentui/react";
import { useEffect, useState } from "react";

import PoliciesModal from "../Modals/PoliciesModal.jsx";
import TableStates from "./TableStates.jsx";

import { tableText } from "../../static/staticStrings.js";
import "../../styles/Tables.css";
import {
  classNames,
  focusZoneProps,
  gridStyles,
} from "../../styles/TablesStyles.js";
import { sanitizeControlID } from "../../utils/controlIdUtils.js";
import { groupAndSortRows, sortRows } from "../../utils/tableSortUtils.js";

initializeIcons();

const POLICY = (props) => {
  const controlIDSet = new Set(props.controls);

  const onItemInvoked = (item) => {
    setModalData(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [items, setItems] = useState([]);
  const [groupedItems, setGroupedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [isTableExpanded, setIsTableExpanded] = useState(true);
  const [isControlDescending, setIsControlDescending] = useState(true);
  const [isMCSBDescending, setIsMCSBDescending] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1300);

  const columns = [
    {
      key: "expand",
      name: "",
      fieldName: "expand",
      minWidth: 12,
      maxWidth: 12,
      onRender: (item) => (
        <div>
          <Icon
            aria-label="Expand fullscreen"
            iconName="ChromeFullScreen"
            style={{
              cursor: "pointer",
              width: "20px",
              color: "#0078D4",
              fontSize: "14px",
            }}
            onClick={() => onItemInvoked(item)}
          />
        </div>
      ),
    },
    {
      key: "control",
      name: (
        <>
          Control ID
          <TooltipHost
            content="Identifier for specific control within the selected regulatory framework"
            closeDelay={1000}
          >
            <Icon
              styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }}
              iconName="info"
              aria-label="Tooltip"
            />
          </TooltipHost>
        </>
      ),
      fieldName: "control",
      minWidth: 105,
      maxWidth: 150,
      isResizable: true,
      isSorted: true,
      isSortedDescending: isControlDescending,
      isSortable: true,
    },
    {
      key: "mcsbID",
      name: (
        <>
          Microsoft Cloud Security Benchmark ID
          <TooltipHost
            content={
              <>
                Identifier for specific control within{" "}
                <Link
                  href={
                    "https://learn.microsoft.com/security/benchmark/azure/overview"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Microsoft Cloud Security Benchmark
                </Link>
              </>
            }
            closeDelay={1000}
          >
            <Icon
              styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }}
              iconName="info"
              aria-label="Tooltip"
            />
          </TooltipHost>
        </>
      ),
      fieldName: "mcsbID",
      minWidth: 175,
      maxWidth: 175,
      isResizable: true,
      isSorted: true,
      isSortedDescending: isMCSBDescending,
      isSortable: true,
    },
    {
      key: "service",
      name: (
        <>
          Service
          <TooltipHost
            content=<Link
              href={"https://azure.microsoft.com/products/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Cloud product
            </Link>
            closeDelay={1000}
          >
            <Icon
              styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }}
              iconName="info"
              aria-label="Tooltip"
            />
          </TooltipHost>
        </>
      ),
      fieldName: "service",
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
    },
    {
      key: "policy",
      name: (
        <>
          Azure Policy Name
          <TooltipHost
            content={
              <>
                Title of the{" "}
                <Link
                  href={
                    "https://learn.microsoft.com/azure/governance/policy/overview"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   Azure Policy
                </Link>{" "}
                used to help measure compliance with a given regulatory
                framework
              </>
            }
            closeDelay={1000}
          >
            <Icon
              styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }}
              iconName="info"
              aria-label="Tooltip"
            />
          </TooltipHost>
        </>
      ),
      fieldName: "policy",
      minWidth: 200,
      maxWidth: 400,
      isResizable: true,
    },
    {
      key: "description",
      name: (
        <>
          Azure Policy Description
          <TooltipHost
            content={
              <>
                More details about the{" "}
                <Link
                  href={
                    "https://learn.microsoft.com/azure/governance/policy/overview"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   Azure Policy
                </Link>{" "}
                used to help measure compliance with a given regulatory
                framework
              </>
            }
            closeDelay={1000}
          >
            <Icon
              styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }}
              iconName="info"
              aria-label="Tooltip"
            />
          </TooltipHost>
        </>
      ),
      fieldName: "description",
      minWidth: 200,
      maxWidth: 800,
      isResizable: true,
    },
    {
      key: "policyID",
      name: (
        <>
          Reference
          <TooltipHost
            content={
              <>
                Link to more information about the{" "}
                <Link
                  href={
                    "https://learn.microsoft.com/azure/governance/policy/overview"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                   Azure Policy
                </Link>{" "}
                used to help measure compliance with a given regulatory
                framework
              </>
            }
            closeDelay={1000}
          >
            <Icon
              styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }}
              iconName="info"
              aria-label="Tooltip"
            />
          </TooltipHost>
        </>
      ),
      fieldName: "policyID",
      minWidth: 90,
      maxWidth: 90,
      isResizable: true,
      onRender: (item) => (
        <Link
          href={
            "https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F" +
            item.policyID
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon
            iconName="OpenInNewWindow"
            style={{ marginRight: "4px", fontSize: "14px" }}
            aria-label="Open in new tab"
          />
          See Docs
        </Link>
      ),
    },
  ];

  const onRenderDetailsHeader = (headerProps, defaultRender) => {
    if (!headerProps || !defaultRender) {
      return null;
    }
    return (
      <Sticky isScrollSynced stickyPosition={StickyPositionType.Header}>
        {defaultRender({
          ...headerProps,
          styles: {
            root: {
              height: "50px",
              selectors: {
                ".ms-DetailsHeader-cell": {
                  whiteSpace: "normal",
                  textOverflow: "clip",
                  lineHeight: "normal",
                  height: "50px",
                },
                ".ms-DetailsHeader-cellTitle": {
                  height: "100%",
                  alignItems: "center",
                },
              },
            },
          },
        })}
      </Sticky>
    );
  };

  const onColumnClick = (ev, column) => {
    let groupedArray;
    const sortableColumn = column;
    if (sortableColumn.key === "control") {
      setIsControlDescending(!isControlDescending);
      const reversedItems = items.reverse();
      let sortedItems = sortRows(items, props.framework);
      if (isControlDescending) {
        sortedItems = sortedItems.reverse();
      }
      groupedArray = groupAndSortRows(
        sortedItems,
        isControlDescending,
        props.framework
      );
      setItems(reversedItems);
      setGroupedItems(groupedArray);
    }
    if (sortableColumn.key === "mcsbID") {
      setIsMCSBDescending(!isMCSBDescending);
      let sortedItems = items.sort((a, b) => {
        const getNumericParts = (str) => str.match(/\d+/g).map(Number) || [0];
        const [alphaA, numsA] = [
          a.mcsbID.match(/[A-Za-z]+/)[0],
          getNumericParts(a.mcsbID),
        ];
        const [alphaB, numsB] = [
          b.mcsbID.match(/[A-Za-z]+/)[0],
          getNumericParts(b.mcsbID),
        ];

        if (alphaA.localeCompare(alphaB) !== 0) {
          return alphaA.localeCompare(alphaB);
        }
        for (let i = 0; i < Math.max(numsA.length, numsB.length); i++) {
          const diff = numsA[i] - numsB[i];
          if (diff !== 0) {
            return diff;
          }
        }
      });
      if (isMCSBDescending) {
        sortedItems = sortedItems.reverse();
      }
      groupedArray = groupAndSortRows(
        sortedItems,
        isMCSBDescending,
        "MCSB_Table"
      );
      setItems(sortedItems);
      setGroupedItems(groupedArray);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      <div className={isSmallScreen ? classNames.scrollable : ""}></div>;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const initTableLoad = (flattenedData) => {
    const sortedItems = sortRows(flattenedData, props.framework);
    setItems(sortedItems);
    setGroupedItems(groupAndSortRows(sortedItems, false, props.framework));
  };

  // ENTRY POINT
  useEffect(() => {
    const flattenedData = flattenData(props.data);
    initTableLoad(flattenedData);
  }, [props]);

  function flattenData(dataset) {
    const temp = [];
    dataset.forEach((row) => {
      const rowControls = row.properties_metadata.frameworkControlsMappings;
      // if there are user-selected control IDs, then only show those controls
      // this filters out rows that do not have any user-selected IDs in their controls array
      if (controlIDSet && controlIDSet.size > 0) {
        rowControls.forEach((control) => {
          if (controlIDSet.has(control.split("_").pop())) {
            row.properties_metadata.automatedPolicyAvailability.forEach(
              (policy) => {
                temp.push({
                  mcsbID: row.properties_metadata.mcsbId,
                  control: `${control.split("_").pop()}: ${props.mapState.get(
                    sanitizeControlID(control.split("_").pop())
                  )}`,
                  service: row.properties_metadata.offeringName,
                  category: policy.policyCategory,
                  policy: policy.policyName,
                  description: policy.policyDescription,
                  policyID: policy.policyId,
                });
              }
            );
          }
        });
        // otherwise, since the user didn't limit any controls,
        // find all of the rows that have our chosen framework instead and show them all
      } else {
        rowControls.forEach((control) => {
          if (control.includes(props.framework)) {
            row.properties_metadata.automatedPolicyAvailability.forEach(
              (policy) => {
                temp.push({
                  mcsbID: row.properties_metadata.mcsbId,
                  control: `${control.split("_").pop()}: ${props.mapState.get(
                    sanitizeControlID(control.split("_").pop())
                  )}`,
                  service: row.properties_metadata.offeringName,
                  category: policy.policyCategory,
                  policy: policy.policyName,
                  description: policy.policyDescription,
                  policyID: policy.policyId,
                });
              }
            );
          }
        });
      }
    });
    return temp;
  }

  return (
    <div className="cardStyle">
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
        <h2 className="titleStyle">{tableText.policyTitle}</h2>
        <IconButton
          ariaLabel={isTableExpanded ? "Collapse table" : "Expand table"}
          title={
            isTableExpanded
              ? "Collapse Compliance Policies by Service table"
              : "Expand Compliance Policies by Service table"
          }
          iconProps={{
            iconName: isTableExpanded ? "ChevronUp" : "ChevronDown",
          }}
          onClick={() => setIsTableExpanded(!isTableExpanded)}
          styles={{
            icon: { color: "#0078D4", fontSize: 15, fontWeight: "bold" },
          }}
        />
      </Stack>
      <Text variant="medium" className="subtitleStyle">
        {tableText.policyDescription}
      </Text>

      {isTableExpanded ? (
        <div className={isSmallScreen ? classNames.scrollable : ""}>
          {items.length > 0 ? (
            groupedItems && groupedItems.length > 0 ? (
              <DetailsList
                items={items}
                columns={columns}
                onColumnHeaderClick={onColumnClick}
                selectionMode={SelectionMode.none}
                onItemInvoked={onItemInvoked}
                onRenderDetailsHeader={onRenderDetailsHeader}
                onRenderRow={(props, defaultRender) => {
                  if (!props) return null;

                  props.styles = {
                    cell: {
                      height: 65,
                      whiteSpace: "normal",
                      lineHeight: "1.69",
                      fontSize: "14.1px",
                      fontFamily:
                        "SegoeUI-Regular-final, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                    },
                    root: {
                      height: 70,
                    },
                    checkCell: {
                      height: 66,
                    },
                  };

                  return defaultRender ? defaultRender(props) : <></>;
                }}
                groups={groupedItems}
                layoutMode={DetailsListLayoutMode.justified}
                styles={gridStyles}
                focusZoneProps={focusZoneProps}
                selectionZoneProps={{
                  className: classNames.selectionZone,
                }}
                constrainMode={ConstrainMode.unconstrained}
              />
            ) : (
              <DetailsList
                items={items}
                columns={columns}
                onColumnHeaderClick={onColumnClick}
                selectionMode={SelectionMode.none}
                onItemInvoked={onItemInvoked}
                onRenderDetailsHeader={onRenderDetailsHeader}
                onRenderRow={(props, defaultRender) => {
                  if (!props) return null;

                  props.styles = {
                    cell: {
                      height: 65,
                      whiteSpace: "normal",
                      lineHeight: "1.69",
                      fontSize: "14.1px",
                      fontFamily:
                        "SegoeUI-Regular-final, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                    },
                    root: {
                      height: 70,
                    },
                    checkCell: {
                      height: 66,
                    },
                  };

                  return defaultRender ? defaultRender(props) : <></>;
                }}
                layoutMode={DetailsListLayoutMode.justified}
                styles={gridStyles}
                focusZoneProps={focusZoneProps}
                selectionZoneProps={{
                  className: classNames.selectionZone,
                }}
                constrainMode={ConstrainMode.unconstrained}
              />
            )
          ) : (
            <TableStates type="Policy" variant="EmptyLoad" />
          )}
        </div>
      ) : null}

      <PoliciesModal
        isLightDismiss
        isOpen={isModalOpen}
        onClose={closeModal}
        rowData={modalData}
      />
    </div>
  );
};

export default POLICY;
