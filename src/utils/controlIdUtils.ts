export const sanitizeControlID = (controlId: string) => {
  const controlIdWithoutParentheses = controlId.replace(/\([^)]*\)/g, '');
  return controlIdWithoutParentheses.split('|')[0].trim();
};