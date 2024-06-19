import nistIDS from '../static/nistControls.json';

export const sanitizeControlID = (controlId) => {
  const controlIdWithoutParentheses = controlId.replace(/\([^)]*\)/g, '');
  return controlIdWithoutParentheses.split('|')[0].trim();
};

export function findLabelByValue(value) {
  const item = nistIDS.find((entry) => entry.value === value);
  return item ? item.label.split(":")[1].trim() : null;
}