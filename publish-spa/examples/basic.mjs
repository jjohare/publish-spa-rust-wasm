#!/usr/bin/env node

/**
 * Basic usage example for @logseq/publish-spa
 *
 * This example shows the simplest way to publish a Logseq graph.
 */

import * as publishSpa from '@logseq/publish-spa';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    console.log('📚 Publishing Logseq graph...\n');

    // Basic configuration
    const config = {
      inputDir: join(__dirname, '../test-graph'),
      outputDir: join(__dirname, '../output')
    };

    console.log('Config:');
    console.log(`  Input:  ${config.inputDir}`);
    console.log(`  Output: ${config.outputDir}\n`);

    // Publish the graph
    const stats = await publishSpa.publish(config);

    // Display results
    console.log('✅ Publishing complete!\n');
    console.log('Statistics:');
    console.log(`  Pages:        ${stats.page_count}`);
    console.log(`  Total blocks: ${stats.total_blocks}`);
    console.log(`  Total links:  ${stats.total_links}`);
    console.log(`  Orphan pages: ${stats.orphan_pages}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
