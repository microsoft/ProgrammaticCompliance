import { describe, it, expect } from 'vitest';
import {
  appText,
  apiText,
  tableText,
  frameworks,
  frameworkStrategyMapping,
} from './staticStrings';

describe('staticStrings', () => {
  describe('appText', () => {
    it('should have the correct siteTitle', () => {
      expect(appText.siteTitle).toBe('Programmatic Compliance 🌼');
    });

    it('should have the correct siteDescription', () => {
      expect(appText.siteDescription).toContain(
        'Microsoft and its customers follow a shared responsibility model regarding security and compliance'
      );
    });

    it('should have the correct readMoreButton text', () => {
      expect(appText.readMoreButton).toBe('Read more');
    });

    it('should have the correct disclaimers', () => {
      expect(appText.disclaimer1).toContain('Microsoft is responsible for the security of its cloud infrastructure');
      expect(appText.disclaimer2).toContain(
        'This tool helps illustrate how customers can leverage, enable, and configure various features'
      );
      expect(appText.disclaimer3).toBe(
        'MICROSOFT MAKES NO WARRANTY THAT THE DATA AND CONTENT PROVIDED AS PART OF THE PROGRAMMATIC COMPLIANCE TOOL IS ACCURATE, UP-TO-DATE, OR COMPLETE.'
      );
    });

    it('should have the correct health messages', () => {
      expect(appText.healthy).toBe('Programmatic Compliance site host is alive and well');
      expect(appText.unhealthy).toBe(
        '🚨 Programmatic Compliance needs repair. Please try again later! 🚨'
      );
    });
  });

  describe('apiText', () => {
    it('should have the correct mainEndpoint', () => {
      expect(apiText.mainEndpoint).toBe(
        'https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2022-10-01'
      );
    });

    it('should have an empty requestBody', () => {
      expect(apiText.requestBody).toEqual({});
    });
  });

  describe('tableText', () => {
    it('should have the correct titles and descriptions', () => {
      expect(tableText.acfTitle).toBe('Microsoft Cloud Compliance Foundation');
      expect(tableText.acfDescription).toContain(
        'This table shows the actions Microsoft takes to help ensure we develop the Microsoft Cloud in a compliant manner'
      );
      expect(tableText.mcsbTitle).toBe('Compliance Features by Service');
      expect(tableText.mcsbDescription).toContain(
        'This table shows the features available to customers to configure'
      );
      expect(tableText.policyTitle).toBe('Compliance Policies by Service');
      expect(tableText.policyDescription).toContain(
        'This table shows the Azure Policies available to customers to enable'
      );
    });

    it('should have the correct unsupportedDescription', () => {
      expect(tableText.unsupportedDescription).toContain(
        'The Microsoft Cloud leads the industry with more than 100 compliance offerings'
      );
    });

    it('should have the correct messages', () => {
      expect(tableText.noService).toBe('Please select a service to start');
      expect(tableText.loading).toBe('Retrieving rows...');
      expect(tableText.onloadTitle).toBe('No results');
      expect(tableText.onloadDescription).toBe(
        'Please select a regulatory framework to start'
      );
    });
  });

  describe('frameworks', () => {
    it('should have the correct frameworks array', () => {
      expect(frameworks).toEqual([
        { key: 'CIS_Azure_2.0.0', text: 'CIS Azure 2.0.0' },
        { key: 'ISO 27001:2013', text: 'ISO 27001-2013' },
        { key: 'NIST_SP_800-53_R4', text: 'NIST SP 800-53 Rev. 4' },
        { key: 'PCI_DSS_v4.0', text: 'PCI DSS 4.0' },
        { key: 'SOC 2 Type 2', text: 'SOC 2 Type 2' },
      ]);
    });
  });

  describe('frameworkStrategyMapping', () => {
    it('should have the correct frameworkStrategyMapping object', () => {
      expect(frameworkStrategyMapping).toEqual({
        'NIST_SP_800-53_R4': 'NISTSP80053R4',
        'PCI_DSS_v4.0': 'PCIDSSv4',
        'CIS_Azure_2.0.0': 'CISAzure2',
        'ISO 27001:2013': 'ISO270012013',
        'SOC 2 Type 2': 'SOC2Type2',
      });
    });
  });
});
