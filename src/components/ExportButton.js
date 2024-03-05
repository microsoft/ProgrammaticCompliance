import React from 'react';
import { DefaultButton } from '@fluentui/react';

const addIcon = { iconName: 'Add' };

const ExportButton = ({ apiData, disabled, acfData, controlIDs }) => {
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
        let acf = acfData;
        if (typeof acf !== 'object') {
            try {
                acf = JSON.parse(acfData);
            } catch (error) {
                console.error('Error parsing the data:', error);
                return;
            }
        }
        const acfCsv = acfToCsvExporter(acf);
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
            const controlID = item.ControlID.split("_").pop() || '';
            // const controlName = sanitizeValue(control["Standard Control Name"]) || '';
            const ACFID = sanitizeValue(item.AzureControlFrameworkID) || '';
            const description = sanitizeValue(item.MicrosoftManagedActionsDescription) || '';
            const details = sanitizeValue(item.MicrosoftManagedActionsDetails) || '';
            const values = [
                sanitizeValue(item.ControlID.lastIndexOf("_") !== -1 ? item.ControlID.slice(0, item.ControlID.lastIndexOf("_")) : item.ControlID) || '',
                ACFID,
                controlID,
                description,
                details
            ];
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    };

    const mcsbToCsvExporter = (data) => {
        const mcsbColumns = ["Control ID", "MCSB ID", "Service", "MCSB Feature", "Feature Supported", "Description", "Configuration Guidance", "Reference"];
        const csvRows = [mcsbColumns.join(',')];
        for (const item of data) {
            const metadata = item.properties_metadata
            metadata.mcsb.frameworkControls.forEach((control) => {
                controlIDs.forEach((value) => {
                    if (control.includes(value)) {
                        metadata.mcsb.features.forEach((feature) => {
                            const values = [
                                control.split("_").pop(),
                                metadata.mcsb.mcsbId,
                                metadata.offeringName,
                                feature.featureName,
                                feature.featureSupport,
                                feature.featureDescription,
                                feature.featureGuidance,
                                feature.featureReference
                            ];
                            csvRows.push(values.join(','));
                        })
                    }
                })
            })
        }
        return csvRows.join('\n');
    };

    const policyToCsvExporter = (data) => {
        const policyColumns = ["Control ID", "Service", "Policy Name", "Policy Description"];
        const csvRows = [policyColumns.join(',')];
        for (const item of data) {
            const metadata = item.properties_metadata
            metadata.mcsb.frameworkControls.forEach((control) => {
                controlIDs.forEach((value) => {
                    if (control.includes(value)) {
                        metadata.mcsb.automatedPolicyAvailability.forEach((policy) => {
                            const values = [
                                control.split("_").pop(),
                                metadata.offeringName,
                                policy.policyName,
                                policy.policyDescription
                            ];
                            csvRows.push(values.join(','));
                        })
                    }
                })
            })
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
