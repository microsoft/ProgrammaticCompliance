import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('renders without crashing', () => {
    const { getByLabelText } = render(<Header />);
    expect(getByLabelText('Banner')).toBeInTheDocument();
  });

  it('renders the icon with correct aria-label', () => {
    const { getByLabelText } = render(<Header />);
    expect(getByLabelText('Menu')).toBeInTheDocument();
  });

  it('renders the text with correct content', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Programmatic Compliance')).toBeInTheDocument();
  });

  it('renders the stack with correct structure', () => {
    const { getByLabelText } = render(<Header />);
    const stack = getByLabelText('Banner');
    expect(stack).toBeInTheDocument();
    expect(stack).toHaveClass('ms-Stack'); // Assuming Fluent UI adds this class
  });

  it('renders the icon with correct structure', () => {
    const { getByLabelText } = render(<Header />);
    const icon = getByLabelText('Menu');
    expect(icon).toBeInTheDocument();
  });

  it('renders the text with correct structure', () => {
    const { getByText } = render(<Header />);
    const text = getByText('Programmatic Compliance');
    expect(text).toBeInTheDocument();
  });
});