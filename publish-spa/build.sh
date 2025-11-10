#!/bin/bash
set -e

echo "🦀 Building Rust WASM module..."

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "❌ wasm-pack not found. Installing..."
    cargo install wasm-pack
fi

# Default mode is build
MODE=${1:-build}

case "$MODE" in
    build)
        echo "📦 Building WASM module..."
        # Build manually to avoid wasm-opt bulk memory issues
        cargo build --release --target wasm32-unknown-unknown
        wasm-bindgen target/wasm32-unknown-unknown/release/publish_spa_wasm.wasm \
            --out-dir pkg \
            --target web

        # Add type: module to package.json
        echo "📝 Updating package.json..."
        cat > pkg/package.json << 'EOF'
{
  "name": "publish-spa-wasm",
  "version": "1.0.0",
  "type": "module",
  "files": [
    "publish_spa_wasm_bg.wasm",
    "publish_spa_wasm.js",
    "publish_spa_wasm.d.ts"
  ],
  "main": "publish_spa_wasm.js",
  "types": "publish_spa_wasm.d.ts",
  "dependencies": {
    "glob": "^10.3.10"
  }
}
EOF

        # Copy the generated files to dist
        echo "📦 Copying generated files to dist..."
        mkdir -p dist/wasm
        cp -r pkg/* dist/wasm/

        echo "✅ Build complete!"
        echo ""
        echo "Generated files:"
        ls -lh dist/wasm/
        ;;

    test)
        echo "🧪 Running WASM tests..."
        echo ""
        echo "Running browser tests..."
        wasm-pack test --headless --chrome

        echo ""
        echo "Running Node.js tests..."
        wasm-pack test --node

        echo ""
        echo "✅ All tests passed!"
        ;;

    test-node)
        echo "🧪 Running Node.js tests only..."
        wasm-pack test --node
        ;;

    test-browser)
        echo "🧪 Running browser tests only..."
        wasm-pack test --headless --chrome
        ;;

    bench)
        echo "📊 Running benchmarks..."
        wasm-pack test --node --test benchmark
        ;;

    check)
        echo "🔍 Running cargo check..."
        cargo check --target wasm32-unknown-unknown
        ;;

    clean)
        echo "🧹 Cleaning build artifacts..."
        rm -rf pkg dist/wasm target
        echo "✅ Clean complete!"
        ;;

    *)
        echo "Usage: $0 [build|test|test-node|test-browser|bench|check|clean]"
        echo ""
        echo "Commands:"
        echo "  build        - Build WASM module (default)"
        echo "  test         - Run all tests (Node.js + browser)"
        echo "  test-node    - Run Node.js tests only"
        echo "  test-browser - Run browser tests only"
        echo "  bench        - Run performance benchmarks"
        echo "  check        - Run cargo check"
        echo "  clean        - Clean build artifacts"
        exit 1
        ;;
esac
