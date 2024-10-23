let idCounter = 0;

export const generateUniqueId = (prefix = 'id') => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};