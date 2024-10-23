import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tableText } from '../../static/staticStrings';
import ACF from './ACF.tsx';

describe('ACF Component', () => {
  const mockData = [
    {
      name: 'ACF1302',
      properties: {
        description: 'Description 1',
        requirements: 'Details 1',
        metadata: {
          frameworkControlsMappings: ['control_1', 'control_2'],
        },
      },
    },
    {
      name: 'ACF1303',
      properties: {
        description: 'Description 2',
        requirements: 'Details 2',
        metadata: {
          frameworkControlsMappings: ['PCI_DSS_v4.0_1.1.1', 'PCI_DSS_v4.0_2.1.1'],
        },
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
    render(<ACF {...mockProps} />);
  });

  it('displays the correct title and description', () => {
    render(<ACF {...mockProps} />);
    expect(screen.getByText(tableText.acfTitle)).toBeInTheDocument();
    expect(screen.getByText(tableText.acfDescription)).toBeInTheDocument();
  });

  it('expands and collapses the table', () => {
    render(<ACF {...mockProps} />);
    const button = screen.getByRole('button', { name: /Collapse table/i });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Expand table');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Collapse table');
  });

  it('opens and closes the modal', async () => {
    render(<ACF {...mockProps} />);

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

  it('sorts the table by control ID', () => {
    render(<ACF {...mockProps} />);
    const controlHeader = screen.getByText('Control ID');
    fireEvent.click(controlHeader);
    const firstRow = screen.getAllByRole('row')[1];
    expect(firstRow).toHaveTextContent('2.1: Control 2(1)');
  });

  it('sorts the table by ACF ID', () => {
    render(<ACF {...mockProps} />);
    const acfHeader = screen.getByText('Azure Control Framework ID');
    fireEvent.click(acfHeader);
    const firstRow = screen.getAllByRole('row')[1];
    expect(firstRow).toHaveTextContent('ACF1');
  });

  it('filters rows based on selected controls', () => {
    render(<ACF {...mockProps} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(5); // 2 data rows + 1 header row todo: why 5?
  });

  it('displays empty state when no data is available', () => {
    render(<ACF {...mockProps} data={[]} />);
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});