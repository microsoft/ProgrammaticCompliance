import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SearchableDropdown from './SearchableDropdown.tsx';

describe('SearchableDropdown', () => {
  const options = [
    { key: 'option1', text: 'Option 1' },
    { key: 'option2', text: 'Option 2' },
    { key: 'option3', text: 'Option 3', disabled: true },
  ];

  it('renders without crashing', () => {
    render(<SearchableDropdown options={options} />);
  });

  it('displays the search box', () => {
    render(<SearchableDropdown options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByPlaceholderText('Search options')).toBeInTheDocument();
  });
});