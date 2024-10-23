import {
  customSort,
  isoSort,
  numberSort,
  sanitizeControlID,
} from "../../utils/filterUtils";

interface ControlDomainData {
  ControlID: string;
  ControlDomain: string;
}

interface Metadata {
  metadataId: string;
  title: string;
}

interface Item {
  properties: Metadata;
}

interface Domain {
  key: string;
  text: string;
}

const Frameworks = {
  NISTSP80053R4: {
    getUniqueDomains: (data: ControlDomainData[]): Domain[] => {
      const domainMap = new Map<string, string>();
      data.forEach((item) => {
        const controlID = item.ControlID.split("_").pop()?.split("-")[0] || "";
        const key = controlID;
        const text = `${controlID}: ${item.ControlDomain}`;
        if (!domainMap.has(key)) {
          domainMap.set(key, text);
        }
      });
      return Array.from(domainMap.values()).map((text) => ({
        key: text.split(": ")[0],
        text,
      }));
    },
    getControlIDForControls: (item: Item): string => {
      const controlID = item.properties.metadataId.replace(/\([^()]*\)/g, "");
      return controlID.trim().split(" ").pop() || "";
    },
    sanitizeControlIDForControls: (controlID: string): string => {
      return sanitizeControlID(controlID);
    },
    getCurrentMap: (data: Item[]): Map<string, string> => {
      const currentMap = new Map<string, string>();
      data.forEach((item) => {
        if (!item.properties.metadataId.includes("(")) {
          let controlID = item.properties.metadataId.replace(/\([^()]*\)/g, "");
          controlID = controlID.trim().split(" ").pop() || "";
          controlID = sanitizeControlID(controlID);
          currentMap.set(controlID, item.properties.title);
        }
      });
      return currentMap;
    },
    sortControlIDs: (currentControls: Domain[]): Domain[] => {
      return currentControls.sort((a, b) => customSort(a.key, b.key));
    },
  },
  CISAzure2: {
    getUniqueDomains: (data: ControlDomainData[]): Domain[] => {
      const domainMap = new Map<string, string>();
      data.forEach((item) => {
        const key = item.ControlDomain.split(" ")[0];
        const text = `${key}: ${item.ControlDomain.substring(item.ControlDomain.indexOf(" ") + 1)}`;
        if (!domainMap.has(key)) {
          domainMap.set(key, text);
        }
      });
      return Array.from(domainMap.values()).map((text) => ({
        key: text.split(": ")[0],
        text,
      }));
    },
    getControlIDForControls: (item: Item): string => {
      return item.properties.metadataId.split(" ").pop()?.trim() || "";
    },
    sanitizeControlIDForControls: (controlID: string): string => {
      return controlID;
    },
    getCurrentMap: (data: Item[]): Map<string, string> => {
      const currentMap = new Map<string, string>();
      data.forEach((item) => {
        const controlID = item.properties.metadataId.split(" ").pop()?.trim() || "";
        currentMap.set(controlID, item.properties.title);
      });
      return currentMap;
    },
    sortControlIDs: (currentControls: Domain[]): Domain[] => {
      return currentControls.sort((a, b) => numberSort(a.key, b.key));
    },
  },
  PCIDSSv4: {
    getUniqueDomains: (data: ControlDomainData[]): Domain[] => {
      const domainMap = new Map<string, string>();
      data.forEach((item) => {
        let controlID = item.ControlDomain.split(":")[0].split(" ")[1];
        if (controlID.startsWith("0")) {
          controlID = controlID.substring(1);
        }
        const key = controlID;
        const text = `${controlID}: ${item.ControlDomain.split(":")[1]}`;
        if (!domainMap.has(key)) {
          domainMap.set(key, text);
        }
      });
      return Array.from(domainMap.values()).map((text) => ({
        key: text.split(": ")[0],
        text,
      }));
    },
    getControlIDForControls: (item: Item): string => {
      return item.properties.metadataId.split(" ").pop()?.trim() || "";
    },
    sanitizeControlIDForControls: (controlID: string): string => {
      return controlID;
    },
    getCurrentMap: (data: Item[]): Map<string, string> => {
      const currentMap = new Map<string, string>();
      data.forEach((item) => {
        const controlID = item.properties.metadataId.split(" ").pop()?.trim() || "";
        currentMap.set(controlID, item.properties.title);
      });
      return currentMap;
    },
    sortControlIDs: (currentControls: Domain[]): Domain[] => {
      return currentControls.sort((a, b) => numberSort(a.key, b.key));
    },
  },
  ISO270012013: {
    getUniqueDomains: (data: ControlDomainData[]): Domain[] => {
      const domainMap = new Map<string, string>();
      data.forEach((item) => {
        const controlID = item.ControlID.split("_").pop()?.split(".").slice(0, 2).join(".") || "";
        const key = controlID;
        const text = `${controlID}: ${item.ControlDomain}`;
        if (!domainMap.has(key)) {
          domainMap.set(key, text);
        }
      });
      return Array.from(domainMap.keys())
        .sort(isoSort)
        .map((key) => ({
          key: key,
          text: domainMap.get(key) || "",
        }));
    },
    getControlIDForControls: (item: Item): string => {
      return item.properties.metadataId.split(" ").pop()?.trim() || "";
    },
    sanitizeControlIDForControls: (controlID: string): string => {
      return controlID;
    },
    getCurrentMap: (data: Item[]): Map<string, string> => {
      const currentMap = new Map<string, string>();
      data.forEach((item) => {
        const controlID = item.properties.metadataId.split(" ").pop()?.trim() || "";
        currentMap.set(controlID, item.properties.title);
      });
      return currentMap;
    },
    sortControlIDs: (currentControls: Domain[]): Domain[] => {
      return currentControls.sort((a, b) => isoSort(a.key, b.key));
    },
  },
  SOC2Type2: {
    getUniqueDomains: (data: ControlDomainData[]): Domain[] => {
      const domainMap = new Map<string, string>();
      data.forEach((item) => {
        const controlID = item.ControlID.split("_").pop()?.split(".")[0] || "";
        const key = controlID;
        const text = `${controlID}: ${item.ControlDomain}`;
        if (!domainMap.has(key)) {
          domainMap.set(key, text);
        }
      });
      return Array.from(domainMap.keys())
        .sort(isoSort)
        .map((key) => ({
          key: key,
          text: domainMap.get(key) || "",
        }));
    },
    getControlIDForControls: (item: Item): string => {
      return item.properties.metadataId.split(" ").pop()?.trim() || "";
    },
    sanitizeControlIDForControls: (controlID: string): string => {
      return controlID;
    },
    getCurrentMap: (data: Item[]): Map<string, string> => {
      const currentMap = new Map<string, string>();
      data.forEach((item) => {
        const controlID = item.properties.metadataId.split(" ").pop()?.trim() || "";
        currentMap.set(controlID, item.properties.title);
      });
      return currentMap;
    },
    sortControlIDs: (currentControls: Domain[]): Domain[] => {
      return currentControls.sort((a, b) => isoSort(a.key, b.key));
    },
  },
};

export default Frameworks;