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
import nistIDS from '../../static/nistControls.json';
import nistDOMAINS from '../../static/nistDomains.json';
import cisIDS from '../../static/cisControls.json';
import cisDOMAINS from '../../static/cisDomains.json';
import pciIDS from '../../static/pciControls.json';
import pciDOMAINS from '../../static/pciDomains.json';

import { styles, frameworkStyles, selectedFrameworkStyles, serviceStyles, selectedServiceStyles, controlStyles, selectedControlStyles } from '../../styles/DropdownStyles.js';
import '../../styles/FilterBar.css';

const FilterBar = ({ authToken }) => {
  const [selectedFramework, setSelectedFramework] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedControls, setSelectedControls] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [controlCount, setControlCount] = useState({});
  const [controlFocus, setControlFocus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isACFLoading, setACFIsLoading] = useState(false);
  const [isOnload, setIsOnload] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [acfData, setACFData] = useState(null);
  const [services, setServices] = useState([]);
  const [defaultControls, setDefaultControls] = useState([]);
  const [defaultDomains, setDefaultDomains] = useState([]);
  const [isExportButtonDisabled, setIsExportButtonDisabled] = useState(true);

  // UTILITY FUNCTIONS
  const sanitizeControlID = (controlId) => {
    const prefixMatch = controlId.match(/^[^:()]+/);
    const prefix = prefixMatch ? prefixMatch[0].trim() : '';
    return prefix;
  };

  const customSort = (a, b) => {
    const splitA = a.split('.').map(Number);
    const splitB = b.split('.').map(Number);

    for (let i = 0; i < Math.max(splitA.length, splitB.length); i++) {
      const numA = splitA[i] || 0;
      const numB = splitB[i] || 0;

      if (numA !== numB) {
        return numA - numB;
      }
    }
    return a.length - b.length;
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
      if (selectedFramework === "NIST_SP_800-53_Rev4") {
        return control.split('-')[0];
      } else {
        return control.split('.')[0];
      }
    }
  }

  const populateFilters = (framework) => {
    let currentControls = [];
    let currentPrefix = '';
    let currentDomains = [];
    let IDS;
    let DOMAINS;
    if (framework === "NIST_SP_800-53_Rev4") {
      IDS = nistIDS;
      DOMAINS = nistDOMAINS;
      IDS.forEach((id, _) => {
        const controlPrefix = prefixExtractor(id.value);
        if (controlPrefix !== currentPrefix) {
          currentControls.push({
            text: `${controlPrefix}`,
            itemType: DropdownMenuItemType.Header,
          });
          currentPrefix = controlPrefix;
        }
        currentControls.push({
          key: sanitizeControlID(id.value),
          text: id.label,
        });
      });
      setDefaultControls(currentControls);
    }
    else if (framework === "CIS_Azure_Benchmark_v2.0.0") {
      IDS = cisIDS;
      DOMAINS = cisDOMAINS;
      IDS.forEach((id, _) => {
        const controlPrefix = prefixExtractor(id.value);
        if (controlPrefix !== currentPrefix && !currentControls.some(item => item.text === controlPrefix)) {
          currentControls.push({
            text: `${controlPrefix}`,
            itemType: DropdownMenuItemType.Header,
          });
          currentPrefix = controlPrefix;
        }
        currentControls.push({
          key: sanitizeControlID(id.value),
          text: id.label,
        });
      });
      currentControls.sort((a, b) => {
        const partA = a.text.split(':')[0].trim();
        const partB = b.text.split(':')[0].trim();
        return customSort(partA, partB);
      });
      setDefaultControls(currentControls);
    }
    else {
      IDS = pciIDS;
      DOMAINS = pciDOMAINS
      IDS.forEach((id, _) => {
        const dotIndex = id.value.indexOf('.', id.value.indexOf('.') + 1);
        const controlPrefix = dotIndex !== -1 ? id.value.slice(0, dotIndex) : id.value;
        if (controlPrefix !== currentPrefix) {
          currentControls.push({
            text: `${controlPrefix}`,
            itemType: DropdownMenuItemType.Header,
          });
          currentPrefix = controlPrefix;
        }
        currentControls.push({
          key: sanitizeControlID(id.value),
          text: id.label,
        });
      });
      currentControls.sort((a, b) => {
        const partA = a.text.split(':')[0].trim();
        const partB = b.text.split(':')[0].trim();
        return customSort(partA, partB);
      });
      setDefaultControls(currentControls);
    }
    currentDomains = DOMAINS.map(domain => {
      return { key: domain.value, text: domain.label };
    });
    setDefaultDomains(currentDomains);
  }

  // USEEFFECT HOOKS
  useEffect(() => {
    setResponseData("onload")
    setACFData("onload")
    fetchServices()
    fetchData();
    fetchACFData();
  }, []);

  useEffect(() => {
    setIsExportButtonDisabled(selectedFramework.length === 0);
    populateFilters(selectedFramework);
  }, [selectedFramework]);

  useEffect(() => {
    fetchServices();
    fetchData();
  }, [selectedFramework, selectedServices, selectedControls]);

  useEffect(() => {
    fetchACFData();
  }, [selectedFramework, selectedControls]);


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

  // API SETUP / FETCH
  let KEY = apiText.subscription
  let TOKEN = `Bearer ${authToken}`
  const myHeaders = new Headers();

  myHeaders.append('Ocp-Apim-Subscription-Key', KEY);
  myHeaders.append('Authorization', TOKEN);
  myHeaders.append('Accept', 'application/json');

  const fetchServices = async () => {
    let servicesURL = apiText.serviceEndpoint;
    fetch(servicesURL, {
      mode: 'cors',
      method: 'GET',
      headers: myHeaders,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const transformedData = data.map(service => ({
          key: service['Service Name'],
          text: service['Service Name'],
        }));
        transformedData.sort((a, b) => a.text.localeCompare(b.text));
        setServices(transformedData);
      })
      .catch(error => {
        console.error('API Error:', error);
      });
  };

  const fetchData = async () => {
    let fetchURL = apiText.mainEndpoint;
    let controlIds = [];
    if (selectedFramework.length > 0) {
      setIsOnload(false);
      setIsLoading(true);
      fetchURL += "?standardName=";
      fetchURL += selectedFramework;
    }
    if (selectedServices.length > 0) {
      selectedServices.forEach(service => {
        fetchURL += "&serviceNames=";
        fetchURL += service;
      });
    }
    if (selectedControls.length > 0) {
      selectedControls.forEach(control => {
        const controlIdWithoutSub = control.replace(/\([^)]*\)/g, '');
        controlIds.push(controlIdWithoutSub);

      });
      controlIds = [...new Set(controlIds)];
      controlIds.forEach(controlId => {
        fetchURL += "&standardControlIds=";
        fetchURL += controlId;
      });
    } else {
      fetchURL = fetchURL.replace(/&standardIds=[^&]*/, '');
    }
    fetch(fetchURL, {
      mode: 'cors',
      method: 'GET',
      headers: myHeaders,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setResponseData(data);
      })
      .catch(error => {
        console.error('API Error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const fetchACFData = async () => {
    let fetchURL = apiText.mainEndpoint;
    let controlIds = [];
    if (selectedFramework.length > 0) {
      setIsOnload(false);
      setACFIsLoading(true);
      fetchURL += "?standardName=";
      fetchURL += selectedFramework;
    }
    if (selectedControls.length > 0) {
      selectedControls.forEach(control => {
        const controlIdWithoutSub = control.replace(/\([^)]*\)/g, '');
        controlIds.push(controlIdWithoutSub);
      });
      controlIds = [...new Set(controlIds)];
      controlIds.forEach(controlId => {
        fetchURL += "&standardControlIds=";
        fetchURL += controlId;
      });
    } else {
      fetchURL = fetchURL.replace(/&standardIds=[^&]*/, '');
    }
    fetch(fetchURL, {
      mode: 'cors',
      method: 'GET',
      headers: myHeaders,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setACFData(data);
      })
      .catch(error => {
        console.error('API Error:', error);
      })
      .finally(() => {
        setACFIsLoading(false);
      });
  };

  // ONCHANGE
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
              placeholder="Regulatory Framework"
              selectedKey={selectedFramework}
              onChange={onFrameworkChange}
              options={frameworks}
              dropdownWidthAuto={true}
              styles={selectedFramework.length > 0 ? selectedFrameworkStyles : frameworkStyles}
              aria-label="Regulatory framework dropdown"
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
              aria-label="Service dropdown"
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
              aria-label="Control domain dropdown"
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
              aria-label="Control ID dropdown"
            />
          </div>
          <div className="exportButton">
            <ExportButton apiData={responseData} disabled={isExportButtonDisabled} acfData={acfData}/>
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
            isACFLoading ? (
              <TableStates type="ACF" variant="Loading" />
            ) : (
              acfData && <ACF data={acfData} framework={selectedFramework} />
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
              responseData && <MCSB data={responseData} framework={selectedFramework} />
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
              responseData && <Policies data={responseData} framework={selectedFramework} />
            )
          ))
        }
      </div>
    </div>
  );
};

export default FilterBar;