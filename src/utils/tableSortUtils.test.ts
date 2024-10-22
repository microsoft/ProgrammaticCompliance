import { describe, it, expect, vi } from 'vitest';
import { sortRows, groupAndSortRows } from './tableSortUtils';

// Mocking sanitizeControlID from controlIdUtils
vi.mock('./controlIdUtils', () => ({
    sanitizeControlID: (controlID: string) => controlID.trim(),
}));

describe('tableSortUtils', () => {
    describe('sortRows', () => {
        // Existing tests for NIST_SP_800-53_Rev4 and NIST_SP_800-53_R4
        it('correctly sorts for NIST_SP_800-53_Rev4 (basic)', () => {
            const framework = 'NIST_SP_800-53_Rev4';

            const items = [
                { control: 'AC-1: Policy' },
                { control: 'AC-3: Policy' },
                { control: 'AC-2: Policy' },
            ];

            const expectedSortedItems = [
                { control: 'AC-1: Policy' },
                { control: 'AC-2: Policy' },
                { control: 'AC-3: Policy' },
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        it('correctly sorts for NIST_SP_800-53_Rev4 (complex)', () => {
            const framework = 'NIST_SP_800-53_Rev4';

            const items = [
                { control: 'AC-10: Access Control' },
                { control: 'AC-2: Account Management' },
                { control: 'AC-1: Policy' },
                { control: 'AC-5: Privilege Management' },
            ];

            const expectedSortedItems = [
                { control: 'AC-1: Policy' },
                { control: 'AC-2: Account Management' },
                { control: 'AC-5: Privilege Management' },
                { control: 'AC-10: Access Control' },
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        // Tests for CIS_Azure_Benchmark_v2.0
        it('correctly sorts for CIS_Azure_Benchmark_v2.0 (basic)', () => {
            const framework = 'CIS_Azure_Benchmark_v2.0';

            const items = [
                { control: '1.2' },
                { control: '1.10' },
                { control: '1.1' },
                { control: '2.1' },
                { control: '1.9' },
                { control: '1.11' },
            ];

            const expectedSortedItems = [
                { control: '1.1' },
                { control: '1.2' },
                { control: '1.9' },
                { control: '1.10' },
                { control: '1.11' },
                { control: '2.1' },
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        it('correctly sorts for CIS_Azure_Benchmark_v2.0 (complex)', () => {
            const framework = 'CIS_Azure_Benchmark_v2.0';

            const items = [
                { control: '1.1' },
                { control: '1.2' },
                { control: '1.2.1' },
                { control: '1.2.10' },
                { control: '1.2.2' },
                { control: '1.10' },
                { control: '1.9' },
                { control: '2.1' },
            ];

            const expectedSortedItems = [
                { control: '1.1' },
                { control: '1.2' },
                { control: '1.2.1' },
                { control: '1.2.2' },
                { control: '1.2.10' },
                { control: '1.9' },
                { control: '1.10' },
                { control: '2.1' },
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        // Tests for PCI_DSS_v4.0
        it('correctly sorts for PCI_DSS_v4.0 (basic)', () => {
            const framework = 'PCI_DSS_v4.0';

            const items = [
                { control: '1.2.1' },
                { control: '1.10' },
                { control: '1.1' },
                { control: '2.1' },
                { control: '1.9' },
                { control: '1.2' },
            ];

            const expectedSortedItems = [
                { control: '1.1' },
                { control: '1.2' },
                { control: '1.2.1' },
                { control: '1.9' },
                { control: '1.10' },
                { control: '2.1' },
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        it('correctly sorts for PCI_DSS_v4.0 (complex)', () => {
            const framework = 'PCI_DSS_v4.0';

            const items = [
                { control: '3.1.2' },
                { control: '3.1.10' },
                { control: '3.1.1' },
                { control: '3.1.9' },
                { control: '3.2' },
                { control: '3.10' },
            ];

            const expectedSortedItems = [
                { control: '3.1.1' },
                { control: '3.1.2' },
                { control: '3.1.9' },
                { control: '3.1.10' },
                { control: '3.2' },
                { control: '3.10' },
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        // Tests for ISO 27001:2013
        it('correctly sorts for ISO 27001:2013 (basic)', () => {
            const framework = 'ISO 27001:2013';

            const items = [
                { control: 'A.1.2' },
                { control: 'A.1.10' },
                { control: 'A.1.1' },
                { control: 'A.2.1' },
                { control: 'A.1.9' },
                { control: 'A.1.11' },
            ];

            const expectedSortedItems = [
                { control: 'A.1.1' },
                { control: 'A.1.2' },
                { control: 'A.1.9' },
                { control: 'A.1.10' },
                { control: 'A.1.11' },
                { control: 'A.2.1' },
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        // Tests for SOC 2 Type 2
        it('correctly sorts for SOC 2 Type 2 (basic)', () => {
            const framework = 'SOC 2 Type 2';

            const items = [
                { control: 'CC1.1' },
                { control: 'CC1.10' },
                { control: 'CC1.2' },
                { control: 'CC1.9' },
                { control: 'CC2.1' },
                { control: 'CC1.11' },
            ];

            const expectedSortedItems = [
                { control: 'CC1.1' },
                { control: 'CC1.2' },
                { control: 'CC1.9' },
                { control: 'CC1.10' },
                { control: 'CC1.11' },
                { control: 'CC2.1' },
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        // Test for default case
        it('returns items as-is for unknown framework', () => {
            const framework = 'Unknown_Framework';

            const items = [
                { control: 'B-3' },
                { control: 'A-1' },
                { control: 'C-2' },
            ];

            const expectedSortedItems = [
                { control: 'B-3' },
                { control: 'A-1' },
                { control: 'C-2' },
            ];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual(expectedSortedItems);
        });

        it('handles empty items array', () => {
            const framework = 'NIST_SP_800-53_Rev4';
            const items: string[] = [];

            const sortedItems = sortRows(items, framework);

            expect(sortedItems).toEqual([]);
        });
    });

    describe('groupAndSortRows', () => {
        it('correctly groups and sorts for NIST_SP_800-53_Rev4', () => {
            const framework = 'NIST_SP_800-53_Rev4';
            const isDescending = false;

            const sortedItems = [
                { control: 'AC-1: Policy' },
                { control: 'AC-2: Account Management' },
                { control: 'AC-3: Privilege Management' },
                { control: 'AC-4: Access Control' },
            ];

            const expectedGroups = [
                {
                    key: 'AC-1: Policy',
                    name: 'AC-1: Policy',
                    startIndex: 0,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'AC-2: Account Management',
                    name: 'AC-2: Account Management',
                    startIndex: 1,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'AC-3: Privilege Management',
                    name: 'AC-3: Privilege Management',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'AC-4: Access Control',
                    name: 'AC-4: Access Control',
                    startIndex: 3,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for NIST_SP_800-53_R4', () => {
            const framework = 'NIST_SP_800-53_Rev4';
            const isDescending = false;

            const sortedItems = [
                { control: 'AC-1: Policy' },
                { control: 'AC-2: Account Management' },
                { control: 'AC-3: Privilege Management' },
                { control: 'AC-4: Access Control' },
            ];

            const expectedGroups = [
                {
                    key: 'AC-1: Policy',
                    name: 'AC-1: Policy',
                    startIndex: 0,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'AC-2: Account Management',
                    name: 'AC-2: Account Management',
                    startIndex: 1,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'AC-3: Privilege Management',
                    name: 'AC-3: Privilege Management',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'AC-4: Access Control',
                    name: 'AC-4: Access Control',
                    startIndex: 3,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for CIS_Azure_Benchmark_v2.0', () => {
            const framework = 'CIS_Azure_Benchmark_v2.0';
            const isDescending = false;

            const sortedItems = [
                { control: '1.1.1' },
                { control: '1.1.2' },
                { control: '1.2.1' },
                { control: '1.2.2' },
            ];

            const expectedGroups = [
                {
                    key: '1.1.1',
                    name: '1.1.1',
                    startIndex: 0,
                    count: 1,
                    isCollapsed: false,
                    level: 0,
                },
                {
                    key: '1.1.2',
                    name: '1.1.2',
                    startIndex: 1,
                    count: 1,
                    isCollapsed: false,
                    level: 0,
                },
                {
                    key: '1.2.1',
                    name: '1.2.1',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                    level: 0,
                },
                {
                    key: '1.2.2',
                    name: '1.2.2',
                    startIndex: 3,
                    count: 1,
                    isCollapsed: false,
                    level: 0,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for PCI_DSS_v4.0', () => {
            const framework = 'PCI_DSS_v4.0';
            const isDescending = false;

            const sortedItems = [
                { control: '1.1.1' },
                { control: '1.1.2' },
                { control: '1.2' },
                { control: '1.2.1' },
                { control: '2.1' },
            ];

            const expectedGroups = [
                {
                    key: '1.1',
                    name: '1.1: ',
                    startIndex: 0,
                    count: 2,
                    isCollapsed: false,
                },
                {
                    key: '1.2',
                    name: '1.2: ',
                    startIndex: 2,
                    count: 2,
                    isCollapsed: false,
                },
                {
                    key: '2.1',
                    name: '2.1: ',
                    startIndex: 4,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for ISO 27001:2013', () => {
            const framework = 'ISO 27001:2013';
            const isDescending = false;

            const sortedItems = [
                { control: 'A.1.1' },
                { control: 'A.1.2' },
                { control: 'A.2.1' },
                { control: 'A.2.2' },
            ];

            const expectedGroups = [
                {
                    key: 'A.1.1',
                    name: 'A.1.1',
                    startIndex: 0,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'A.1.2',
                    name: 'A.1.2',
                    startIndex: 1,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'A.2.1',
                    name: 'A.2.1',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'A.2.2',
                    name: 'A.2.2',
                    startIndex: 3,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for SOC 2 Type 2', () => {
            const framework = 'SOC 2 Type 2';
            const isDescending = false;

            const sortedItems = [
                { control: 'CC1.1' },
                { control: 'CC1.2' },
                { control: 'CC2.1' },
            ];

            const expectedGroups = [
                {
                    key: 'CC1.1',
                    name: 'CC1.1',
                    startIndex: 0,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'CC1.2',
                    name: 'CC1.2',
                    startIndex: 1,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'CC2.1',
                    name: 'CC2.1',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for ACF_Table', () => {
            const framework = 'ACF_Table';
            const isDescending = false;

            const sortedItems = [
                { acfID: 'ACF1', control: 'Control1' },
                { acfID: 'ACF1', control: 'Control2' },
                { acfID: 'ACF2', control: 'Control3' },
            ];

            const expectedGroups = [
                {
                    key: 'ACF1',
                    name: 'ACF1',
                    startIndex: 0,
                    count: 2,
                    isCollapsed: false,
                },
                {
                    key: 'ACF2',
                    name: 'ACF2',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for default framework (MCSB)', () => {
            const framework = 'Unknown_Framework';
            const isDescending = false;

            const sortedItems = [
                { mcsbID: 'MCSB1', control: 'Control1' },
                { mcsbID: 'MCSB1', control: 'Control2' },
                { mcsbID: 'MCSB2', control: 'Control3' },
            ];

            const expectedGroups = [
                {
                    key: 'MCSB1',
                    name: 'MCSB1',
                    startIndex: 0,
                    count: 2,
                    isCollapsed: false,
                },
                {
                    key: 'MCSB2',
                    name: 'MCSB2',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('handles empty sortedItems array', () => {
            const framework = 'NIST_SP_800-53_Rev4';
            const isDescending = false;
            const sortedItems: string[] = [];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual([]);
        });

        it('correctly groups and sorts for ISO 27001:2013 in descending order', () => {
            const framework = 'ISO 27001:2013';
            const isDescending = true;

            const sortedItems = [
                { control: 'A.1.1' },
                { control: 'A.1.2' },
                { control: 'A.2.1' },
                { control: 'A.2.2' },
            ];

            const expectedGroups = [
                {
                    key: 'A.2.2',
                    name: 'A.2.2',
                    startIndex: 3,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'A.2.1',
                    name: 'A.2.1',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'A.1.2',
                    name: 'A.1.2',
                    startIndex: 1,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'A.1.1',
                    name: 'A.1.1',
                    startIndex: 0,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for SOC 2 Type 2 in descending order', () => {
            const framework = 'SOC 2 Type 2';
            const isDescending = true;

            const sortedItems = [
                { control: 'CC1.1' },
                { control: 'CC1.2' },
                { control: 'CC2.1' },
            ];

            const expectedGroups = [
                {
                    key: 'CC2.1',
                    name: 'CC2.1',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'CC1.2',
                    name: 'CC1.2',
                    startIndex: 1,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'CC1.1',
                    name: 'CC1.1',
                    startIndex: 0,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for ACF_Table in descending order', () => {
            const framework = 'ACF_Table';
            const isDescending = true;

            const sortedItems = [
                { acfID: 'ACF1', control: 'Control1' },
                { acfID: 'ACF1', control: 'Control2' },
                { acfID: 'ACF2', control: 'Control3' },
                { acfID: 'ACF3', control: 'Control4' },
            ];

            const expectedGroups = [
                {
                    key: 'ACF3',
                    name: 'ACF3',
                    startIndex: 3,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'ACF2',
                    name: 'ACF2',
                    startIndex: 2,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'ACF1',
                    name: 'ACF1',
                    startIndex: 0,
                    count: 2,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });

        it('correctly groups and sorts for default framework (MCSB) in descending order', () => {
            const framework = 'Unknown_Framework';
            const isDescending = true;

            const sortedItems = [
                { mcsbID: 'MCSB1', control: 'Control1' },
                { mcsbID: 'MCSB2', control: 'Control2' },
                { mcsbID: 'MCSB2', control: 'Control3' },
                { mcsbID: 'MCSB3', control: 'Control4' },
            ];

            const expectedGroups = [
                {
                    key: 'MCSB3',
                    name: 'MCSB3',
                    startIndex: 3,
                    count: 1,
                    isCollapsed: false,
                },
                {
                    key: 'MCSB2',
                    name: 'MCSB2',
                    startIndex: 1,
                    count: 2,
                    isCollapsed: false,
                },
                {
                    key: 'MCSB1',
                    name: 'MCSB1',
                    startIndex: 0,
                    count: 1,
                    isCollapsed: false,
                },
            ];

            const groups = groupAndSortRows(sortedItems, isDescending, framework);

            expect(groups).toEqual(expectedGroups);
        });
    });
});
