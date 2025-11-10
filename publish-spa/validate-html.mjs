#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, './test-output');

async function validateHTML() {
  console.log('🔍 HTML Validation');
  console.log('═'.repeat(60));

  try {
    const files = await fs.readdir(OUTPUT_DIR);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    console.log(`Found ${htmlFiles.length} HTML files`);

    if (htmlFiles.length === 0) {
      console.log('⚠️  No HTML files found in test-output directory');
      console.log('Please run the integration test first to generate HTML files');
      return false;
    }

    let allValid = true;
    const results = [];

    for (const file of htmlFiles) {
      const filePath = path.join(OUTPUT_DIR, file);
      const html = await fs.readFile(filePath, 'utf-8');

      console.log(`\nValidating ${file}...`);

      // Check for basic HTML structure
      const checks = [
        { name: 'DOCTYPE', test: html.includes('<!DOCTYPE html>') || html.includes('<!doctype html>') },
        { name: '<html>', test: html.includes('<html') },
        { name: '<head>', test: html.includes('<head>') },
        { name: '<body>', test: html.includes('<body>') },
        { name: '<title>', test: html.includes('<title>') },
        { name: 'CSS', test: html.includes('<style') || html.includes('.css') },
        { name: 'Closing tags', test: checkClosingTags(html) },
      ];

      let fileValid = true;
      checks.forEach(check => {
        const status = check.test ? '✓' : '✗';
        console.log(`  ${status} ${check.name}`);
        if (!check.test) {
          fileValid = false;
          allValid = false;
        }
      });

      // Check for XSS vulnerabilities (should be escaped)
      const xssCheck = checkXSS(html);
      if (!xssCheck.safe) {
        console.log(`  ✗ WARNING: Potential XSS vulnerability detected: ${xssCheck.reason}`);
        fileValid = false;
        allValid = false;
      } else {
        console.log('  ✓ No obvious XSS vulnerabilities');
      }

      // Check for wiki-links converted to HTML links
      const linkCount = (html.match(/<a href=/g) || []).length;
      console.log(`  ℹ  Found ${linkCount} links`);

      // Check for backlinks section if it exists
      if (html.includes('backlinks') || html.includes('Backlinks')) {
        console.log('  ✓ Backlinks section present');
      }

      // Check for code blocks
      const codeBlocks = (html.match(/<code/g) || []).length;
      const preBlocks = (html.match(/<pre/g) || []).length;
      console.log(`  ℹ  Code blocks: ${codeBlocks}, Pre blocks: ${preBlocks}`);

      results.push({
        file,
        valid: fileValid,
        linkCount,
        codeBlocks,
        preBlocks,
        size: html.length
      });
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📊 Summary:');
    results.forEach(r => {
      const status = r.valid ? '✅' : '❌';
      console.log(`${status} ${r.file} - ${r.linkCount} links, ${r.codeBlocks} code blocks, ${r.size} bytes`);
    });

    console.log('\n' + '═'.repeat(60));
    if (allValid) {
      console.log('✅ ALL VALIDATION CHECKS PASSED');
    } else {
      console.log('❌ SOME VALIDATION CHECKS FAILED');
    }
    console.log('═'.repeat(60));

    return allValid;
  } catch (err) {
    console.error('❌ Validation error:', err);
    return false;
  }
}

function checkClosingTags(html) {
  // Simple check for common unclosed tags
  const tagPairs = [
    ['<html', '</html>'],
    ['<head>', '</head>'],
    ['<body>', '</body>'],
    ['<div', '</div>'],
    ['<span', '</span>'],
    ['<p>', '</p>'],
  ];

  for (const [open, close] of tagPairs) {
    const openCount = (html.match(new RegExp(open, 'g')) || []).length;
    const closeCount = (html.match(new RegExp(close.replace('>', '\\>'), 'g')) || []).length;
    if (openCount > 0 && closeCount === 0) {
      return false; // Found opening tag but no closing tag
    }
  }

  return true;
}

function checkXSS(html) {
  // Check for dangerous patterns
  const dangerousPatterns = [
    { pattern: /<script>alert\(/i, reason: 'Unescaped script alert' },
    { pattern: /javascript:/i, reason: 'JavaScript protocol in link' },
    { pattern: /onerror\s*=/i, reason: 'onerror event handler' },
    { pattern: /onclick\s*=/i, reason: 'onclick event handler' },
    { pattern: /<iframe/i, reason: 'iframe element' },
  ];

  for (const { pattern, reason } of dangerousPatterns) {
    if (pattern.test(html)) {
      return { safe: false, reason };
    }
  }

  return { safe: true };
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateHTML().then(valid => {
    process.exit(valid ? 0 : 1);
  }).catch(err => {
    console.error('Validation error:', err);
    process.exit(1);
  });
}

export { validateHTML };
