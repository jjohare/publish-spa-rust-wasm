#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as wasm from './pkg/publish_spa_wasm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Integration Test: Full Publish Pipeline');
console.log('═'.repeat(60));

const TEST_GRAPH = path.resolve(__dirname, '../test-graph');
const TEST_OUTPUT = path.resolve(__dirname, './test-output');

async function main() {
  try {
    // Clean output
    await fs.rm(TEST_OUTPUT, { recursive: true, force: true });
    console.log('✓ Cleaned output directory');

    // Initialize WASM with manual loading
    const wasmPath = path.join(__dirname, 'pkg/publish_spa_wasm_bg.wasm');
    const wasmBytes = await fs.readFile(wasmPath);
    await wasm.default(wasmBytes);
    console.log('✓ WASM initialized');

    // Parse graph (this tests file I/O bridge)
    console.log('\nParsing test graph...');
    const stats = await wasm.parse_graph(TEST_GRAPH);

    console.log('✓ Graph parsed successfully!');
    console.log(`  Pages: ${stats.page_count}`);
    console.log(`  Blocks: ${stats.total_blocks}`);
    console.log(`  Links: ${stats.total_links}`);
    console.log(`  Orphans: ${stats.orphan_pages}`);

    // Full publish test
    console.log('\nPublishing graph...');
    const publishStats = await wasm.publish({
      input_dir: TEST_GRAPH,
      output_dir: TEST_OUTPUT,
      theme: 'default',
      include_backlinks: true,
      include_graph_view: false
    });

    console.log('✓ Publish complete!');
    console.log(`  Pages: ${publishStats.page_count}`);

    // Verify output
    const outputFiles = await fs.readdir(TEST_OUTPUT);
    console.log(`\n✓ Generated ${outputFiles.length} files`);

    // List some output files
    if (outputFiles.length > 0) {
      console.log('\nOutput files:');
      outputFiles.slice(0, 5).forEach(f => console.log(`  - ${f}`));
      if (outputFiles.length > 5) {
        console.log(`  ... and ${outputFiles.length - 5} more`);
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✅ INTEGRATION TEST PASSED');
    console.log('═'.repeat(60));

  } catch (err) {
    console.error('\n❌ INTEGRATION TEST FAILED');
    console.error('Error:', err);
    console.error('Type:', typeof err);
    console.error('Message:', err.message);
    if (err.stack) {
      console.error('\nStack trace:');
      console.error(err.stack);
    }
    if (typeof err === 'object') {
      console.error('\nError details:', JSON.stringify(err, null, 2));
    }
    process.exit(1);
  }
}

main();
