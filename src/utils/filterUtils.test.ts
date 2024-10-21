import { describe, it, expect } from 'vitest';
import {
  sanitizeControlID,
  isoSort,
  customSort,
  numberSort,
  prefixExtractor,
} from './filterUtils';

describe('filterUtils', () => {
  
  describe('sanitizeControlID', () => {
    it('should remove the control name after ":"', () => {
      const input = 'AC-2: Account Management';
      const expected = 'AC-2';
      expect(sanitizeControlID(input)).toBe(expected);
    });

    it('should remove the control name after "("', () => {
      const input = 'AC-2 (Account Management)';
      const expected = 'AC-2';
      expect(sanitizeControlID(input)).toBe(expected);
    });

    it('should return the entire string if no ":" or "(" is present', () => {
      const input = 'AC-2';
      const expected = 'AC-2';
      expect(sanitizeControlID(input)).toBe(expected);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expected = '';
      expect(sanitizeControlID(input)).toBe(expected);
    });

    it('should handle strings without matching pattern', () => {
      const input = ': Account Management';
      const expected = '';
      expect(sanitizeControlID(input)).toBe(expected);
    });
  });

  describe('isoSort', () => {
    it('should sort based on alphabetical parts first', () => {
      const a = 'A.2';
      const b = 'B.1';
      expect(isoSort(a, b)).toBe(-1);
      expect(isoSort(b, a)).toBe(1);
    });

    it('should sort based on numerical parts when alphabetical parts are equal', () => {
      const a = 'A.1';
      const b = 'A.2';
      expect(isoSort(a, b)).toBe(-1);
      expect(isoSort(b, a)).toBe(1);
    });

    it('should handle multiple numerical parts', () => {
      const a = 'A.1.2';
      const b = 'A.1.3';
      expect(isoSort(a, b)).toBe(-1);
      expect(isoSort(b, a)).toBe(1);
    });

    it('should treat missing numerical parts as 0', () => {
      const a = 'A';
      const b = 'A.1';
      expect(isoSort(a, b)).toBe(-1);
      expect(isoSort(b, a)).toBe(1);
    });

    it('should return 0 for identical strings', () => {
      const a = 'A.1.2';
      const b = 'A.1.2';
      expect(isoSort(a, b)).toBe(0);
    });

    it('should handle different lengths of numerical parts', () => {
      const a = 'A.1';
      const b = 'A.1.1';
      expect(isoSort(a, b)).toBe(-1);
      expect(isoSort(b, a)).toBe(1);
    });

    it('should handle non-numeric numerical parts gracefully', () => {
      const a = 'A.1a';
      const b = 'A.1';
      expect(isoSort(a, b)).toBe(0);
    });
  });

  describe('customSort', () => {
    it('should sort based on alphabetical parts first', () => {
      const a = 'AB1';
      const b = 'AC1';
      expect(customSort(a, b)).toBe(-1);
      expect(customSort(b, a)).toBe(1);
    });

    it('should sort numerical parts in descending order when alphabetical parts are equal', () => {
      const a = 'AB2';
      const b = 'AB1';
      expect(customSort(a, b)).toBe(-1);
      expect(customSort(b, a)).toBe(1);
    });

    it('should handle identical strings', () => {
      const a = 'AC1';
      const b = 'AC1';
      expect(customSort(a, b)).toBe(0);
    });

    it('should treat missing numerical parts as 0', () => {
      const a = 'SC1';
      const b = 'SC';
      expect(customSort(a, b)).toBe(-1);
      expect(customSort(b, a)).toBe(1);
    });
  });

  describe('numberSort', () => {
    it('should sort based on first numerical segment', () => {
      const a = '1.2';
      const b = '2.1';
      expect(numberSort(a, b)).toBe(-1);
      expect(numberSort(b, a)).toBe(1);
    });

    it('should sort based on subsequent numerical segments', () => {
      const a = '2.1';
      const b = '2.2';
      expect(numberSort(a, b)).toBe(-1);
      expect(numberSort(b, a)).toBe(1);
    });

    it('should handle multiple numerical segments', () => {
      const a = '1.2.3';
      const b = '1.2.4';
      expect(numberSort(a, b)).toBe(-1);
      expect(numberSort(b, a)).toBe(1);
    });

    it('should handle different lengths by treating missing segments as 0', () => {
      const a = '1.2';
      const b = '1.2.1';
      expect(numberSort(a, b)).toBe(-1);
      expect(numberSort(b, a)).toBe(1);
    });

    it('should return 0 for identical strings', () => {
      const a = '2.1';
      const b = '2.1';
      expect(numberSort(a, b)).toBe(0);
    });

    it('should handle leading zeros correctly', () => {
      const a = '01.002';
      const b = '1.2';
      expect(numberSort(a, b)).toBe(0);
    });

    it('should handle non-numeric strings gracefully', () => {
      const a = '1.a';
      const b = '1.2';
      expect(numberSort(a, b)).toBe(-1);
    });
  });

  describe('prefixExtractor', () => {
    it('should extract prefix for NIST framework', () => {
      const control = 'AC-2: Account Management';
      const framework = 'NIST_SP_800-53_R4';
      const expected = 'AC';
      expect(prefixExtractor(control, framework)).toBe(expected);
    });

    it('should extract first segment for other frameworks', () => {
      const control = '1.2.3: Some Control';
      const framework = 'PCI';
      const expected = '1';
      expect(prefixExtractor(control, framework)).toBe(expected);
    });

    it('should handle empty control strings', () => {
      const control = '';
      const framework = 'NIST_SP_800-53_R4';
      const expected = undefined;
      expect(prefixExtractor(control, framework)).toBe(expected);
    });

    it('should extract prefix correctly for PCI frameworks with alphanumeric prefixes', () => {
      const control = 'A1.2.3: Some Control';
      const framework = 'PCI';
      expect(prefixExtractor(control, framework)).toBe('A1');
    });

    it('should extract prefix correctly for SOC2 frameworks', () => {
      const control = 'CC3.4: Some Control';
      const framework = 'SOC2';
      const expected = 'CC3';
      expect(prefixExtractor(control, framework)).toBe(expected);
    });

    it('should extract prefix correctly for CIS frameworks', () => {
      const control = 'A.10.5: Some Control';
      const framework = 'CIS';
      expect(prefixExtractor(control, framework)).toBe('A');
    });
  });

});
