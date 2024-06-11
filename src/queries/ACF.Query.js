// this query used when no control IDs are selected
export const allACFs = (framework) => {
    return `policyresources | where type == 'microsoft.authorization/policydefinitions' | where properties.displayName startswith 'Custom - Microsoft Managed Control' | where properties.metadata.standardControlMappings contains '${framework}' | extend additionalMetadataId = tostring(properties.metadata.additionalMetadataId) | join kind=inner(policyresources | where type == 'microsoft.policyinsights/policymetadata' | extend ControlDomain = tostring(properties.category)) on $left.additionalMetadataId == $right.['id'] | project ControlIDs = properties.metadata.standardControlMappings, AzureControlFrameworkID = name1, MicrosoftManagedActionsDescription = properties1.Description, MicrosoftManagedActionsDetails = properties1.Requirements, ControlDomain | mv-expand ControlIDs to typeof(string) | where ControlIDs contains '${framework}' | project ControlID = ControlIDs, AzureControlFrameworkID, MicrosoftManagedActionsDescription, MicrosoftManagedActionsDetails, ControlDomain`;
};

// this query accounts for user-selected control IDs
export const filteredACFs = (framework, controls) => {
    let whereClause = `ControlIDs == '${framework}`;
    let CONTROL_ID_CLAUSES = "";
    controls.forEach((control) => {
        CONTROL_ID_CLAUSES += (whereClause + "_" + control + "'" + " or ")
    })
    CONTROL_ID_CLAUSES = CONTROL_ID_CLAUSES.slice(0, -4);
    let baseQuery = `policyresources | where type == 'microsoft.authorization/policydefinitions' | where properties.displayName startswith 'Custom - Microsoft Managed Control' | where properties.metadata.standardControlMappings contains '${framework}' | extend additionalMetadataId = tostring(properties.metadata.additionalMetadataId) | join kind=inner(policyresources | where type == 'microsoft.policyinsights/policymetadata' | extend ControlDomain = tostring(properties.category)) on $left.additionalMetadataId == $right.['id'] | project ControlIDs = properties.metadata.standardControlMappings, AzureControlFrameworkID = name1, MicrosoftManagedActionsDescription = properties1.Description, MicrosoftManagedActionsDetails = properties1.Requirements, ControlDomain | mv-expand ControlIDs to typeof(string) | where ${CONTROL_ID_CLAUSES} | project ControlID = ControlIDs, AzureControlFrameworkID, MicrosoftManagedActionsDescription, MicrosoftManagedActionsDetails, ControlDomain`;
    return baseQuery;
};