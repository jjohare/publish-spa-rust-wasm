# Contributing to @logseq/publish-spa

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Code of Conduct

This project follows the Logseq community guidelines. Be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- **Rust** 1.70+ with `wasm32-unknown-unknown` target
- **Node.js** 16+
- **wasm-pack** for building WASM modules
- **Git** for version control

### Installation

1. Fork and clone the repository:

```bash
git clone https://github.com/your-username/publish-spa.git
cd publish-spa
```

2. Install dependencies:

```bash
npm install
```

3. Install Rust and wasm-pack:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown

# Install wasm-pack
cargo install wasm-pack
```

## Development Setup

### Building the Project

```bash
# Build WASM module
npm run build:wasm

# Or use the build script directly
./build.sh
```

### Running Tests

```bash
# Rust tests
cargo test

# Integration tests
npm test
```

### Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Test your changes:
```bash
cargo test
npm test
```

4. Build and verify:
```bash
npm run build
```

## How to Contribute

### Reporting Bugs

When filing a bug report, include:

- **Description**: Clear description of the bug
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: OS, Node.js version, Rust version
- **Logs**: Any relevant error messages or logs

### Suggesting Features

For feature requests:

1. Check if the feature has already been requested
2. Provide a clear use case
3. Explain how it benefits users
4. Consider implementation complexity

### Code Contributions

Areas where contributions are welcome:

- **Parser improvements**: Better handling of Logseq syntax
- **Export features**: Additional export formats or customization
- **Performance**: Optimization of parsing or HTML generation
- **Documentation**: Improving examples and guides
- **Testing**: Adding more test cases
- **Bug fixes**: Fixing reported issues

## Coding Standards

### Rust Code Style

Follow standard Rust conventions:

```rust
// Use clear, descriptive names
pub struct Page {
    pub title: String,
    pub content: String,
    pub links: Vec<String>,
}

// Document public APIs
/// Parses a Logseq markdown page
///
/// # Arguments
/// * `content` - The markdown content
/// * `path` - The file path
///
/// # Returns
/// A `Result` containing the parsed `Page` or an error
pub fn parse_logseq_page(content: &str, path: &str) -> Result<Page, ParseError> {
    // Implementation
}

// Use idiomatic error handling
match parse_result {
    Ok(page) => process_page(page),
    Err(e) => return Err(e.into()),
}

// Keep functions focused and small
pub fn process_page(page: Page) -> Result<Html, ExportError> {
    validate_page(&page)?;
    convert_to_html(&page)
}
```

### JavaScript/TypeScript Style

```typescript
// Use async/await
async function publishGraph(config: PublishConfig): Promise<PublishStats> {
  const stats = await publishSpa.publish(config);
  return stats;
}

// Clear error handling
try {
  const result = await operation();
} catch (error) {
  console.error('Operation failed:', error.message);
  throw error;
}

// Descriptive variable names
const publishConfig = {
  inputDir: './graph',
  outputDir: './output'
};
```

### Code Formatting

- **Rust**: Use `rustfmt` (run `cargo fmt`)
- **JavaScript**: Use project's Prettier config
- **Line length**: Maximum 100 characters
- **Indentation**: 2 spaces for JS, 4 spaces for Rust

## Testing

### Rust Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple_page() {
        let content = "# Title\n- Block 1\n- Block 2";
        let page = parse_logseq_page(content, "test.md").unwrap();
        assert_eq!(page.title, "Title");
        assert_eq!(page.blocks.len(), 2);
    }

    #[test]
    fn test_error_handling() {
        let invalid = "((invalid syntax";
        let result = parse_logseq_page(invalid, "test.md");
        assert!(result.is_err());
    }
}
```

### Integration Tests

```javascript
// test-integration.mjs
import * as publishSpa from './dist/index.js';

async function testPublish() {
  const stats = await publishSpa.publish({
    inputDir: './test-fixtures/simple-graph',
    outputDir: './test-output'
  });

  assert(stats.page_count > 0, 'Should publish pages');
  assert(stats.total_blocks > 0, 'Should have blocks');
}
```

### Test Coverage

- Aim for >80% code coverage
- Test edge cases and error conditions
- Include integration tests for main workflows
- Test WASM bindings work correctly

## Pull Request Process

### Before Submitting

1. **Run all tests**: `cargo test && npm test`
2. **Format code**: `cargo fmt`
3. **Lint**: `cargo clippy`
4. **Build**: `npm run build`
5. **Update docs**: If you changed APIs or behavior
6. **Write tests**: Add tests for new features

### PR Description

Include:

- **What**: What changes are in this PR
- **Why**: Why these changes are needed
- **How**: How the changes work
- **Testing**: How you tested the changes
- **Screenshots**: If applicable

### PR Template

```markdown
## Description
Brief description of changes

## Motivation
Why these changes are needed

## Changes
- Change 1
- Change 2

## Testing
How to test these changes

## Checklist
- [ ] Tests pass
- [ ] Code formatted
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Automated checks must pass (tests, build)
2. At least one maintainer review required
3. Address feedback and comments
4. Maintainer will merge when approved

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes

### Release Checklist

For maintainers:

1. Update version in `Cargo.toml` and `package.json`
2. Update `CHANGELOG.md`
3. Build and test: `npm run build && npm test`
4. Commit: `git commit -am "Release v1.2.3"`
5. Tag: `git tag v1.2.3`
6. Push: `git push && git push --tags`
7. Publish: `npm publish`
8. Create GitHub release with changelog

## Architecture Overview

### Project Structure

```
publish-spa/
├── src/                    # Rust source code
│   ├── lib.rs             # WASM bindings and main API
│   ├── parser.rs          # Logseq markdown parser
│   ├── graph.rs           # Graph data structure
│   ├── exporter.rs        # HTML export logic
│   ├── converter.rs       # File I/O utilities
│   └── errors.rs          # Error types
├── dist/                   # Compiled output
│   ├── index.js           # Main entry point
│   ├── publish_spa_wasm.js     # WASM wrapper
│   └── publish_spa_wasm_bg.wasm # WASM binary
├── examples/              # Usage examples
├── tests/                 # Integration tests
└── build.sh              # Build script
```

### Key Components

1. **Parser** (`parser.rs`): Parses Logseq markdown into structured data
2. **Graph** (`graph.rs`): Builds page relationships and backlinks
3. **Exporter** (`exporter.rs`): Generates HTML from graph
4. **Converter** (`converter.rs`): Handles file I/O (async)
5. **Bindings** (`lib.rs`): WASM bindings to JavaScript

## Getting Help

- **Issues**: File an issue for bugs or questions
- **Discussions**: Use GitHub Discussions for general questions
- **Discord**: Join the Logseq Discord community
- **Documentation**: Check the [README](./README.md)

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Recognition

Contributors will be recognized in:

- GitHub contributors page
- Release notes
- Special thanks in documentation

Thank you for contributing to @logseq/publish-spa! 🎉
