export const sanitizeControlID = (controlId) => {
  const controlIdWithoutParentheses = controlId.replace(/\([^)]*\)/g, '');
  return controlIdWithoutParentheses.split('|')[0].trim();
};