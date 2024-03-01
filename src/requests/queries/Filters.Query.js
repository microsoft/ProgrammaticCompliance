export const allDomains = (framework) => {
    return `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name contains '${framework}' | project ControlID = name, properties.metadataId, properties.description, ControlDomain = tostring(properties.category), properties | distinct ControlID, ControlDomain`;
};

export const allServices = () => {
    return `policyresources | where type == 'microsoft.authorization/policydefinitions' | where properties.displayName startswith 'MCSB Baseline item' and properties.metadata.category == 'Regulatory Compliance' | extend Service = tostring(properties.metadata.offeringName) | where isnotnull(Service) | distinct Service`;
};

export const allControls = (framework) => {
    return `policyresources | where type == 'microsoft.authorization/policydefinitions' | where properties.displayName startswith 'Custom - Microsoft Managed Control' | where properties.metadata.standardControlMappings contains '${framework}' | extend additionalMetadataId = tostring(properties.metadata.additionalMetadataId) | join kind=inner(policyresources | where type == 'microsoft.policyinsights/policymetadata' ) on $left.additionalMetadataId == $right.['id'] | project ControlIDs = properties.metadata.standardControlMappings, properties1, id1 | mv-expand ControlIDs to typeof(string) | where ControlIDs contains '${framework}' | project ControlID = ControlIDs, properties1, id1`
}