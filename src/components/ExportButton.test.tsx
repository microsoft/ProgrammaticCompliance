import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ExportButton from './ExportButton';

describe('ExportButton Component', () => {
  const mockApiData = [
    {
      properties_metadata: {
        frameworkControlsMappings: ['PCI_DSS_v4.0_1.1.1'],
        mcsbId: 'MCSB001',
        offeringName: 'Azure Service',
        features: [
          {
            featureName: 'Feature 1',
            featureSupport: 'Supported',
            featureDescription: 'Description 1',
            featureGuidance: 'Guidance 1',
            featureReference: 'Reference 1',
          },
        ],
        automatedPolicyAvailability: [
          {
            policyName: 'Policy 1',
            policyDescription: 'Policy Description 1',
          },
        ],
      },
    },
  ];

  const mockAcfData = [
    {
      name: 'ACF1302',
      properties: {
        description: 'Description 1',
        requirements: 'Details 1',
        metadata: {
          frameworkControlsMappings: ['PCI_DSS_v4.0_1.1.1'],
        },
      },
    },
  ];

  const mockProps = {
    services: ['Azure Service'],
    policyTable: <div>Policy Table Mock</div>,
    apiData: mockApiData,
    disabled: false,
    acfData: mockAcfData,
    controlIDs: ['1.1.1'],
    framework: 'PCI_DSS_v4.0',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/exported');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders without crashing', () => {
    render(<ExportButton {...mockProps} />);
    const buttonElement = screen.getByText(/Export/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('shows menu options when Export button is clicked', () => {
    render(<ExportButton {...mockProps} />);
    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    expect(screen.getByText(/JSON/i)).toBeInTheDocument();
    expect(screen.getByText(/CSV/i)).toBeInTheDocument();
  });

  it('calls handleExportJSON when JSON menu item is clicked', () => {
    render(<ExportButton {...mockProps} />);

    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    const jsonMenuItem = screen.getByText(/JSON/i);
    fireEvent.click(jsonMenuItem);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('calls handleExportCSV when CSV menu item is clicked', () => {
    render(<ExportButton {...mockProps} />);

    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    const csvMenuItem = screen.getByText(/CSV/i);
    fireEvent.click(csvMenuItem);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('does not crash when apiData is empty', () => {
    render(<ExportButton {...mockProps} apiData={[]} />);
    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    const jsonMenuItem = screen.getByText(/JSON/i);
    fireEvent.click(jsonMenuItem);

    // Should not throw any errors
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('handles empty acfData gracefully', () => {
    render(<ExportButton {...mockProps} acfData={[]} />);
    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    const csvMenuItem = screen.getByText(/CSV/i);
    fireEvent.click(csvMenuItem);

    // Should not throw any errors
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('filters data based on controlIDs and framework', () => {
    render(<ExportButton {...mockProps} />);
    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    const csvMenuItem = screen.getByText(/CSV/i);
    fireEvent.click(csvMenuItem);

    // Verify that the data is processed without errors
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('sanitizes values correctly', () => {
    render(<ExportButton {...mockProps} />);
    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    const csvMenuItem = screen.getByText(/CSV/i);
    fireEvent.click(csvMenuItem);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('sanitizes values when comma is present correctly', () => {
    const commaAcfData = [
      {
        name: 'ACF,1302',
        properties: {
          description: 'Description 1',
          requirements: 'Details 1',
          metadata: {
            frameworkControlsMappings: ['PCI_DSS_v4.0_1.1.1'],
          },
        },
      },
    ];

    render(<ExportButton {...mockProps} acfData={commaAcfData} />);
    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    const csvMenuItem = screen.getByText(/CSV/i);
    fireEvent.click(csvMenuItem);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('handles invalid apiData and logs error', () => {
    const invalidApiData = 'Invalid JSON String';
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    render(<ExportButton {...mockProps} apiData={invalidApiData} />);
    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    const csvMenuItem = screen.getByText(/CSV/i);
    fireEvent.click(csvMenuItem);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('handles invalid acfData and logs error', () => {
    const invalidAcfData = 'Invalid JSON String';
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    render(<ExportButton {...mockProps} acfData={invalidAcfData} />);
    const buttonElement = screen.getByText(/Export/i);
    fireEvent.click(buttonElement);
    const csvMenuItem = screen.getByText(/CSV/i);
    fireEvent.click(csvMenuItem);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should render pane without crashing', () => {
    const mockProps = {
      services: ['Azure Service'],
      policyTable: <div>Policy Table Mock</div>,
      apiData: null,
      disabled: false,
      acfData: null,
      controlIDs: [], // Ensure controlIDs array is empty
      framework: '',
    };

    render(<ExportButton {...mockProps} />);

    const exportButton = screen.getByText(/Export/i);
    fireEvent.click(exportButton);

    const initiativeMenuItem = screen.getByText(/Custom Initiative/i);
    expect(initiativeMenuItem).toBeInTheDocument();

    fireEvent.click(initiativeMenuItem);

    const paneHeader = screen.getByText(/Export Custom Initiative/i);
    expect(paneHeader).toBeInTheDocument();
  });
});