import { Command } from 'commander';

import type { CliContext } from '../context.js';
import { extractMarkdownSection, truncateOutput } from '../utils/markdown.js';
import { normalizeUrl, parsePositiveInteger, resolveEndpoint } from '../utils/options.js';
import { ensureTrailingNewline } from '../utils/text.js';
import { parseFetchArgs } from '../utils/validation.js';
import { UsageError } from '../utils/errors.js';

interface FetchCommandOptions {
  section?: string;
  maxChars?: number;
}

export function registerFetchCommand(program: Command, context: CliContext): void {
  program
    .command('fetch')
    .description('Fetch a Microsoft Learn document in markdown-friendly form.')
    .argument('<url>', 'Microsoft Learn document URL.')
    .option('--section <heading>', 'Return only the matching markdown section.')
    .option('--max-chars <number>', 'Truncate the final rendered output.', parsePositiveInteger)
    .action(async (url: string, options: FetchCommandOptions) => {
      try {
        // Validate input before proceeding
        const validated = parseFetchArgs({ url });

        const endpoint = resolveEndpoint(program.opts<{ endpoint?: string }>().endpoint, context.env);
        const normalizedUrl = normalizeUrl(validated.url);
        const client = context.createClient({ endpoint });

        try {
          const markdown = await client.fetchDocument(normalizedUrl);
          const sectionFiltered = options.section ? extractMarkdownSection(markdown, options.section) : markdown;
          const finalContent = truncateOutput(sectionFiltered, options.maxChars);
          context.writeOut(ensureTrailingNewline(finalContent));
        } finally {
          await client.close();
        }
      } catch (err) {
        if (err instanceof UsageError) {
          context.writeErr(`Invalid fetch input: ${err.message}\n`);
          process.exit(1);
        }
        throw err;
      }
    });
            }
