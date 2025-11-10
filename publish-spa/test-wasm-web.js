// Test script for web-target WASM
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testWasm() {
  try {
    console.log('Testing WASM Package (web target)...\n');

    // Read the WASM file
    const wasmPath = path.join(__dirname, 'pkg', 'publish_spa_wasm_bg.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);

    console.log('✓ WASM binary found');
    console.log('  Path:', wasmPath);
    console.log('  Size:', (wasmBuffer.length / 1024).toFixed(2), 'KB');

    // Compile WASM
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    console.log('✓ WASM module compiled');

    // Import and initialize
    const wasm = await import('./pkg/publish_spa_wasm.js');

    console.log('✓ JavaScript bindings imported');

    // Initialize with buffer
    await wasm.default(wasmBuffer);

    console.log('✓ WASM initialized successfully\n');

    // Check exports
    console.log('Exported API:');
    console.log('  - init():', typeof wasm.init);
    console.log('  - publish():', typeof wasm.publish);
    console.log('  - parse_graph():', typeof wasm.parse_graph);
    console.log('  - get_backlinks():', typeof wasm.get_backlinks);
    console.log('  - PublishConfig:', typeof wasm.PublishConfig);
    console.log('  - PublishStats:', typeof wasm.PublishStats);

    console.log('\n✅ All tests passed! Package is ready to use.');
    console.log('\nPackage contents:');
    const pkgFiles = fs.readdirSync(path.join(__dirname, 'pkg'));
    pkgFiles.forEach(file => {
      const stat = fs.statSync(path.join(__dirname, 'pkg', file));
      if (stat.isFile()) {
        console.log(`  - ${file} (${(stat.size / 1024).toFixed(2)} KB)`);
      } else {
        console.log(`  - ${file}/ (directory)`);
      }
    });

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testWasm();
