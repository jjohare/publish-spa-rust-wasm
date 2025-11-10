# Documentation Index

Complete documentation for @logseq/publish-spa Rust WASM implementation.

## 📚 Main Documentation

### Core Documentation
- **[README.md](../README.md)** - Main project documentation with API reference
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and release notes
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[LICENSE](../LICENSE)** - ISC License

### Guides
- **[MIGRATION.md](./MIGRATION.md)** - Migration guide from ClojureScript to Rust WASM
- **[WASM-BUILD-WORKAROUND.md](./WASM-BUILD-WORKAROUND.md)** - Build system workarounds

## 🎯 Quick Links

### Getting Started
1. [Installation](../README.md#installation)
2. [Quick Start](../README.md#quick-start)
3. [API Reference](../README.md#api)
4. [CLI Usage](../README.md#cli-usage)

### Examples
- **[examples/basic.mjs](../examples/basic.mjs)** - Basic usage example
- **[examples/advanced.mjs](../examples/advanced.mjs)** - Advanced configuration
- **[examples/cli.mjs](../examples/cli.mjs)** - Custom CLI wrapper
- **[examples/browser.html](../examples/browser.html)** - Browser usage demo

### Development
- [Development Setup](../CONTRIBUTING.md#development-setup)
- [Building from Source](../README.md#building-from-source)
- [Testing](../CONTRIBUTING.md#testing)
- [Coding Standards](../CONTRIBUTING.md#coding-standards)

## 📖 Documentation Structure

```
publish-spa/
├── README.md                    # Main documentation
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Contribution guide
├── package.json                 # NPM package config
│
├── docs/                        # Additional documentation
│   ├── README.md               # This file
│   ├── MIGRATION.md            # Migration guide
│   └── WASM-BUILD-WORKAROUND.md # Build workarounds
│
├── examples/                    # Usage examples
│   ├── basic.mjs               # Basic usage
│   ├── advanced.mjs            # Advanced features
│   ├── cli.mjs                 # CLI wrapper
│   └── browser.html            # Browser demo
│
└── src/                         # Rust source code
    ├── lib.rs                  # WASM bindings
    ├── parser.rs               # Markdown parser
    ├── graph.rs                # Graph structure
    ├── exporter.rs             # HTML export
    └── converter.rs            # File I/O
```

## 🔍 Documentation by Topic

### For Users

#### Installation & Setup
- [Installing the package](../README.md#installation)
- [Node.js requirements](../README.md#requirements)
- [Browser compatibility](../README.md#browser-usage)

#### Basic Usage
- [Publishing a graph](../examples/basic.mjs)
- [CLI commands](../README.md#cli-usage)
- [Configuration options](../README.md#api)

#### Advanced Features
- [Custom themes](../examples/advanced.mjs)
- [Graph visualization](../README.md#api)
- [Custom CSS](../examples/advanced.mjs)
- [Backlinks](../README.md#getbacklinks)

#### Migration
- [From ClojureScript version](./MIGRATION.md)
- [API changes](./MIGRATION.md#api-migration)
- [Configuration changes](./MIGRATION.md#configuration-changes)
- [CLI migration](./MIGRATION.md#cli-migration)

### For Contributors

#### Getting Started
- [Development setup](../CONTRIBUTING.md#development-setup)
- [Building the project](../CONTRIBUTING.md#building-the-project)
- [Running tests](../CONTRIBUTING.md#running-tests)

#### Code Guidelines
- [Rust code style](../CONTRIBUTING.md#rust-code-style)
- [JavaScript style](../CONTRIBUTING.md#javascripttypescript-style)
- [Code formatting](../CONTRIBUTING.md#code-formatting)

#### Contributing
- [How to contribute](../CONTRIBUTING.md#how-to-contribute)
- [Pull request process](../CONTRIBUTING.md#pull-request-process)
- [Testing requirements](../CONTRIBUTING.md#testing)

#### Architecture
- [Project structure](../CONTRIBUTING.md#project-structure)
- [Key components](../CONTRIBUTING.md#key-components)
- [WASM bindings](../src/lib.rs)

### For Maintainers

#### Release Process
- [Versioning](../CONTRIBUTING.md#versioning)
- [Release checklist](../CONTRIBUTING.md#release-checklist)
- [Changelog updates](../CHANGELOG.md)

#### Security
- [Reporting vulnerabilities](../README.md#reporting-vulnerabilities)
- [Security features](../README.md#security-features)

## 🎓 Learning Path

### Beginner
1. Read [Quick Start](../README.md#quick-start)
2. Try [Basic Example](../examples/basic.mjs)
3. Explore [CLI Usage](../README.md#cli-usage)

### Intermediate
1. Study [API Reference](../README.md#api)
2. Try [Advanced Example](../examples/advanced.mjs)
3. Read [Configuration](../README.md#api)

### Advanced
1. Read [Architecture](../CONTRIBUTING.md#architecture-overview)
2. Study [Rust source code](../src/)
3. Read [WASM bindings](../src/lib.rs)
4. Contribute to the project

### Migrating
1. Read [Migration Guide](./MIGRATION.md)
2. Check [Breaking Changes](./MIGRATION.md#breaking-changes)
3. Follow [Step-by-Step Migration](./MIGRATION.md#step-by-step-migration)

## 🔧 Troubleshooting

Common issues and solutions:

- [Module not found](../README.md#cannot-find-module-error)
- [Memory errors](../README.md#memory-errors-in-large-graphs)
- [WASM initialization](../README.md#wasm-initialization-fails)
- [Build issues](./WASM-BUILD-WORKAROUND.md)

## 📊 Performance

- [Benchmarks](../README.md#performance)
- [Performance comparison](../CHANGELOG.md#performance-benchmarks)
- [Memory usage](../README.md#performance)

## 🔗 External Resources

### Logseq
- [Logseq Website](https://logseq.com/)
- [Logseq Documentation](https://docs.logseq.com/)
- [Logseq GitHub](https://github.com/logseq/logseq)

### Technologies
- [Rust](https://www.rust-lang.org/)
- [WebAssembly](https://webassembly.org/)
- [wasm-bindgen](https://rustwasm.github.io/wasm-bindgen/)
- [pulldown-cmark](https://github.com/raphlinus/pulldown-cmark)

### Community
- [GitHub Issues](https://github.com/logseq/publish-spa/issues)
- [GitHub Discussions](https://github.com/logseq/publish-spa/discussions)
- [Logseq Discord](https://discord.gg/logseq)

## 📝 Documentation Stats

- **Total files**: 8 main documents
- **Total lines**: 2000+ lines of documentation
- **Examples**: 4 complete examples
- **Guides**: 2 comprehensive guides
- **Languages**: English

## 🤝 Getting Help

1. **Check Documentation**: Start with [README.md](../README.md)
2. **Search Issues**: Check [existing issues](https://github.com/logseq/publish-spa/issues)
3. **Ask Questions**: Use [GitHub Discussions](https://github.com/logseq/publish-spa/discussions)
4. **Report Bugs**: File a [new issue](https://github.com/logseq/publish-spa/issues/new)

## 📅 Last Updated

Documentation last updated: 2024-01-15

## 📄 License

All documentation is licensed under ISC License - see [LICENSE](../LICENSE) for details.
