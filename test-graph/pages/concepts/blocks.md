---
title: Blocks
tags: concepts, blocks, fundamentals
---

# Blocks

Understanding blocks - the fundamental unit of content in Logseq.

## What is a Block?

A block is a discrete piece of content:
- Can be a single line
- Can contain multiple paragraphs
- Can be nested under other blocks
- Has a unique identifier
- Can be referenced and linked

## Block Structure

### Simple Blocks

Each line starting with `-` or `*` is a block:
- This is a block
- This is another block
- And another one

### Nested Blocks

Blocks can contain child blocks:
- Parent block
  - Child block 1
    - Grandchild block 1
    - Grandchild block 2
  - Child block 2
    - Another grandchild
      - Great-grandchild!

### Block Properties

Blocks can have properties:
- id:: block-uuid-123
- tags:: #important #example
- created:: 2025-11-10
- updated:: 2025-11-10

## Block Types

### Text Blocks

Plain text content:
- Simple text
- With **formatting**
- And *styles*

### Task Blocks

TODO items:
- TODO Complete the tutorial
- DOING Work on documentation
- DONE Finish implementation
- CANCELLED Deprecated feature

### Code Blocks

Code with syntax highlighting:

```rust
struct Block {
    id: String,
    content: String,
    children: Vec<Block>,
}
```

```javascript
const block = {
    id: 'uuid',
    content: 'Block content',
    children: []
};
```

### Quote Blocks

> This is a quote block
>
> It can span multiple lines
>
> And contain **formatting**

## Block References

Blocks can reference each other:
- Direct reference: `((block-id))`
- Embed content from other blocks
- Create transclusion

### Example Reference

Main content block:
- id:: example-block
- This block can be referenced elsewhere

Reference to the block:
- See ((example-block)) for details

## Block Linking

### Wiki Links in Blocks

Blocks can link to [[pages]]:
- See [[getting-started]] for setup
- Check [[features]] for capabilities
- Review [[api-reference]] for technical details

### Hashtag References

Blocks can use #tags:
- #important
- #example
- #blocks

## Block Metadata

Blocks support rich metadata:

```yaml
id: unique-block-id
properties:
  created: 2025-11-10
  author: Test User
  tags: [example, metadata]
  priority: high
```

## Working with Blocks

### Creating Blocks

In Logseq:
1. Press `Enter` for new block
2. Press `Tab` to nest
3. Press `Shift+Tab` to unnest

### Moving Blocks

Blocks can be:
- Dragged and dropped
- Cut and pasted
- Referenced and embedded

### Searching Blocks

Find blocks by:
- Content search
- Tag search
- Property search
- Reference search

## Block Hierarchy

### Maximum Nesting

Test deep nesting:
- Level 1
  - Level 2
    - Level 3
      - Level 4
        - Level 5
          - Level 6
            - Level 7
              - Level 8
                - Level 9
                  - Level 10

### Mixed Content

Blocks can contain varied content:
- Text paragraphs with multiple sentences
  - Nested **formatted** text
    - Code: `inline code`
      - Links to [[concepts/pages]]
        - Tags: #nested #example
          - TODO tasks
            - Quotes
              > Quoted content
                - Even more nesting!

## Advanced Block Features

### Block Queries

Query blocks by properties:
```clojure
{{query (and (task TODO) (priority high))}}
```

### Block Embeds

Embed block content:
```
{{embed ((block-id))}}
```

### Block Aliases

Reference blocks by name:
```
[[Block Title]] -> ((block-id))
```

## Best Practices

### Organization
- Keep blocks focused and atomic
- Use nesting for hierarchy
- Add properties for metadata
- Link related blocks

### Performance
- Avoid excessive nesting (>10 levels)
- Keep block content reasonable size
- Use references instead of duplication

### Maintenance
- Regular cleanup of unused blocks
- Consistent property naming
- Clear block titles
- Meaningful tags

## Related Concepts

Learn more about:
- [[concepts/pages]] - Page organization
- [[concepts/links]] - Linking strategies
- [[features]] - All available features
- [[api-reference]] - Technical details

## Block Parser Implementation

The WASM parser handles:
- Markdown block syntax
- Nested indentation
- Property extraction
- Reference resolution
- Code block detection

See [[api-reference#block-object]] for the data structure.

---

#concepts #blocks #fundamentals #documentation
