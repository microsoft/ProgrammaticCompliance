import {
  customSort,
  numberSort,
  isoSort,
  sanitizeControlID,
} from "../../utils/filterUtils";

const Frameworks = {
  NISTSP80053R4: {
    getUniqueDomains: (data) => {
      let controlID;
      let key;
      let text;
      const domainMap = {};
      data.forEach((item) => {
        controlID = item.ControlID.split("_").pop().split("-")[0];
        key = controlID;
        text = `${controlID}: ${item.ControlDomain}`;
        if (!domainMap[key]) {
          domainMap[key] = text;
        }
      });
      return Object.values(domainMap).map((text) => ({
        key: text.split(": ")[0],
        text,
      }));
    },
    getControlIDForControls: (item) => {
      let controlID = item.properties.metadataId.replace(/\([^()]*\)/g, "");
      return controlID.trim().split(" ").pop();
    },
    sanitizeControlIDForControls: (controlID) => {
      return sanitizeControlID(controlID);
    },
    getCurrentMap: (data) => {
      let controlID;
      let currentMap = new Map();
      data.forEach((item) => {
        if (!item.properties.metadataId.includes("(")) {
          controlID = item.properties.metadataId.replace(/\([^()]*\)/g, "");
          controlID = controlID.trim().split(" ").pop();
          controlID = sanitizeControlID(controlID);
          currentMap.set(controlID, item.properties.title);
        }
      });
      return currentMap;
    },
    sortControlIDs: (currentControls) => {
      return currentControls.sort((a, b) => {
        return customSort(a.key, b.key);
      });
    },
  },
  CISAzure2: {
    getUniqueDomains: (data) => {
      let key;
      let text;
      const domainMap = {};
      data.forEach((item) => {
        key = item.ControlDomain.split(" ")[0];
        text = `${
          item.ControlDomain.split(" ")[0]
        }: ${item.ControlDomain.substring(
          item.ControlDomain.indexOf(" ") + 1
        )}`;
        if (!domainMap[key]) {
          domainMap[key] = text;
        }
      });
      return Object.values(domainMap).map((text) => ({
        key: text.split(": ")[0],
        text,
      }));
    },
    getControlIDForControls: (item) => {
      return item.properties.metadataId.split(" ").pop().trim();
    },
    sanitizeControlIDForControls: (controlID) => {
      return controlID;
    },
    getCurrentMap: (data) => {
      let controlID;
      let currentMap = new Map();
      data.forEach((item) => {
        controlID = item.properties.metadataId.split(" ").pop().trim();
        currentMap.set(controlID, item.properties.title);
      });
      return currentMap;
    },
    sortControlIDs: (currentControls) => {
      return currentControls.sort((a, b) => {
        return numberSort(a.key, b.key);
      });
    },
  },
  PCIDSSv4: {
    getUniqueDomains: (data) => {
      let controlID;
      let key;
      let text;
      const domainMap = {};
      data.forEach((item) => {
        controlID = item.ControlDomain.split(":")[0].split(" ")[1];
        if (controlID.startsWith("0")) {
          controlID = controlID.substring(1);
        }
        key = controlID;
        text = `${controlID}: ${item.ControlDomain.split(":")[1]}`;
        if (!domainMap[key]) {
          domainMap[key] = text;
        }
      });
      return Object.values(domainMap).map((text) => ({
        key: text.split(": ")[0],
        text,
      }));
    },
    getControlIDForControls: (item) => {
      return item.properties.metadataId.split(" ").pop().trim();
    },
    sanitizeControlIDForControls: (controlID) => {
      return controlID;
    },
    getCurrentMap: (data) => {
      let controlID;
      let currentMap = new Map();
      data.forEach((item) => {
        controlID = item.properties.metadataId.split(" ").pop().trim();
        currentMap.set(controlID, item.properties.title);
      });
      return currentMap;
    },
    sortControlIDs: (currentControls) => {
      return currentControls.sort((a, b) => {
        return numberSort(a.key, b.key);
      });
    },
  },
  ISO270012013: {
    getUniqueDomains: (data) => {
      let controlID;
      let key;
      let text;
      const domainMap = {};

      data.forEach((item) => {
        controlID = item.ControlID.split("_")
          .pop()
          .split(".")
          .slice(0, 2)
          .join(".");
        key = controlID;
        text = `${controlID}: ${item.ControlDomain}`;
        if (!domainMap[key]) {
          domainMap[key] = text;
        }
      });
      return Object.keys(domainMap)
        .sort(isoSort)
        .map((key) => ({
          key: key,
          text: domainMap[key],
        }));
    },
    getControlIDForControls: (item) => {
      return item.properties.metadataId.split(" ").pop().trim();
    },
    sanitizeControlIDForControls: (controlID) => {
      return controlID;
    },
    getCurrentMap: (data) => {
      let controlID;
      let currentMap = new Map();
      data.forEach((item) => {
        controlID = item.properties.metadataId.split(" ").pop().trim();
        currentMap.set(controlID, item.properties.title);
      });
      return currentMap;
    },
    sortControlIDs: (currentControls) => {
      return currentControls.sort((a, b) => {
        return isoSort(a.key, b.key);
      });
    },
  },
  SOC2Type2: {
    getUniqueDomains: (data) => {
      let controlID;
      let key;
      let text;
      const domainMap = {};
      data.forEach((item) => {
        controlID = item.ControlID.split("_").pop().split(".")[0];
        key = controlID;
        text = `${controlID}: ${item.ControlDomain}`;
        if (!domainMap[key]) {
          domainMap[key] = text;
        }
      });
      return Object.keys(domainMap)
        .sort(isoSort)
        .map((key) => ({
          key: key,
          text: domainMap[key],
        }));
    },
    getControlIDForControls: (item) => {
      return item.properties.metadataId.split(" ").pop().trim();
    },
    sanitizeControlIDForControls: (controlID) => {
      return controlID;
    },
    getCurrentMap: (data) => {
      let controlID;
      let currentMap = new Map();

      data.forEach((item) => {
        controlID = item.properties.metadataId.split(" ").pop().trim();
        currentMap.set(controlID, item.properties.title);
      });
      return currentMap;
    },
    sortControlIDs: (currentControls) => {
      return currentControls.sort((a, b) => {
        return isoSort(a.key, b.key);
      });
    },
  },
};

export default Frameworks;
