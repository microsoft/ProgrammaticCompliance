import { describe, expect, it } from 'vitest';
import { allACFs, filteredACFs } from './ACF.Query';

describe('ACF.Query', () => {
  describe('allACFs', () => {
    it('should generate the correct query for a given framework', () => {
      const framework = 'exampleFramework';
      const expectedQuery = `policyresources | where type contains 'microsoft.policyinsights/policymetadata' | where name contains "ACF" and properties.metadata.frameworkControlsMappings contains 'exampleFramework'`;
      expect(allACFs(framework)).toBe(expectedQuery);
    });
  });

  describe('filteredACFs', () => {
    it('should generate the correct query for given framework and controls', () => {
      const framework = 'exampleFramework';
      const controls = ['control1', 'control2'];
      const expectedQuery = `policyresources | where type contains 'microsoft.policyinsights/policymetadata' | where name contains "ACF" and properties.metadata.frameworkControlsMappings has 'exampleFramework_control1' or name contains "ACF" and properties.metadata.frameworkControlsMappings has 'exampleFramework_control2'`;
      expect(filteredACFs(framework, controls)).toBe(expectedQuery);
    });

    it('should handle empty controls array', () => {
      const framework = 'exampleFramework';
      const controls: string[] = [];
      const expectedQuery = `policyresources | where type contains 'microsoft.policyinsights/policymetadata' | where name contains "ACF" and `;
      expect(filteredACFs(framework, controls)).toBe(expectedQuery);
    });
  });
});