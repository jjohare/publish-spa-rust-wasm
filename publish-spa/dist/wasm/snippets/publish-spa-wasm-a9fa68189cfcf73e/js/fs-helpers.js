/**
 * File system helper functions for WASM/Node.js interop
 * These functions are called from Rust via wasm-bindgen
 */

import { promises as fs } from 'fs';
import { join, dirname, relative } from 'path';
import { glob } from 'glob';

/**
 * Recursively read all files in a directory
 * @param {string} dirPath - Directory path to read
 * @returns {Promise<Array<{path: string, content: string}>>}
 */
export async function read_dir_recursive(dirPath) {
    const files = [];

    try {
        // Find all markdown files
        const pattern = join(dirPath, '**/*.{md,markdown}');
        const filePaths = await glob(pattern, {
            ignore: ['**/node_modules/**', '**/.git/**'],
            nodir: true
        });

        // Read each file
        for (const filePath of filePaths) {
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const relativePath = relative(dirPath, filePath);

                files.push({
                    path: relativePath,
                    content: content
                });
            } catch (err) {
                console.error(`Warning: Failed to read ${filePath}:`, err.message);
            }
        }
    } catch (err) {
        throw new Error(`Failed to read directory ${dirPath}: ${err.message}`);
    }

    return files;
}

/**
 * Write a file, creating directories as needed
 * @param {string} filePath - File path to write
 * @param {string} content - File content
 */
export async function write_file(filePath, content) {
    try {
        // Ensure directory exists
        await fs.mkdir(dirname(filePath), { recursive: true });

        // Write file
        await fs.writeFile(filePath, content, 'utf-8');
    } catch (err) {
        throw new Error(`Failed to write file ${filePath}: ${err.message}`);
    }
}

/**
 * Ensure a directory exists
 * @param {string} dirPath - Directory path
 */
export async function ensure_dir(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
        throw new Error(`Failed to create directory ${dirPath}: ${err.message}`);
    }
}
