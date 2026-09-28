import { Command } from 'commander';

import type { CliContext } from '../context.js';
import { formatSearchResults } from '../formatters/search-results.js';
import { resolveEndpoint } from '../utils/options.js';
import { ensureTrailingNewline } from '../utils/text.js';
import { parseSearchArgs } from '../utils/validation.js';
import { UsageError } from '../utils/errors.js';

interface SearchCommandOptions {
  json?: boolean;
}

export function registerSearchCommand(program: Command, context: CliContext): void {
  program
    .command('search')
    .description('Search official Microsoft documentation through the Learn MCP server.')
    .argument('<query>', 'Search query.')
    .option('--json', 'Output raw JSON instead of formatted text.')
    .action(async (query: string, options: SearchCommandOptions) => {
      try {
        // Validate input before proceeding
        const validated = parseSearchArgs({ query });

        const endpoint = resolveEndpoint(program.opts<{ endpoint?: string }>().endpoint, context.env);
        const client = context.createClient({ endpoint });

        try {
          const payload = await client.searchDocs(validated.query);
          const output = options.json ? payload : formatSearchResults(payload);
          context.writeOut(ensureTrailingNewline(output));
        } finally {
          await client.close();
        }
      } catch (err) {
        if (err instanceof UsageError) {
          context.writeErr(`Invalid search input: ${err.message}\n`);
          process.exit(1);
        }
        throw err;
      }
    });
      }
