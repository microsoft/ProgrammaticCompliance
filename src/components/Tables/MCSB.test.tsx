import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tableText } from '../../static/staticStrings';
import MCSB from './MCSB';

describe('MCSB Component', () => {
    const mockData = [
        {
            properties_metadata: {
                mcsbId: 'MCSB1',
                offeringName: 'Azure Service 1',
                frameworkControlsMappings: ['PCI_DSS_v4.0_1.1.1', 'PCI_DSS_v4.0_2.1.1'],
                features: [
                    {
                        featureName: 'Feature 1',
                        customerActionsDescription: 'Action Description 1',
                        featureSupport: 'Supported',
                        enabledByDefault: 'Yes',
                        featureDescription: 'Feature Description 1',
                        featureGuidance: 'Guidance 1',
                        featureReference: 'https://example.com/feature1',
                    },
                ],
            },
        },
        {
            properties_metadata: {
                mcsbId: 'MCSB2',
                offeringName: 'Azure Service 2',
                frameworkControlsMappings: ['PCI_DSS_v4.0_3.1.1'],
                features: [
                    {
                        featureName: 'Feature 2',
                        customerActionsDescription: 'Action Description 2',
                        featureSupport: 'Not Supported',
                        enabledByDefault: 'No',
                        featureDescription: 'Feature Description 2',
                        featureGuidance: 'Guidance 2',
                        featureReference: 'Not Applicable',
                    },
                ],
            },
        },
    ];

    const mockProps = {
        controls: ['1.1.1', '2.1.1', '3.1.1'],
        data: mockData,
        framework: 'PCI_DSS_v4.0',
        mapState: new Map([
            ['1.1.1', 'Control 1'],
            ['2.1.1', 'Control 2'],
            ['3.1.1', 'Control 3'],
        ]),
    };

    it('renders without crashing', () => {
        render(<MCSB {...mockProps} />);
    });

    it('displays the correct title and description', () => {
        render(<MCSB {...mockProps} />);
        expect(screen.getByText(tableText.mcsbTitle)).toBeInTheDocument();
        expect(screen.getByText(tableText.mcsbDescription)).toBeInTheDocument();
    });

    it('expands and collapses the table', () => {
        render(<MCSB {...mockProps} />);
        const button = screen.getByRole('button', { name: /Collapse table/i });
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-label', 'Expand table');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-label', 'Collapse table');
    });

    it('opens and closes the modal', async () => {
        render(<MCSB {...mockProps} />);

        const expandIcon = screen.getAllByLabelText('Expand fullscreen')[0];
        fireEvent.click(expandIcon);
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();

        const dialogContainer = within(dialog).getByRole('document');
        expect(dialogContainer).toBeInTheDocument();
        const closeButton = within(dialogContainer).getByRole('button', { name: /Close/i });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('displays empty state when no data is available', () => {
        render(<MCSB {...mockProps} data={[]} />);
        expect(screen.getByText('No results')).toBeInTheDocument();
    });
});
