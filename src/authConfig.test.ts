import { describe, it, expect, vi } from 'vitest';
const { msalConfig, tokenConfig } = await import('./authConfig');
import { LogLevel } from '@azure/msal-browser';

const mockClientId = 'mock-client-id';
const mockTenantId = 'mock-tenant-id';
const mockWebAppUrl = 'http://example.com';

describe('msalConfig', () => {
  it('should have the correct auth', async () => {
    expect(msalConfig.auth.clientId).toBe(mockClientId);
    expect(msalConfig.auth.authority).toBe(`https://login.microsoftonline.com/${mockTenantId}`);
    expect(msalConfig.auth.redirectUri).toBe(mockWebAppUrl);
  });

  it('should have correct cache', async () => {
    expect(msalConfig.cache?.cacheLocation).toBe('sessionStorage');
    expect(msalConfig.cache?.storeAuthStateInCookie).toBe(false);
  });
});

describe('msalConfig.system.loggerOptions.loggerCallback', () => {
  it('should log errors using console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const loggerCallback = msalConfig.system?.loggerOptions?.loggerCallback;
    
    const level = LogLevel.Error;
    const message = 'Error message';
    const containsPii = false;

    if (loggerCallback) {
      loggerCallback(level, message, containsPii);
    }

    expect(spy).toHaveBeenCalledWith(message);
    spy.mockRestore();
  });

  it('should log info using console.info', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const loggerCallback = msalConfig.system?.loggerOptions?.loggerCallback;
    
    const level = LogLevel.Info;
    const message = 'Info message';
    const containsPii = false;

    if (loggerCallback) {
      loggerCallback(level, message, containsPii);
    }

    expect(spy).toHaveBeenCalledWith(message);
    spy.mockRestore(); 
  });

  it('should log verbose using console.debug', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const loggerCallback = msalConfig.system?.loggerOptions?.loggerCallback;
    
    const level = LogLevel.Verbose;
    const message = 'Verbose message';
    const containsPii = false;

    if (loggerCallback) {
      loggerCallback(level, message, containsPii);
    }

    expect(spy).toHaveBeenCalledWith(message);
    spy.mockRestore(); // Clean up
  });

  it('should log warnings using console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const loggerCallback = msalConfig.system?.loggerOptions?.loggerCallback;
    
    const level = LogLevel.Warning;
    const message = 'Warning message';
    const containsPii = false;

    if (loggerCallback) {
      loggerCallback(level, message, containsPii);
    }

    expect(spy).toHaveBeenCalledWith(message);
    spy.mockRestore(); // Clean up
  });

  it('should not log when containsPii is true', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const loggerCallback = msalConfig.system?.loggerOptions?.loggerCallback;
    
    const level = LogLevel.Error;
    const message = 'Message with PII';
    const containsPii = true;

    if (loggerCallback) {
      loggerCallback(level, message, containsPii);
    }

    expect(errorSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(debugSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();

    // Clean up spies
    errorSpy.mockRestore();
    infoSpy.mockRestore();
    debugSpy.mockRestore();
    warnSpy.mockRestore();
  });
});


describe('tokenConfig', () => {
  it('should have the correct managementEndpoint', async () => {
    expect(tokenConfig.managementEndpoint).toBe('https://management.azure.com/.default');
  });
});
