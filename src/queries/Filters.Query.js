export const allDomains = (framework) => {
    return `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name contains '${framework}' | project ControlID = name, properties.metadataId, properties.description, ControlDomain = tostring(properties.category), properties | distinct ControlID, ControlDomain`;
};

export const allServices = () => {
    return `policyresources | where type == 'microsoft.authorization/policydefinitions' | where properties.displayName startswith 'MCSB Baseline item' and properties.metadata.category == 'Regulatory Compliance' | extend Service = tostring(properties.metadata.offeringName) | where isnotnull(Service) | distinct Service`;
};

export const allControls = (framework) => {
    return `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name startswith '${framework}' | order by ['name'] asc`
}