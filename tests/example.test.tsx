import { render, screen } from '@testing-library/react';
import React from 'react';

test('renders learn react link', () => {
  render(<a href="https://reactjs.org" > Learn React </a>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});