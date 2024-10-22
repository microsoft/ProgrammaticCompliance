import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reloadPage } from './reloadPage';

describe('reloadPage', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        const location: Location = {
            ...window.location,
            reload: vi.fn(),
        };
        Object.defineProperty(window, 'location', {
            value: location,
            writable: true,
        });
    });

    afterEach(() => {
        window.location = originalLocation;
    });

    it('should call window.location.reload once', () => {
        reloadPage();
        expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
});
