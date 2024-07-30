import React, { useState, useEffect } from "react";
import {
  DetailsList,
  SelectionMode,
  DetailsListLayoutMode,
  Text,
  Icon,
  IconButton,
  Stack,
  initializeIcons,
  TooltipHost,
  Sticky,
  StickyPositionType,
  ConstrainMode,
  Link,
} from "@fluentui/react";

import MCSBModal from "../Modals/MCSBModal.js";
import TableStates from "./TableStates.js";

import "../../styles/Tables.css";
import {
  gridStyles,
  focusZoneProps,
  classNames,
} from "../../styles/TablesStyles.js";
import { tableText } from "../../static/staticStrings.js";
import { sortRows, groupAndSortRows } from "../../utils/tableSortUtils.js";
import { sanitizeControlID } from "../../utils/controlIdUtils.js";

initializeIcons();

const MCSB = (props) => {
  let controlIDSet = new Set(props.controls);

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
              styles={{
                root: {
                  verticalAlign: "bottom",
                  marginLeft: "5px",
                  fontSize: "14px",
                },
              }}
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
      key: "name",
      name: (
        <>
          Microsoft Cloud Security Benchmark Feature
          <TooltipHost
            content="Technical control a customer can configure to help achieve their compliance obligations"
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
      fieldName: "name",
      minWidth: 160,
      maxWidth: 160,
      isResizable: true,
    },
    {
      key: "supported",
      name: (
        <>
          Feature Supported
          <TooltipHost
            content="Describes whether a technical control is supported by a given service"
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
      fieldName: "supported",
      minWidth: 90,
      maxWidth: 90,
      isResizable: true,
    },
    {
      key: "description",
      name: (
        <>
          Description
          <TooltipHost
            content="Description of the MCSB Feature for the given Service"
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
      minWidth: 100,
      maxWidth: 500,
      isResizable: true,
    },
    {
      key: "guidance",
      name: (
        <>
          Configuration Guidance
          <TooltipHost
            content="Guidance to help customers configure the MCSB Feature for the given Service"
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
      fieldName: "guidance",
      minWidth: 100,
      maxWidth: 600,
      isResizable: true,
    },
    {
      key: "reference",
      name: (
        <>
          Reference
          <TooltipHost
            content="Link to more information about the MCSB Feature for the given Service"
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
      fieldName: "reference",
      minWidth: 90,
      maxWidth: 90,
      isResizable: true,
      onRender: (item) => {
        if (item.reference === "Not Applicable") {
          return <span>N/A</span>;
        }
        return (
          <Link href={item.reference} target="_blank" rel="noopener noreferrer">
            <Icon
              iconName="OpenInNewWindow"
              style={{ marginRight: "4px" }}
              aria-label="Open in new tab"
            />
            See Docs
          </Link>
        );
      },
    },
  ];

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

  const onRenderDetailsHeader = (headerProps, defaultRender) => {
    if (!headerProps || !defaultRender) {
      return null;
    }
    return (
      <Sticky isScrollSynced={true} stickyPosition={StickyPositionType.Header}>
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
    let sortedItems = sortRows(flattenedData, props.framework);
    setItems(sortedItems);
    setGroupedItems(groupAndSortRows(sortedItems, false, props.framework));
  };

  // ENTRY POINT
  useEffect(() => {
    let flattenedData = flattenData(props.data);
    console.log("MCSB data: ", flattenedData);
    initTableLoad(flattenedData);
  }, [props]);

  function flattenData(dataset) {
    const temp = [];
    dataset.forEach((row) => {
      let rowControls = row.properties_metadata.frameworkControlsMappings;
      // if there are user-selected control IDs, then only show those controls
      // this filters out rows that do not have any user-selected IDs in their controls array
      if (controlIDSet && controlIDSet.size > 0) {
        rowControls.forEach((control) => {
          if (controlIDSet.has(control.split("_").pop())) {
            row.properties_metadata.features.forEach((feature) => {
              temp.push({
                mcsbID: row.properties_metadata.mcsbId,
                control: `${control.split("_").pop()}: ${props.mapState.get(
                  sanitizeControlID(control.split("_").pop())
                )}`,
                service: row.properties_metadata.offeringName,
                name: feature.featureName,
                actions: feature.customerActionsDescription,
                supported: feature.featureSupport,
                enabled: feature.enabledByDefault,
                description: feature.featureDescription,
                guidance: feature.featureGuidance,
                reference: feature.featureReference,
              });
            });
          }
        });
        // otherwise, since the user didn't limit any controls,
        // find all of the rows that have our chosen framework instead and show them all
      } else {
        rowControls.forEach((control) => {
          if (control.includes(props.framework)) {
            row.properties_metadata.features.forEach((feature) => {
              temp.push({
                control: `${control.split("_").pop()}: ${props.mapState.get(
                  sanitizeControlID(control.split("_").pop())
                )}`,
                mcsbID: row.properties_metadata.mcsbId,
                service: row.properties_metadata.offeringName,
                name: feature.featureName,
                actions: feature.customerActionsDescription,
                supported: feature.featureSupport,
                enabled: feature.enabledByDefault,
                description: feature.featureDescription,
                guidance: feature.featureGuidance,
                reference: feature.featureReference,
              });
            });
          }
        });
      }
    });
    return temp;
  }

  return (
    <div className="cardStyle">
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
        <h2 className="titleStyle">{tableText.mcsbTitle}</h2>
        <IconButton
          ariaLabel={isTableExpanded ? "Collapse table" : "Expand table"}
          title={
            isTableExpanded
              ? "Collapse Compliance Features by Service table"
              : "Expand Compliance Features by Service table"
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
        {tableText.mcsbDescription}
      </Text>

      {isTableExpanded ? (
        <div className={isSmallScreen ? classNames.scrollable : ""}>
          {items.length > 0 ? (
            (() => {
              const commonProps = {
                items,
                columns,
                onColumnHeaderClick: onColumnClick,
                selectionMode: SelectionMode.none,
                onItemInvoked,
                isHeaderVisible: true,
                onRenderDetailsHeader,
                onShouldVirtualize: () => false,
                onRenderRow: (props, defaultRender) => {
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
                },
                layoutMode: DetailsListLayoutMode.justified,
                styles: gridStyles,
                focusZoneProps,
                selectionZoneProps: {
                  className: classNames.selectionZone,
                },
                constrainMode: ConstrainMode.unconstrained,
              };

              return groupedItems && groupedItems.length > 0 ? (
                <DetailsList {...commonProps} groups={groupedItems} />
              ) : (
                <DetailsList {...commonProps} />
              );
            })()
          ) : (
            <TableStates type="MCSB" variant="EmptyLoad" />
          )}
        </div>
      ) : null}
      <MCSBModal
        isLightDismiss
        isOpen={isModalOpen}
        onClose={closeModal}
        rowData={modalData}
      />
    </div>
  );
};

export default MCSB;
