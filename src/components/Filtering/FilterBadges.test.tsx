import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FilterBadges from './FilterBadges.jsx';

describe('FilterBadges', () => {
  it('renders without crashing', () => {
    render(<FilterBadges filterItems={[]} filterType="test" onRemoveFilter={vi.fn()} />);
  });

  it('does not render anything if filterItems is an empty array', () => {
    const { container } = render(<FilterBadges filterItems={[]} filterType="test" onRemoveFilter={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the correct number of SelectedFilterLabel components', () => {
    const filterItems = ['Item 1', 'Item 2', 'Item 3'];
    render(<FilterBadges filterItems={filterItems} filterType="test" onRemoveFilter={vi.fn()} />);

    const labels = screen.getAllByText(/Item/);
    expect(labels).toHaveLength(filterItems.length);
  });

  it('calls onRemoveFilter when a filter is removed', () => {
    const filterItems = ['Item 1'];
    const onRemoveFilter = vi.fn();
    render(<FilterBadges filterItems={filterItems} filterType="test" onRemoveFilter={onRemoveFilter} />);

    const removeButton = screen.getByText('Item 1');
    const cancelIcon = removeButton.closest('div')?.querySelector('i[data-icon-name="Cancel"]');

    expect(cancelIcon).toBeInTheDocument();
    if (cancelIcon) {
      fireEvent.click(cancelIcon);
    }
    expect(onRemoveFilter).toHaveBeenCalledWith('Item 1', 'test');
  });
});