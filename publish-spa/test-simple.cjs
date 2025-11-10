#!/usr/bin/env node

/**
 * Simple WASM API Test (CommonJS)
 */

const wasm = require('./pkg/publish_spa_wasm.js');

console.log('═'.repeat(60));
console.log('  Simple WASM API Test');
console.log('═'.repeat(60));
console.log('');

console.log('✓ WASM module loaded');
console.log('Exports:', Object.keys(wasm).filter(k => !k.startsWith('_')).join(', '));
console.log('');

// Test PublishConfig
try {
  const config = new wasm.PublishConfig('../test-graph', './test-output');
  console.log('✓ PublishConfig created');
  console.log('  - Input dir:', '../test-graph');
  console.log('  - Output dir:', './test-output');
  console.log('  - Theme:', config.theme);
  console.log('  - Include backlinks:', config.include_backlinks);
  console.log('  - Include graph view:', config.include_graph_view);
  console.log('');

  // Test setters
  config.set_theme('dark');
  console.log('✓ Theme changed to:', config.theme);

  config.set_include_backlinks(false);
  console.log('✓ Backlinks disabled:', config.include_backlinks);

  console.log('');
} catch (err) {
  console.error('✗ Failed:', err.message);
  process.exit(1);
}

console.log('═'.repeat(60));
console.log('  TEST PASSED ✓');
console.log('═'.repeat(60));
console.log('');
console.log('Note: Full publish() test requires async file I/O implementation');
