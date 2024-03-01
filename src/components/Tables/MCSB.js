import React, { useState, useEffect } from 'react';
import { DetailsList, SelectionMode, DetailsListLayoutMode, Text, Icon, Stack, initializeIcons, TooltipHost, Sticky, StickyPositionType, ConstrainMode, Link } from '@fluentui/react';

import MCSBModal from '../Modals/MCSBModal.js';
import TableStates from './TableStates.js';

import '../../styles/Tables.css';
import { gridStyles, focusZoneProps, classNames } from '../../styles/TablesStyles.js';
import { tableText } from '../../static/staticStrings.js';

initializeIcons();

const MCSB = (props) => {

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
          content="Identifier for specific control within the selected regulatory framework"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'control',
      minWidth: 105,
      maxWidth: 150,
      isResizable: true,
      isSorted: true,
      isSortedDescending: isControlDescending,
      isSortable: true,
    },
    {
      key: 'mcsbID',
      name: (
        <>Microsoft Cloud Security Benchmark ID
          <TooltipHost
            content={
              <>
                Identifier for specific control within{" "}
                <Link href={"https://learn.microsoft.com/security/benchmark/azure/overview"} target="_blank" rel="noopener noreferrer">Microsoft Cloud Security Benchmark</Link>
              </>
            }
            closeDelay={1000}
          >
            <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px", fontSize: '14px' } }} iconName="info" aria-label="Tooltip" />
          </TooltipHost>
        </>
      ),
      fieldName: 'mcsbID',
      minWidth: 175,
      maxWidth: 175,
      isResizable: true,
    },
    {
      key: 'service',
      name: <>Service
        <TooltipHost
          content=<Link href={'https://azure.microsoft.com/products/'} target="_blank" rel="noopener noreferrer">Microsoft Cloud product</Link>
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'service',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
    },
    {
      key: 'name',
      name: <>Microsoft Cloud Security Benchmark Feature
        <TooltipHost
          content="Technical control a customer can configure to help achieve their compliance obligations"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'name',
      minWidth: 160,
      maxWidth: 160,
      isResizable: true,
    },
    {
      key: 'supported',
      name: <>Feature Supported
        <TooltipHost
          content="Describes whether a technical control is supported by a given service"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'supported',
      minWidth: 90,
      maxWidth: 90,
      isResizable: true,
    },
    {
      key: 'description',
      name: <>Description
        <TooltipHost
          content="Description of the MCSB Feature for the given Service"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'description',
      minWidth: 100,
      maxWidth: 500,
      isResizable: true,
    },
    {
      key: 'guidance',
      name: <>Configuration Guidance
        <TooltipHost
          content="Guidance to help customers configure the MCSB Feature for the given Service"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'guidance',
      minWidth: 100,
      maxWidth: 600,
      isResizable: true,
    },
    {
      key: 'reference',
      name: <>Reference
        <TooltipHost
          content="Link to more information about the MCSB Feature for the given Service"
          closeDelay={1000}>
          <Icon styles={{ root: { verticalAlign: "bottom", marginLeft: "5px" } }} iconName="info" aria-label="Tooltip" />
        </TooltipHost>
      </>,
      fieldName: 'reference',
      minWidth: 90,
      maxWidth: 90,
      isResizable: true,
      onRender: (item) => {
        if (item.reference === "Not Applicable") {
          return <span>N/A</span>;
        }
        return (
          <Link href={item.reference} target="_blank" rel="noopener noreferrer">
            <Icon iconName="OpenInNewWindow" style={{ marginRight: '4px' }} aria-label="Open in new tab" />
            See Docs
          </Link>
        );
      },
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

  const sanitizeControlID = (controlId) => {
    const controlIdWithoutParentheses = controlId.replace(/\([^)]*\)/g, '');
    return controlIdWithoutParentheses.split('|')[0].trim();
  };

  const groupAndSortNIST = (sortedItems, descending) => {
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
    }));

    groupedArray.sort((a, b) => {
      const [alphaA, numA] = [a.name.match(/[A-Za-z]+/)[0], parseInt(a.name.match(/\d+/)[0], 10)];
      const [alphaB, numB] = [b.name.match(/[A-Za-z]+/)[0], parseInt(b.name.match(/\d+/)[0], 10)];

      return alphaA !== alphaB
        ? alphaA.localeCompare(alphaB)
        : (!descending ? numA - numB : numB - numA);

    });
    return groupedArray
  }

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

  const nistTableLoad = (flattenedData) => {
    let sortedItems = flattenedData.sort((a, b) => {
      const numA = parseInt(sanitizeControlID(a.control).match(/\d+/)[0], 10);
      const numB = parseInt(sanitizeControlID(b.control).match(/\d+/)[0], 10);

      if (numA < numB) {
        return -1;
      } else if (numA > numB) {
        return 1;
      } else {
        return sanitizeControlID(a.control).localeCompare(sanitizeControlID(b.control));
      }
    });
    setItems(sortedItems);
    setGroupedItems(groupAndSortNIST(sortedItems, false));
  }

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

  useEffect(() => {
    const flattenedData = flattenData(props.data);
    if (props.framework === "NIST_SP_800-53_R4") {
      nistTableLoad(flattenedData)
    } else if (props.framework === "CIS_Azure_Benchmark_v2.0.0") {
      cisTableLoad(flattenedData)
    } else {
      pciTableLoad(flattenedData)
    }
  }, [props]);

  function flattenData(dataset) {
    const temp = [];
    dataset.forEach((service) => {
      const serviceName = service['Service Name'];
      service['Standard Controls'].forEach((control) => {
        const controlID = control['Standard Control ID'];
        const controlName = control['Standard Control Name'];
        const mcsbBaseline = control['MCSB Baseline'];
        const sanitizedControlName = controlName ? controlName.replace(/[^\w.,: ]/g, '') : '';

        mcsbBaseline.forEach((baselineItem) => {
          const feature = baselineItem['Features'];
          feature.forEach((feature) => {
            temp.push({
              mcsbID: baselineItem['MCSB ID'],
              control: `${controlID}: ${sanitizedControlName}`,
              service: serviceName,
              name: feature['Feature Name'],
              actions: feature['Customer Actions Description'],
              supported: feature['Feature Support'],
              enabled: feature['Enabled by Default'],
              description: feature['Feature Description'],
              guidance: feature['Feature Guidance'],
              reference: feature['Feature Reference'],
            });
          });
        });
      });
    });
    return temp;
  }

  return (
    <div className="cardStyle">
      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between">
        <Stack horizontal verticalAlign="center">
          <div>
            <h2 className="titleStyle">
              {tableText.mcsbTitle}
            </h2>
            <Text variant="medium" className="subtitleStyle">
              {tableText.mcsbDescription}
            </Text>
          </div>
        </Stack>
        <Icon
          aria-label="Expand table"
          iconName={isTableExpanded ? 'ChevronUp' : 'ChevronDown'}
          onClick={() => setIsTableExpanded(!isTableExpanded)}
          style={{ fontSize: '15px', cursor: 'pointer', color: '#0078D4', paddingLeft: '15px', fontWeight: 'bold' }}
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
              isHeaderVisible={true}
              onRenderDetailsHeader={onRenderDetailsHeader}
              onShouldVirtualize={() => {
                return false;
              }}
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
              layoutMode={DetailsListLayoutMode.justified}
              styles={gridStyles}
              focusZoneProps={focusZoneProps}
              selectionZoneProps={{
                className: classNames.selectionZone,
              }}
              constrainMode={ConstrainMode.unconstrained}
            />
          ) : (
            <TableStates type="MCSB" variant="EmptyLoad" />
          )}
        </div>
      ) : null}
      <MCSBModal isLightDismiss isOpen={isModalOpen} onClose={closeModal} rowData={modalData} />
    </div>
  );
};

export default MCSB;