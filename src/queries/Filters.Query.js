export const allDomains = (framework) => {
  return `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name contains '${framework}' | project ControlID = name, properties.metadataId, properties.description, ControlDomain = tostring(properties.category), properties | distinct ControlID, ControlDomain`;
};

export const cisDomains = () => {
  return `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name contains 'CIS_Azure_1.4.0' | project ControlID = name, properties.metadataId, properties.description, ControlDomain = tostring(properties.category), properties | distinct ControlID, ControlDomain`;
};

export const allServices = () => {
  return `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where properties.category == 'Guidance' | extend Service = tostring(properties.metadata.offeringName) | where isnotnull(Service) | distinct Service`;
};

export const allControls = (framework) => {
  return `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name startswith '${framework}' | order by ['name'] asc`;
};
