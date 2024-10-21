/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reloadPage } from './reloadPage';

describe('reloadPage', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        delete (window as any).location;
        (window as any).location = {
            reload: vi.fn(),
        };
    });

    afterEach(() => {
        window.location = originalLocation;
    });

    it('should call window.location.reload once', () => {
        reloadPage();
        expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
});
