export const filteredMCSB = (framework, services, controls) => {
    let servicesClause = "properties.metadata.offeringName == ";
    let controlIDsClause = `properties.metadata.mcsb.frameworkControls has '${framework}`
    let PAIRED_CLAUSES = ""; 
    // if there are user-selected controls, generate pairings of service/control clauses
    if (controls.length > 0) {
        services.forEach((service) => {
            controls.forEach((control) => {
                PAIRED_CLAUSES += (servicesClause + "'" + service + "'" + " and " + controlIDsClause + "_" + control + "'" + " or ");
            })
        })
    // if not, just stack all the service clauses together instead
    } else {
        services.forEach((service) => {
            PAIRED_CLAUSES += (servicesClause + "'" + service + "'" + " or ");
        }) 
    }
    PAIRED_CLAUSES = PAIRED_CLAUSES.slice(0, -4);
    let baseQuery = `policyresources | where type == 'microsoft.authorization/policydefinitions' | where properties.displayName startswith 'MCSB Baseline item' and properties.metadata.category == 'Regulatory Compliance' and properties.metadata.mcsb.frameworkControls contains '${framework}' and ${PAIRED_CLAUSES} | project properties.metadata`
    return baseQuery;
}