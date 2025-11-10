#!/bin/bash
set -e

echo "🔧 Building WASM manually (bypassing wasm-pack)..."
echo ""

# Step 1: Compile to WASM
echo "Step 1/5: Compiling Rust to WASM..."
cargo build --target wasm32-unknown-unknown --release
echo "✓ WASM compiled: target/wasm32-unknown-unknown/release/publish_spa_wasm.wasm"
echo ""

# Step 2: Check wasm-bindgen version
echo "Step 2/5: Checking wasm-bindgen-cli version..."
REQUIRED_VERSION="0.2.105"
if ! command -v wasm-bindgen &> /dev/null || ! wasm-bindgen --version | grep -q "$REQUIRED_VERSION"; then
    echo "Installing wasm-bindgen-cli $REQUIRED_VERSION..."
    cargo install -f wasm-bindgen-cli --version "$REQUIRED_VERSION"
fi
echo "✓ wasm-bindgen-cli $REQUIRED_VERSION ready"
echo ""

# Step 3: Generate JavaScript bindings
echo "Step 3/5: Generating JavaScript bindings..."
rm -rf pkg && mkdir -p pkg
wasm-bindgen target/wasm32-unknown-unknown/release/publish_spa_wasm.wasm \
  --out-dir pkg \
  --target web \
  --typescript
echo "✓ Bindings generated in pkg/"
echo ""

# Step 4: Install dependencies
echo "Step 4/5: Installing dependencies..."
cd pkg
npm install --silent
cd ..
echo "✓ Dependencies installed"
echo ""

# Step 5: Copy to dist
echo "Step 5/5: Copying to dist/wasm..."
mkdir -p dist/wasm
rm -rf dist/wasm/*
cp -r pkg/* dist/wasm/
echo "✓ Package copied to dist/wasm/"
echo ""

# Summary
echo "📊 Build Summary:"
echo "  - WASM binary: $(du -sh pkg/publish_spa_wasm_bg.wasm | cut -f1)"
echo "  - JS bindings: $(du -sh pkg/publish_spa_wasm.js | cut -f1)"
echo "  - Total package: $(du -sh pkg | cut -f1)"
echo ""
echo "✅ WASM package ready!"
echo ""
echo "Test with: node test-wasm-web.js"
echo "Documentation: docs/WASM-BUILD-WORKAROUND.md"
