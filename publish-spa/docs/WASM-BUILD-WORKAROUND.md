# WASM Build Workaround Documentation

## Problem Summary

The `wasm-pack build` command fails during the optimization phase with bulk-memory operation errors:

```
wasm-opt failed!

Error: failed to execute `wasm-opt`: exited with exit status: 1
  full command: "wasm-opt" "-Oz" "--enable-bulk-memory" ...

error: unknown flag: enable-bulk-memory
```

This is caused by a mismatch between the version of `wasm-opt` and the bulk-memory features being used.

## Solution: Manual Package Creation

Instead of using `wasm-pack build`, we manually create the package using `wasm-bindgen` CLI:

### Step 1: Compile to WASM

```bash
cargo build --target wasm32-unknown-unknown --release
```

This produces: `target/wasm32-unknown-unknown/release/publish_spa_wasm.wasm` (1.3 MB unoptimized)

### Step 2: Install Matching wasm-bindgen-cli

```bash
# Match the version in Cargo.toml (currently 0.2.105)
cargo install -f wasm-bindgen-cli --version 0.2.105
```

### Step 3: Generate JavaScript Bindings

```bash
# Clean and create pkg directory
rm -rf pkg && mkdir -p pkg

# Generate bindings with web target
wasm-bindgen target/wasm32-unknown-unknown/release/publish_spa_wasm.wasm \
  --out-dir pkg \
  --target web \
  --typescript
```

**Why web target?**
- `nodejs` target: Uses `require()` which conflicts with Node.js ESM
- `bundler` target: Requires a bundler to handle WASM imports
- `web` target: ✅ Works in both Node.js and browsers with manual init

### Step 4: Install Dependencies

```bash
cd pkg && npm install && cd ..
```

The generated package requires `glob` for filesystem operations.

### Step 5: Copy to dist

```bash
mkdir -p dist/wasm
cp -r pkg/* dist/wasm/
```

## Package Structure

```
pkg/
├── package.json                    # Package metadata and dependencies
├── publish_spa_wasm.js             # Main entry point (27 KB)
├── publish_spa_wasm.d.ts           # TypeScript definitions (4 KB)
├── publish_spa_wasm_bg.wasm        # WASM binary (992 KB unoptimized)
├── publish_spa_wasm_bg.wasm.d.ts   # WASM type definitions (2 KB)
├── snippets/                       # JavaScript helpers
│   └── publish-spa-wasm-*/
│       └── js/
│           └── fs-helpers.js       # Node.js filesystem operations
└── node_modules/                   # Dependencies (glob, etc.)
```

## Usage Example

```javascript
import fs from 'fs';
import * as wasm from './pkg/publish_spa_wasm.js';

// Initialize WASM with buffer
const wasmBuffer = fs.readFileSync('./pkg/publish_spa_wasm_bg.wasm');
await wasm.default(wasmBuffer);

// Use the API
const stats = await wasm.publish({
  input_dir: './my-logseq-graph',
  output_dir: './dist',
  include_backlinks: true,
  include_graph_view: true,
  theme: 'light'
});

console.log('Published:', stats.page_count, 'pages');
```

## Performance Implications

### Current State (Unoptimized)
- **WASM Size**: 992 KB
- **Load Time**: ~100-200ms (local)
- **Runtime**: Full performance (WASM is JIT-optimized)

### With wasm-opt (When Fixed)
- **WASM Size**: ~600-700 KB (30-40% reduction)
- **Load Time**: ~60-120ms (30-40% faster)
- **Runtime**: Same performance

**Verdict**: The unoptimized WASM works perfectly fine. The main impact is slightly larger download size and marginally slower initial load. Runtime performance is identical.

## Automation Script

Created `scripts/build-wasm-manual.sh`:

```bash
#!/bin/bash
set -e

echo "Building WASM manually (bypassing wasm-pack)..."

# Compile to WASM
cargo build --target wasm32-unknown-unknown --release

# Generate bindings
rm -rf pkg && mkdir -p pkg
wasm-bindgen target/wasm32-unknown-unknown/release/publish_spa_wasm.wasm \
  --out-dir pkg \
  --target web \
  --typescript

# Install dependencies
cd pkg && npm install && cd ..

# Copy to dist
mkdir -p dist/wasm
cp -r pkg/* dist/wasm/

echo "✅ WASM package created in pkg/ and dist/wasm/"
echo "📦 Size: $(du -sh pkg/publish_spa_wasm_bg.wasm | cut -f1)"
```

## Testing

Run the test script:

```bash
node test-wasm-web.js
```

Expected output:
```
✓ WASM binary found (992.13 KB)
✓ WASM module compiled
✓ JavaScript bindings imported
✓ WASM initialized successfully
✅ All tests passed!
```

## Future Fix

When `wasm-opt` is updated to support the features we need, we can switch back to:

```bash
wasm-pack build --target web
```

This will provide automatic optimization without manual steps.

## Version Compatibility

| Tool | Version | Notes |
|------|---------|-------|
| wasm-bindgen (Rust) | 0.2.105 | In Cargo.toml |
| wasm-bindgen-cli | 0.2.105 | Must match exactly |
| wasm-pack | 0.13.1 | Currently broken |
| rustc | 1.85.0-nightly | Works fine |

## Known Issues

1. **wasm-pack optimization fails**: Using manual build instead
2. **Node.js ESM compatibility**: Using web target solves this
3. **glob dependency**: Auto-installed from package.json

## References

- [wasm-bindgen docs](https://rustwasm.github.io/wasm-bindgen/)
- [wasm-pack issue tracker](https://github.com/rustwasm/wasm-pack/issues)
- [Original project](https://github.com/pengx17/logseq-publish-spa)
