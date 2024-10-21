import { describe, expect, it } from 'vitest';
import { filteredMCSB } from './MCSB.Query';

describe('MCSB.Query', () => {
  describe('filteredMCSB', () => {
    it('should generate the correct query for given framework, services, and controls', () => {
      const framework = 'exampleFramework';
      const services = ['service1', 'service2'];
      const controls = ['control1', 'control2'];
      const expectedQuery = `policyresources | where type contains 'microsoft.policyinsights/policymetadata' | where properties.category == 'Guidance' and properties.metadata.frameworkControlsMappings contains 'exampleFramework' and properties.metadata.offeringName == 'service1' and properties.metadata.frameworkControlsMappings has 'exampleFramework_control1' or properties.metadata.offeringName == 'service1' and properties.metadata.frameworkControlsMappings has 'exampleFramework_control2' or properties.metadata.offeringName == 'service2' and properties.metadata.frameworkControlsMappings has 'exampleFramework_control1' or properties.metadata.offeringName == 'service2' and properties.metadata.frameworkControlsMappings has 'exampleFramework_control2' | project properties.metadata`;
      expect(filteredMCSB(framework, services, controls)).toBe(expectedQuery);
    });

    it('should handle empty controls array', () => {
      const framework = 'exampleFramework';
      const services = ['service1', 'service2'];
      const controls: string[] = [];
      const expectedQuery = `policyresources | where type contains 'microsoft.policyinsights/policymetadata' | where properties.category == 'Guidance' and properties.metadata.frameworkControlsMappings contains 'exampleFramework' and properties.metadata.offeringName == 'service1' or properties.metadata.offeringName == 'service2' | project properties.metadata`;
      expect(filteredMCSB(framework, services, controls)).toBe(expectedQuery);
    });

    it('should handle empty services array', () => {
      const framework = 'exampleFramework';
      const services: string[] = [];
      const controls = ['control1', 'control2'];
      const expectedQuery = `policyresources | where type contains 'microsoft.policyinsights/policymetadata' | where properties.category == 'Guidance' and properties.metadata.frameworkControlsMappings contains 'exampleFramework' and  | project properties.metadata`;
      expect(filteredMCSB(framework, services, controls)).toBe(expectedQuery);
    });

    it('should handle empty services and controls arrays', () => {
      const framework = 'exampleFramework';
      const services: string[] = [];
      const controls: string[] = [];
      const expectedQuery = `policyresources | where type contains 'microsoft.policyinsights/policymetadata' | where properties.category == 'Guidance' and properties.metadata.frameworkControlsMappings contains 'exampleFramework' and  | project properties.metadata`;
      expect(filteredMCSB(framework, services, controls)).toBe(expectedQuery);
    });
  });
});