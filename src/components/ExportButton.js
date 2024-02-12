import React from 'react';
import { DefaultButton } from '@fluentui/react';

const addIcon = { iconName: 'Add'};

const ExportButton = ({ apiData, disabled }) => {
    const sanitizeValue = (value) => {
        if (typeof value === 'string') {
            value = value.replace(/(\r\n|\r|\n)/g, ' ');
            if (value.includes(',')) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
        }
        return value;
    };

    const handleExportJSON = () => {
        const jsonData = JSON.stringify(apiData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exportedData.json';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportCSV = () => {
        let jsonData = apiData;
        if (typeof jsonData !== 'object') {
            try {
                jsonData = JSON.parse(apiData);
            } catch (error) {
                console.error('Error parsing the data:', error);
                return;
            }
        }
        const acfCsv = acfToCsvExporter(jsonData);
        if (hasMultipleRows(acfCsv)) {
            downloadCsv(acfCsv, 'exportedData_ACF.csv');
        }
        const mcsbCsv = mcsbToCsvExporter(jsonData);
        if (hasMultipleRows(mcsbCsv)) {
            downloadCsv(mcsbCsv, 'exportedData_MCSB.csv');
        }
        const policyCsv = policyToCsvExporter(jsonData);
        if (hasMultipleRows(policyCsv)) {
            downloadCsv(policyCsv, 'exportedData_Policy.csv');
        }
    };

    const hasMultipleRows = (csvData) => {
        const rows = csvData.split('\n');
        return rows.length > 1;
    };

    const downloadCsv = (csvData, fileName) => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    };

    const acfToCsvExporter = (data) => {
        const ACFcolumns = ["Standard", "ACF ID", "Control ID", "Microsoft Managed Actions - Description", "Microsoft Managed Actions - Details"];
        const csvRows = [ACFcolumns.join(',')];
        for (const item of data) {
            for (const control of item["Standard Controls"]) {
                for (const baseline of control["ACF Baseline"]) {
                    const controlID = sanitizeValue(control["Standard Control ID"]) || '';
                    const controlName = sanitizeValue(control["Standard Control Name"]) || '';
                    const ACFID = sanitizeValue(baseline["ACF ID"]) || '';
                    const description = sanitizeValue(baseline["Microsoft Managed Actions - Description"]) || '';
                    const details = sanitizeValue(baseline["Microsoft Managed Actions - Details"]) || '';
                    const values = [
                        sanitizeValue(item["Standard Name"]) || '',
                        ACFID,
                        `${controlID}: ${controlName}`,
                        description,
                        details
                    ];
                    csvRows.push(values.join(','));
                }
            }
        }
        return csvRows.join('\n');
    };

    const mcsbToCsvExporter = (data) => {
        const mcsbColumns = ["Control ID", "MCSB ID", "Service", "MCSB Feature", "Feature Supported", "Description", "Configuration Guidance", "Reference"];
        const csvRows = [mcsbColumns.join(',')];
        for (const item of data) {
            for (const control of item["Standard Controls"]) {
                for (const baseline of control["MCSB Baseline"]) {
                    const controlID = sanitizeValue(control["Standard Control ID"]) || '';
                    const controlName = sanitizeValue(control["Standard Control Name"]) || '';
                    const mcsbId = sanitizeValue(baseline["MCSB ID"]) || '';
                    for (const feature of baseline["Features"]) {
                        const values = [
                            `${controlID}: ${controlName}`,
                            mcsbId,
                            sanitizeValue(item["Service Name"]) || '',
                            sanitizeValue(feature["Feature Name"]) || '',
                            sanitizeValue(feature["Feature Support"]) || '',
                            sanitizeValue(feature["Feature Description"]) || '',
                            sanitizeValue(feature["Feature Guidance"]) || '',
                            sanitizeValue(feature["Feature Reference"]) || '',
                        ];
                        csvRows.push(values.join(','));
                    }
                }
            }
        }
        return csvRows.join('\n');
    };

    const policyToCsvExporter = (data) => {
        const policyColumns = ["Control ID", "Service", "Policy Name", "Policy Description"];
        const csvRows = [policyColumns.join(',')];
        for (const item of data) {
            for (const control of item["Standard Controls"]) {
                for (const baseline of control["MCSB Baseline"]) {
                    const controlID = sanitizeValue(control["Standard Control ID"]) || '';
                    const controlName = sanitizeValue(control["Standard Control Name"]) || '';
                    const values = [
                        `${controlID}: ${controlName}`,
                        sanitizeValue(item["Service Name"]) || '',
                    ];
                    if (baseline['Automated Policy Availability'].length > 0) {
                        baseline['Automated Policy Availability'].forEach((policy) => {
                            const policyValues = [
                                sanitizeValue(policy['Policy Name']),
                                sanitizeValue(policy['Policy Description']),
                            ];
                            csvRows.push([...values, ...policyValues].join(','));
                        });
                    }
                }
            }
        }
        return csvRows.join('\n');
    };

    const menuProps = {
        items: [
            {
                key: 'json',
                text: 'JSON',
                iconProps: { iconName: 'Embed' },
                onClick: handleExportJSON,
            },
            {
                key: 'csv',
                text: 'CSV',
                iconProps: { iconName: 'GridViewSmall' },
                onClick: handleExportCSV,
            },
        ],
    };

    return (
        <DefaultButton
            text="Export"
            primary
            iconProps={addIcon}
            menuProps={menuProps}
            disabled={disabled}
        />
    );
}

export default ExportButton;
