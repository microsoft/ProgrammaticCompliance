export const appText = {
  siteTitle: 'Programmatic Compliance 🌼',
  siteDescription:
    'Microsoft and its customers follow a shared responsibility model regarding security and compliance of the Microsoft Cloud environment. This tool is designed to bring together helpful information about the technical capabilities available through the Microsoft Cloud to support customers’ compliance goals. This tool is provided for informational purposes only; as-is; without warranties of any kind, either express or implied; and is not intended to be a substitute for professional advice.',
  readMoreButton: 'Read more',
  disclaimer1: `Microsoft is responsible for the security of its cloud infrastructure and provides additional security controls which customers can enable and/or configure to further customize the Microsoft Cloud’s world-class security. The customer is responsible for configuring applications’ technical controls within the Microsoft Cloud, including but not limited to managing access controls, setting data protections, and complying with regulatory requirements that are applicable to the customer. The Microsoft Cloud provides a number of technical capabilities to support customers in their regulatory compliance journey.`,
  disclaimer2: 'This tool helps illustrate how customers can leverage, enable, and configure various features and capabilities in support of achieving their regulatory requirements. It is the customer’s responsibility to determine whether these technical capabilities, if properly employed, meet their compliance needs.',
  disclaimer3: 'MICROSOFT MAKES NO WARRANTY THAT THE DATA AND CONTENT PROVIDED AS PART OF THE PROGRAMMATIC COMPLIANCE TOOL IS ACCURATE, UP-TO-DATE, OR COMPLETE.',
  healthy: 'Programmatic Compliance site host is alive and well 🌼',
  unhealthy: '🚨 Programmatic Compliance needs repair. Please try again later! 🚨'
};

export const apiText = {
  mainEndpoint: "https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2022-10-01",
  requestBody: {
  },
};

export const tableText = {
  acfTitle: "Microsoft Cloud Compliance Foundation",
  acfDescription: "This table shows the actions Microsoft takes to help ensure we develop the Microsoft Cloud in a compliant manner, as well as the responsibilities a customer shares in using the Microsoft Cloud in a compliant manner.",
  mcsbTitle: "Compliance Features by Service",
  mcsbDescription: "This table shows the features available to customers to configure, per service, to help maintain compliance with a given standard.",
  policyTitle: "Compliance Policies by Service",
  policyDescription: "This table shows the Azure Policies available to customers to enable, per service, to help maintain compliance with a given standard.",
  unsupportedDescription: "The Microsoft Cloud leads the industry with more than 100 compliance offerings. We’re working to add them to this experience, but in the meantime you can find more information ",
  noService: "Please select a service to start",
  loading: "Retrieving rows...",
  onloadTitle: "No results",
  onloadDescription: "Please select a regulatory framework to start"
};

export const frameworks = [
  { key: 'CIS_Azure_2.0.0', text: 'CIS 2.0.0' },
  { key: 'NIST_SP_800-53_R4', text: 'NIST SP 800-53 Rev. 4' },
  { key: 'PCI_DSS_v4.0', text: 'PCI DSS 4.0' },
  // { key: 'ISO 27001:2013', text: 'ISO 27001' },
  // { key: 'SOC 2 Type 2', text: 'SOC 2 Type 2' },
];

export const frameworkStrategyMapping = {
  'NIST_SP_800-53_R4': 'NISTSP80053R4',
  'PCI_DSS_v4.0': 'PCIDSSv4',
  'CIS_Azure_2.0.0': 'CISAzure2'
}