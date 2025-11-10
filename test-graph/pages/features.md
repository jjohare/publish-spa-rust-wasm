---
title: Features
tags: features, documentation, overview
---

# Features

The publish-spa WASM implementation includes comprehensive support for Logseq features.

## Core Features

### Block-based Editing
Edit content as discrete blocks with full nesting support:
- Top level block
  - Nested block level 1
    - Nested block level 2
      - Deep nesting supported
  - Another nested block
- Back to top level

See [[concepts/blocks]] for more details.

### Bidirectional Linking
[[pages|Pages]] link to each other automatically:
- Create links with `[[page-name]]` syntax
- See backlinks automatically
- Explore the knowledge graph
- Follow connections between ideas

Learn more in [[concepts/links]].

### Rich Formatting

**Bold text**, *italic text*, ~~strikethrough~~, `inline code`, and ==highlights==.

### Code Blocks

Syntax highlighting for multiple languages:

```rust
fn main() {
    println!("Hello from Rust!");
}
```

```javascript
function greet(name) {
    console.log(`Hello, ${name}!`);
}
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

## Advanced Features

### Task Management
- TODO Implement feature X
- DOING Work in progress on Y
- DONE Completed feature Z
- CANCELLED Won't implement W

### Tags and References
Use #tags to categorize content:
- #feature
- #documentation
- #advanced

### Queries and Embeds
While not yet fully supported in the static export, the parser handles:
- Block references `((block-id))`
- Page embeds `{{embed [[page-name]]}}`

### Metadata
Pages support frontmatter metadata:
- Title
- Tags
- Public/private flags
- Custom properties

See the [[api-reference]] for technical details.

## Performance

The WASM implementation provides:
- **10x faster** parsing compared to ClojureScript
- **Smaller bundle size** (200KB vs 2MB)
- **Better startup time** (<100ms vs 1s+)
- **Native performance** in the browser

Check [[changelog]] for benchmark details.

## Compatibility

### Supported Formats
- Standard Logseq markdown
- Wiki-links `[[page]]`
- Block references `((ref))`
- Org-mode syntax (partial)

### Export Targets
- Static HTML site
- Single-page application
- GitHub Pages compatible
- Netlify/Vercel ready

## Roadmap

Future features planned:
- [ ] Full query support
- [ ] Interactive graph view
- [ ] Search functionality
- [ ] Theme customization
- [ ] Plugin system

See [[getting-started]] to begin using these features.

---

#features #documentation #overview
