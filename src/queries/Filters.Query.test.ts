import { describe, expect, it } from 'vitest';
import { allControls, allDomains, allServices, cisDomains } from './Filters.Query';

describe('Filters.Query', () => {
  it('allDomains should generate correct query for given framework', () => {
    const framework = 'ISO_27001';
    const expectedQuery = `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name contains 'ISO_27001' | project ControlID = name, properties.metadataId, properties.description, ControlDomain = tostring(properties.category), properties | distinct ControlID, ControlDomain`;
    expect(allDomains(framework)).toBe(expectedQuery);
  });

  it('cisDomains should generate correct query', () => {
    const expectedQuery = `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name contains 'CIS_Azure_1.4.0' | project ControlID = name, properties.metadataId, properties.description, ControlDomain = tostring(properties.category), properties | distinct ControlID, ControlDomain`;
    expect(cisDomains()).toBe(expectedQuery);
  });

  it('allServices should generate correct query', () => {
    const expectedQuery = `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where properties.category == 'Guidance' | extend Service = tostring(properties.metadata.offeringName) | where isnotnull(Service) | distinct Service`;
    expect(allServices()).toBe(expectedQuery);
  });

  it('allControls should generate correct query for given framework', () => {
    const framework = 'NIST_SP_800-53';
    const expectedQuery = `policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name startswith 'NIST_SP_800-53' | order by ['name'] asc`;
    expect(allControls(framework)).toBe(expectedQuery);
  });
});