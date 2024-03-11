import React, { useEffect, useState } from 'react';
import { DropdownMenuItemType, Dropdown } from '@fluentui/react';
import ACF from '../Tables/ACF.js';
import MCSB from '../Tables/MCSB.js';
import Policies from '../Tables/Policies.js';
import TableStates from '../Tables/TableStates.js';
import FilterBadgesContainer from './FilterBadgesContainer.js';
import ExportButton from '../ExportButton.js';
import SearchableDropdown from './SearchableDropdown.js';
import { frameworks, apiText } from '../../static/staticStrings.js';
import { cisDomains, allDomains, allServices, allControls } from '../../queries/Filters.Query.js';
import { allACFs, filteredACFs } from '../../queries/ACF.Query.js';
import { filteredMCSB } from '../../queries/MCSB.Query.js';
import { styles, frameworkStyles, selectedFrameworkStyles, serviceStyles, selectedServiceStyles, controlStyles, selectedControlStyles } from '../../styles/DropdownStyles.js';
import '../../styles/FilterBar.css';
import cisDOMAINS from '../../static/cisDomains.json';

const FilterBar = ({ azureToken }) => {
  const [selectedFramework, setSelectedFramework] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedControls, setSelectedControls] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [controlCount, setControlCount] = useState({});
  const [controlFocus, setControlFocus] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isACFLoading, setACFIsLoading] = useState(false);
  const [isOnload, setIsOnload] = useState(true);
  const [isOverloaded, setIsOverloaded] = useState(false);
  const [isExportButtonDisabled, setIsExportButtonDisabled] = useState(true);

  const [responseData, setResponseData] = useState(null);
  const [acfData, setACFData] = useState(null);
  const [services, setServices] = useState([]);
  const [defaultControls, setDefaultControls] = useState([]);
  const [defaultDomains, setDefaultDomains] = useState([]);

  const [nistMap, setNistMap] = useState(new Map());
  const [pciMap, setPciMap] = useState(new Map());
  const [cisMap, setCisMap] = useState(new Map());

  // API SETUP
  let TOKEN = `Bearer ${azureToken}`
  const myHeaders = new Headers();
  myHeaders.append('Authorization', TOKEN);
  myHeaders.append('Accept', '*/*');
  myHeaders.append('Content-Type', 'application/json');

  // UTILITY FUNCTIONS
  const sanitizeControlID = (controlId) => {
    const prefixMatch = controlId.match(/^[^:()]+/);
    const prefix = prefixMatch ? prefixMatch[0].trim() : '';
    return prefix;
  };

  const customSort = (a, b) => {
    const splitA = a.match(/([a-zA-Z]+)(-?\d*)/);
    const splitB = b.match(/([a-zA-Z]+)(-?\d*)/);

    if (splitA[1] < splitB[1]) return -1;
    if (splitA[1] > splitB[1]) return 1;

    const numA = parseInt(splitA[2]) || 0;
    const numB = parseInt(splitB[2]) || 0;
    return numB - numA;
  };

  const countMaxTotal = (seekControl) => {
    let total = 0;
    for (let control of defaultControls) {
      const key = control.key
      if (key) {
        if (prefixExtractor(key) === seekControl) {
          total++;
        }
      }
    }
    return total;
  }

  const updateControlCount = (key, increment = true) => {
    setControlCount((prevDictionary) => {
      let total = countMaxTotal(key);
      const currentValue = prevDictionary[key];
      const change = increment ? 1 : -1;
      const proposedCount = currentValue !== undefined ? currentValue + change : 1;
      const newCount = Math.max(0, Math.min(total, proposedCount));
      return {
        ...prevDictionary,
        [key]: newCount,
      };
    });
  };

  const prefixExtractor = (control) => {
    if (control) {
      if (selectedFramework === "NIST_SP_800-53_R4") {
        return control.split('-')[0];
      } else {
        return control.split('.')[0];
      }
    }
  }

  // FILTER POPULATION FUNCTIONS

  /**
   * Populates the service filter dropdown
   */
  const populateServices = async () => {
    apiText.requestBody.query = allServices();
    fetch(apiText.mainEndpoint, {
      mode: 'cors',
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(apiText.requestBody)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        const data = result.data;
        const transformedData = data.map(item => ({
          key: item.Service,
          text: item.Service,
        }));
        transformedData.sort((a, b) => a.text.localeCompare(b.text));
        setServices(transformedData);
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  };


  /**
   * Populates the domain filter dropdown depending on what framework is selected
   * @param {string} framework 
   */
  const populateDomains = (framework) => {
    let controlID;
    let key;
    let text;
    if (selectedFramework === "CIS_Azure_2.0.0") { // @TODO Reconnect with below API call once CIS domain names are fixed
      // apiText.requestBody.query = cisDomains();
      let currentDomains = cisDOMAINS.map(domain => {
        return { key: domain.value, text: domain.label };
      });
      setDefaultDomains(currentDomains);
    } else {
      apiText.requestBody.query = allDomains(framework);
      // }
      fetch(apiText.mainEndpoint, {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(apiText.requestBody)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(result => {
          const data = result.data;
          const domainMap = {};
          data.forEach(item => {
            if (framework === "NIST_SP_800-53_R4") {
              controlID = item.ControlID.split('_').pop().split('-')[0];
              key = controlID;
              text = `${controlID}: ${item.ControlDomain}`;
            } else if (framework === "PCI_DSS_v4.0") {
              controlID = item.ControlDomain.split(':')[0].split(' ')[1];
              if (controlID.startsWith('0')) {
                controlID = controlID.substring(1);
              }
              key = controlID;
              text = `${controlID}: ${item.ControlDomain.split(':')[1]}`;
            } else if (framework === "CIS_Azure_2.0.0") {
              key = item.ControlDomain.split(' ')[0];
              text = `${item.ControlDomain.split(' ')[0]}: ${item.ControlDomain.substring(item.ControlDomain.indexOf(" ") + 1)}`;
            }
            if (!domainMap[key]) {
              domainMap[key] = text;
            }
          });
          const uniqueDomains = Object.values(domainMap).map(text => ({ key: text.split(': ')[0], text }));
          setDefaultDomains(uniqueDomains);
        })
        .catch(error => {
          console.error('API Error:', error);
        });
    }
  }

  /**
   * Populates the control ID filter dropdown depending on what framework is selected
   * @param {string} framework 
   */
  const populateControls = (framework) => {
    let currentControls = [];
    let currentPrefix = '';
    let controlID;
    apiText.requestBody.query = allControls(framework);
    fetch(apiText.mainEndpoint, {
      mode: 'cors',
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(apiText.requestBody)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        const data = result.data;
        const controlKeys = new Set();
        const controlPrefixes = new Set();
        data.forEach(item => {
          if (framework === "NIST_SP_800-53_R4") {
            controlID = item.properties.metadataId.replace(/\([^()]*\)/g, '');
            controlID = controlID.trim().split(' ').pop();
            const controlPrefix = prefixExtractor(controlID);
            if (controlPrefix !== currentPrefix && !controlPrefixes.has(controlPrefix)) {
              controlPrefixes.add(controlPrefix)
              currentControls.push({
                key: `${controlPrefix}`,
                text: `${controlPrefix}`,
                itemType: DropdownMenuItemType.Header,
              });
              currentPrefix = controlPrefix;
            }
            const sanitizedControlID = sanitizeControlID(controlID);
            if (!controlKeys.has(sanitizedControlID)) {
              controlKeys.add(sanitizedControlID);
              currentControls.push({
                key: sanitizedControlID,
                text: `${sanitizedControlID}: ${item.properties.title}`,
              });
            }
          } else {
            controlID = item.properties.metadataId.split(' ').pop().trim();
            const controlPrefix = prefixExtractor(controlID);
            if (controlPrefix !== currentPrefix && !controlPrefixes.has(controlPrefix)) {
              controlPrefixes.add(controlPrefix)
              currentControls.push({
                key: `${controlPrefix}`,
                text: `${controlPrefix}`,
                itemType: DropdownMenuItemType.Header,
              });
              currentPrefix = controlPrefix;
            }
            if (!controlKeys.has(controlID)) {
              controlKeys.add(controlID);
              currentControls.push({
                key: controlID,
                text: `${controlID}: ${item.properties.title}`,
              });
            }
            setDefaultControls(currentControls);
          }
        });
        currentControls.sort((a, b) => {
          return customSort(a.key, b.key);
        });
        setDefaultControls(currentControls);
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  }

  /**
   * Populates the instance cache with the control ID value-name mapping depending on what framework is selected
   * Used during onload to populate control ID values for all frameworks
   * @param {string} framework 
   */
  const populateControlMaps = (framework) => {
    let controlID;
    let currentMap = new Map();
    let retryCount = 0;
    apiText.requestBody.query = allControls(framework);
    fetch(apiText.mainEndpoint, {
      mode: 'cors',
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(apiText.requestBody)
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 429 && retryCount < 3) {
            retryCount++;
            console.log('Too Many Requests. Retrying...');
            populateControlMaps(framework)
            return;
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        return response.json();
      })
      .then(result => {
        const data = result.data;
        data.forEach(item => {
          if (framework === "NIST_SP_800-53_R4") {
            if (!item.properties.metadataId.includes("(")) {
              controlID = item.properties.metadataId.replace(/\([^()]*\)/g, '');
              controlID = controlID.trim().split(' ').pop();
              controlID = sanitizeControlID(controlID);
              currentMap.set(controlID, item.properties.title)
            }
          } else {
            controlID = item.properties.metadataId.split(' ').pop().trim();
            currentMap.set(controlID, item.properties.title)
          }
        });
        if (framework === "NIST_SP_800-53_R4") {
          setNistMap(currentMap);
        } else if (framework === "CIS_Azure_2.0.0") {
          setCisMap(currentMap);
        } else {
          setPciMap(currentMap)
        }
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  }

  // USEEFFECT HOOKS

  useEffect(() => {
    populateControlMaps("CIS_Azure_2.0.0")
    populateControlMaps("NIST_SP_800-53_R4")
    populateControlMaps("PCI_DSS_v4.0")
    populateServices();
  }, [])

  useEffect(() => {
    setIsExportButtonDisabled(selectedFramework.length === 0);
    populateDomains(selectedFramework);
    populateControls(selectedFramework);
    setSelectedDomains([]);
    setSelectedControls([]);
    setResponseData(null);
    setControlCount({});
    setControlFocus("");
  }, [selectedFramework]);

  useEffect(() => {
    if (selectedServices.length > 0) {
      fetchMCSBData();
    }
  }, [selectedFramework, selectedServices, selectedControls]);

  useEffect(() => {
    fetchACFData();
  }, [selectedFramework, selectedControls]);

  /**
   * Controls the linked relationship between the control domain and control IDs filters
   */
  useEffect(() => {
    if (controlFocus) {
      let controlPrefix = prefixExtractor(controlFocus);
      let total = 0;
      for (let control of defaultControls) {
        const key = control.key
        if (key) {
          if (prefixExtractor(control.key) === controlPrefix) {
            total++;
          }
        }
      }
      const count = Math.min(controlCount[controlPrefix], total);
      if (count === total) { // all controls selected, select domain
        setSelectedDomains(prevDomains => {
          let resultSelectedDomains = [...prevDomains];
          let newSelectedDomain = [];
          defaultDomains.forEach((domain) => {
            const key = domain.key;
            if (key) {
              if (key === controlPrefix) {
                newSelectedDomain.push(domain);
              }
            }
          });
          for (let domain of newSelectedDomain) {
            if (!resultSelectedDomains.includes(domain)) {
              resultSelectedDomains.push(domain.key);
            }
          }
          return resultSelectedDomains;
        }
        )
      } else { // some or all controls deselected, deselect domain
        setSelectedDomains(prevDomains => {
          let resultSelectedDomains = [...prevDomains];
          let newSelectedDomain = [];
          defaultDomains.forEach((domain) => {
            const key = domain.key;
            if (key) {
              if (key === controlPrefix) {
                newSelectedDomain.push(domain);
              }
            }
          });
          resultSelectedDomains = resultSelectedDomains.filter(domain => newSelectedDomain[0].key !== domain);
          return resultSelectedDomains;
        }
        )
      }
    }
  }, [selectedControls]);

  // TABLE DATA QUERY FUNCTIONS

  const fetchMCSBData = async () => {
    setIsLoading(true);
    apiText.requestBody.query = filteredMCSB(selectedFramework, selectedServices, selectedControls);
    fetch(apiText.mainEndpoint, {
      mode: 'cors',
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(apiText.requestBody)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(response => {
        setResponseData(response.data);
      })
      .catch(error => {
        console.error('API Error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchACFData = async () => {
    let controlIds = [];
    if (selectedFramework.length > 0) {
      setIsOnload(false);
      setACFIsLoading(true);
      apiText.requestBody.query = allACFs(selectedFramework);
    }
    if (selectedControls.length > 0) {
      selectedControls.forEach(control => {
        const controlIdWithoutSub = control.replace(/\([^)]*\)/g, '');
        controlIds.push(controlIdWithoutSub);
      });
      controlIds = [...new Set(controlIds)];
      apiText.requestBody.query = filteredACFs(selectedFramework, controlIds);
    }
    fetch(apiText.mainEndpoint, {
      mode: 'cors',
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(apiText.requestBody)
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 429) {
            setIsOverloaded(true)
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setIsOverloaded(false)
        return response.json();
      })
      .then(result => {
        setACFData(result.data);
      })
      .catch(error => {
        console.error('API Error:', error);
      })
      .finally(() => {
        setACFIsLoading(false);
      });
  };

  // ONCHANGE FUNCTIONS
  const onClear = async () => {
    setResponseData("onload");
    setIsOnload(true);
    setSelectedServices([]);
    setSelectedDomains([]);
    setSelectedControls([]);
    setResponseData(null);
    setACFData(null)
    setControlCount({});
    setControlFocus("");
  };

  const onFrameworkChange = (_, item) => {
    if (item) {
      onClear();
      setSelectedFramework(
        item.key
      );
    }
  };

  const onServiceChange = (_, item) => {
    if (item) {
      setSelectedServices((prevSelectedServices) => {
        if (item.selected) {
          return [...prevSelectedServices, item.key];
        } else {
          return prevSelectedServices.filter((key) => key !== item.key);
        }
      });
    }
  };

  const onDomainChange = (_, item) => {
    if (item) {
      if (!item.selected) { // deselect all controls
        setSelectedControls(prevControls => {
          let resultSelectedControls = [...prevControls];
          let newDomainSelectedControls = [];
          defaultControls.forEach((control) => {
            const key = control.key;
            if (key) {
              const domainKey = prefixExtractor(key);

              if (domainKey === item.key) {
                newDomainSelectedControls.push(control);
              }
            }
          });
          newDomainSelectedControls.forEach((control) => {
            let controlPrefix = prefixExtractor(control.key);
            updateControlCount(controlPrefix, false);
          });
          let ndscStrings = [];
          for (let val of newDomainSelectedControls) {
            ndscStrings.push(val.key);
          }
          resultSelectedControls = resultSelectedControls.filter(control =>
            !ndscStrings.includes(control)
          );
          setControlFocus(newDomainSelectedControls[0].key)
          return resultSelectedControls;
        });
      } else { // select all controls
        const uniqueKeysSet = new Set();
        setSelectedControls(prevControls => {
          let resultSelectedControls = [...prevControls];
          let newDomainSelectedControls = [];
          defaultControls.forEach((control) => {
            const key = control.key;
            if (key) {
              const domainKey = prefixExtractor(key);
              if (domainKey === item.key) {
                newDomainSelectedControls.push(control);
              }
            }
          });
          newDomainSelectedControls.forEach((control) => {
            let controlPrefix = prefixExtractor(control.key);
            updateControlCount(controlPrefix, true);
          });
          for (let control of newDomainSelectedControls) {
            if (!resultSelectedControls.includes(control)) {
              resultSelectedControls.push(control.key);
            }
          }
          setControlFocus(newDomainSelectedControls[0].key)
          resultSelectedControls = resultSelectedControls.filter((key) => {
            if (!uniqueKeysSet.has(key)) {
              uniqueKeysSet.add(key);
              return true;
            }
            return false;
          });
          return resultSelectedControls;
        });
      }
    }
  };

  const onControlChange = (_, item) => {
    if (item) {
      const sanitizedKey = sanitizeControlID(item.key);
      setSelectedControls((prevSelectedControls) => {
        if (item.selected) {
          return [...prevSelectedControls, sanitizedKey];
        } else {
          return prevSelectedControls.filter((key) => key !== sanitizedKey);
        }
      });
      let controlPrefix = prefixExtractor(item.key);
      updateControlCount(controlPrefix, item.selected);
      setControlFocus(item.key);
    }
  };

  const removeFilter = (filterText, filterType) => {
    if (filterType === 'service') {
      setSelectedServices((prevSelectedServices) =>
        prevSelectedServices.filter((service) => service !== filterText)
      );
    } else if (filterType === 'control') {
      const sanitizedKey = sanitizeControlID(filterText);
      setSelectedControls((prevSelectedControls) => {
        return prevSelectedControls.filter((key) => key !== sanitizedKey);
      });
      let controlPrefix = prefixExtractor(filterText)
      updateControlCount(controlPrefix, false);
      setControlFocus(filterText);
    }
  };

  return (
    <div>
      <div>
        <div className="dropdown-container">
          <div className="select-dropdown">
            <Dropdown
              placeholder={nistMap.size === 0 || pciMap.size === 0 || cisMap.size === 0 || services.length === 0 ? "Loading..." : "Regulatory Framework"}
              selectedKey={selectedFramework}
              onChange={onFrameworkChange}
              options={frameworks}
              dropdownWidthAuto={true}
              styles={selectedFramework.length > 0 ? selectedFrameworkStyles : frameworkStyles}
              aria-label="Regulatory framework"
              label="Regulatory framework"
              disabled={nistMap.size === 0 || pciMap.size === 0 || cisMap.size === 0 || services.length === 0}
            />
          </div>
          <div className="select-dropdown">
            <SearchableDropdown
              placeholder="Service"
              selectedKeys={selectedServices}
              onChange={onServiceChange}
              multiSelect
              options={services}
              disabled={!(selectedFramework.length > 0)}
              dropdownWidthAuto={true}
              styles={selectedServices.length > 0 ? selectedServiceStyles : serviceStyles}
              onRenderTitle={(options) => {
                const title = `Services: (${options.length})`;
                return (
                  <div>
                    <span className={styles.selectedTitle}>{title}</span>
                  </div>
                );
              }}
              aria-label="Service"
              label="Service"
            />
          </div>
          <div className="select-dropdown">
            <SearchableDropdown
              placeholder="Control Domain"
              selectedKeys={selectedDomains}
              onChange={onDomainChange}
              multiSelect
              options={defaultDomains}
              disabled={!selectedFramework.length > 0}
              dropdownWidthAuto={true}
              styles={selectedDomains.length > 0 ? selectedServiceStyles : serviceStyles}
              onRenderTitle={(options) => {
                const title = `Control Domains: (${selectedDomains.length})`;
                return (
                  <div>
                    <span className={styles.selectedTitle}>{title}</span>
                  </div>
                );
              }}
              aria-label="Control domain"
              label="Control domain"
            />
          </div>
          <div className="select-dropdown">
            <SearchableDropdown
              placeholder="Control IDs"
              selectedKeys={selectedControls}
              onChange={onControlChange}
              multiSelect
              options={defaultControls}
              disabled={!selectedFramework.length > 0}
              onRenderTitle={(options) => {
                const title = `Control IDs: (${selectedControls.length})`;
                return (
                  <div>
                    <span className={styles.selectedTitle}>{title}</span>
                  </div>
                );
              }}
              dropdownWidthAuto={true}
              styles={selectedControls.length > 0 ? selectedControlStyles : controlStyles}
              aria-label="Control ID"
              label="Control ID"
            />
          </div>
          <div className="exportButton">
            <ExportButton apiData={responseData} disabled={isExportButtonDisabled} acfData={acfData} controlIDs={selectedControls} mapState={selectedFramework === "NIST_SP_800-53_R4" ? nistMap : selectedFramework === "CIS_Azure_2.0.0" ? cisMap : selectedFramework === "PCI_DSS_v4.0" ? pciMap : null} />
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'horizontal',
        }}
      >
        <FilterBadgesContainer
          selectedServices={selectedServices}
          selectedControls={selectedControls}
          handleClear={onClear}
          removeFilter={removeFilter}
        />
      </div>
      <div>
        <p></p>
        {
          isOnload ? (
            <TableStates type="ACF" variant="Onload" />
          ) : (
            isACFLoading || isOverloaded ? (
              <TableStates type="ACF" variant="Loading" />
            ) : (
              acfData && <ACF data={acfData} framework={selectedFramework} mapState={selectedFramework === "NIST_SP_800-53_R4" ? nistMap : selectedFramework === "CIS_Azure_2.0.0" ? cisMap : selectedFramework === "PCI_DSS_v4.0" ? pciMap : null} />
            )
          )
        }
      </div>
      <p></p>
      <div>
        {
          isOnload ? (
            <TableStates type="MCSB" variant="Onload" />
          ) : (selectedServices.length === 0 ? (<TableStates type="MCSB" variant="NoService" />) : (
            isLoading ? (
              <TableStates type="MCSB" variant="Loading" />
            ) : (
              responseData && <MCSB data={responseData} framework={selectedFramework} controls={selectedControls} mapState={selectedFramework === "NIST_SP_800-53_R4" ? nistMap : selectedFramework === "CIS_Azure_2.0.0" ? cisMap : selectedFramework === "PCI_DSS_v4.0" ? pciMap : null} />
            )
          ))
        }
      </div>
      <p></p>
      <div>
        {
          isOnload ? (
            <TableStates type="Policy" variant="Onload" />
          ) : (selectedServices.length === 0 ? (<TableStates type="Policy" variant="NoService" />) : (
            isLoading ? (
              <TableStates type="Policy" variant="Loading" />
            ) : (
              responseData && <Policies data={responseData} framework={selectedFramework} controls={selectedControls} mapState={selectedFramework === "NIST_SP_800-53_R4" ? nistMap : selectedFramework === "CIS_Azure_2.0.0" ? cisMap : selectedFramework === "PCI_DSS_v4.0" ? pciMap : null} />
            )
          ))
        }
      </div>
    </div>
  );
};

export default FilterBar;