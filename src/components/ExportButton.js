import React, { useEffect, useState } from "react";
import {
  DefaultButton,
  PrimaryButton,
  TextField,
  Checkbox,
  Panel,
  PanelType,
} from "@fluentui/react";

const addIcon = { iconName: "Add" };
const downloadIcon = { iconName: "Download" };

const ExportButton = ({
  services,
  policyTable,
  apiData,
  disabled,
  acfData,
  controlIDs,
  framework,
}) => {
  const [isPaneOpen, setIsPaneOpen] = useState(false);

  const sanitizeValue = (value) => {
    if (typeof value === "string") {
      value = value.replace(/(\r\n|\r|\n)/g, " ");
      if (value.includes(",")) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
    }
    return value;
  };

  const handleExportJSON = () => {
    if (apiData) {
      const jsonData = JSON.stringify(apiData, null, 2);
      let blob = new Blob([jsonData], { type: "application/json" });
      let url = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = "exportedMCSB.json";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    }
    const jsonAcf = JSON.stringify(acfData, null, 2);
    let blob = new Blob([jsonAcf], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "exportedACF.json";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (apiData) {
      let jsonData = apiData;
      if (typeof jsonData !== "object") {
        try {
          jsonData = JSON.parse(apiData);
        } catch (error) {
          console.error("Error parsing the data:", error);
          return;
        }
      }
      const mcsbCsv = mcsbToCsvExporter(jsonData);
      downloadCsv(mcsbCsv, "exportedData_MCSB.csv");
      const policyCsv = policyToCsvExporter(jsonData);
      downloadCsv(policyCsv, "exportedData_Policy.csv");
    }
    let acf = acfData;
    if (typeof acf !== "object") {
      try {
        acf = JSON.parse(acfData);
      } catch (error) {
        console.error("Error parsing the data:", error);
        return;
      }
    }
    const acfCsv = acfToCsvExporter(acf);
    if (hasMultipleRows(acfCsv)) {
      downloadCsv(acfCsv, "exportedData_ACF.csv");
    }
  };

  const hasMultipleRows = (csvData) => {
    const rows = csvData.split("\n");
    return rows.length > 1;
  };

  const downloadCsv = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const acfToCsvExporter = (data) => {
    const ACFcolumns = [
      "Standard",
      "ACF ID",
      "Control ID",
      "Microsoft Managed Actions - Description",
      "Microsoft Managed Actions - Details",
    ];
    let csvRows = [ACFcolumns.join(",")];
    for (const item of data) {
      let controlID;
      for (const mapping of item.properties.metadata
        .frameworkControlsMappings) {
        if (controlIDs.length === 0) {
          // there are not controls, export all with the framework
          if (mapping.contains(framework)) {
            controlID = mapping.split("_").pop();
          }
        } else {
          // there are controls, just export the ones with the control ID included
          if (controlIDs.includes(mapping.split("_").pop())) {
            controlID = mapping.split("_").pop() || "";
          }
        }
        const Standard = framework;
        const ACFID = sanitizeValue(item.name) || "";
        const description = sanitizeValue(item.properties.description) || "";
        const details = sanitizeValue(item.properties.requirements) || "";
        const values = [Standard, ACFID, controlID, description, details];
        if (controlID) {
          csvRows.push(values.join(","));
        }
      }
      csvRows = getUniqueRows(csvRows);
    }
    return csvRows.join("\n");
  };

  const getUniqueRows = (rows) => {
    const uniqueRows = [];
    for (const row of rows) {
      if (!uniqueRows.includes(row)) {
        uniqueRows.push(row);
      }
    }
    return uniqueRows;
  };

  const mcsbToCsvExporter = (data) => {
    const mcsbColumns = [
      "Control ID",
      "MCSB ID",
      "Service",
      "MCSB Feature",
      "Feature Supported",
      "Description",
      "Configuration Guidance",
      "Reference",
    ];
    let csvRows = [mcsbColumns.join(",")];
    for (const item of data) {
      const metadata = item.properties_metadata;
      metadata.frameworkControlsMappings.forEach((control) => {
        if (controlIDs.length === 0) {
          metadata.features.forEach((feature) => {
            const sanitizedValues = [
              control.split("_").pop(),
              metadata.mcsbId,
              metadata.offeringName,
              '"' + feature.featureName.replace(/"/g, '""') + '"',
              '"' + feature.featureSupport.replace(/"/g, '""') + '"',
              '"' + feature.featureDescription.replace(/"/g, '""') + '"',
              '"' + feature.featureGuidance.replace(/"/g, '""') + '"',
              '"' + feature.featureReference.replace(/"/g, '""') + '"',
            ];
            csvRows.push(sanitizedValues.join(","));
          });
        } else {
          if (controlIDs.includes(control.split("_").pop())) {
            metadata.features.forEach((feature) => {
              const sanitizedValues = [
                '"' + control.split("_").pop() + '"',
                metadata.mcsbId,
                metadata.offeringName,
                '"' + feature.featureName.replace(/"/g, '""') + '"',
                '"' + feature.featureSupport.replace(/"/g, '""') + '"',
                '"' + feature.featureDescription.replace(/"/g, '""') + '"',
                '"' + feature.featureGuidance.replace(/"/g, '""') + '"',
                '"' + feature.featureReference.replace(/"/g, '""') + '"',
              ];
              csvRows.push(sanitizedValues.join(","));
            });
          }
        }
      });
    }
    csvRows = getUniqueRows(csvRows);

    return csvRows.join("\n");
  };

  const policyToCsvExporter = (data) => {
    const policyColumns = [
      "Control ID",
      "Service",
      "Policy Name",
      "Policy Description",
    ];
    let csvRows = [policyColumns.join(",")];
    for (const item of data) {
      const metadata = item.properties_metadata;
      metadata.frameworkControlsMappings.forEach((control) => {
        if (controlIDs.length === 0) {
          metadata.automatedPolicyAvailability.forEach((policy) => {
            const sanitizedValues = [
              control.split("_").pop(),
              metadata.offeringName,
              '"' + policy.policyName + '"',
              '"' + policy.policyDescription + '"',
            ];
            csvRows.push(sanitizedValues.join(","));
          });
        } else {
          if (controlIDs.includes(control.split("_").pop())) {
            metadata.automatedPolicyAvailability.forEach((policy) => {
              const sanitizedValues = [
                control.split("_").pop(),
                metadata.offeringName,
                '"' + policy.policyName + '"',
                '"' + policy.policyDescription + '"',
              ];
              csvRows.push(sanitizedValues.join(","));
            });
          }
        }
      });
    }
    csvRows = getUniqueRows(csvRows);

    return csvRows.join("\n");
  };

  const handleExportInitiative = () => {
    setIsPaneOpen(true);
  };

  const closePane = () => {
    setIsPaneOpen(false);
  };

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <DefaultButton text="Download" primary iconProps={downloadIcon} />
      </div>
    ),
    [closePane]
  );

  const Pane = () => (
    <div>
      <Panel
        headerText="Export Custom Initiative"
        // this prop makes the panel non-modal
        type={PanelType.extraLarge}
        isOpen={isPaneOpen}
        onDismiss={closePane}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
        isLightDismiss
      >
        <p>
          Select policies to export using the checkboxes below or the individual
          table row selectors for more fine-grained control.
        </p>
        <Checkbox label="Manual Policies" />
        <p></p>
        <Checkbox label="Automated Policies" />
        <br />
        {policyTable}
        <TextField
          label="Initiative filename"
          placeholder="e.g. AKS_Manual_Initiative.json"
          required
        />
        <br />
        <br />
      </Panel>
    </div>
  );

  const menuProps = {
    items: [
      {
        key: "json",
        text: "JSON",
        iconProps: { iconName: "Embed" },
        onClick: handleExportJSON,
      },
      {
        key: "csv",
        text: "CSV",
        iconProps: { iconName: "GridViewSmall" },
        onClick: handleExportCSV,
      },
      // {
      //     key: 'initiative',
      //     text: 'Custom Initiative',
      //     iconProps: { iconName: 'CustomList' },
      //     onClick: handleExportInitiative,
      //     disabled: services.length == 0 || controlIDs.length > 0 // only allows exporting to initiative if services are selected without controls
      // },
    ],
  };

  return (
    <>
      <DefaultButton
        text="Export"
        primary
        iconProps={addIcon}
        menuProps={menuProps}
        disabled={disabled}
      />
      {isPaneOpen && <Pane />}
    </>
  );
};

export default ExportButton;
