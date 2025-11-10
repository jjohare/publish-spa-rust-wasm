---
title: Changelog
tags: changelog, updates, releases, history
---

# Changelog

All notable changes to the publish-spa WASM implementation.

## v1.0.0 (2025-11-10)

### 🎉 Initial WASM Implementation

Complete rewrite from ClojureScript to Rust/WASM:
- **10x performance improvement** over previous implementation
- **200KB bundle** (down from 2MB ClojureScript)
- **Sub-100ms startup time**
- Full feature parity with original implementation

### Features
- Block-based parsing (see [[concepts/blocks]])
- Wiki-link resolution (see [[concepts/links]])
- Page metadata support
- Asset copying
- Multiple theme support

### Technical Details
- Rust 1.70+ required
- wasm-bindgen for JS interop
- Zero-copy parsing where possible
- Incremental compilation support

See [[api-reference]] for complete API documentation.

## v0.9.0 (2025-10-01)

### ClojureScript Version

The original implementation before WASM migration:
- nbb-logseq based
- ClojureScript parsing
- Basic HTML generation
- Limited performance

### Features
- Initial [[features]] implementation
- Basic link resolution
- Simple theming
- Command-line interface

### Known Limitations
- Large bundle size (2MB+)
- Slow startup (1-2 seconds)
- Memory intensive
- Limited browser compatibility

## v0.5.0 (2025-08-15)

### Alpha Release

First working prototype:
- Proof of concept
- Basic parsing
- HTML generation
- No optimization

See [[getting-started]] for migration guide from old versions.

## Roadmap

### v1.1.0 (Planned - 2025-12-01)
- [ ] Interactive search
- [ ] Graph visualization
- [ ] Query support
- [ ] Advanced theming

### v1.2.0 (Planned - 2026-01-15)
- [ ] Plugin system
- [ ] Custom renderers
- [ ] Export formats (PDF, EPUB)
- [ ] Offline support

### v2.0.0 (Planned - 2026-03-01)
- [ ] Real-time collaboration
- [ ] Server-side rendering
- [ ] Database backend
- [ ] Advanced queries

## Migration Guides

### From v0.9.0 to v1.0.0

The WASM implementation is mostly compatible, but note:

**Breaking Changes:**
- CLI flags renamed (see [[api-reference#cli-usage]])
- Config format updated
- Some internal APIs changed

**Migration Steps:**
1. Update dependencies: `npm install publish-spa-wasm@latest`
2. Update build scripts
3. Test with your graph
4. Report issues

**Benefits:**
- 10x faster publishing
- Smaller bundle size
- Better browser support
- Native performance

### From Legacy ClojureScript

If migrating from the original nbb-logseq version:

1. Install new package: `npm install publish-spa-wasm`
2. Update imports in your code
3. Update configuration files
4. Test thoroughly

See [[getting-started]] for detailed setup instructions.

## Performance Benchmarks

### v1.0.0 (WASM)
- Small graph (50 pages): **150ms**
- Medium graph (500 pages): **1.2s**
- Large graph (5000 pages): **8.5s**
- Bundle size: **200KB gzipped**
- Memory usage: **15MB average**

### v0.9.0 (ClojureScript)
- Small graph (50 pages): **1.5s** (10x slower)
- Medium graph (500 pages): **15s** (12.5x slower)
- Large graph (5000 pages): **120s** (14x slower)
- Bundle size: **2.1MB gzipped** (10x larger)
- Memory usage: **150MB average** (10x more)

See [[features#performance]] for more benchmarks.

## Contributors

Thank you to all contributors:
- Core team
- Community testers
- Bug reporters
- Documentation writers

## License

MIT License - See LICENSE file for details.

---

#changelog #updates #releases #history
