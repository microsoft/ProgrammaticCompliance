import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { InteractionStatus, AccountInfo, PublicClientApplication } from '@azure/msal-browser';
import { useAuthorizeUser } from './getAzureToken';

vi.mock('@azure/msal-browser', () => {
  class MockPublicClientApplication {
    loginRedirect = vi.fn();
    acquireTokenSilent = vi.fn();
  }

  const InteractionStatus = {
    None: 'None',
  };

  return {
    PublicClientApplication: MockPublicClientApplication,
    InteractionStatus,
  };
});

process.env.VITE_APP_TENANT_ID = 'test-tenant-id';

type MockInstanceType = {
  loginRedirect: jest.Mock;
  acquireTokenSilent: jest.Mock;
} & PublicClientApplication;

interface TestComponentProps {
  isAuthenticated: boolean;
  inProgress: InteractionStatus;
  accounts: AccountInfo[];
  instance: PublicClientApplication;
}

function TestComponent(props: TestComponentProps) {
  const { azureToken } = useAuthorizeUser(props);
  return <div data-testid="azureToken">{azureToken}</div>;
}

describe('useAuthorizeUser', () => {
  it('should initiate login redirect when not authenticated and inProgress is None', async () => {
    const mockInstance = new PublicClientApplication({ auth: { clientId: '' } }) as unknown as MockInstanceType;
    const mockAccounts: AccountInfo[] = [];

    await act(async () => {
      render(
        <TestComponent
          isAuthenticated={false}
          inProgress={InteractionStatus.None}
          accounts={mockAccounts}
          instance={mockInstance}
        />
      );
    });

    expect(mockInstance.loginRedirect).toHaveBeenCalledWith({
      authority: expect.any(String),
      scopes: [expect.any(String)],
    });
  });

  it('should not call loginRedirect when inProgress is not None', async () => {
    const mockInstance = new PublicClientApplication({ auth: { clientId: '' } }) as unknown as MockInstanceType;
    const mockAccounts: AccountInfo[] = [];

    await act(async () => {
      render(
        <TestComponent
          isAuthenticated={false}
          inProgress={'SomeOtherStatus' as InteractionStatus}
          accounts={mockAccounts}
          instance={mockInstance}
        />
      );
    });

    expect(mockInstance.loginRedirect).not.toHaveBeenCalled();
  });

  it('should set azureToken when authenticated and inProgress is None', async () => {
    const mockAccessToken = 'mockAccessToken';
    const mockAccounts: AccountInfo[] = [{ username: 'testuser' } as AccountInfo];
    const mockInstance = new PublicClientApplication({ auth: { clientId: '' } }) as unknown as MockInstanceType;

    mockInstance.acquireTokenSilent.mockResolvedValue({
      accessToken: mockAccessToken,
    } as unknown as { accessToken: string });

    let getByTestId: (id: string) => HTMLElement = () => document.createElement('div');

    await act(async () => {
      ({ getByTestId } = render(
        <TestComponent
          isAuthenticated={true}
          inProgress={InteractionStatus.None}
          accounts={mockAccounts}
          instance={mockInstance}
        />
      ));
    });

    expect(mockInstance.acquireTokenSilent).toHaveBeenCalledWith({
      authority: `https://login.microsoftonline.com/${process.env.VITE_APP_TENANT_ID}`,
      scopes: ['https://management.azure.com/.default'],
      account: mockAccounts[0],
    });
    expect(getByTestId('azureToken').textContent).toBe(mockAccessToken);
  });

  it('should handle acquireTokenSilent failure and set azureToken to empty string', async () => {
    const mockAccounts: AccountInfo[] = [{ username: 'testuser' } as AccountInfo];
    const mockInstance = new PublicClientApplication({ auth: { clientId: '' } }) as unknown as MockInstanceType;

    mockInstance.acquireTokenSilent.mockRejectedValue(new Error('Failed to acquire token'));

    let getByTestId: (id: string) => HTMLElement = () => document.createElement('div');

    await act(async () => {
      ({ getByTestId } = render(
        <TestComponent
          isAuthenticated={true}
          inProgress={InteractionStatus.None}
          accounts={mockAccounts}
          instance={mockInstance}
        />
      ));
    });

    expect(mockInstance.acquireTokenSilent).toHaveBeenCalled();
    expect(getByTestId('azureToken').textContent).toBe('');
  });
});
