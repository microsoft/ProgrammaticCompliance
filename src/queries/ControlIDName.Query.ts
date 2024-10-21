export const allACFs = (framework: string, control: string): string => {
    return `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name == '${framework}_${control}' | order by ['name'] asc`
}