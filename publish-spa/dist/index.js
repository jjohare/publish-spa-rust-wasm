/**
 * Logseq Publisher - Rust WASM wrapper for Node.js
 *
 * This module provides a clean JavaScript API around the Rust WASM implementation
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the WASM module
let wasmModule;

async function initWasm() {
    if (!wasmModule) {
        // In a real build, wasm-pack would generate these files
        // For now, we'll create a stub that throws an informative error
        throw new Error(
            'WASM module not built yet. Please run: npm run build:wasm'
        );
    }
    return wasmModule;
}

/**
 * Publish a Logseq graph as a static HTML site
 *
 * @param {Object} options - Publishing options
 * @param {string} options.inputDir - Input directory containing Logseq graph
 * @param {string} options.outputDir - Output directory for generated HTML
 * @param {string} [options.theme='default'] - Theme name
 * @param {boolean} [options.includeBacklinks=true] - Include backlinks in pages
 * @param {boolean} [options.includeGraphView=false] - Include interactive graph view
 * @param {string} [options.customCss] - Custom CSS to inject
 * @returns {Promise<Object>} Publishing statistics
 */
export async function publish(options) {
    const wasm = await initWasm();

    // Normalize options
    const config = {
        inputDir: options.inputDir,
        outputDir: options.outputDir,
        theme: options.theme || 'default',
        includeBacklinks: options.includeBacklinks !== false,
        includeGraphView: options.includeGraphView || false,
        customCss: options.customCss || null
    };

    try {
        const stats = await wasm.publish(config);
        return stats;
    } catch (error) {
        throw new Error(`Publishing failed: ${error.message}`);
    }
}

/**
 * Parse a Logseq graph and return statistics
 *
 * @param {string} inputDir - Input directory containing Logseq graph
 * @returns {Promise<Object>} Graph statistics
 */
export async function parseGraph(inputDir) {
    const wasm = await initWasm();

    try {
        const stats = await wasm.parse_graph(inputDir);
        return stats;
    } catch (error) {
        throw new Error(`Graph parsing failed: ${error.message}`);
    }
}

/**
 * Get backlinks for a specific page
 *
 * @param {string} inputDir - Input directory containing Logseq graph
 * @param {string} pagePath - Path to the page
 * @returns {Promise<string[]>} Array of backlink paths
 */
export async function getBacklinks(inputDir, pagePath) {
    const wasm = await initWasm();

    try {
        const backlinks = await wasm.get_backlinks(inputDir, pagePath);
        return backlinks;
    } catch (error) {
        throw new Error(`Failed to get backlinks: ${error.message}`);
    }
}

// Export for CommonJS compatibility
export default { publish, parseGraph, getBacklinks };
