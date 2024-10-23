import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tableText } from '../../static/staticStrings';
import TableStates from './TableStates.tsx';

describe('TableStates Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<TableStates type="ACF" variant="Onload" />);
    expect(getByText(tableText.acfTitle)).toBeInTheDocument();
  });

  it('displays the correct title and subtitle for ACF type', () => {
    const { getByText } = render(<TableStates type="ACF" variant="Onload" />);
    expect(getByText(tableText.acfTitle)).toBeInTheDocument();
    expect(getByText(tableText.acfDescription)).toBeInTheDocument();
  });

  it('displays the correct title and subtitle for MCSB type', () => {
    const { getByText } = render(<TableStates type="MCSB" variant="Onload" />);
    expect(getByText(tableText.mcsbTitle)).toBeInTheDocument();
    expect(getByText(tableText.mcsbDescription)).toBeInTheDocument();
  });

  it('displays the correct title and subtitle for Policy type', () => {
    const { getByText } = render(<TableStates type="Policy" variant="Onload" />);
    expect(getByText(tableText.policyTitle)).toBeInTheDocument();
    expect(getByText(tableText.policyDescription)).toBeInTheDocument();
  });

  it('displays the correct content for Onload variant', () => {
    const { getByText, getByLabelText } = render(<TableStates type="ACF" variant="Onload" />);
    expect(getByLabelText('Search')).toBeInTheDocument();
    expect(getByText(tableText.onloadTitle)).toBeInTheDocument();
    expect(getByText(tableText.onloadDescription)).toBeInTheDocument();
  });

  it('displays the correct content for Empty variant', () => {
    const { getByText, getByRole } = render(<TableStates type="ACF" variant="Empty" />);
    expect(getByRole('link', { name: /here/i })).toBeInTheDocument();
    const regex = new RegExp(tableText.unsupportedDescription, 'i');
    expect(getByText(regex)).toBeInTheDocument();
  });

  it('displays the correct content for Loading variant', () => {
    const { getByText } = render(<TableStates type="ACF" variant="Loading" />);
    expect(getByText(tableText.loading)).toBeInTheDocument();
  });

  it('displays the correct content for NoService variant', () => {
    const { getByText, getByLabelText } = render(<TableStates type="ACF" variant="NoService" />);
    expect(getByLabelText('Search')).toBeInTheDocument();
    expect(getByText(tableText.noService)).toBeInTheDocument();
  });

  it('displays the correct content for EmptyLoad variant', () => {
    const { getByText, getByRole } = render(<TableStates type="ACF" variant="EmptyLoad" />);
    expect(getByRole('link', { name: /here/i })).toBeInTheDocument();
    const regex = new RegExp(tableText.unsupportedDescription, 'i');
    expect(getByText(regex)).toBeInTheDocument();
  });
});