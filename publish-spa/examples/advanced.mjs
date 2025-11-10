#!/usr/bin/env node

/**
 * Advanced usage example for @logseq/publish-spa
 *
 * This example demonstrates all available configuration options
 * and multiple API methods.
 */

import * as publishSpa from '@logseq/publish-spa';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    const inputDir = join(__dirname, '../test-graph');
    const outputDir = join(__dirname, '../output-advanced');

    console.log('🔬 Advanced Publishing Example\n');
    console.log('='.repeat(50));

    // Step 1: Parse graph first to get statistics
    console.log('\n📊 Step 1: Analyzing graph...\n');
    const initialStats = await publishSpa.parseGraph(inputDir);

    console.log('Graph Analysis:');
    console.log(`  Total pages:  ${initialStats.page_count}`);
    console.log(`  Total blocks: ${initialStats.total_blocks}`);
    console.log(`  Total links:  ${initialStats.total_links}`);
    console.log(`  Orphan pages: ${initialStats.orphan_pages}`);

    // Step 2: Get backlinks for a specific page
    console.log('\n🔗 Step 2: Checking backlinks...\n');

    // Example: get backlinks for index page
    const indexPage = 'pages/index.md';
    try {
      const backlinks = await publishSpa.getBacklinks(inputDir, indexPage);
      console.log(`Backlinks to ${indexPage}:`);
      if (backlinks.length > 0) {
        backlinks.forEach(link => console.log(`  - ${link}`));
      } else {
        console.log('  (no backlinks found)');
      }
    } catch (error) {
      console.log(`  Could not find ${indexPage}`);
    }

    // Step 3: Publish with full configuration
    console.log('\n🚀 Step 3: Publishing with advanced config...\n');

    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const config = {
      inputDir: inputDir,
      outputDir: outputDir,

      // Theme configuration
      theme: 'dark',

      // Feature toggles
      includeBacklinks: true,
      includeGraphView: true,

      // Custom styling
      customCss: existsSync(join(__dirname, 'custom.css'))
        ? join(__dirname, 'custom.css')
        : undefined
    };

    console.log('Publishing with config:');
    console.log(JSON.stringify(config, null, 2));
    console.log('');

    const stats = await publishSpa.publish(config);

    // Step 4: Display detailed results
    console.log('\n✅ Publishing complete!\n');
    console.log('='.repeat(50));
    console.log('\nFinal Statistics:');
    console.log(`  Pages published: ${stats.page_count}`);
    console.log(`  Blocks processed: ${stats.total_blocks}`);
    console.log(`  Links created: ${stats.total_links}`);
    console.log(`  Orphan pages: ${stats.orphan_pages}`);

    // Calculate some metrics
    const avgBlocksPerPage = stats.page_count > 0
      ? (stats.total_blocks / stats.page_count).toFixed(2)
      : 0;
    const avgLinksPerPage = stats.page_count > 0
      ? (stats.total_links / stats.page_count).toFixed(2)
      : 0;

    console.log('\nMetrics:');
    console.log(`  Avg blocks/page: ${avgBlocksPerPage}`);
    console.log(`  Avg links/page:  ${avgLinksPerPage}`);
    console.log(`  Output directory: ${outputDir}`);

    console.log('\n' + '='.repeat(50));
    console.log('✨ Done! Open output/index.html to view your site.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
