import React from 'react';
import ReactDOM from 'react-dom';
import { describe, it, expect, vi } from 'vitest';
import { renderApp } from './main';

// Mock ReactDOM.render
vi.mock('react-dom', () => ({
  default: {
    render: vi.fn(),
  },
}));

// Mock external dependencies
vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn(() => ({
    // Mock any methods if necessary
  })),
}));

vi.mock('@azure/msal-react', () => ({
  MsalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./authConfig', () => ({
  msalConfig: {
    auth: {
      clientId: 'test-client-id',
      authority: 'https://login.microsoftonline.com/test-tenant-id',
      redirectUri: 'http://localhost',
    },
  },
}));

describe('main.tsx', () => {
  it('renders without crashing', () => {
    // Create a DOM element to render the app into
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    renderApp();

    expect(ReactDOM.render).toHaveBeenCalled();

    const renderArgs = (ReactDOM.render as jest.Mock).mock.calls[0];
    const renderedElement = renderArgs[0];

    expect(React.isValidElement(renderedElement)).toBe(true);
    
    document.body.removeChild(root);
    vi.clearAllMocks();
  });
});
