#!/usr/bin/env node
// Integration test for WASM package
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runIntegrationTest() {
  console.log('🧪 WASM Package Integration Test\n');

  const tests = [];
  const testResult = (name, passed, details = '') => {
    tests.push({ name, passed, details });
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name}${details ? ': ' + details : ''}`);
  };

  try {
    // Test 1: Check WASM binary exists
    const wasmPath = path.join(__dirname, 'pkg', 'publish_spa_wasm_bg.wasm');
    const wasmExists = fs.existsSync(wasmPath);
    const wasmSize = wasmExists ? fs.statSync(wasmPath).size : 0;
    testResult('WASM binary exists', wasmExists, `${(wasmSize / 1024).toFixed(0)} KB`);

    if (!wasmExists) throw new Error('WASM binary not found');

    // Test 2: Validate WASM binary
    const wasmBuffer = fs.readFileSync(wasmPath);
    const isValidWasm = wasmBuffer[0] === 0x00 && wasmBuffer[1] === 0x61 &&
                       wasmBuffer[2] === 0x73 && wasmBuffer[3] === 0x6D;
    testResult('WASM binary is valid', isValidWasm, 'magic bytes correct');

    // Test 3: Compile WASM module
    let wasmModule;
    try {
      wasmModule = await WebAssembly.compile(wasmBuffer);
      testResult('WASM compilation', true, 'module compiled');
    } catch (e) {
      testResult('WASM compilation', false, e.message);
      throw e;
    }

    // Test 4: Load JavaScript bindings
    let wasm;
    try {
      wasm = await import('./pkg/publish_spa_wasm.js');
      testResult('JavaScript bindings', true, 'imported successfully');
    } catch (e) {
      testResult('JavaScript bindings', false, e.message);
      throw e;
    }

    // Test 5: Initialize WASM
    try {
      await wasm.default(wasmBuffer);
      testResult('WASM initialization', true, 'initialized with buffer');
    } catch (e) {
      testResult('WASM initialization', false, e.message);
      throw e;
    }

    // Test 6: Verify exported functions
    const expectedExports = [
      'init',
      'publish',
      'parse_graph',
      'get_backlinks',
      'PublishConfig',
      'PublishStats'
    ];

    const missingExports = expectedExports.filter(name => typeof wasm[name] === 'undefined');
    testResult('API exports complete', missingExports.length === 0,
      missingExports.length > 0 ? `Missing: ${missingExports.join(', ')}` : 'all exports found');

    // Test 7: Check function signatures
    const functionTypes = {
      init: typeof wasm.init,
      publish: typeof wasm.publish,
      parse_graph: typeof wasm.parse_graph,
      get_backlinks: typeof wasm.get_backlinks,
      PublishConfig: typeof wasm.PublishConfig,
      PublishStats: typeof wasm.PublishStats
    };

    const correctTypes = Object.entries(functionTypes).every(([name, type]) => type === 'function');
    testResult('Function signatures', correctTypes,
      `${Object.keys(functionTypes).length} functions/classes`);

    // Test 8: Check package.json
    const pkgPath = path.join(__dirname, 'pkg', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    testResult('package.json valid', pkg.name === 'publish-spa-wasm', `v${pkg.version}`);

    // Test 9: Check TypeScript definitions
    const dtsPath = path.join(__dirname, 'pkg', 'publish_spa_wasm.d.ts');
    const dtsExists = fs.existsSync(dtsPath);
    const dtsSize = dtsExists ? fs.statSync(dtsPath).size : 0;
    testResult('TypeScript definitions', dtsExists, `${dtsSize} bytes`);

    // Test 10: Verify dist/wasm copy
    const distWasmPath = path.join(__dirname, 'dist', 'wasm', 'publish_spa_wasm_bg.wasm');
    const distExists = fs.existsSync(distWasmPath);
    const distSize = distExists ? fs.statSync(distWasmPath).size : 0;
    testResult('dist/wasm copy', distExists, `${(distSize / 1024).toFixed(0)} KB`);

    // Summary
    console.log('\n' + '═'.repeat(50));
    const passed = tests.filter(t => t.passed).length;
    const total = tests.length;
    const percentage = ((passed / total) * 100).toFixed(0);

    console.log(`\n📊 Test Results: ${passed}/${total} passed (${percentage}%)`);

    if (passed === total) {
      console.log('\n🎉 All tests passed! Package is ready for use.\n');
      console.log('Next steps:');
      console.log('  1. Test in your application');
      console.log('  2. Run: npm test (if configured)');
      console.log('  3. Deploy to npm or use locally');
      return 0;
    } else {
      console.log('\n⚠️  Some tests failed. Review the output above.\n');
      return 1;
    }

  } catch (error) {
    console.log('\n' + '═'.repeat(50));
    console.log('\n❌ Integration test failed:', error.message);
    console.log('\nError details:');
    console.error(error.stack);
    return 1;
  }
}

// Run tests
runIntegrationTest()
  .then(code => process.exit(code))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
