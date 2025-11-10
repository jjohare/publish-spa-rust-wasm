#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_GRAPH = path.resolve(__dirname, '../test-graph');
const OUTPUT_DIR = path.resolve(__dirname, './test-output');

async function runFullPipeline() {
  console.log('🚀 Full Pipeline Test');
  console.log('═'.repeat(60));

  let allPassed = true;

  try {
    // Step 1: Setup test environment
    console.log('\n📁 Step 1: Setting up test environment...');
    await fs.mkdir(TEST_GRAPH, { recursive: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Clean output directory
    const existingFiles = await fs.readdir(OUTPUT_DIR);
    for (const file of existingFiles) {
      await fs.unlink(path.join(OUTPUT_DIR, file));
    }
    console.log('✓ Test environment ready');

    // Step 2: Create test graph
    console.log('\n📝 Step 2: Creating test graph...');
    const testPages = [
      {
        name: 'index.md',
        content: `# Test Wiki Home

Welcome to the test wiki! This is a comprehensive test of the publish-spa system.

## Features

- [[page-1|Link to Page 1]]
- [[page-2|Link to Page 2]]
- [[code-examples|Code Examples]]

## About

This is a test graph with various types of content.`
      },
      {
        name: 'page-1.md',
        content: `# Page 1

This is the first test page.

## Content

- Links back to [[index]]
- References [[page-2]]
- Has a code block:

\`\`\`javascript
function test() {
  console.log("Hello from page 1");
}
\`\`\`

## More Info

See [[code-examples]] for more.`
      },
      {
        name: 'page-2.md',
        content: `# Page 2

This is the second test page with **bold** and *italic* text.

## Links

- Back to [[index]]
- See also [[page-1]]

## Lists

1. First item
2. Second item
3. Third item

- Bullet one
- Bullet two`
      },
      {
        name: 'code-examples.md',
        content: `# Code Examples

Here are some code examples in different languages.

## JavaScript

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## Python

\`\`\`python
def greet():
    print("Hello, World!")

greet()
\`\`\`

## Rust

\`\`\`rust
fn main() {
    println!("Hello, World!");
}
\`\`\`

Back to [[index]]`
      },
      {
        name: 'orphan.md',
        content: `# Orphan Page

This page has no incoming links (orphan).

It links to [[index]] but nothing links to it.`
      }
    ];

    for (const page of testPages) {
      await fs.writeFile(path.join(TEST_GRAPH, page.name), page.content);
    }
    console.log(`✓ Created ${testPages.length} test pages`);

    // Step 3: Load and run WASM
    console.log('\n🦀 Step 3: Loading WASM module...');
    let wasm;
    try {
      wasm = await import('./pkg/publish_spa_wasm.js');
      await wasm.default();
      console.log('✓ WASM module loaded');
    } catch (err) {
      console.error('❌ Failed to load WASM:', err.message);
      allPassed = false;
      return allPassed;
    }

    // Step 4: Parse graph
    console.log('\n🔍 Step 4: Parsing graph...');
    let graphData;
    try {
      const start = performance.now();
      graphData = await wasm.parse_graph(TEST_GRAPH);
      const duration = performance.now() - start;
      console.log(`✓ Parsed graph in ${duration.toFixed(2)}ms`);
      console.log(`  Pages found: ${graphData.pages?.length || 0}`);
    } catch (err) {
      console.error('❌ Failed to parse graph:', err.message);
      allPassed = false;
      return allPassed;
    }

    // Step 5: Generate HTML
    console.log('\n📄 Step 5: Generating HTML...');
    if (!graphData || !graphData.pages) {
      console.error('❌ No graph data available');
      allPassed = false;
      return allPassed;
    }

    let htmlCount = 0;
    for (const page of graphData.pages) {
      try {
        const html = await wasm.render_html(page, graphData);
        const outputPath = path.join(OUTPUT_DIR, `${page.slug}.html`);
        await fs.writeFile(outputPath, html);
        htmlCount++;
      } catch (err) {
        console.error(`  ❌ Failed to render ${page.slug}:`, err.message);
        allPassed = false;
      }
    }
    console.log(`✓ Generated ${htmlCount} HTML files`);

    // Step 6: Verify output
    console.log('\n✅ Step 6: Verifying output...');
    const outputFiles = await fs.readdir(OUTPUT_DIR);
    const htmlFiles = outputFiles.filter(f => f.endsWith('.html'));

    console.log(`  HTML files created: ${htmlFiles.length}`);
    console.log(`  Files: ${htmlFiles.join(', ')}`);

    // Check for specific files
    const expectedFiles = ['index.html', 'page-1.html', 'page-2.html', 'code-examples.html', 'orphan.html'];
    const missing = expectedFiles.filter(f => !htmlFiles.includes(f));

    if (missing.length > 0) {
      console.log(`  ⚠️  Missing expected files: ${missing.join(', ')}`);
    } else {
      console.log('  ✓ All expected files present');
    }

    // Verify content of index.html
    const indexPath = path.join(OUTPUT_DIR, 'index.html');
    try {
      const indexHtml = await fs.readFile(indexPath, 'utf-8');
      const checks = [
        { name: 'Contains title', test: indexHtml.includes('Test Wiki Home') },
        { name: 'Has links', test: indexHtml.includes('<a href=') },
        { name: 'Has HTML structure', test: indexHtml.includes('<!DOCTYPE html>') || indexHtml.includes('<html') }
      ];

      checks.forEach(check => {
        const status = check.test ? '✓' : '✗';
        console.log(`  ${status} ${check.name}`);
        if (!check.test) allPassed = false;
      });
    } catch (err) {
      console.log('  ⚠️  Could not verify index.html content');
    }

    console.log('\n' + '═'.repeat(60));
    if (allPassed) {
      console.log('✅ FULL PIPELINE TEST PASSED');
    } else {
      console.log('❌ FULL PIPELINE TEST HAD FAILURES');
    }
    console.log('═'.repeat(60));

    return allPassed;

  } catch (err) {
    console.error('❌ Pipeline error:', err);
    return false;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFullPipeline().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(err => {
    console.error('Pipeline error:', err);
    process.exit(1);
  });
}

export { runFullPipeline };
