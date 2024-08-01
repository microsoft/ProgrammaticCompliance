/**
 * @param {string} controlId
 * @returns the controlID string without the control name (e.g. AC-2: Account Management -> AC-2)
 */
export const sanitizeControlID = (controlId) => {
  const prefixMatch = controlId.match(/^[^:()]+/);
  const prefix = prefixMatch ? prefixMatch[0].trim() : "";
  return prefix;
};

export const isoSort = (a, b) => {
  const parseControlID = (str) => {
    const [alphaPart, ...numericParts] = str.split(".");
    const numericPart = numericParts.map((num) => parseInt(num, 10));
    return { alphaPart, numericPart };
  };

  const splitA = parseControlID(a);
  const splitB = parseControlID(b);

  // Compare alphabetical parts first
  if (splitA.alphaPart < splitB.alphaPart) return -1;
  if (splitA.alphaPart > splitB.alphaPart) return 1;

  // Compare numerical parts
  for (
    let i = 0;
    i < Math.max(splitA.numericPart.length, splitB.numericPart.length);
    i++
  ) {
    const numA = splitA.numericPart[i] || 0;
    const numB = splitB.numericPart[i] || 0;
    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }

  return 0;
};

/**
 * @param {string} a
 * @param {string} b
 * @returns AC before AU, AU before SC
 */
export const customSort = (a, b) => {
  const splitA = a.match(/([a-zA-Z]+)(-?\d*)/);
  const splitB = b.match(/([a-zA-Z]+)(-?\d*)/);

  if (splitA[1] < splitB[1]) return -1;
  if (splitA[1] > splitB[1]) return 1;

  const numA = parseInt(splitA[2]) || 0;
  const numB = parseInt(splitB[2]) || 0;
  return numB - numA;
};

/**
 * @param {string} a
 * @param {string} b
 * @returns 1.2 before 2.1, 2.1 before 10.1
 */
export const numberSort = (a, b) => {
  const splitA = a.split(".").map(Number);
  const splitB = b.split(".").map(Number);

  const maxLength = Math.max(splitA.length, splitB.length);

  for (let i = 0; i < maxLength; i++) {
    const numA = splitA[i] || 0;
    const numB = splitB[i] || 0;

    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }

  return 0;
};

/**
 * @param {string} control to extract the prefix from
 * @returns "AC", "AU" etc. if NIST, "1", "2" or "A1", "CC3" etc. if PCI, SOC2, or CIS, "A.10", "C.5" if ISO
 */
export const prefixExtractor = (control, framework) => {
  if (control) {
    if (framework === "NIST_SP_800-53_R4") {
      return control.split("-")[0];
    } else if (framework == "ISO 27001:2013") {
      return control.split(".").slice(0, 2).join(".");
    } else {
      return control.split(".")[0];
    }
  }
};
