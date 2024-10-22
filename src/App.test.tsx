// App.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import MainApp from './App';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useAuthorizeUser } from './hooks/getAzureToken.js';
import { InteractionStatus, IPublicClientApplication, AccountInfo, Logger, LogLevel } from '@azure/msal-browser';
import { appText } from './static/staticStrings';
import { reloadPage } from './utils/reloadPage';

vi.mock('@azure/msal-react', () => ({
  useIsAuthenticated: vi.fn(),
  useMsal: vi.fn(),
}));

vi.mock('./hooks/getAzureToken.js', () => ({
  useAuthorizeUser: vi.fn(),
}));

vi.mock('./utils/reloadPage', () => ({
  reloadPage: vi.fn(),
}));

vi.mock('./components/Filtering/FilterBar.jsx', () => ({
  default: () => <div aria-label="Main">FilterBar Component</div>,
}));

describe('MainApp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    const useIsAuthenticatedMock = useIsAuthenticated as jest.MockedFunction<typeof useIsAuthenticated>;
    useIsAuthenticatedMock.mockReturnValue(true);

    const mockInstance: Partial<IPublicClientApplication> = {
      acquireTokenSilent: vi.fn(),
      loginRedirect: vi.fn(),
      // Include any other methods your component calls on 'instance'
    };

    const mockAccount: AccountInfo = {
      homeAccountId: 'mock-home-account-id',
      environment: 'mock-environment',
      tenantId: 'mock-tenant-id',
      username: 'mock-username',
      localAccountId: 'mock-local-account-id',
    };

    const mockLogger = new Logger({
      loggerCallback: () => { },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info, // Choose an appropriate log level
    });

    const useMsalMock = useMsal as jest.MockedFunction<typeof useMsal>;
    useMsalMock.mockReturnValue({
      inProgress: InteractionStatus.None,
      instance: mockInstance as IPublicClientApplication,
      accounts: [mockAccount],
      logger: mockLogger,
    });

    const useAuthorizeUserMock = useAuthorizeUser as jest.MockedFunction<typeof useAuthorizeUser>;
    useAuthorizeUserMock.mockReturnValue({
      azureToken: 'mockAzureToken',
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('renders header and site title', () => {
    render(<MainApp />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: appText.siteTitle })).toBeInTheDocument();
  });

  it('displays Callout when "Read More" link is clicked', () => {
    render(<MainApp />);
    const readMoreLink = screen.getByText(appText.readMoreButton);
    fireEvent.click(readMoreLink);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('I Understand')).toBeInTheDocument();
  });

  it('hides Callout when "I Understand" button is clicked', () => {
    render(<MainApp />);
    const readMoreLink = screen.getByText(appText.readMoreButton);
    fireEvent.click(readMoreLink);
    const iUnderstandButton = screen.getByText('I Understand');
    fireEvent.click(iUnderstandButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders Microsoft Privacy Statement link', () => {
    render(<MainApp />);
    const privacyLink = screen.getByText('Microsoft Privacy Statement');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', 'https://go.microsoft.com/fwlink/?LinkId=521839');
  });

  it('renders FilterBar when azureToken is available', () => {
    render(<MainApp />);
    expect(screen.getByLabelText('Main')).toBeInTheDocument();
  });

  it('reloads the page after 15 minutes of inactivity', () => {
    const reloadMock = reloadPage as jest.MockedFunction<typeof reloadPage>;

    render(<MainApp />);

    // Advance timers by 15 minutes. The page should reload.
    act(() => {
      vi.advanceTimersByTime(900000);
    });
    expect(reloadMock).toHaveBeenCalled();
  });

  it('resets idle timeout on user activity', () => {
    const reloadMock = reloadPage as jest.MockedFunction<typeof reloadPage>;

    render(<MainApp />);

    // Simulate key press and advance timer. The page should not reload.
    fireEvent.keyDown(document);
    act(() => {
      vi.advanceTimersByTime(500000);
    });
    expect(reloadMock).not.toHaveBeenCalled();

    // Simulate mouse move and advance timer. The page should not reload.
    fireEvent.mouseMove(document);
    act(() => {
      vi.advanceTimersByTime(500000);
    });
    expect(reloadMock).not.toHaveBeenCalled();

    // Simulate no user activity for 15 minutes. The page should reload.
    act(() => {
      vi.advanceTimersByTime(900000);
    });
    expect(reloadMock).toHaveBeenCalled();
  });
});

