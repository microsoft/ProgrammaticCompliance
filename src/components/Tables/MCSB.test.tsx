import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tableText } from '../../static/staticStrings';
import MCSB from './MCSB';

describe('MCSB Component', () => {
  const mockData = [
    {
      properties_metadata: {
        mcsbId: 'MCSB10',
        offeringName: 'Azure Service A',
        frameworkControlsMappings: ['PCI_DSS_v4.0_1.1.1'],
        features: [
          {
            featureName: 'Feature A',
            customerActionsDescription: 'Action Description A',
            featureSupport: 'Supported',
            enabledByDefault: 'Yes',
            featureDescription: 'Feature Description A',
            featureGuidance: 'Guidance A',
            featureReference: 'https://example.com/featureA',
          },
        ],
      },
    },
    {
      properties_metadata: {
        mcsbId: 'MCSB2',
        offeringName: 'Azure Service B',
        frameworkControlsMappings: ['PCI_DSS_v4.0_2.1.1'],
        features: [
          {
            featureName: 'Feature B',
            customerActionsDescription: 'Action Description B',
            featureSupport: 'Supported',
            enabledByDefault: 'Yes',
            featureDescription: 'Feature Description B',
            featureGuidance: 'Guidance B',
            featureReference: 'https://example.com/featureB',
          },
        ],
      },
    },
    {
      properties_metadata: {
        mcsbId: 'MCSB1',
        offeringName: 'Azure Service C',
        frameworkControlsMappings: ['PCI_DSS_v4.0_3.1.1'],
        features: [
          {
            featureName: 'Feature C',
            customerActionsDescription: 'Action Description C',
            featureSupport: 'Not Supported',
            enabledByDefault: 'No',
            featureDescription: 'Feature Description C',
            featureGuidance: 'Guidance C',
            featureReference: 'Not Applicable',
          },
        ],
      },
    },
  ];

  const mockProps = {
    controls: ['1.1.1', '2.1.1', '3.1.1'],
    data: mockData,
    framework: 'PCI_DSS_v4.0',
    mapState: new Map([
      ['1.1.1', 'Control 1'],
      ['2.1.1', 'Control 2'],
      ['3.1.1', 'Control 3'],
    ]),
  };

  it('renders without crashing', () => {
    render(<MCSB {...mockProps} />);
  });

  it('displays the correct title and description', () => {
    render(<MCSB {...mockProps} />);
    expect(screen.getByText(tableText.mcsbTitle)).toBeInTheDocument();
    expect(screen.getByText(tableText.mcsbDescription)).toBeInTheDocument();
  });

  it('expands and collapses the table', () => {
    render(<MCSB {...mockProps} />);
    const button = screen.getByRole('button', { name: /Collapse table/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Expand table');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Collapse table');
  });

  it('opens and closes the modal', async () => {
    render(<MCSB {...mockProps} />);

    const expandIcon = screen.getAllByLabelText('Expand fullscreen')[0];
    fireEvent.click(expandIcon);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const dialogContainer = within(dialog).getByRole('document');
    expect(dialogContainer).toBeInTheDocument();
    const closeButton = within(dialogContainer).getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no data is available', () => {
    render(<MCSB {...mockProps} data={[]} />);
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('displays all relevant data when no controls are selected (controlIDSet.size === 0)', () => {
    const propsWithEmptyControls = {
      ...mockProps,
      controls: [],
    };
    render(<MCSB {...propsWithEmptyControls} />);

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1);

    // Since we have three data entries, we expect at least 4 rows (1 header + 3 data rows)
    expect(rows.length).toBeGreaterThan(1);

    expect(screen.getByText('1.1.1: Control 1')).toBeInTheDocument();
    expect(screen.getByText('2.1.1: Control 2')).toBeInTheDocument();
    expect(screen.getByText('3.1.1: Control 3')).toBeInTheDocument();

    // Verify that features from all entries are displayed
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
    expect(screen.getByText('Feature C')).toBeInTheDocument();
  });
});
