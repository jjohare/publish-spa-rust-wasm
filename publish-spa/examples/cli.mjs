#!/usr/bin/env node

/**
 * CLI wrapper example for @logseq/publish-spa
 *
 * This demonstrates how to build a custom CLI tool
 * around the publish-spa library.
 */

import * as publishSpa from '@logseq/publish-spa';
import { parseArgs } from 'util';
import { resolve } from 'path';

// CLI Configuration
const CLI_VERSION = '1.0.0';

const usage = `
Logseq Publish SPA - Custom CLI Example

Usage:
  node cli.mjs <command> [options]

Commands:
  build       Build static site from Logseq graph
  stats       Show graph statistics
  backlinks   Get backlinks for a page
  help        Show this help message

Build Options:
  -i, --input <dir>       Input directory (Logseq graph) [required]
  -o, --output <dir>      Output directory [required]
  --theme <name>          Theme name (default, dark, light)
  --no-backlinks          Disable backlinks
  --graph-view            Include graph visualization
  --custom-css <file>     Path to custom CSS file

Stats Options:
  -i, --input <dir>       Input directory (Logseq graph) [required]

Backlinks Options:
  -i, --input <dir>       Input directory (Logseq graph) [required]
  -p, --page <path>       Page path to check [required]

Examples:
  node cli.mjs build -i ./my-graph -o ./public
  node cli.mjs build -i ./graph -o ./out --theme dark --graph-view
  node cli.mjs stats -i ./my-graph
  node cli.mjs backlinks -i ./graph -p pages/index.md
`;

async function buildCommand(options) {
  const { input, output, theme, backlinks, graphView, customCss } = options;

  if (!input || !output) {
    console.error('Error: --input and --output are required for build command');
    console.log(usage);
    process.exit(1);
  }

  console.log('🏗️  Building static site...\n');

  const config = {
    inputDir: resolve(input),
    outputDir: resolve(output),
    theme: theme || 'default',
    includeBacklinks: backlinks !== false,
    includeGraphView: graphView || false,
    customCss: customCss ? resolve(customCss) : undefined
  };

  console.log('Configuration:');
  console.log(`  Input:        ${config.inputDir}`);
  console.log(`  Output:       ${config.outputDir}`);
  console.log(`  Theme:        ${config.theme}`);
  console.log(`  Backlinks:    ${config.includeBacklinks ? 'enabled' : 'disabled'}`);
  console.log(`  Graph view:   ${config.includeGraphView ? 'enabled' : 'disabled'}`);
  if (config.customCss) {
    console.log(`  Custom CSS:   ${config.customCss}`);
  }
  console.log('');

  const startTime = Date.now();
  const stats = await publishSpa.publish(config);
  const elapsed = Date.now() - startTime;

  console.log('✅ Build complete!\n');
  console.log('Statistics:');
  console.log(`  Pages:        ${stats.page_count}`);
  console.log(`  Blocks:       ${stats.total_blocks}`);
  console.log(`  Links:        ${stats.total_links}`);
  console.log(`  Orphan pages: ${stats.orphan_pages}`);
  console.log(`  Build time:   ${elapsed}ms`);
}

async function statsCommand(options) {
  const { input } = options;

  if (!input) {
    console.error('Error: --input is required for stats command');
    console.log(usage);
    process.exit(1);
  }

  console.log('📊 Analyzing graph...\n');

  const inputDir = resolve(input);
  const stats = await publishSpa.parseGraph(inputDir);

  console.log('Graph Statistics:');
  console.log(`  Input:        ${inputDir}`);
  console.log(`  Pages:        ${stats.page_count}`);
  console.log(`  Blocks:       ${stats.total_blocks}`);
  console.log(`  Links:        ${stats.total_links}`);
  console.log(`  Orphan pages: ${stats.orphan_pages}`);

  if (stats.page_count > 0) {
    console.log('\nMetrics:');
    console.log(`  Avg blocks/page: ${(stats.total_blocks / stats.page_count).toFixed(2)}`);
    console.log(`  Avg links/page:  ${(stats.total_links / stats.page_count).toFixed(2)}`);
  }
}

async function backlinksCommand(options) {
  const { input, page } = options;

  if (!input || !page) {
    console.error('Error: --input and --page are required for backlinks command');
    console.log(usage);
    process.exit(1);
  }

  console.log('🔗 Finding backlinks...\n');

  const inputDir = resolve(input);
  const backlinks = await publishSpa.getBacklinks(inputDir, page);

  console.log(`Backlinks for "${page}":`);
  console.log(`  Input: ${inputDir}\n`);

  if (backlinks.length > 0) {
    backlinks.forEach(link => {
      console.log(`  📄 ${link}`);
    });
    console.log(`\n  Total: ${backlinks.length} backlink(s)`);
  } else {
    console.log('  (no backlinks found)');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    console.log(usage);
    process.exit(0);
  }

  if (command === '--version' || command === '-v') {
    console.log(`Logseq Publish SPA CLI v${CLI_VERSION}`);
    process.exit(0);
  }

  // Parse command-line arguments
  const options = {};
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-i' || arg === '--input') {
      options.input = args[++i];
    } else if (arg === '-o' || arg === '--output') {
      options.output = args[++i];
    } else if (arg === '-p' || arg === '--page') {
      options.page = args[++i];
    } else if (arg === '--theme') {
      options.theme = args[++i];
    } else if (arg === '--no-backlinks') {
      options.backlinks = false;
    } else if (arg === '--graph-view') {
      options.graphView = true;
    } else if (arg === '--custom-css') {
      options.customCss = args[++i];
    }
  }

  try {
    switch (command) {
      case 'build':
        await buildCommand(options);
        break;
      case 'stats':
        await statsCommand(options);
        break;
      case 'backlinks':
        await backlinksCommand(options);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.log(usage);
        process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (process.env.DEBUG) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
