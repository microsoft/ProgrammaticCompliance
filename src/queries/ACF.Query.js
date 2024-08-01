// this query used when no control IDs are selected
// export const allACFs = (framework) => {
//   return `policyresources | where type == 'microsoft.authorization/policydefinitions' | where properties.displayName startswith 'Custom - Microsoft Managed Control' | where properties.metadata.standardControlMappings contains '${framework}' | extend additionalMetadataId = tostring(properties.metadata.additionalMetadataId) | join kind=inner(policyresources | where type == 'microsoft.policyinsights/policymetadata' | extend ControlDomain = tostring(properties.category)) on $left.additionalMetadataId == $right.['id'] | project ControlIDs = properties.metadata.standardControlMappings, AzureControlFrameworkID = name1, MicrosoftManagedActionsDescription = properties1.description, MicrosoftManagedActionsDetails = properties1.requirements, ControlDomain | mv-expand ControlIDs to typeof(string) | where ControlIDs contains '${framework}' | project ControlID = ControlIDs, AzureControlFrameworkID, MicrosoftManagedActionsDescription, MicrosoftManagedActionsDetails, ControlDomain`;
// };

export const allACFs = (framework) => {
  let query = `policyresources | where type contains 'microsoft.policyinsights/policymetadata' | where name contains "ACF" and properties.metadata.frameworkControlsMappings contains '${framework}'`;
  return query;
};

// this query accounts for user-selected control IDs
export const filteredACFs = (framework, controls) => {
  let whereClause = `ControlIDs == '${framework}`;
  let CONTROL_ID_CLAUSES = "";
  controls.forEach((control) => {
    CONTROL_ID_CLAUSES +=
      `properties.metadata.frameworkControlsMappings has '${framework}` +
      "_" +
      control +
      "'" +
      ' or name contains "ACF" and';
  });
  CONTROL_ID_CLAUSES = CONTROL_ID_CLAUSES.slice(0, -28);
  let baseQuery = `policyresources | where type contains 'microsoft.policyinsights/policymetadata' | where name contains "ACF" and ${CONTROL_ID_CLAUSES}`;
  console.log(baseQuery);
  return baseQuery;
};
