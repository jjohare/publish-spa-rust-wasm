---
title: API Reference
tags: api, reference, technical, documentation
---

# API Reference

Technical documentation for the publish-spa WASM API.

## JavaScript API

### publish()

Publishes a Logseq graph to static HTML.

```javascript
import { publish } from 'publish-spa-wasm';

const stats = await publish({
    inputDir: '/path/to/graph',
    outputDir: './output',
    options: {
        theme: 'auto',
        baseUrl: 'https://example.com'
    }
});

console.log(`Published ${stats.pageCount} pages`);
```

**Parameters:**
- `inputDir` (string): Path to Logseq graph directory
- `outputDir` (string): Path for HTML output
- `options` (object, optional):
  - `theme` (string): 'light', 'dark', or 'auto'
  - `baseUrl` (string): Base URL for deployment

**Returns:** `PublishStats`
- `pageCount` (number): Number of pages processed
- `linkCount` (number): Number of links resolved
- `assetCount` (number): Number of assets copied
- `duration` (number): Processing time in milliseconds

### parseGraph()

Parses a Logseq graph into a structured format.

```javascript
import { parseGraph } from 'publish-spa-wasm';

const graph = await parseGraph('/path/to/graph');

console.log(`Found ${graph.pages.length} pages`);
console.log(`Found ${graph.links.length} links`);
```

**Parameters:**
- `graphPath` (string): Path to Logseq graph

**Returns:** `Graph`
- `pages` (Page[]): Array of page objects
- `links` (Link[]): Array of link objects
- `blocks` (Block[]): Array of block objects

### Page Object

```typescript
interface Page {
    title: string;
    content: string;
    metadata: Metadata;
    blocks: Block[];
    links: string[];
    tags: string[];
}
```

### Block Object

```typescript
interface Block {
    id: string;
    content: string;
    level: number;
    children: Block[];
    properties: Record<string, any>;
}
```

## Rust API

For advanced users and contributors.

### Core Types

```rust
pub struct Graph {
    pub pages: Vec<Page>,
    pub links: Vec<Link>,
}

pub struct Page {
    pub title: String,
    pub content: String,
    pub metadata: Metadata,
    pub blocks: Vec<Block>,
}

pub struct Block {
    pub id: String,
    pub content: String,
    pub level: usize,
    pub children: Vec<Block>,
}
```

### Publishing

```rust
use publish_spa::Publisher;

let publisher = Publisher::new(config);
let stats = publisher.publish(input_dir, output_dir)?;

println!("Published {} pages", stats.page_count);
```

## CLI Usage

Command-line interface for publishing.

```bash
# Basic usage
publish-spa --input ./graph --output ./dist

# With options
publish-spa \
    --input ./graph \
    --output ./dist \
    --theme dark \
    --base-url https://example.com

# Show help
publish-spa --help
```

### CLI Options

- `--input, -i`: Input graph directory (required)
- `--output, -o`: Output directory (default: `./output`)
- `--theme, -t`: Color theme (default: `auto`)
- `--base-url, -b`: Base URL for deployment
- `--verbose, -v`: Enable verbose logging
- `--help, -h`: Show help message

## Configuration

### config.edn

Configure publishing behavior in `logseq/config.edn`:

```clojure
{:publishing {
  :theme "auto"
  :exclude-pages ["private"]
  :include-assets true
  :generate-index true
}}
```

## Error Handling

All API functions return `Result` types in Rust and throw exceptions in JavaScript.

```javascript
try {
    await publish({ inputDir: './graph', outputDir: './dist' });
} catch (error) {
    console.error('Publishing failed:', error.message);
}
```

## Troubleshooting

### Common Errors

**`GraphNotFound`**: Input directory doesn't exist or isn't a valid Logseq graph
- **Solution**: Check the path and ensure `pages/` directory exists

**`ParseError`**: Failed to parse a page
- **Solution**: Check for malformed markdown or invalid frontmatter

**`LinkResolutionError`**: Failed to resolve a [[link]]
- **Solution**: Ensure linked pages exist in your graph

See [[getting-started#troubleshooting]] for more help.

## Examples

See the test graph for working examples:
- [[index]] - Home page structure
- [[features]] - Rich content formatting
- [[concepts/blocks]] - Block nesting
- [[concepts/links]] - Link types

## Performance Tips

For best performance:
1. Use relative paths when possible
2. Minimize deep block nesting (>10 levels)
3. Optimize asset sizes before publishing
4. Enable caching for repeated builds

See [[features#performance]] for benchmarks.

---

#api #reference #technical #documentation
