import { mergeStyleSets } from '@fluentui/react';

export const gridStyles = {
    width: '100%',
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        height: '100%',
    },
    headerWrapper: {
        flex: '0 0 auto',
    },
    contentWrapper: {
        flex: '1 1 auto',
    },
};

export const classNames = mergeStyleSets({
    header: {
        margin: 15,
        width: '100%',
    },
    focusZone: {
        maxHeight: '45vh',
        overflowY: 'scroll',
        width: '100%',
    },
    selectionZone: {
        maxHeight: '45vh',
        width: '100%',
        overflow: 'hidden',
    },
    scrollable: {
        overflowX: 'auto', // Add horizontal scrollbar
    },
});

export const focusZoneProps = {
    className: classNames.focusZone,
    'data-is-scrollable': 'true',
};