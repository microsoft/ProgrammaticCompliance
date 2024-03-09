export const allACFs = (framework, control) => {
    return `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name == '${framework}_${control}' | order by ['name'] asc`
}