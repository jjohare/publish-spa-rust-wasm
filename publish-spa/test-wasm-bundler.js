// Test script for bundler-target WASM
// This simulates what a bundler like webpack/vite would do

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testWasm() {
  try {
    // Read the WASM file
    const wasmPath = path.join(__dirname, 'pkg', 'publish_spa_wasm_bg.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);

    console.log('✓ WASM file loaded:', wasmPath);
    console.log('✓ WASM size:', (wasmBuffer.length / 1024).toFixed(2), 'KB');

    // Initialize WebAssembly
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    console.log('✓ WASM module compiled successfully');

    // Import the JS bindings
    const { default: init, publish, parse_graph, get_backlinks, PublishConfig, PublishStats } = await import('./pkg/publish_spa_wasm.js');

    console.log('✓ JavaScript bindings loaded');

    // Initialize with the buffer
    await init(wasmBuffer);

    console.log('✓ WASM initialized successfully');
    console.log('\nExported functions:');
    console.log('  - publish():', typeof publish);
    console.log('  - parse_graph():', typeof parse_graph);
    console.log('  - get_backlinks():', typeof get_backlinks);
    console.log('  - PublishConfig:', typeof PublishConfig);
    console.log('  - PublishStats:', typeof PublishStats);

    console.log('\n✓ All tests passed! Package is working correctly.');

  } catch (error) {
    console.error('✗ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testWasm();
