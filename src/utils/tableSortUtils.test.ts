import { describe, it, expect } from 'vitest';
import { sortRows } from './tableSortUtils';


describe('tableSortUtils', () => {
    describe('sortRows', () => {
        it("correctly sorts for NIST_SP_800-53_Rev4 (basic)", () => {
            const framework = "NIST_SP_800-53_Rev4";

            const items = [
                { control: 'AC-1: Policy' }, 
                { control: 'AC-3: Policy' }, 
                { control: 'AC-2: Policy' }
            ];

            const expectedSortedItems = [
                { control: 'AC-1: Policy' },
                { control: 'AC-2: Policy' },
                { control: 'AC-3: Policy' }
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        it("correctly sorts for NIST_SP_800-53_Rev4 (complex)", () => {
            const framework = "NIST_SP_800-53_Rev4";

            const items = [
                { control: 'AC-10: Access Control' },
                { control: 'AC-2: Account Management' },
                { control: 'AC-1: Policy' },
                { control: 'AC-5: Privilege Management' }
              ];

            const expectedSortedItems = [
                { control: 'AC-1: Policy' },
                { control: 'AC-2: Account Management' },
                { control: 'AC-5: Privilege Management' },
                { control: 'AC-10: Access Control' },
            ]

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });
    });
});