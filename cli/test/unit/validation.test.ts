import { describe, it, expect } from 'vitest';
import { parseSearchArgs, parseFetchArgs, parseCodeSearchArgs } from '../../src/utils/validation';
import { UsageError } from '../../src/utils/errors';

describe('Validation Utilities', () => {
  describe('parseSearchArgs', () => {
    it('accepts a valid search query', () => {
      const result = parseSearchArgs({ query: 'azure functions' });
      expect(result.query).toBe('azure functions');
    });

    it('rejects an empty search query', () => {
      expect(() => parseSearchArgs({ query: '' })).toThrow(UsageError);
    });
  });

  describe('parseFetchArgs', () => {
    it('accepts a valid URL', () => {
      const result = parseFetchArgs({ url: 'https://learn.microsoft.com/en-us/azure' });
      expect(result.url).toBe('https://learn.microsoft.com/en-us/azure');
    });

    it('rejects an invalid URL', () => {
      expect(() => parseFetchArgs({ url: 'not-a-url' })).toThrow(UsageError);
    });
  });

  describe('parseCodeSearchArgs', () => {
    it('accepts valid language and query', () => {
      const result = parseCodeSearchArgs({ language: 'typescript', query: 'http client' });
      expect(result.language).toBe('typescript');
      expect(result.query).toBe('http client');
    });

    it('rejects empty language', () => {
      expect(() => parseCodeSearchArgs({ language: '', query: 'http client' })).toThrow(UsageError);
    });

    it('rejects empty query', () => {
      expect(() => parseCodeSearchArgs({ language: 'typescript', query: '' })).toThrow(UsageError);
    });
  });
});
