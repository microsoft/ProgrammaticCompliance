export const filteredMCSB = (framework, services, controls) => {
    let servicesClause = "properties.metadata.offeringName == ";
    let controlIDsClause = `properties.metadata.mcsb.frameworkControls has '${framework}`
    let PAIRED_CLAUSES = ""; // each service needs to be paired up wtih each control
    console.log("Framework:", framework);
    console.log("Services:", services);
    console.log("Controls:", controls);
    services.forEach((service) => {
        controls.forEach((control) => {
            PAIRED_CLAUSES += (servicesClause + "'" + service + "'" + " and " + controlIDsClause + "_" + control + "' or ");
        })
    })
    PAIRED_CLAUSES = PAIRED_CLAUSES.slice(0, -4);
    console.log("PAIRED_CUASES", PAIRED_CLAUSES)
    let baseQuery = `policyresources | where type == 'microsoft.authorization/policydefinitions' | where properties.displayName startswith 'MCSB Baseline item' and properties.metadata.category == 'Regulatory Compliance and ' ${PAIRED_CLAUSES} | project properties.metadata`
    return baseQuery;
}