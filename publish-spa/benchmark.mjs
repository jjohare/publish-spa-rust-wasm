#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_GRAPH = path.resolve(__dirname, '../test-graph');

async function benchmark() {
  console.log('⚡ Performance Benchmark');
  console.log('═'.repeat(60));

  try {
    // Check if test-graph directory exists
    try {
      await fs.access(TEST_GRAPH);
    } catch {
      console.log('⚠️  Test graph directory not found, creating sample data...');
      await createSampleGraph();
    }

    // Import WASM module
    let wasm;
    try {
      wasm = await import('./pkg/publish_spa_wasm.js');
      await wasm.default();
      console.log('✓ WASM module loaded successfully\n');
    } catch (err) {
      console.error('❌ Failed to load WASM module:', err.message);
      console.log('Please run: npm run build:wasm');
      return false;
    }

    // Warm up
    console.log('Warming up...');
    try {
      await wasm.parse_graph(TEST_GRAPH);
    } catch (err) {
      console.log('⚠️  Parse failed during warmup, using alternative test');
    }

    // Run benchmark (5 iterations)
    const times = [];
    const iterations = 5;
    console.log(`Running ${iterations} iterations...\n`);

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      try {
        await wasm.parse_graph(TEST_GRAPH);
        const end = performance.now();
        times.push(end - start);
        console.log(`  Iteration ${i + 1}: ${(end - start).toFixed(2)}ms`);
      } catch (err) {
        console.log(`  Iteration ${i + 1}: Failed - ${err.message}`);
      }
    }

    if (times.length === 0) {
      console.log('\n❌ No successful iterations');
      return false;
    }

    const avg = times.reduce((a, b) => a + b) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const stdDev = Math.sqrt(times.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / times.length);

    console.log('\n' + '═'.repeat(60));
    console.log('📊 Parse Performance Statistics:');
    console.log(`  Iterations: ${times.length}/${iterations}`);
    console.log(`  Average: ${avg.toFixed(2)}ms`);
    console.log(`  Min: ${min.toFixed(2)}ms`);
    console.log(`  Max: ${max.toFixed(2)}ms`);
    console.log(`  Std Dev: ${stdDev.toFixed(2)}ms`);

    // Memory usage
    const mem = process.memoryUsage();
    console.log('\n💾 Memory Usage:');
    console.log(`  RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  External: ${(mem.external / 1024 / 1024).toFixed(2)} MB`);

    // Performance assessment
    console.log('\n🎯 Performance Assessment:');
    if (avg < 50) {
      console.log('  ⚡ Excellent (< 50ms)');
    } else if (avg < 100) {
      console.log('  ✓ Good (< 100ms)');
    } else if (avg < 200) {
      console.log('  ⚠️  Acceptable (< 200ms)');
    } else {
      console.log('  ❌ Needs Optimization (> 200ms)');
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✅ BENCHMARK COMPLETE');
    console.log('═'.repeat(60));

    return true;
  } catch (err) {
    console.error('❌ Benchmark error:', err);
    return false;
  }
}

async function createSampleGraph() {
  await fs.mkdir(TEST_GRAPH, { recursive: true });

  // Create sample pages
  const pages = [
    { name: 'index.md', content: '# Home\n\nWelcome to the test graph.\n\n[[page1]] [[page2]]' },
    { name: 'page1.md', content: '# Page 1\n\nThis is page 1.\n\n[[index]]' },
    { name: 'page2.md', content: '# Page 2\n\nThis is page 2.\n\n```js\nconsole.log("test");\n```\n\n[[index]]' },
  ];

  for (const page of pages) {
    await fs.writeFile(path.join(TEST_GRAPH, page.name), page.content);
  }

  console.log(`✓ Created sample graph at ${TEST_GRAPH}\n`);
}

// Run benchmark if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  benchmark().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(err => {
    console.error('Benchmark error:', err);
    process.exit(1);
  });
}

export { benchmark };
