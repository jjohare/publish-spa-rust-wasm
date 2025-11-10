---
title: Links
tags: concepts, links, fundamentals, references
---

# Links

Understanding linking strategies in Logseq.

## Link Types

### Wiki Links

The primary linking mechanism:
- `[[page-name]]` - Links to a page
- `[[page-name|display text]]` - Link with custom text
- `[[nested/page]]` - Links to nested pages

Examples:
- [[getting-started]]
- [[features|Feature List]]
- [[concepts/blocks]]

### Page References

Link to specific pages:
- [[index]] - Home page
- [[api-reference]] - API documentation
- [[changelog]] - Version history

### Block References

Link to specific blocks:
- `((block-id))` - Reference a block
- Embed block content
- Create transclusions

Example:
- See ((example-block-ref)) for details

### Tag Links

Use hashtags to categorize:
- #concept
- #fundamentals
- #linking
- #documentation

Tags are also links! Click #concept to see all tagged content.

## Link Syntax

### Basic Syntax

```markdown
[[page-name]]
```

### Alias Syntax

```markdown
[[actual-page|Display Text]]
```

Examples:
- [[getting-started|Start Here]]
- [[api-reference|API Docs]]
- [[concepts/pages|About Pages]]

### Nested Pages

```markdown
[[folder/page-name]]
```

Examples:
- [[concepts/blocks]]
- [[concepts/pages]]
- [[concepts/links]] (this page!)

## Bidirectional Linking

### Forward Links

Links you create in your content:
- From this page to [[getting-started]]
- From this page to [[features]]
- From this page to [[concepts/blocks]]

### Backlinks

Automatically generated links showing:
- Which pages link to this page
- Context of the reference
- Bidirectional navigation

Example: See backlinks section to find all pages referencing [[concepts/links]].

## Link Resolution

### How Links Work

1. Parser finds `[[link-text]]`
2. Resolves to page file
3. Generates proper URL
4. Creates bidirectional reference

### Resolution Rules

- Case-insensitive matching
- Handles spaces and special characters
- Resolves aliases
- Falls back gracefully for missing pages

## Link Patterns

### Hub and Spoke

Central index linking to topics:
```
Index
├── [[getting-started]]
├── [[features]]
├── [[concepts/blocks]]
├── [[concepts/pages]]
└── [[concepts/links]]
```

### Hierarchical

Parent-child relationships:
```
[[concepts/pages]]
├── [[concepts/blocks]]
└── [[concepts/links]]
```

### Network/Mesh

Interconnected web of ideas:
```
[[concepts/blocks]] ↔ [[concepts/pages]] ↔ [[concepts/links]]
     ↓                      ↓                      ↓
[[features]]         [[getting-started]]     [[api-reference]]
```

## Link Organization

### Contextual Links

Link within natural flow:
- When discussing [[concepts/blocks]], link to the concept
- Reference the [[api-reference]] for technical details
- Point to [[getting-started]] for setup instructions

### Structured Links

Organized link sections:

**Core Concepts:**
- [[concepts/blocks]]
- [[concepts/pages]]
- [[concepts/links]]

**Documentation:**
- [[getting-started]]
- [[features]]
- [[api-reference]]

**Project Info:**
- [[changelog]]
- [[index]]

## Link Best Practices

### When to Link

✅ **DO Link:**
- First mention of a topic
- Key concepts
- Related resources
- Important references

❌ **DON'T Link:**
- Every occurrence of a word
- Common terms excessively
- Unrelated pages
- Broken or missing pages

### Link Density

Find the right balance:
- **Too few**: Hard to navigate
- **Too many**: Overwhelming
- **Just right**: Natural flow with helpful connections

Example paragraph with good density:
> The [[concepts/blocks|block system]] enables structured content organization. Each [[concepts/pages|page]] contains multiple blocks, connected through [[concepts/links|wiki-style links]]. See the [[getting-started]] guide for practical examples.

### Link Text

Make link text meaningful:

✅ Good:
- [[getting-started|Start with the tutorial]]
- [[api-reference|Check the API documentation]]
- [[concepts/blocks|Learn about blocks]]

❌ Bad:
- [[getting-started|click here]]
- [[api-reference|here]]
- [[concepts/blocks|this]]

## Advanced Linking

### Namespace Links

Organize pages in namespaces:
```
concepts/blocks
concepts/pages
concepts/links
```

Link with full path:
- [[concepts/blocks]]

Or create namespace index:
- [[concepts]] → Lists all concept pages

### Alias Resolution

Define aliases in frontmatter:
```yaml
---
title: API Reference
alias: API, Docs, Reference
---
```

Now these all work:
- [[API Reference]]
- [[API]]
- [[Docs]]
- [[Reference]]

### Link Embeds

Embed page content:
```
{{embed [[page-name]]}}
```

Embed specific blocks:
```
{{embed ((block-id))}}
```

## Link Analysis

### Graph Structure

The test graph demonstrates:
- **9 total pages**
- **50+ internal links**
- **3-level deep nesting** (concepts/)
- **Hub structure** (index.md as central hub)

### Link Metrics

```
Index (9 outgoing links)
  ├── Getting Started (6 outgoing)
  ├── Features (8 outgoing)
  ├── API Reference (7 outgoing)
  ├── Changelog (5 outgoing)
  └── Concepts/
      ├── Blocks (5 outgoing)
      ├── Pages (6 outgoing)
      └── Links (10+ outgoing)
```

### Backlink Distribution

Most referenced pages:
1. [[getting-started]] (8 backlinks)
2. [[concepts/blocks]] (7 backlinks)
3. [[features]] (6 backlinks)
4. [[api-reference]] (6 backlinks)

## Link Types Summary

| Type | Syntax | Example |
|------|--------|---------|
| Page | `[[page]]` | [[index]] |
| Alias | `[[page\|text]]` | [[index\|Home]] |
| Nested | `[[folder/page]]` | [[concepts/blocks]] |
| Block | `((id))` | ((block-123)) |
| Tag | `#tag` | #documentation |
| External | `[text](url)` | [Logseq](https://logseq.com) |

## Link Validation

The parser validates:
- ✅ Link syntax correctness
- ✅ Target page exists
- ✅ No circular references
- ✅ Alias resolution
- ⚠️ Warns on broken links

See [[api-reference#link-resolution-error]] for error handling.

## Performance Considerations

### Link Processing

- **Fast**: Direct page links
- **Medium**: Alias resolution
- **Slower**: Complex queries
- **Slowest**: Deep transclusions

### Optimization Tips

1. Use direct links when possible
2. Minimize deep embedding
3. Avoid circular references
4. Cache link resolution

## External Resources

Beyond internal links:
- [Logseq Documentation](https://docs.logseq.com)
- [Markdown Guide](https://www.markdownguide.org)
- [YAML Frontmatter](https://jekyllrb.com/docs/front-matter/)

## Related Concepts

Essential reading:
- [[concepts/blocks]] - Block structure and nesting
- [[concepts/pages]] - Page organization
- [[features]] - All linking features
- [[getting-started]] - Practical linking examples
- [[api-reference]] - Link resolution API

## Testing Links

This test graph includes:
- ✅ Simple page links
- ✅ Nested page links
- ✅ Alias links
- ✅ Tag links
- ✅ External links
- ✅ Bidirectional references
- ✅ Hub structure
- ✅ Multiple link densities

Perfect for testing the link parser!

---

#concepts #links #fundamentals #references #documentation
