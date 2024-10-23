import { describe, it, expect } from 'vitest';
import { sanitizeControlID } from './controlIdUtils.ts';

describe('sanitizeControlID', () => {
  it('should remove parentheses and their contents', () => {
    const input = 'controlId(123)';
    const expectedOutput = 'controlId';
    expect(sanitizeControlID(input)).toBe(expectedOutput);
  });

  it('should remove everything after the first pipe character', () => {
    const input = 'controlId|extra|info';
    const expectedOutput = 'controlId';
    expect(sanitizeControlID(input)).toBe(expectedOutput);
  });

  it('should trim whitespace', () => {
    const input = '  controlId  ';
    const expectedOutput = 'controlId';
    expect(sanitizeControlID(input)).toBe(expectedOutput);
  });

  it('should handle complex cases', () => {
    const input = '  controlId(123)|extra|info  ';
    const expectedOutput = 'controlId';
    expect(sanitizeControlID(input)).toBe(expectedOutput);
  });

  it('should return the same string if no parentheses or pipe characters are present', () => {
    const input = 'controlId';
    const expectedOutput = 'controlId';
    expect(sanitizeControlID(input)).toBe(expectedOutput);
  });

  it('should handle empty strings', () => {
    const input = '';
    const expectedOutput = '';
    expect(sanitizeControlID(input)).toBe(expectedOutput);
  });
});