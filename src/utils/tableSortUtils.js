import { sanitizeControlID, findLabelByValue } from './controlIdUtils';

export const sortRows = (items, framework) => {
    switch (framework) {
        case 'NIST_SP_800-53_R4':
            return sortNIST(items);
        case 'CIS_Azure_2.0.0':
            return sortCIS(items, sanitizeControlID);
        case 'PCI_DSS_v4.0':
            return sortPCI(items, sanitizeControlID);
        default:
            return items;
    }
}

export const groupAndSortRows = (sortedItems, isControlDescending, framework) => {
    switch (framework) {
        case 'NIST_SP_800-53_R4':
            return groupAndSortNIST(sortedItems, isControlDescending);
        case 'CIS_Azure_2.0.0':
            return groupAndSortCIS(sortedItems, isControlDescending, sanitizeControlID);
        case 'PCI_DSS_v4.0':
            return groupAndSortPCI(sortedItems, isControlDescending, sanitizeControlID);
        default:
            return sortedItems;
    }
}

const sortNIST = (items) => {
    let sortedItems = items.sort((a, b) => {
        const getNumericParts = (str) => str.match(/\d+/g).map(Number) || [0];

        const [alphaA, numsA] = [a.control.match(/[A-Za-z]+/)[0], getNumericParts(a.control)];
        const [alphaB, numsB] = [b.control.match(/[A-Za-z]+/)[0], getNumericParts(b.control)];

        for (let i = 0; i < Math.max(numsA.length, numsB.length); i++) {
            const diff = numsA[i] - numsB[i];
            if (diff !== 0) {
                return diff;
            }
        }
        return alphaA.localeCompare(alphaB);
    });
    return sortedItems;
};

const sortCIS = (items, sanitizeControlID) => {
    let sortedItems = items.sort((a, b) => {
        const partsA = sanitizeControlID(a.control).split('.').map(part => isNaN(part) ? part : parseInt(part, 10));
        const partsB = sanitizeControlID(b.control).split('.').map(part => isNaN(part) ? part : parseInt(part, 10));

        for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
            const partA = partsA[i] || 0;
            const partB = partsB[i] || 0;

            if (partA < partB) {
                return -1;
            } else if (partA > partB) {
                return 1;
            }
        }
        return sanitizeControlID(a.control).localeCompare(sanitizeControlID(b.control));
    });
    return sortedItems;
};

const sortPCI = (items, sanitizeControlID) => {
    let sortedItems = items.sort((a, b) => {
        const controlIDA = sanitizeControlID(a.control).split('.').map(part => parseInt(part, 10));
        const controlIDB = sanitizeControlID(b.control).split('.').map(part => parseInt(part, 10));

        for (let i = 0; i < Math.min(controlIDA.length, controlIDB.length); i++) {
            const numA = controlIDA[i];
            const numB = controlIDB[i];

            if (numA < numB) {
                return -1;
            } else if (numA > numB) {
                return 1;
            }
        }
        return controlIDA.length - controlIDB.length;
    });
    return sortedItems;
};

const groupAndSortNIST = (sortedItems, descending) => {
    const groupedItems = sortedItems.reduce((groups, item) => {
        const controlId = sanitizeControlID(item.control).split(/[(,:]/)[0].trim();
        if (!groups[controlId]) {
            groups[controlId] = [];
        }
        groups[controlId].push(item);
        return groups;
    }, {});

    const groupedArray = Object.keys(groupedItems).map((key) => ({
        key,
        name: key + ": " + findLabelByValue(key),
        startIndex: sortedItems.indexOf(groupedItems[key][0]),
        count: groupedItems[key].length,
        isCollapsed: false,
    }));

    groupedArray.sort((a, b) => {
        const [alphaA, numA] = [a.name.match(/[A-Za-z]+/)[0], parseInt(a.name.match(/\d+/)[0], 10)];
        const [alphaB, numB] = [b.name.match(/[A-Za-z]+/)[0], parseInt(b.name.match(/\d+/)[0], 10)];

        return alphaA !== alphaB ? alphaA.localeCompare(alphaB) : numA - numB;
    });

    if (descending) {
        groupedArray.reverse();
    }
    return groupedArray;
};

const groupAndSortCIS = (sortedItems, descending) => {
    const groupedItems = sortedItems.reduce((groups, item) => {
        const controlId = sanitizeControlID(item.control).trim();
        if (!groups[controlId]) {
            groups[controlId] = [];
        }
        groups[controlId].push(item);
        return groups;
    }, {});

    const groupedArray = Object.keys(groupedItems).map((key) => ({
        key,
        name: key,
        startIndex: sortedItems.indexOf(groupedItems[key][0]),
        count: groupedItems[key].length,
        isCollapsed: false,
        level: 0
    }));

    groupedArray.sort((a, b) => {
        const getNumericParts = (str) => str.match(/\d+/g).map(Number) || [0];

        const [alphaA, numsA] = [a.name.match(/[A-Za-z]+/)[0], getNumericParts(a.name)];
        const [alphaB, numsB] = [b.name.match(/[A-Za-z]+/)[0], getNumericParts(b.name)];

        for (let i = 0; i < Math.max(numsA.length, numsB.length); i++) {
            const diff = numsA[i] - numsB[i];
            if (diff !== 0) {
                return !descending ? diff : -diff;
            }
        }
        return alphaA.localeCompare(alphaB);
    });
    return groupedArray;
};

const groupAndSortPCI = (sortedItems, descending) => {
    const groupedItems = sortedItems.reduce((groups, item) => {
        const controlIdArray = sanitizeControlID(item.control).split('.');
        const controlId = controlIdArray.slice(0, 2).join('.');
        let groupHeaderText
        if (controlIdArray.length === 3) {
            groupHeaderText = `${controlId}: ${controlIdArray.slice(2).join('. ').substring(3)}`;
        } else {
            groupHeaderText = `${controlId}: ${controlIdArray.slice(2).join('. ').substring(6)}`;
        }

        if (!groups[controlId]) {
            groups[controlId] = {
                items: [],
                groupHeaderText,
            };
        }
        groups[controlId].items.push(item);
        return groups;
    }, {});

    const groupedArray = Object.keys(groupedItems).map((key) => ({
        key,
        name: groupedItems[key].groupHeaderText,
        startIndex: sortedItems.indexOf(groupedItems[key].items[0]),
        count: groupedItems[key].items.length,
        isCollapsed: false,
    }));

    groupedArray.sort((a, b) => {
        const controlIDA = sanitizeControlID(a.name).split('.').map(part => parseInt(part, 10));
        const controlIDB = sanitizeControlID(b.name).split('.').map(part => parseInt(part, 10));

        for (let i = 0; i < Math.min(controlIDA.length, controlIDB.length); i++) {
            const numA = controlIDA[i];
            const numB = controlIDB[i];

            return (!descending ? 1 : -1) * (numA - numB);
        }
        return controlIDA.length - controlIDB.length;
    });
    return groupedArray;
}

