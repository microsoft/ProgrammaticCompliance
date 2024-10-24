import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import INITIATIVES from './Initiatives';

describe('INITIATIVES Component', () => {
  const mockData = [
    {
      properties_metadata: {
        mcsb: {
          mcsbId: 'MCSB1',
          frameworkControls: ['PCI_DSS_v4.0_1.1.1', 'PCI_DSS_v4.0_2.1.1'],
          automatedPolicyAvailability: [
            {
              policyCategory: 'Category 1',
              policyName: 'Policy 1',
              policyDescription: 'Description 1',
              policyId: 'PolicyID1',
            },
          ],
        },
        offeringName: 'Azure Service 1',
      },
    },
    {
      properties_metadata: {
        mcsb: {
          mcsbId: 'MCSB2',
          frameworkControls: ['PCI_DSS_v4.0_3.1.1'],
          automatedPolicyAvailability: [
            {
              policyCategory: 'Category 2',
              policyName: 'Policy 2',
              policyDescription: 'Description 2',
              policyId: 'PolicyID2',
            },
          ],
        },
        offeringName: 'Azure Service 2',
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
    render(<INITIATIVES {...mockProps} />);
  });

  it('displays the correct title and description', () => {
    render(<INITIATIVES {...mockProps} />);
    expect(screen.getByText('Export to Custom Initiative')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The policy definitions selected below will be added to the custom initiative file.'
      )
    ).toBeInTheDocument();
  });

  it('expands and collapses the table', () => {
    render(<INITIATIVES {...mockProps} />);
    const button = screen.getByRole('button', { name: /Collapse table/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Expand table');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Collapse table');
  });

  it('renders the correct number of rows based on provided data', () => {
    render(<INITIATIVES {...mockProps} />);
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3);
  });

  it('handles selection and updates selectedKeys correctly', () => {
    render(<INITIATIVES {...mockProps} />);
    const checkboxes = screen.getAllByRole('checkbox');

    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();

    fireEvent.click(checkboxes[2]);
    expect(checkboxes[2]).toBeChecked();

    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('opens and closes the modal when an item is invoked', async () => {
    render(<INITIATIVES {...mockProps} />);

    const firstRow = screen.getAllByRole('row')[1];
    fireEvent.doubleClick(firstRow);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const closeButton = within(dialog).getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no data is available', () => {
    render(<INITIATIVES {...mockProps} data={[]} />);
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('displays all relevant data when no controls are selected (controlIDSet.size === 0)', () => {
    const propsWithEmptyControls = {
      ...mockProps,
      controls: [],
    };
    render(<INITIATIVES {...propsWithEmptyControls} />);

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(3);

    expect(screen.getByText('MCSB1')).toBeInTheDocument();
    expect(screen.getByText('MCSB2')).toBeInTheDocument();
  });

  it('filters rows based on selected controls', () => {
    const propsWithSpecificControl = {
      ...mockProps,
      controls: ['2.1.1'],
    };
    render(<INITIATIVES {...propsWithSpecificControl} />);

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(2);

    expect(screen.queryByText('MCSB1')).toBeInTheDocument();
    expect(screen.queryByText('MCSB2')).not.toBeInTheDocument();
  });
});
