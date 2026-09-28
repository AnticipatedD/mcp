import { z } from 'zod';
import { UsageError } from './errors';

// Schema for search queries
const searchSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty')
});

// Schema for fetch URLs
const fetchSchema = z.object({
  url: z.string().url('Invalid URL provided')
});

// Schema for code search arguments
const codeSearchSchema = z.object({
  language: z.string().min(1, 'Language must be specified'),
  query: z.string().min(1, 'Code search query cannot be empty')
});

export function parseSearchArgs(args: { query: string }) {
  const result = searchSchema.safeParse(args);
  if (!result.success) {
    throw new UsageError(result.error.errors.map(e => e.message).join(', '));
  }
  return result.data;
}

export function parseFetchArgs(args: { url: string }) {
  const result = fetchSchema.safeParse(args);
  if (!result.success) {
    throw new UsageError(result.error.errors.map(e => e.message).join(', '));
  }
  return result.data;
}

export function parseCodeSearchArgs(args: { language: string; query: string }) {
  const result = codeSearchSchema.safeParse(args);
  if (!result.success) {
    throw new UsageError(result.error.errors.map(e => e.message).join(', '));
  }
  return result.data;
  }
