import { Command } from 'commander';

import type { CliContext } from '../context.js';
import { formatCodeSearchResults } from '../formatters/search-results.js';
import { resolveEndpoint } from '../utils/options.js';
import { ensureTrailingNewline } from '../utils/text.js';
import { parseCodeSearchArgs } from '../utils/validation.js';
import { UsageError } from '../utils/errors.js';

interface CodeSearchCommandOptions {
  language?: string;
  json?: boolean;
}

export function registerCodeSearchCommand(program: Command, context: CliContext): void {
  program
    .command('code-search')
    .description('Search Microsoft Learn code samples through the Learn MCP server.')
    .argument('<query>', 'Search query.')
    .option('--language <name>', 'Preferred language filter to pass to Learn.')
    .option('--json', 'Output raw JSON instead of formatted text.')
    .action(async (query: string, options: CodeSearchCommandOptions) => {
      try {
        // Validate input before proceeding
        const validated = parseCodeSearchArgs({
          language: options.language ?? '',
          query
        });

        const endpoint = resolveEndpoint(program.opts<{ endpoint?: string }>().endpoint, context.env);
        const client = context.createClient({ endpoint });

        try {
          const payload = await client.searchCodeSamples(validated.query, validated.language);
          const output = options.json ? payload : formatCodeSearchResults(payload);
          context.writeOut(ensureTrailingNewline(output));
        } finally {
          await client.close();
        }
      } catch (err) {
        if (err instanceof UsageError) {
          context.writeErr(`Invalid code-search input: ${err.message}\n`);
          process.exit(1);
        }
        throw err;
      }
    });
        }
