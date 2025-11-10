---
title: Pages
tags: concepts, pages, fundamentals
---

# Pages

Understanding pages - how content is organized in Logseq.

## What is a Page?

A page is a collection of [[concepts/blocks|blocks]] organized around a topic:
- Has a unique title
- Contains blocks of content
- Can link to other pages
- Has metadata and properties
- Lives in the `pages/` directory

## Page Structure

### Basic Page

Every page has:
```markdown
---
title: Page Title
tags: tag1, tag2
---

# Page Title

Page content goes here...
```

### Frontmatter

YAML metadata at the top:
```yaml
---
title: Page Title
tags: tag1, tag2, tag3
public: true
created: 2025-11-10
author: Test User
---
```

### Content Section

After frontmatter comes content:
- Markdown formatted
- [[concepts/blocks|Block-based structure]]
- Can include all Logseq features

## Page Types

### Journal Pages

Daily notes with date-based names:
- `2025-11-10.md`
- `2025-11-09.md`
- Automatic creation
- Chronological organization

### Topic Pages

Named pages for specific topics:
- [[getting-started]]
- [[features]]
- [[api-reference]]
- [[concepts/blocks]]

### Index Pages

Central hubs linking related content:
- [[index]] - Main entry point
- Category indexes
- Table of contents pages

## Page Organization

### Flat Structure

All pages in `pages/` directory:
```
pages/
├── index.md
├── getting-started.md
├── features.md
└── api-reference.md
```

### Nested Structure

Organize with subdirectories:
```
pages/
├── index.md
├── getting-started.md
└── concepts/
    ├── blocks.md
    ├── pages.md
    └── links.md
```

## Page Naming

### Conventions

- Use kebab-case: `getting-started.md`
- Descriptive names: `api-reference.md`
- Avoid special characters
- Keep names concise

### Page Aliases

Create aliases for pages:
```yaml
---
title: API Reference
alias: API, Reference, Docs
---
```

Now [[API]], [[Reference]], and [[Docs]] all link to this page.

## Page Metadata

### Common Properties

```yaml
---
title: Page Title
tags: tag1, tag2
public: true
created: 2025-11-10
updated: 2025-11-10
author: Test User
status: draft
priority: high
---
```

### Custom Properties

Add any custom metadata:
```yaml
---
title: My Page
category: Tutorial
difficulty: Beginner
estimated-time: 15 minutes
prerequisites: [Basic Knowledge, Setup Complete]
---
```

## Page Links

### Creating Links

Link to other pages with `[[page-name]]`:
- [[getting-started]]
- [[features]]
- [[concepts/blocks]]

### Link Aliases

Display different text:
- [[getting-started|Start Here]]
- [[api-reference|API Docs]]
- [[concepts/blocks|About Blocks]]

### Backlinks

Pages automatically show backlinks:
- See who references this page
- Explore connections
- Navigate bidirectionally

## Page Templates

### Basic Template

```markdown
---
title: {{TITLE}}
tags: {{TAGS}}
---

# {{TITLE}}

## Overview

Brief description...

## Details

Main content...

## Related
- [[related-page-1]]
- [[related-page-2]]
```

### Tutorial Template

```markdown
---
title: Tutorial: {{TOPIC}}
tags: tutorial, guide
difficulty: {{LEVEL}}
---

# Tutorial: {{TOPIC}}

## What You'll Learn
- Item 1
- Item 2

## Prerequisites
- Requirement 1
- Requirement 2

## Steps

### Step 1: {{STEP}}
Content...

### Step 2: {{STEP}}
Content...

## Next Steps
- [[next-tutorial]]
```

## Page Queries

### Find Pages by Tag

```clojure
{{query (page-tags tutorial)}}
```

### Find Pages by Property

```clojure
{{query (page-property status draft)}}
```

## Working with Pages

### Creating Pages

Multiple ways to create:
1. Click a [[new-page-link]]
2. Create file in `pages/` directory
3. Use Logseq UI

### Editing Pages

Edit in:
- Logseq desktop app
- Any text editor
- Direct file editing

### Deleting Pages

To delete a page:
1. Remove the file
2. Update links referencing it
3. Clean up orphaned references

## Page Navigation

### Internal Navigation

Within the graph:
- [[index]] - Home
- [[getting-started]] - Tutorial
- [[features]] - Features list
- [[api-reference]] - API docs

### External Links

Link to external resources:
- [Logseq Documentation](https://docs.logseq.com)
- [GitHub Repository](https://github.com)

## Page Publishing

### Public Pages

Mark pages as public:
```yaml
---
public: true
---
```

### Private Pages

Keep pages private:
```yaml
---
public: false
---
```

Or omit from publishing:
```yaml
---
exclude-from-publish: true
---
```

## Page Performance

### Optimization Tips

- Keep pages focused
- Break large pages into smaller ones
- Use page references instead of duplication
- Optimize images in pages

### Page Size Guidelines

- Small: <100 blocks
- Medium: 100-500 blocks
- Large: 500+ blocks (consider splitting)

## Page Hierarchy

Example knowledge base structure:

```
Index
├── Getting Started
│   ├── Installation
│   ├── Quick Start
│   └── First Steps
├── Concepts
│   ├── Blocks
│   ├── Pages
│   └── Links
├── Features
│   ├── Core Features
│   └── Advanced Features
└── Reference
    ├── API Reference
    └── CLI Reference
```

## Related Concepts

Learn more about:
- [[concepts/blocks]] - Block structure
- [[concepts/links]] - Linking strategies
- [[features]] - Available features
- [[getting-started]] - Setup guide

## Page Parser Implementation

The WASM parser handles:
- Frontmatter parsing (YAML)
- Markdown content
- Block extraction
- Link resolution
- Metadata extraction

See [[api-reference#page-object]] for the data structure.

---

#concepts #pages #fundamentals #documentation
