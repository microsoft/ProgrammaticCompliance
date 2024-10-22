import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tableText } from '../../static/staticStrings';
import POLICY from './Policies';

describe('POLICY Component', () => {
  const mockProps = {
    controls: ['1.1.1', '1.1.2'],
    data: [
      {
        properties_metadata: {
          frameworkControlsMappings: ['PCI_DSS_v4.0_1.1.1', 'PCI_DSS_v4.0_1.1.2'],
          mcsbId: 'MCSB-001',
          offeringName: 'Azure Service',
          automatedPolicyAvailability: [
            {
              policyCategory: 'Category1',
              policyName: 'Policy1',
              policyDescription: 'Description1',
              policyId: 'PolicyID1',
            },
          ],
        },
      },
    ],
    framework: 'PCI_DSS_v4.0',
    mapState: new Map([
      ['1.1.1', 'Control 1'],
      ['1.1.2', 'Control 2'],
    ]),
  };

  it('renders the component', () => {
    render(<POLICY {...mockProps} />);
    expect(screen.getByText(tableText.policyTitle)).toBeInTheDocument();
    expect(screen.getByText(tableText.policyDescription)).toBeInTheDocument();
  });

  it('toggles table expansion', () => {
    render(<POLICY {...mockProps} />);
    const toggleButton = screen.getByLabelText('Collapse table');
    fireEvent.click(toggleButton);
    expect(screen.getByLabelText('Expand table')).toBeInTheDocument();
  });

  it('opens and closes the modal', async () => {
    render(<POLICY {...mockProps} />);

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

  it('sorts columns correctly', async () => {
    render(<POLICY {...mockProps} />);
    const controlHeader = screen.getByText('Control ID');
    fireEvent.click(controlHeader);

    const firstRow = screen.getAllByRole('row')[2]; // Assuming the first row is the header and the second row is the column header
    expect(firstRow).toHaveTextContent(/Control 2/);
  });

  it('renders the correct number of items', () => {
    render(<POLICY {...mockProps} />);
    const items = screen.getAllByRole('row');
    expect(items.length).toBe(mockProps.mapState.size + 2); // +1 for the header row + 1 for the column header row
  });
});