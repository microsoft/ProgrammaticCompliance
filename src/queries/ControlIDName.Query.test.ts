import { describe, expect, it } from 'vitest';
import { allACFs } from './ControlIDName.Query';

describe('allACFs', () => {
  it('should return the correct query string for given framework and control', () => {
    const framework = 'framework1';
    const control = 'control1';
    const expectedOutput = "policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name == 'framework1_control1' | order by ['name'] asc";
    expect(allACFs(framework, control)).toBe(expectedOutput);
  });

  it('should handle empty strings for framework and control', () => {
    const framework = '';
    const control = '';
    const expectedOutput = "policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name == '_' | order by ['name'] asc";
    expect(allACFs(framework, control)).toBe(expectedOutput);
  });

  it('should handle special characters in framework and control', () => {
    const framework = 'frame@work!';
    const control = 'con#trol$';
    const expectedOutput = "policyresources | where type == 'microsoft.policyinsights/policymetadata' | where name == 'frame@work!_con#trol$' | order by ['name'] asc";
    expect(allACFs(framework, control)).toBe(expectedOutput);
  });
});