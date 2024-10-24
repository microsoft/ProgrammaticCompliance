import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor} from '@testing-library/react';
import FilterBar from './FilterBar';
import type { ChangeEvent } from 'react';

vi.mock('../ExportButton.jsx', () => ({
  default: () => <div data-testid="export-button">ExportButton</div>,
}));

vi.mock('./SearchableDropdown.tsx', () => ({
  default: ({
    label,
    selectedKeys,
    onChange,
    options,
  }: {
    label: string;
    selectedKeys: string[];
    onChange: (event: ChangeEvent<HTMLSelectElement>, option: { selected: boolean; key: string[] }) => void;
    options: { key: string; text: string }[];
  }) => (
    <div data-testid={`searchable-dropdown-${label}`}>
      <label>{label}</label>
      <select
        aria-label={label}
        multiple
        value={selectedKeys}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => option.value
          );
          onChange(e, { selected: true, key: selectedOptions });
        }}
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock('../Tables/ACF.tsx', () => ({
  default: () => <div data-testid="acf-table">ACF Table</div>,
}));

vi.mock('../Tables/MCSB.jsx', () => ({
  default: () => <div data-testid="mcsb-table">MCSB Table</div>,
}));

vi.mock('../Tables/Policies.jsx', () => ({
  default: () => <div data-testid="policies-table">Policies Table</div>,
}));

vi.mock('../Tables/TableStates.tsx', () => ({
  default: ({ type, variant }: { type: string; variant: string }) => (
    <div data-testid="table-states">
      {type} - {variant}
    </div>
  ),
}));

vi.mock('./FilterBadgesContainer.tsx', () => ({
  default: () => (
    <div data-testid="filter-badges-container">FilterBadgesContainer</div>
  ),
}));

global.fetch = vi.fn() as Mock;

describe('FilterBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders FilterBar without crashing', () => {
    (global.fetch as Mock).mockResolvedValue(
      Promise.resolve({
        ok: true,
        json: async () => ({ data: [] }),
      })
    );

    render(<FilterBar azureToken="dummy_token" />);
    expect(screen.getByText(/Regulatory framework/i)).toBeInTheDocument();
  });

  it('displays error message when API returns error', async () => {
    (global.fetch as Mock).mockResolvedValue(
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}), 
      })
    );

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<FilterBar azureToken="dummy_token" />);
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});