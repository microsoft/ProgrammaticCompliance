import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SelectedFilterLabel from './SelectedFilterLabel';

describe('SelectedFilterLabel', () => {
  it('renders without crashing', () => {
    render(<SelectedFilterLabel text="Filter 1" filterType="test" onRemoveFilter={vi.fn()} />);
  });

  it('displays the correct text', () => {
    render(<SelectedFilterLabel text="Filter 1" filterType="test" onRemoveFilter={vi.fn()} />);
    expect(screen.getByText('Filter 1')).toBeInTheDocument();
  });

  it('calls onRemoveFilter with the correct arguments when the cancel icon is clicked', () => {
    const onRemoveFilter = vi.fn();
    render(<SelectedFilterLabel text="Filter 1" filterType="test" onRemoveFilter={onRemoveFilter} />);

    const cancelIcon = screen.getByLabelText('Cancel');
    fireEvent.click(cancelIcon);

    expect(onRemoveFilter).toHaveBeenCalledWith('Filter 1', 'test');
  });

  it('applies the correct styles', () => {
    render(<SelectedFilterLabel text="Filter 1" filterType="test" onRemoveFilter={vi.fn()} />);

    const labelContainer = screen.getByText('Filter 1').closest('div');
    expect(labelContainer).toBeInTheDocument();
    expect(labelContainer?.className).toMatch(/^labelContainer/);
  });
});