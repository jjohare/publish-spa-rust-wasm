# File I/O Implementation Documentation

## Overview

This document describes the file I/O bridge between Rust WASM and Node.js filesystem operations.

## Architecture

The implementation uses a JavaScript bridge layer that connects Rust WASM functions to Node.js filesystem APIs.

```
┌─────────────┐          ┌──────────────┐          ┌──────────────┐
│   Rust      │          │  JavaScript  │          │   Node.js    │
│   WASM      │  extern  │  Bridge      │   uses   │  fs module   │
│  (converter.rs) ◄─────►│ (fs-helpers.js) ◄─────►│              │
└─────────────┘          └──────────────┘          └──────────────┘
```

## Components

### 1. Rust Side (`src/converter.rs`)

The Rust code declares external JavaScript functions using `wasm-bindgen`:

```rust
#[wasm_bindgen(module = "/js/fs-helpers.js")]
extern "C" {
    #[wasm_bindgen(catch)]
    async fn read_dir_recursive(path: &str) -> Result<Array, JsValue>;

    #[wasm_bindgen(catch)]
    async fn write_file(path: &str, content: &str) -> Result<(), JsValue>;

    #[wasm_bindgen(catch)]
    async fn ensure_dir(path: &str) -> Result<(), JsValue>;
}
```

These functions are implemented in JavaScript and called from Rust.

### 2. JavaScript Bridge (`js/fs-helpers.js`)

The JavaScript bridge provides three main functions:

#### `read_dir_recursive(dirPath)`

Recursively reads all markdown files from a directory.

**Parameters:**
- `dirPath` (string): Directory path to scan

**Returns:**
- `Promise<Array<{path: string, content: string}>>`: Array of file objects

**Features:**
- Uses `glob` package for pattern matching
- Finds all `.md` and `.markdown` files
- Returns relative paths from the input directory
- Automatically ignores `node_modules` and `.git` directories
- Handles file read errors gracefully

**Example:**
```javascript
const files = await read_dir_recursive('/path/to/graph');
// Returns: [
//   { path: 'pages/index.md', content: '...' },
//   { path: 'pages/features.md', content: '...' }
// ]
```

#### `write_file(filePath, content)`

Writes a file, creating parent directories as needed.

**Parameters:**
- `filePath` (string): Full path to the file
- `content` (string): File content to write

**Returns:**
- `Promise<void>`

**Features:**
- Automatically creates parent directories using `mkdir -p` semantics
- Uses UTF-8 encoding
- Throws descriptive errors on failure

**Example:**
```javascript
await write_file('/path/to/output/index.html', '<html>...</html>');
```

#### `ensure_dir(dirPath)`

Ensures a directory exists, creating it if necessary.

**Parameters:**
- `dirPath` (string): Directory path

**Returns:**
- `Promise<void>`

**Features:**
- Recursive directory creation
- No error if directory already exists

**Example:**
```javascript
await ensure_dir('/path/to/output/pages');
```

## Security Features

The implementation includes several security measures in the Rust layer:

### Path Validation

```rust
fn validate_input_path(path: &str) -> Result<(), PublishError> {
    // Empty path check
    if path.is_empty() {
        return Err(PublishError::invalid_input("Input directory path cannot be empty"));
    }

    // Path traversal prevention
    if path.contains("..") {
        return Err(PublishError::invalid_input("Path traversal not allowed: path contains '..'"));
    }

    // Absolute path restrictions
    if path.starts_with('/') && !path.starts_with("/home/") && !path.starts_with("/tmp/") {
        return Err(PublishError::invalid_input("Absolute paths outside allowed directories are not permitted"));
    }

    Ok(())
}
```

### File Path Validation

```rust
fn validate_file_path(path: &str) -> Result<(), PublishError> {
    // Empty check
    if path.is_empty() {
        return Err(PublishError::invalid_input("File path cannot be empty"));
    }

    // Path traversal
    if path.contains("..") {
        return Err(PublishError::invalid_input(&format!("Path traversal not allowed in file path: '{}'", path)));
    }

    // Null byte injection
    if path.contains('\0') {
        return Err(PublishError::invalid_input(&format!("Null bytes not allowed in file path: '{}'", path)));
    }

    // Absolute path restriction
    if path.starts_with('/') || path.starts_with('\\') {
        return Err(PublishError::invalid_input(&format!("Absolute file paths not allowed: '{}'", path)));
    }

    Ok(())
}
```

## Error Handling

### JavaScript Layer

Errors in the JavaScript layer are thrown with descriptive messages:

```javascript
try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
} catch (err) {
    throw new Error(`Failed to read file ${filePath}: ${err.message}`);
}
```

### Rust Layer

The Rust layer catches JavaScript errors and wraps them in typed errors:

```rust
let files_array = read_dir_recursive(input_dir)
    .await
    .map_err(|e| PublishError::io(format!("Failed to read directory '{}': {:?}", input_dir, e)))?;
```

## Usage Example

### From Rust

```rust
use crate::converter::{read_graph_files, write_output_files};

// Read all markdown files
let files = read_graph_files("/path/to/graph").await?;
// Returns: HashMap<String, String> of path => content

// Write HTML outputs
let mut output_files = HashMap::new();
output_files.insert("index.html".to_string(), "<html>...</html>".to_string());
write_output_files("/path/to/output", output_files).await?;
```

### From JavaScript/TypeScript

```javascript
import * as wasm from './pkg/publish_spa_wasm.js';

// Initialize WASM
const wasmBytes = await fs.readFile('pkg/publish_spa_wasm_bg.wasm');
await wasm.default(wasmBytes);

// Use the publish function (which uses file I/O bridge internally)
const stats = await wasm.publish({
  input_dir: '/path/to/graph',
  output_dir: '/path/to/output',
  theme: 'default',
  include_backlinks: true,
  include_graph_view: false
});

console.log(`Published ${stats.page_count} pages`);
```

## Testing

The integration test (`test-integration.mjs`) verifies the complete pipeline:

```bash
# Run integration test
node test-integration.mjs

# Expected output:
# 🧪 Integration Test: Full Publish Pipeline
# ════════════════════════════════════════════════════════════
# ✓ Cleaned output directory
# ✓ WASM initialized
#
# Parsing test graph...
# ✓ Graph parsed successfully!
#   Pages: 14
#   Blocks: 1417
#   Links: 113
#   Orphans: 0
#
# Publishing graph...
# ✓ Publish complete!
#   Pages: 14
#
# ✓ Generated 9 files
# ════════════════════════════════════════════════════════════
# ✅ INTEGRATION TEST PASSED
# ════════════════════════════════════════════════════════════
```

## Performance Considerations

### Glob Pattern Matching

The `glob` package is used for efficient file discovery:

```javascript
const pattern = join(dirPath, '**/*.{md,markdown}');
const filePaths = await glob(pattern, {
    ignore: ['**/node_modules/**', '**/.git/**'],
    nodir: true
});
```

### Batch Operations

Files are processed in batches to optimize performance:

```rust
for (path, content) in files {
    // Process each file
}
```

### Memory Management

- Files are read as UTF-8 strings
- Large graphs may require significant memory
- Consider streaming for very large graphs in future versions

## Build Configuration

The WASM module is built without wasm-opt to avoid bulk memory issues:

```bash
# Manual build (in build.sh)
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/release/publish_spa_wasm.wasm \
    --out-dir pkg \
    --target web
```

## Known Limitations

1. **Synchronous Operations**: Node.js fs operations are async, but WASM calls them asynchronously
2. **Path Format**: Currently expects Unix-style paths (uses `/` separator)
3. **File Size**: No streaming support for very large files
4. **Error Details**: JavaScript errors may lose some detail when crossing WASM boundary

## Future Improvements

1. **Streaming Support**: For large file processing
2. **Progress Callbacks**: Report progress during long operations
3. **Parallel Processing**: Read multiple files concurrently
4. **Caching**: Cache file contents to avoid re-reading
5. **Watch Mode**: Monitor file changes and rebuild incrementally

## Dependencies

### JavaScript
- `fs/promises`: Node.js filesystem API
- `path`: Path manipulation
- `glob`: Pattern matching for file discovery

### Rust
- `wasm-bindgen`: JavaScript interop
- `js-sys`: JavaScript types
- `serde`: Serialization for data exchange

## Troubleshooting

### Common Issues

**Problem**: `ERR_UNKNOWN_FILE_EXTENSION: .wasm`
- **Solution**: Use `web` target for wasm-bindgen and load WASM manually

**Problem**: `module is not defined in ES module scope`
- **Solution**: Ensure `package.json` has `"type": "module"`

**Problem**: File not found errors
- **Solution**: Check that paths are relative and use forward slashes

**Problem**: Permission errors
- **Solution**: Ensure output directory is writable

### Debug Tips

1. Enable detailed error logging:
```javascript
.catch(err => {
  console.error('Error:', err);
  console.error('Type:', typeof err);
  console.error('Details:', JSON.stringify(err, null, 2));
});
```

2. Check file discovery:
```javascript
const files = await read_dir_recursive(dirPath);
console.log('Found files:', files.map(f => f.path));
```

3. Verify WASM initialization:
```javascript
await wasm.default(wasmBytes);
console.log('WASM initialized successfully');
```

## Conclusion

The file I/O implementation provides a robust bridge between Rust WASM and Node.js filesystem operations, with proper error handling, security validation, and performance optimizations. The integration test demonstrates the complete workflow from reading Logseq markdown files to generating HTML output.
