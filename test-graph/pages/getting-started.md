---
title: Getting Started
tags: tutorial, guide, documentation
---

# Getting Started Guide

Welcome! This guide will help you understand how to use the publish-spa system.

## Prerequisites

Before you begin, ensure you have:
- Rust toolchain installed (1.70+)
- Node.js and npm
- A Logseq graph to publish

## Installation

Follow these steps to set up the publishing system:

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/publish-spa-rust-wasm
cd publish-spa-rust-wasm
```

### Step 2: Install Dependencies
```bash
# Install npm dependencies
npm install

# Build the WASM module
cargo build --release --target wasm32-unknown-unknown
```

### Step 3: Build the Project
```bash
npm run build
```

## Usage

### Publishing Your Graph

To publish your Logseq graph to static HTML:

```bash
npm run publish -- --input /path/to/your/graph --output ./output
```

This will:
- Parse all pages and blocks
- Process wiki-links and references
- Generate static HTML files
- Copy assets to the output directory

### Configuration Options

You can customize the publishing process:
- `--input`: Path to your Logseq graph directory
- `--output`: Where to save the generated HTML
- `--theme`: Choose a theme (light, dark, auto)
- `--base-url`: Base URL for deployed site

## Next Steps

- Explore [[features]] to see what's possible
- Check the [[api-reference]] for programmatic usage
- Review [[concepts/blocks]] to understand the data model
- See [[changelog]] for recent updates

## Troubleshooting

### Common Issues

**Problem**: Build fails with WASM errors
- **Solution**: Ensure you have the latest Rust toolchain and wasm-bindgen installed

**Problem**: Links not resolving correctly
- **Solution**: Check that your page names match the [[links|link syntax]]

For more help, see the [[api-reference#troubleshooting]] section.

---

#tutorial #guide #getting-started
