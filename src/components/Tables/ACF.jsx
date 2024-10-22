import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  Icon,
  IconButton,
  initializeIcons,
  SelectionMode,
  Stack,
  Sticky,
  StickyPositionType,
  Text,
  TooltipHost,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { useEffect, useState } from "react";

import ACFModal from "../Modals/ACFModal.jsx";
import TableStates from "./TableStates.tsx";

import { tableText } from "../../static/staticStrings";
import "../../styles/Tables.css";
import {
  classNames,
  focusZoneProps,
  gridStyles,
} from "../../styles/TablesStyles.js";
import { sanitizeControlID } from "../../utils/controlIdUtils.ts";
import { groupAndSortRows, sortRows } from "../../utils/tableSortUtils.js";

initializeIcons();

const ACF = (props) => {
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
  const [isACFDescending, setIsACFDescending] = useState(true);
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
            id={useId("tooltip")}
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
      maxWidth: 105,
      isResizable: true,
      isSorted: true,
      isSortedDescending: isControlDescending,
      isSortable: true,
    },
    {
      key: "acfID",
      name: (
        <>
          Azure Control Framework ID
          <TooltipHost
            id={useId("tooltip")}
            content="Identifier for specific control within Azure Control Framework"
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
      fieldName: "acfID",
      minWidth: 125,
      maxWidth: 125,
      isResizable: true,
      isSorted: true,
      isSortedDescending: isACFDescending,
      isSortable: true,
    },
    {
      key: "description",
      name: (
        <>
          Microsoft Managed Actions - Description
          <TooltipHost
            id={useId("tooltip")}
            content="Summary of the actions Microsoft takes to help fulfill its compliance responsibilities when developing and operating the Microsoft Cloud"
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
      maxWidth: 600,
      isResizable: true,
    },
    {
      key: "details",
      name: (
        <>
          Microsoft Managed Actions - Details
          <TooltipHost
            id={useId("tooltip")}
            content="Additional details about the actions Microsoft takes to help fulfill its compliance responsibilities when developing and operating the Microsoft Cloud"
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
      fieldName: "details",
      minWidth: 200,
      maxWidth: 600,
      isResizable: true,
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
    if (sortableColumn.key === "acfID") {
      setIsACFDescending(!isACFDescending);
      let sortedItems = items.sort((a, b) => {
        const numA = parseInt(a.acfID.match(/\d+/g), 10);
        const numB = parseInt(b.acfID.match(/\d+/g), 10);
        return numA - numB;
      });
      if (isACFDescending) {
        sortedItems = sortedItems.reverse();
      }
      groupedArray = groupAndSortRows(
        sortedItems,
        isACFDescending,
        "ACF_Table"
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

  const onRenderColumn = (item, index, column) => {
    const value =
      item && column && column.fieldName ? item[column.fieldName] || "" : "";

    return <div data-is-focusable={true}>{value}</div>;
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
  }, [props.data]);

  function flattenData(dataset) {
    const temp = [];
    dataset.forEach((row) => {
      const rowControls = row.properties.metadata.frameworkControlsMappings;

      // if there are user-selected control IDs, then only show those controls
      // this filters out rows that do not have any user-selected IDs in their controls array
      if (controlIDSet && controlIDSet.size > 0) {
        rowControls.forEach((control) => {
          const controlID = control.split("_").pop();
          const mappedControl = props.mapState.get(
            sanitizeControlID(controlID)
          );

          if (controlIDSet.has(controlID) && mappedControl !== undefined) {
            temp.push({
              control: `${controlID}: ${mappedControl}`,
              acfID: row.name,
              description: row.properties.description,
              details: row.properties.requirements,
            });
          }
        });
      } else {
        // otherwise, since the user didn't limit any controls,
        // find all of the rows that have our chosen framework instead and show them all
        rowControls.forEach((control) => {
          if (control.includes(props.framework)) {
            const controlID = control.split("_").pop();
            const mappedControl = props.mapState.get(
              sanitizeControlID(controlID)
            );

            if (mappedControl !== undefined) {
              temp.push({
                control: `${controlID}: ${mappedControl}`,
                acfID: row.name,
                description: row.properties.description,
                details: row.properties.requirements,
              });
            }
          }
        });
      }
    });
    return temp;
  }

  return (
    <div className={"cardStyle"}>
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
        <h2 className="titleStyle">{tableText.acfTitle}</h2>
        <IconButton
          ariaLabel={isTableExpanded ? "Collapse table" : "Expand table"}
          title={
            isTableExpanded
              ? "Collapse Microsoft Cloud Compliance Foundation table"
              : "Expand Microsoft Cloud Compliance Foundation table"
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
        {tableText.acfDescription}
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
                onRenderItemColumn={onRenderColumn}
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
                groupProps={{
                  showEmptyGroups: true,
                }}
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
                onRenderItemColumn={onRenderColumn}
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
            <TableStates type="ACF" variant="EmptyLoad" />
          )}
        </div>
      ) : null}

      <ACFModal
        isLightDismiss
        isOpen={isModalOpen}
        onClose={closeModal}
        rowData={modalData}
      />
    </div>
  );
};

export default ACF;
