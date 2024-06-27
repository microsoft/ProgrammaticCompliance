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
 * @returns 1.2 before 2.1, 2.1 before 10.1
 */
export const numberSort = (a, b) => {
  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  return numA - numB;
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