#!/usr/bin/env node

/**
 * CLI wrapper for Logseq Publisher
 * Provides compatibility with the original CLI interface
 */

import { publish, parseGraph, getBacklinks } from './index.js';
import { resolve } from 'path';

// Simple argument parser
function parseArgs(args) {
    const options = {
        inputDir: './graph',
        outputDir: './public',
        theme: 'default',
        includeBacklinks: true,
        includeGraphView: false,
        customCss: null
    };

    let command = null;
    let i = 0;

    while (i < args.length) {
        const arg = args[i];

        switch (arg) {
            case 'build':
                command = 'build';
                break;
            case 'stats':
                command = 'stats';
                break;
            case 'backlinks':
                command = 'backlinks';
                if (i + 1 < args.length) {
                    options.pagePath = args[++i];
                }
                break;
            case '-i':
            case '--input':
                if (i + 1 < args.length) {
                    options.inputDir = args[++i];
                }
                break;
            case '-o':
            case '--output':
                if (i + 1 < args.length) {
                    options.outputDir = args[++i];
                }
                break;
            case '-t':
            case '--theme':
                if (i + 1 < args.length) {
                    options.theme = args[++i];
                }
                break;
            case '--no-backlinks':
                options.includeBacklinks = false;
                break;
            case '--graph-view':
                options.includeGraphView = true;
                break;
            case '--css':
                if (i + 1 < args.length) {
                    options.customCssFile = args[++i];
                }
                break;
            case '-h':
            case '--help':
                command = 'help';
                break;
            default:
                if (!command && !arg.startsWith('-')) {
                    // First positional argument might be output dir for build
                    if (command === null) {
                        options.outputDir = arg;
                    }
                }
        }
        i++;
    }

    return { command, options };
}

function printHelp() {
    console.log(`
Logseq Publisher - Rust WASM Edition

Usage:
  logseq-publish-spa build [OPTIONS]         Build static HTML from Logseq graph
  logseq-publish-spa stats [OPTIONS]         Show graph statistics
  logseq-publish-spa backlinks <page> [OPTIONS]  Show backlinks for a page

Options:
  -i, --input <dir>      Input directory (Logseq graph) [default: ./graph]
  -o, --output <dir>     Output directory [default: ./public]
  -t, --theme <theme>    Theme name [default: default]
  --no-backlinks         Disable backlinks
  --graph-view           Enable interactive graph view
  --css <file>           Custom CSS file
  -h, --help             Show this help message

Examples:
  logseq-publish-spa build -i ./my-graph -o ./dist
  logseq-publish-spa stats -i ./my-graph
  logseq-publish-spa backlinks "my-page" -i ./my-graph
`);
}

async function main() {
    const args = process.argv.slice(2);
    const { command, options } = parseArgs(args);

    if (!command || command === 'help' || args.length === 0) {
        printHelp();
        process.exit(0);
    }

    try {
        // Read custom CSS if specified
        if (options.customCssFile) {
            const { readFileSync } = await import('fs');
            options.customCss = readFileSync(options.customCssFile, 'utf-8');
        }

        // Resolve paths to absolute
        options.inputDir = resolve(options.inputDir);
        options.outputDir = resolve(options.outputDir);

        switch (command) {
            case 'build': {
                console.log('🚀 Building Logseq graph with Rust/WASM...');
                console.log(`📁 Input: ${options.inputDir}`);
                console.log(`📤 Output: ${options.outputDir}`);

                const stats = await publish(options);

                console.log('\n✅ Build complete!');
                console.log(`📄 Pages: ${stats.page_count}`);
                console.log(`📝 Blocks: ${stats.total_blocks}`);
                console.log(`🔗 Links: ${stats.total_links}`);

                if (stats.orphan_pages > 0) {
                    console.log(`⚠️  Orphan pages: ${stats.orphan_pages}`);
                }
                break;
            }

            case 'stats': {
                console.log('📊 Analyzing graph...');
                const stats = await parseGraph(options.inputDir);

                console.log('\nGraph Statistics:');
                console.log(`  Pages: ${stats.page_count}`);
                console.log(`  Blocks: ${stats.total_blocks}`);
                console.log(`  Links: ${stats.total_links}`);
                console.log(`  Orphans: ${stats.orphan_pages}`);
                break;
            }

            case 'backlinks': {
                if (!options.pagePath) {
                    console.error('❌ Page path required for backlinks command');
                    process.exit(1);
                }

                console.log(`🔍 Finding backlinks for ${options.pagePath}...`);
                const backlinks = await getBacklinks(options.inputDir, options.pagePath);

                if (backlinks.length === 0) {
                    console.log('No backlinks found');
                } else {
                    console.log(`\nFound ${backlinks.length} backlinks:`);
                    backlinks.forEach(link => {
                        console.log(`  • ${link}`);
                    });
                }
                break;
            }

            default:
                console.error(`❌ Unknown command: ${command}`);
                printHelp();
                process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (process.env.DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

main();
