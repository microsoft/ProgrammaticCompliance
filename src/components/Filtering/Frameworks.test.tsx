import { describe, expect, it } from 'vitest';
import Frameworks from './Frameworks';

describe('Frameworks', () => {
  const mockData = [
    {
      ControlID: 'NIST_SP_800-53_R4_AC-1',
      ControlDomain: 'Access Control',
      properties: {
        metadataId: 'NIST SP 800-53 Rev. 4 AC-1',
        title: 'Access Control Policy And Procedures',
      },
    },
    {
      ControlID: 'NIST_SP_800-53_R4_AC-2',
      ControlDomain: 'Access Control',
      properties: {
        metadataId: 'NIST SP 800-53 Rev. 4 AC-2',
        title: 'Account Management',
      },
    },
  ];

  it('should get unique domains for NISTSP80053R4', () => {
    const uniqueDomains = Frameworks.NISTSP80053R4.getUniqueDomains(mockData);
    expect(uniqueDomains).toEqual([
      { key: 'AC', text: 'AC: Access Control' },
    ]);
  });

  it('should get control ID for NISTSP80053R4', () => {
    const controlID = Frameworks.NISTSP80053R4.getControlIDForControls(mockData[0]);
    expect(controlID).toBe('AC-1');
  });

  it('should sanitize control ID for NISTSP80053R4', () => {
    const sanitizedControlID = Frameworks.NISTSP80053R4.sanitizeControlIDForControls('AC-1');
    expect(sanitizedControlID).toBe('AC-1'); // Assuming sanitizeControlID doesn't change the input in this case
  });

  it('should get current map for NISTSP80053R4', () => {
    const currentMap = Frameworks.NISTSP80053R4.getCurrentMap(mockData);
    expect(currentMap.get('AC-1')).toBe('Access Control Policy And Procedures');
    expect(currentMap.get('AC-2')).toBe('Account Management');
  });

  it('should sort control IDs for NISTSP80053R4', () => {
    const currentControls = [
      { key: 'AC-2', text: 'Account Management' },
      { key: 'AC-1', text: 'Access Control Policy And Procedures' },
    ];
    const sortedControls = Frameworks.NISTSP80053R4.sortControlIDs(currentControls);
    expect(sortedControls).toEqual([
      { key: 'AC-1', text: 'Access Control Policy And Procedures' },
      { key: 'AC-2', text: 'Account Management' },
    ]);
  });
});