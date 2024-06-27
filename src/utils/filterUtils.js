/**
 * @param {string} controlId 
 * @returns the controlID string without the control name (e.g. AC-2: Account Management -> AC-2)
 */
export const sanitizeControlID = (controlId) => {
  const prefixMatch = controlId.match(/^[^:()]+/);
  const prefix = prefixMatch ? prefixMatch[0].trim() : '';
  return prefix;
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
  const splitA = a.split('.').map(Number);
  const splitB = b.split('.').map(Number);

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
 * @returns "AC", "AU" etc. if NIST, "1.1", "2.1" etc. if PCI or CIS
 */
export const prefixExtractor = (control, framework) => {
  if (control) {
    if (framework === "NIST_SP_800-53_R4") {
    return control.split('-')[0];
    } else {
    return control.split('.')[0];
    }
  }
};