import React, { useState, useEffect } from 'react';
import { DetailsList, SelectionMode, DetailsListLayoutMode, Text, Icon, IconButton, Stack, initializeIcons, TooltipHost, Sticky, StickyPositionType, ConstrainMode } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';

import ACFModal from '../Modals/ACFModal.js';
import TableStates from './TableStates.js';
import nistIDS from '../../static/nistControls.json';

import '../../styles/Tables.css';
import { gridStyles, focusZoneProps, classNames } from '../../styles/TablesStyles.js';
import { tableText } from '../../static/staticStrings.js';

initializeIcons();

const ACF = (props) => {

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
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1300);

  const columns = [
    {
      key: 'expand',
      name: '',
      fieldName: 'expand',
      minWidth: 12,
      maxWidth: 12,
      onRender: (item) => (
        <div>
          <Icon
            aria-label="Expand fullscreen"
            iconName="ChromeFullScreen"
            style={{ cursor: 'pointer', width: "20px", color: '#0078D4', fontSize: '14px' }}
            onClick={() => onItemInvoked(item)}
          />
        </div>
      ),
    },
    {
      key: 'control',
      name: <>Control ID
        <TooltipHost
          id={useId('tooltip')}
          content="Identifier for specific control within the selected regulatory framework"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'control',
      minWidth: 105,
      maxWidth: 105,
      isResizable: true,
      isSorted: true,
      isSortedDescending: isControlDescending,
      isSortable: true,
    },
    {
      key: 'acfID',
      name: <>Azure Control Framework ID
        <TooltipHost
          id={useId('tooltip')}
          content="Identifier for specific control within Azure Control Framework"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'acfID',
      minWidth: 125,
      maxWidth: 125,
      isResizable: true,
    },
    {
      key: 'description',
      name: <>Microsoft Managed Actions - Description
        <TooltipHost
          id={useId('tooltip')}
          content="Summary of the actions Microsoft takes to help fulfill its compliance responsibilities when developing and operating the Microsoft Cloud"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'description',
      minWidth: 200,
      maxWidth: 600,
      isResizable: true,
    },
    {
      key: 'details',
      name: <>Microsoft Managed Actions - Details
        <TooltipHost
          id={useId('tooltip')}
          content="Additional details about the actions Microsoft takes to help fulfill its compliance responsibilities when developing and operating the Microsoft Cloud"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'details',
      minWidth: 200,
      maxWidth: 600,
      isResizable: true,
    },
  ];

  const onColumnClick = (ev, column) => {
    let groupedArray;
    const sortableColumn = column;
    if (sortableColumn.key === 'control') {
      setIsControlDescending(!isControlDescending);
      const reversedItems = items.reverse();

      if (props.framework === "NIST_SP_800-53_R4") {
        groupedArray = groupAndSortNIST(reversedItems, isControlDescending);
      } else if (props.framework === "CIS_Azure_2.0.0") {
        groupedArray = groupAndSortCIS(reversedItems, isControlDescending);
      } else {
        groupedArray = groupAndSortPCI(reversedItems, isControlDescending);
      }
      setItems(reversedItems);
      setGroupedItems(groupedArray);
    }
  }

  function findLabelByValue(value) {
    const item = nistIDS.find((entry) => entry.value === value);
    return item ? item.label.split(":")[1].trim() : null;
  }

  const groupAndSortNIST = (sortedItems, descending) => {
    const groupedItems = sortedItems.reduce((groups, item) => {
      const controlId = sanitizeControlID(item.control).split(/[(,:]/)[0].trim();
      if (!groups[controlId]) {
        groups[controlId] = [];
      }
      groups[controlId].push(item);
      return groups;
    }, {});

    const groupedArray = Object.keys(groupedItems).map((key) => ({
      key,
      name: key + ": " + findLabelByValue(key),
      startIndex: sortedItems.indexOf(groupedItems[key][0]),
      count: groupedItems[key].length,
      isCollapsed: false,
    }));

    groupedArray.sort((a, b) => {
      const [alphaA, numA] = [a.name.match(/[A-Za-z]+/)[0], parseInt(a.name.match(/\d+/)[0], 10)];
      const [alphaB, numB] = [b.name.match(/[A-Za-z]+/)[0], parseInt(b.name.match(/\d+/)[0], 10)];

      return alphaA !== alphaB ? alphaA.localeCompare(alphaB) : numA - numB;
    });

    if (descending) {
      groupedArray.reverse();
    }
    return groupedArray;
  };

  const groupAndSortCIS = (sortedItems, descending) => {
    const groupedItems = sortedItems.reduce((groups, item) => {
      const controlId = sanitizeControlID(item.control).trim();
      if (!groups[controlId]) {
        groups[controlId] = [];
      }
      groups[controlId].push(item);
      return groups;
    }, {});

    const groupedArray = Object.keys(groupedItems).map((key) => ({
      key,
      name: key,
      startIndex: sortedItems.indexOf(groupedItems[key][0]),
      count: groupedItems[key].length,
      isCollapsed: false,
      level: 0
    }));

    groupedArray.sort((a, b) => {
      const getNumericParts = (str) => str.match(/\d+/g).map(Number) || [0];

      const [alphaA, numsA] = [a.name.match(/[A-Za-z]+/)[0], getNumericParts(a.name)];
      const [alphaB, numsB] = [b.name.match(/[A-Za-z]+/)[0], getNumericParts(b.name)];

      for (let i = 0; i < Math.max(numsA.length, numsB.length); i++) {
        const diff = numsA[i] - numsB[i];
        if (diff !== 0) {
          return !descending ? diff : -diff;
        }
      }
      return alphaA.localeCompare(alphaB);
    });

    return groupedArray;
  };

  const groupAndSortPCI = (sortedItems, descending) => {
    const groupedItems = sortedItems.reduce((groups, item) => {
      const controlIdArray = sanitizeControlID(item.control).split('.');
      const controlId = controlIdArray.slice(0, 2).join('.');
      let groupHeaderText
      if (controlIdArray.length === 3) {
        groupHeaderText = `${controlId}: ${controlIdArray.slice(2).join('. ').substring(3)}`;
      } else {
        groupHeaderText = `${controlId}: ${controlIdArray.slice(2).join('. ').substring(6)}`;
      }

      if (!groups[controlId]) {
        groups[controlId] = {
          items: [],
          groupHeaderText,
        };
      }
      groups[controlId].items.push(item);
      return groups;
    }, {});

    const groupedArray = Object.keys(groupedItems).map((key) => ({
      key,
      name: groupedItems[key].groupHeaderText,
      startIndex: sortedItems.indexOf(groupedItems[key].items[0]),
      count: groupedItems[key].items.length,
      isCollapsed: false,
    }));

    groupedArray.sort((a, b) => {
      const controlIDA = sanitizeControlID(a.name).split('.').map(part => parseInt(part, 10));
      const controlIDB = sanitizeControlID(b.name).split('.').map(part => parseInt(part, 10));

      for (let i = 0; i < Math.min(controlIDA.length, controlIDB.length); i++) {
        const numA = controlIDA[i];
        const numB = controlIDB[i];

        return (!descending ? 1 : -1) * (numA - numB);
      }
      return controlIDA.length - controlIDB.length;
    });
    return groupedArray;
  }

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
              height: '50px',
              selectors: {
                '.ms-DetailsHeader-cell': {
                  whiteSpace: 'normal',
                  textOverflow: 'clip',
                  lineHeight: 'normal',
                  height: '50px',
                },
                '.ms-DetailsHeader-cellTitle': {
                  height: '100%',
                  alignItems: 'center',
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
      item && column && column.fieldName ? item[column.fieldName] || '' : '';

    return <div data-is-focusable={true}>{value}</div>;
  }

  const sanitizeControlID = (controlId) => {
    const controlIdWithoutParentheses = controlId.replace(/\([^)]*\)/g, '');
    return controlIdWithoutParentheses.split('|')[0].trim();
  };

  const nistTableLoad = (flattenedData) => {
    let sortedItems = flattenedData.sort((a, b) => {
      const getNumericParts = (str) => str.match(/\d+/g).map(Number) || [0];

      const [alphaA, numsA] = [a.control.match(/[A-Za-z]+/)[0], getNumericParts(a.control)];
      const [alphaB, numsB] = [b.control.match(/[A-Za-z]+/)[0], getNumericParts(b.control)];

      for (let i = 0; i < Math.max(numsA.length, numsB.length); i++) {
        const diff = numsA[i] - numsB[i];
        if (diff !== 0) {
          return diff;
        }
      }
      return alphaA.localeCompare(alphaB);
    });

    setItems(sortedItems);
    setGroupedItems(groupAndSortNIST(sortedItems, false));
  };


  const pciTableLoad = (flattenedData) => {
    let sortedItems = flattenedData.sort((a, b) => {
      const controlIDA = sanitizeControlID(a.control).split('.').map(part => parseInt(part, 10));
      const controlIDB = sanitizeControlID(b.control).split('.').map(part => parseInt(part, 10));

      for (let i = 0; i < Math.min(controlIDA.length, controlIDB.length); i++) {
        const numA = controlIDA[i];
        const numB = controlIDB[i];

        if (numA < numB) {
          return -1;
        } else if (numA > numB) {
          return 1;
        }
      }
      return controlIDA.length - controlIDB.length;
    });
    setItems(sortedItems);
    setGroupedItems(groupAndSortPCI(sortedItems, false));
  };

  const cisTableLoad = (flattenedData) => {
    let sortedItems = flattenedData.sort((a, b) => {
      const partsA = sanitizeControlID(a.control).split('.').map(part => isNaN(part) ? part : parseInt(part, 10));
      const partsB = sanitizeControlID(b.control).split('.').map(part => isNaN(part) ? part : parseInt(part, 10));

      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const partA = partsA[i] || 0;
        const partB = partsB[i] || 0;

        if (partA < partB) {
          return -1;
        } else if (partA > partB) {
          return 1;
        }
      }
      return sanitizeControlID(a.control).localeCompare(sanitizeControlID(b.control));
    });

    setItems(sortedItems);
    setGroupedItems(groupAndSortCIS(sortedItems, false));
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      <div className={isSmallScreen ? classNames.scrollable : ''}></div>
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ENTRY POINT
  useEffect(() => {
    const flattenedData = flattenData(props.data);
    if (props.framework === "NIST_SP_800-53_R4") {
      nistTableLoad(flattenedData);
    } else if (props.framework === "CIS_Azure_Benchmark_v2.0.0") {
      cisTableLoad(flattenedData);
    } else {
      pciTableLoad(flattenedData);
    }
  }, [props.data]);

  function flattenData(dataset) {
    const temp = [];
    let controlValue;
    dataset.forEach((row) => {
      if (props.framework === "NIST_SP_800-53_R4") {
        controlValue = `${row.ControlID.split("_").pop()}: ${props.mapState.get(sanitizeControlID(row.ControlID.split("_").pop()))}`
      } else {
        controlValue = `${row.ControlID.split("_").pop()}: ${props.mapState.get(row.ControlID.split("_").pop())}`
      }
      temp.push({
        acfID: row.AzureControlFrameworkID,
        control: controlValue,
        description: row.MicrosoftManagedActionsDescription,
        details: row.MicrosoftManagedActionsDetails,
      });
    });
    return temp;
  }

  return (
    <div className={"cardStyle"}>
      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between">
        <Stack horizontal verticalAlign="center">
          <div>
            <h2 className="titleStyle">
              {tableText.acfTitle}
            </h2>
            <Text variant="medium" className="subtitleStyle">
              {tableText.acfDescription}
            </Text>
          </div>
        </Stack>
        <IconButton
          ariaLabel={isTableExpanded ? "Collapse table" : "Expand table"}
          title={isTableExpanded ? "Collapse Microsoft Cloud Compliance Foundation table" : "Expand Microsoft Cloud Compliance Foundation table"}
          iconProps={{iconName: isTableExpanded ? 'ChevronUp' : 'ChevronDown'}}
          onClick={() => setIsTableExpanded(!isTableExpanded)}
          styles={{
            icon: { color: '#0078D4', fontSize: 15, fontWeight: "bold" },
          }}
        />
      </Stack>

      {isTableExpanded ? (
        <div className={isSmallScreen ? classNames.scrollable : ''}>
          {items.length > 0 ? (
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
                    whiteSpace: 'normal',
                    lineHeight: '1.69',
                    fontSize: '14.1px',
                    fontFamily: 'SegoeUI-Regular-final, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
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
            <TableStates type="ACF" variant="EmptyLoad" />
          )}
        </div>
      ) : null}
      <ACFModal isLightDismiss isOpen={isModalOpen} onClose={closeModal} rowData={modalData} />
    </div>
  );
};

export default ACF;
