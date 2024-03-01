export const filteredACFs = (framework, controls) => {
    return `policyresources 
    | where type == 'microsoft.authorization/policydefinitions' 
    | where properties.displayName startswith "Custom - Microsoft Managed Control" 
    | where properties.metadata.standardControlMappings contains "NIST_SP_800-53_R4" // regulation filter
    | extend additionalMetadataId = tostring(properties.metadata.additionalMetadataId) 
    | join kind=inner(
    policyresources 
    | where type == "microsoft.policyinsights/policymetadata" 
    | extend ControlDomain = tostring(properties.category)) on $left.additionalMetadataId == $right.['id'] 
    | project ControlIDs = properties.metadata.standardControlMappings, AzureControlFrameworkID = name1, MicrosoftManagedActionsDescription = properties1.description, MicrosoftManagedActionsDetails = properties1.requirements, ControlDomain
    | mv-expand ControlIDs to typeof(string)
    | where ControlIDs == "NIST_SP_800-53_R4_AC-2" or ControlIDs == "NIST_SP_800-53_R4_AC-1"
    | project ControlID = ControlIDs, AzureControlFrameworkID, MicrosoftManagedActionsDescription, MicrosoftManagedActionsDetails, ControlDomain`;
};

export const allACFs = (framework) => {
    return `policyresources | where type == 'microsoft.authorization/policydefinitions' | where properties.displayName startswith 'Custom - Microsoft Managed Control' | where properties.metadata.standardControlMappings contains '${framework}' | extend additionalMetadataId = tostring(properties.metadata.additionalMetadataId) | join kind=inner(policyresources | where type == 'microsoft.policyinsights/policymetadata' | extend ControlDomain = tostring(properties.category)) on $left.additionalMetadataId == $right.['id'] | project ControlIDs = properties.metadata.standardControlMappings, AzureControlFrameworkID = name1, MicrosoftManagedActionsDescription = properties1.description, MicrosoftManagedActionsDetails = properties1.requirements, ControlDomain | mv-expand ControlIDs to typeof(string) | where ControlIDs contains '${framework}' | project ControlID = ControlIDs, AzureControlFrameworkID, MicrosoftManagedActionsDescription, MicrosoftManagedActionsDetails, ControlDomain`;
};
