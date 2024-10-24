import { describe, expect, it } from 'vitest';
import Frameworks from './Frameworks';

describe('Frameworks', () => {
  const nistData = [
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

  const cisData = [
    {
      ControlID: 'CIS_Azure_2_1',
      ControlDomain: '1 Initial Setup',
      properties: {
        metadataId: 'CIS Microsoft Azure Foundations Benchmark v2.0.0 1',
        title: 'Ensure that multi-factor authentication is enabled for all privileged users',
      },
    },
    {
      ControlID: 'CIS_Azure_2_2',
      ControlDomain: '2 Identity and Access Management',
      properties: {
        metadataId: 'CIS Microsoft Azure Foundations Benchmark v2.0.0 2',
        title: 'Ensure that "Enable Security Defaults" is set to "Yes" on Azure Active Directory',
      },
    },
  ];

  const pciData = [
    {
      ControlID: 'PCI_DSS_v4.0_1.1',
      ControlDomain: '1: Install and Maintain Network Security Controls',
      properties: {
        metadataId: 'PCI DSS v4.0 1.1',
        title: 'Establish and implement firewall and router configurations',
      },
    },
    {
      ControlID: 'PCI_DSS_v4.0_2.1',
      ControlDomain: '2: Apply Secure Configurations to All System Components',
      properties: {
        metadataId: 'PCI DSS v4.0 2.1',
        title: 'Change all default passwords and settings',
      },
    },
  ];

  const isoData = [
    {
      ControlID: 'ISO_27001_2013_5.1',
      ControlDomain: '5: Information Security Policies',
      properties: {
        metadataId: 'ISO/IEC 27001:2013 5.1',
        title: 'Management direction for information security',
      },
    },
    {
      ControlID: 'ISO_27001_2013_6.1',
      ControlDomain: '6: Organization of Information Security',
      properties: {
        metadataId: 'ISO/IEC 27001:2013 6.1',
        title: 'Internal organization',
      },
    },
  ];

  const socData = [
    {
      ControlID: 'SOC_2_Type_2_CC1.1',
      ControlDomain: 'CC1: Control Environment',
      properties: {
        metadataId: 'SOC 2 Type 2 CC1.1',
        title: 'Commitment to integrity and ethical values',
      },
    },
    {
      ControlID: 'SOC_2_Type_2_CC2.1',
      ControlDomain: 'CC2: Communication and Information',
      properties: {
        metadataId: 'SOC 2 Type 2 CC2.1',
        title: 'Communication of internal control information',
      },
    },
  ];

  describe('NISTSP80053R4', () => {
    it('should get unique domains', () => {
      const uniqueDomains = Frameworks.NISTSP80053R4.getUniqueDomains(nistData);
      expect(uniqueDomains).toEqual([{ key: 'AC', text: 'AC: Access Control' }]);
    });

    it('should get control ID for controls', () => {
      const controlID = Frameworks.NISTSP80053R4.getControlIDForControls(nistData[0]);
      expect(controlID).toBe('AC-1');
    });

    it('should sanitize control ID for controls', () => {
      const sanitizedControlID = Frameworks.NISTSP80053R4.sanitizeControlIDForControls('AC-1');
      expect(sanitizedControlID).toBe('AC-1');
    });

    it('should get current map', () => {
      const currentMap = Frameworks.NISTSP80053R4.getCurrentMap(nistData);
      expect(currentMap.get('AC-1')).toBe('Access Control Policy And Procedures');
      expect(currentMap.get('AC-2')).toBe('Account Management');
    });

    it('should sort control IDs', () => {
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

  describe('CISAzure2', () => {
    it('should get unique domains', () => {
      const uniqueDomains = Frameworks.CISAzure2.getUniqueDomains(cisData);
      expect(uniqueDomains).toEqual([
        { key: '1', text: '1: Initial Setup' },
        { key: '2', text: '2: Identity and Access Management' },
      ]);
    });

    it('should get control ID for controls', () => {
      const controlID = Frameworks.CISAzure2.getControlIDForControls(cisData[0]);
      expect(controlID).toBe('1');
    });

    it('should sanitize control ID for controls', () => {
      const sanitizedControlID = Frameworks.CISAzure2.sanitizeControlIDForControls('1');
      expect(sanitizedControlID).toBe('1');
    });

    it('should get current map', () => {
      const currentMap = Frameworks.CISAzure2.getCurrentMap(cisData);
      expect(currentMap.get('1')).toBe(
        'Ensure that multi-factor authentication is enabled for all privileged users'
      );
      expect(currentMap.get('2')).toBe(
        'Ensure that "Enable Security Defaults" is set to "Yes" on Azure Active Directory'
      );
    });

    it('should sort control IDs', () => {
      const currentControls = [
        { key: '2', text: 'Identity and Access Management' },
        { key: '1', text: 'Initial Setup' },
      ];
      const sortedControls = Frameworks.CISAzure2.sortControlIDs(currentControls);
      expect(sortedControls).toEqual([
        { key: '1', text: 'Initial Setup' },
        { key: '2', text: 'Identity and Access Management' },
      ]);
    });
  });

  describe('PCIDSSv4', () => {
    it('should get control ID for controls', () => {
      const controlID = Frameworks.PCIDSSv4.getControlIDForControls(pciData[0]);
      expect(controlID).toBe('1.1');
    });

    it('should sanitize control ID for controls', () => {
      const sanitizedControlID = Frameworks.PCIDSSv4.sanitizeControlIDForControls('1.1');
      expect(sanitizedControlID).toBe('1.1');
    });

    it('should get current map', () => {
      const currentMap = Frameworks.PCIDSSv4.getCurrentMap(pciData);
      expect(currentMap.get('1.1')).toBe(
        'Establish and implement firewall and router configurations'
      );
      expect(currentMap.get('2.1')).toBe('Change all default passwords and settings');
    });

    it('should sort control IDs', () => {
      const currentControls = [
        { key: '2.1', text: 'Apply Secure Configurations to All System Components' },
        { key: '1.1', text: 'Install and Maintain Network Security Controls' },
      ];
      const sortedControls = Frameworks.PCIDSSv4.sortControlIDs(currentControls);
      expect(sortedControls).toEqual([
        { key: '1.1', text: 'Install and Maintain Network Security Controls' },
        { key: '2.1', text: 'Apply Secure Configurations to All System Components' },
      ]);
    });
  });

  describe('ISO270012013', () => {
    it('should get control ID for controls', () => {
      const controlID = Frameworks.ISO270012013.getControlIDForControls(isoData[0]);
      expect(controlID).toBe('5.1');
    });

    it('should sanitize control ID for controls', () => {
      const sanitizedControlID = Frameworks.ISO270012013.sanitizeControlIDForControls('5.1');
      expect(sanitizedControlID).toBe('5.1');
    });

    it('should get current map', () => {
      const currentMap = Frameworks.ISO270012013.getCurrentMap(isoData);
      expect(currentMap.get('5.1')).toBe('Management direction for information security');
      expect(currentMap.get('6.1')).toBe('Internal organization');
    });

    it('should sort control IDs', () => {
      const currentControls = [
        { key: '6.1', text: 'Organization of Information Security' },
        { key: '5.1', text: 'Information Security Policies' },
      ];
      const sortedControls = Frameworks.ISO270012013.sortControlIDs(currentControls);
      expect(sortedControls).toEqual([
        { key: '5.1', text: 'Information Security Policies' },
        { key: '6.1', text: 'Organization of Information Security' },
      ]);
    });
  });

  describe('SOC2Type2', () => {
    it('should get control ID for controls', () => {
      const controlID = Frameworks.SOC2Type2.getControlIDForControls(socData[0]);
      expect(controlID).toBe('CC1.1');
    });

    it('should sanitize control ID for controls', () => {
      const sanitizedControlID = Frameworks.SOC2Type2.sanitizeControlIDForControls('CC1.1');
      expect(sanitizedControlID).toBe('CC1.1');
    });

    it('should get current map', () => {
      const currentMap = Frameworks.SOC2Type2.getCurrentMap(socData);
      expect(currentMap.get('CC1.1')).toBe('Commitment to integrity and ethical values');
      expect(currentMap.get('CC2.1')).toBe('Communication of internal control information');
    });

    it('should sort control IDs', () => {
      const currentControls = [
        { key: 'CC2.1', text: 'Communication and Information' },
        { key: 'CC1.1', text: 'Control Environment' },
      ];
      const sortedControls = Frameworks.SOC2Type2.sortControlIDs(currentControls);
      expect(sortedControls).toEqual([
        { key: 'CC1.1', text: 'Control Environment' },
        { key: 'CC2.1', text: 'Communication and Information' },
      ]);
    });
  });
});
