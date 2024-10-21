import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FilterBadgesContainer from './FilterBadgesContainer';

describe('FilterBadgesContainer', () => {
  const mockProps = {
    selectedServices: ['Service1', 'Service2'],
    selectedControls: ['Control1', 'Control2'],
    removeFilter: vi.fn(),
    handleClear: vi.fn(),
  };

  it('renders without crashing', () => {
    render(<FilterBadgesContainer {...mockProps} />);
  });

  it('displays the correct filtered items', () => {
    render(<FilterBadgesContainer {...mockProps} />);
    expect(screen.getByText('Filtered by:')).toBeInTheDocument();
    expect(screen.getByText('Service1')).toBeInTheDocument();
    expect(screen.getByText('Service2')).toBeInTheDocument();
    expect(screen.getByText('Control1')).toBeInTheDocument();
    expect(screen.getByText('Control2')).toBeInTheDocument();
  });

  it('calls removeFilter when a filter badge is clicked', () => {
    render(<FilterBadgesContainer {...mockProps} />);
    const serviceBadge = screen.getByText('Service1');
    const cancelIcon = serviceBadge.closest('div')?.querySelector('i[data-icon-name="Cancel"]');
    fireEvent.click(cancelIcon!);
    expect(mockProps.removeFilter).toHaveBeenCalledWith('Service1', 'service');
  });

  it('calls handleClear when the clear button is clicked', () => {
    render(<FilterBadgesContainer {...mockProps} />);
    const clearButton = screen.getByText('Clear all filters');
    fireEvent.click(clearButton);
    expect(mockProps.handleClear).toHaveBeenCalled();
  });

  it('handles screen resize correctly', () => {
    render(<FilterBadgesContainer {...mockProps} />);
    global.innerWidth = 300;
    global.dispatchEvent(new Event('resize'));
    expect(screen.getByText('Filtered by:')).toBeInTheDocument();
  });

  it('displays the correct separator', () => {
    render(<FilterBadgesContainer {...mockProps} />);
    const separators = screen.getAllByText('|');
    expect(separators).toHaveLength(2);
  });

  it('displays no filters when selectedServices and selectedControls are empty', () => {
    render(<FilterBadgesContainer {...mockProps} selectedServices={[]} selectedControls={[]} />);
    expect(screen.queryByText('Filtered by:')).not.toBeInTheDocument();
  });
});