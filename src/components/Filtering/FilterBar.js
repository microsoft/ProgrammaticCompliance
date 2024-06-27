import React, { useEffect, useState } from 'react';
import { DropdownMenuItemType, Dropdown } from '@fluentui/react';
import ACF from '../Tables/ACF.js';
import MCSB from '../Tables/MCSB.js';
import Policies from '../Tables/Policies.js';
import TableStates from '../Tables/TableStates.js';
import FilterBadgesContainer from './FilterBadgesContainer.js';
import ExportButton from '../ExportButton.js';
import SearchableDropdown from './SearchableDropdown.js';
import { frameworks, apiText, frameworkStrategyMapping } from '../../static/staticStrings.js';
import { cisDomains, allDomains, allServices, allControls } from '../../queries/Filters.Query.js';
import { allACFs, filteredACFs } from '../../queries/ACF.Query.js';
import { filteredMCSB } from '../../queries/MCSB.Query.js';
import { styles, frameworkStyles, selectedFrameworkStyles, serviceStyles, selectedServiceStyles, controlStyles, selectedControlStyles } from '../../styles/DropdownStyles.js';
import { appText } from '../../static/staticStrings.js';
import Frameworks from './Frameworks.js';
import { sanitizeControlID, numberSort, prefixExtractor } from '../../utils/filterUtils.js';

import '../../styles/FilterBar.css';
import '../../styles/index.css';

import cisDOMAINS from '../../static/cisDomains.json';

const FilterBar = ({ azureToken }) => {
  const [error, setError] = useState(null);

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
  /**
   * @param {string} seekControl the control key to count the total for
   * @returns the total number of controls with the same prefix as seekControl
   */
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

  /**
   * @param {string} key the control prefix to update the count for
   * @param {boolean} increment whether the total control count should be incremented (true) or decremented (false)
   */
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

  // Sanity checks if the mcsb data is malformed / fields cannot be found, if errors, displays user-friendly error message
  const checkMCSBDataValid = async () => {
    apiText.requestBody.query = filteredMCSB("NIST_SP_800-53_R4", ["Azure Kubernetes Service (AKS)"], ["AC-2"]);
    await fetch(apiText.mainEndpoint, {
      mode: 'cors',
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(apiText.requestBody)
    })
      .then(response => {
        if (!response.ok) {
          throw (`HTTP error! Going too fast. Please try again in a little bit.`);
        }
        return response.json();
      })
      .then(response => {
        if (!response.data[0].hasOwnProperty("properties_metadata") || !response.data[0].properties_metadata.hasOwnProperty("mcsb")) {
          setError('Data is malformed. Please check upstream data.')
        }
        let json = response.data[0].properties_metadata.mcsb;
        if (!json.hasOwnProperty("mcsbId") || !json.hasOwnProperty("features") || !json.features[0].hasOwnProperty("customerActionsDescription")
          || !json.features[0].hasOwnProperty("enabledByDefault") || !json.features[0].hasOwnProperty("featureDescription")
          || !json.features[0].hasOwnProperty("featureGuidance") || !json.features[0].hasOwnProperty("featureId")
          || !json.features[0].hasOwnProperty("featureName") || !json.features[0].hasOwnProperty("featureReference") || !json.features[0].hasOwnProperty("featureSupport")) {
          setError('Data is malformed. Please check upstream data.')
        }
      })
  }

  // Sanity checks if the acf data is malformed / fields cannot be found, if errors, displays user-friendly error message
  const checkACFDataValid = async () => {
    apiText.requestBody.query = filteredACFs("NIST_SP_800-53_R4", ["AC-2"]);
    await fetch(apiText.mainEndpoint, {
      mode: 'cors',
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(apiText.requestBody)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Going too fast. Please try again in a little bit.`);
        }
        return response.json();
      })
      .then(response => {
        let json = response.data[0]
        if (!json.hasOwnProperty("AzureControlFrameworkID") || !json.hasOwnProperty("ControlDomain") || !json.hasOwnProperty("ControlID")
          || !json.hasOwnProperty("MicrosoftManagedActionsDescription") || !json.hasOwnProperty("MicrosoftManagedActionsDetails")) {
          setError('Data is malformed. Please check upstream data.');
        }
      })
  }

  // FILTER POPULATION FUNCTIONS

  // Provides a loading time delay for the services dropdown
  const populateServicesWithDelay = () => {
    setTimeout(populateServices, 1000);
  };

  // Populates the service filter dropdown
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
          throw new Error(`HTTP error! Going too fast. Please try again in a little bit.`);
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
   * @param {string} framework that is selected
   * Populates the domain filter dropdown depending on what framework is selected
   */
  const populateDomains = (framework) => {
    let uniqueDomains;
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
            throw new Error(`HTTP error! Going too fast. Please try again in a little bit.`);
          }
          return response.json();
        })
        .then(result => {
          uniqueDomains = Frameworks[frameworkStrategyMapping[framework]].getUniqueDomains(result.data, framework) 
          setDefaultDomains(uniqueDomains);
        })
        .catch(error => {
          console.error('API Error:', error);
      });
    }
  }

  /**
   * @param {string} framework that is selected
   * Populates the control ID filter dropdown depending on what framework is selected
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
          throw new Error(`HTTP error! Going too fast. Please try again in a little bit.`);
        }
        return response.json();
      })
      .then(result => {
        const data = result.data;
        const controlKeys = new Set();
        const controlPrefixes = new Set();
        data.forEach(item => {
          controlID = Frameworks[frameworkStrategyMapping[framework]].getControlIDForControls(item);
          const controlPrefix = prefixExtractor(controlID, framework);
          if (controlPrefix !== currentPrefix && !controlPrefixes.has(controlPrefix)) {
              controlPrefixes.add(controlPrefix)
              currentControls.push({
              key: `${controlPrefix}`,
              text: `${controlPrefix}`,
              itemType: DropdownMenuItemType.Header,
            });
            currentPrefix = controlPrefix;
          }
          const sanitizedControlID = Frameworks[frameworkStrategyMapping[framework]].sanitizeControlIDForControls(controlID);
          if (!controlKeys.has(controlID)) {
              controlKeys.add(controlID);
              currentControls.push({
              key: controlID,
              text: `${sanitizedControlID}: ${item.properties.title}`,
            });
          }
          currentControls.sort((a, b) => {
            return numberSort(a.key, b.key);
          });
        });
        setDefaultControls(currentControls);
      })
      .catch(error => {
        console.error('API Error in control IDs:', error);
    });
  }

  /**
   * @param {string} framework that is selected
   * Populates the instance cache with the control ID value-name mapping depending on what framework is selected
   * Used during onload to populate control ID values for all frameworks
   */
  const populateControlMaps = (framework) => {
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
            throw new Error(`HTTP error! Going too fast. Please try again in a little bit.`);
          }
        }
        return response.json();
      })
      .then(result => {
        currentMap = Frameworks[frameworkStrategyMapping[framework]].getCurrentMap(result.data)
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
    checkACFDataValid();
    checkMCSBDataValid();
  }, [])

  useEffect(() => {
    populateControlMaps(selectedFramework)
    populateServicesWithDelay();
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

  // Controls the linked relationship between the control domain and control IDs filters
  useEffect(() => {
    if (controlFocus) {
      let controlPrefix = prefixExtractor(controlFocus, selectedFramework);
      let total = 0;
      for (let control of defaultControls) {
        const key = control.key
        if (key) {
          if (prefixExtractor(control.key, selectedFramework) === controlPrefix) {
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
          throw new Error(`HTTP error! Going too fast. Please try again in a little bit.`);
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
          throw new Error(`HTTP error! Going too fast. Please try again in a little bit.`);
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
              const domainKey = prefixExtractor(key, selectedFramework);
              if (domainKey === item.key) {
                newDomainSelectedControls.push(control);
              }
            }
          });
          newDomainSelectedControls.forEach((control) => {
            let controlPrefix = prefixExtractor(control.key, selectedFramework);
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
              const domainKey = prefixExtractor(key, selectedFramework);
              if (domainKey === item.key) {
                newDomainSelectedControls.push(control);
              }
            }
          });
          newDomainSelectedControls.forEach((control) => {
            let controlPrefix = prefixExtractor(control.key, selectedFramework);
            updateControlCount(controlPrefix, true);
          });
          for (let control of newDomainSelectedControls.slice(1)) {
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
      let controlPrefix = prefixExtractor(item.key, selectedFramework);
      updateControlCount(controlPrefix, item.selected);
      setControlFocus(item.key);
    }
  };

  // deleting the filter via clicking the badge
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
      let controlPrefix = prefixExtractor(filterText, selectedFramework)
      updateControlCount(controlPrefix, false);
      setControlFocus(filterText);
    }
  };

  return (
    <>
      {error ? (
        <div>
          <br></br>
          <h1 className="siteTitle">{appText.unhealthy}</h1>
          <h1 className="siteTitle">Error message: "{error}"</h1>
        </div>
      ) : (
        <div>
          <div>
            <div className="dropdown-container">
              <div className="select-dropdown">
                <Dropdown
                  placeholder={services.length === 0 ? "Loading..." : "Regulatory Framework"}
                  selectedKey={selectedFramework}
                  onChange={onFrameworkChange}
                  options={frameworks}
                  dropdownWidthAuto={true}
                  styles={selectedFramework.length > 0 ? selectedFrameworkStyles : frameworkStyles}
                  aria-label="Regulatory framework"
                  label="Regulatory framework"
                  disabled={!(services.length > 0)}
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
                  disabled={!selectedFramework.length > 0 || defaultDomains.size === 0}
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
                  disabled={!selectedFramework.length > 0 || defaultControls.size === 0}
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
                {/* <ExportButton policyTable={<Initiatives data={responseData} framework={selectedFramework} controls={selectedControls} mapState={selectedFramework === "NIST_SP_800-53_R4" ? nistMap : selectedFramework === "CIS_Azure_2.0.0" ? cisMap : selectedFramework === "PCI_DSS_v4.0" ? pciMap : null} />}
                  services={selectedServices} apiData={responseData} disabled={isExportButtonDisabled} acfData={acfData} controlIDs={selectedControls} mapState={selectedFramework === "NIST_SP_800-53_R4" ? nistMap : selectedFramework === "CIS_Azure_2.0.0" ? cisMap : selectedFramework === "PCI_DSS_v4.0" ? pciMap : null} /> */}
                <ExportButton services={selectedServices} apiData={responseData} disabled={isExportButtonDisabled} acfData={acfData} controlIDs={selectedControls} mapState={selectedFramework === "NIST_SP_800-53_R4" ? nistMap : selectedFramework === "CIS_Azure_2.0.0" ? cisMap : selectedFramework === "PCI_DSS_v4.0" ? pciMap : null} />
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
                  responseData && <Policies data={responseData} framework={selectedFramework} controls={selectedControls} mapState={selectedFramework === "NIST_SP_800-53_R4" ? nistMap : selectedFramework === "CIS_Azure_2.0.0" ? cisMap : selectedFramework === "PCI_DSS_v4.0" ? pciMap : null} nistMap={nistMap} cisMap={cisMap} pciMap={pciMap}/>
                )
              ))
            }
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;