# Test Logseq Graph

A comprehensive test graph for the publish-spa WASM implementation.

## Graph Statistics

### Pages
- **Total Pages**: 9
  - 1 index page
  - 4 main documentation pages
  - 3 concept pages (nested)
  - 1 changelog page

### Page Breakdown

| Page | Path | Purpose | Links Out | Features Tested |
|------|------|---------|-----------|-----------------|
| Index | `pages/index.md` | Home page | 9 | Hub structure, overview, navigation |
| Getting Started | `pages/getting-started.md` | Tutorial | 6 | Code blocks, nested content, steps |
| Features | `pages/features.md` | Feature list | 8 | Rich formatting, tasks, code, nesting |
| API Reference | `pages/api-reference.md` | Technical docs | 7 | Code examples, TypeScript, tables |
| Changelog | `pages/changelog.md` | Version history | 5 | Timeline, performance data, migration |
| Blocks | `pages/concepts/blocks.md` | Block concept | 5 | Deep nesting (10 levels), properties, references |
| Pages | `pages/concepts/pages.md` | Page concept | 6 | Frontmatter, metadata, templates |
| Links | `pages/concepts/links.md` | Linking concept | 10+ | All link types, bidirectional, aliases |

### Content Statistics

- **Total Links**: 50+ internal wiki-links
- **Total Tags**: 30+ unique hashtags
- **Code Blocks**: 15+ with multiple languages (Rust, JavaScript, Python, TypeScript, Bash, YAML, Clojure)
- **Nested Blocks**: Up to 10 levels deep
- **TODO Items**: 10+ tasks in various states
- **Assets**: 1 test file in `assets/`

## Features Tested

### 1. Frontmatter Parsing ✅
Every page has YAML frontmatter with:
- `title` field
- `tags` array
- Optional `public` flag
- Various custom properties

### 2. Wiki Links ✅
- Simple links: `[[page-name]]`
- Alias links: `[[page|display text]]`
- Nested links: `[[folder/page]]`
- 50+ internal links across pages

### 3. Hashtags ✅
- 30+ unique tags
- In content: `#tag`
- In frontmatter: `tags: tag1, tag2`

### 4. Block Nesting ✅
- Up to 10 levels deep
- Indentation-based hierarchy
- Mixed content types in nested blocks

### 5. Code Blocks ✅
Languages tested:
- Rust
- JavaScript
- TypeScript
- Python
- Bash
- YAML
- Clojure
- JSON

### 6. Rich Formatting ✅
- **Bold text**
- *Italic text*
- ~~Strikethrough~~
- `Inline code`
- ==Highlights==
- > Block quotes

### 7. Task Management ✅
- TODO items
- DOING items
- DONE items
- CANCELLED items

### 8. Hierarchical Structure ✅
```
test-graph/
├── pages/
│   ├── index.md              (hub page)
│   ├── getting-started.md    (tutorial)
│   ├── features.md           (feature showcase)
│   ├── api-reference.md      (technical docs)
│   ├── changelog.md          (history)
│   └── concepts/             (nested folder)
│       ├── blocks.md
│       ├── pages.md
│       └── links.md
├── assets/
│   └── test.txt
└── logseq/
    └── config.edn
```

### 9. Bidirectional Links ✅
Every page links to multiple other pages, creating a web of connections:
- Index links to all main pages
- Concept pages link to each other
- Documentation pages cross-reference
- Tutorial links to reference docs

### 10. Asset References ✅
- Test asset file in `assets/`
- Can be referenced from pages
- Should be copied during publishing

## Link Graph Structure

### Hub Structure (Index as Central Hub)
```
                    index
                      |
      +---------------+---------------+
      |               |               |
getting-started   features      api-reference
      |               |               |
      +-------+-------+-------+-------+
              |               |
          changelog      concepts/
                              |
                    +---------+---------+
                    |         |         |
                 blocks    pages     links
```

### Most Connected Pages
1. **index** (9 outgoing links) - Central hub
2. **links** (10+ outgoing links) - Link documentation
3. **features** (8 outgoing links) - Feature showcase
4. **api-reference** (7 outgoing links) - Technical docs

### Most Referenced Pages (Backlinks)
1. **getting-started** (8 backlinks)
2. **concepts/blocks** (7 backlinks)
3. **features** (6 backlinks)
4. **api-reference** (6 backlinks)

## Parser Testing Checklist

Use this graph to verify:

- [ ] Frontmatter YAML parsing
- [ ] Wiki-link resolution
- [ ] Alias link handling
- [ ] Nested page paths
- [ ] Hashtag extraction
- [ ] Block hierarchy parsing
- [ ] Code block language detection
- [ ] TODO item detection
- [ ] Rich text formatting
- [ ] Block property parsing
- [ ] Asset file handling
- [ ] Config.edn parsing
- [ ] Bidirectional link creation
- [ ] Cross-reference resolution
- [ ] Deep nesting (10+ levels)

## Usage

### Testing Publishing
```bash
# Publish this test graph
cd /home/devuser/workspace/publish-spa-rust-wasm
npm run publish -- --input ./test-graph --output ./test-output

# Verify output
ls -la test-output/
```

### Expected Output
After publishing, you should see:
```
test-output/
├── index.html
├── getting-started.html
├── features.html
├── api-reference.html
├── changelog.html
├── concepts/
│   ├── blocks.html
│   ├── pages.html
│   └── links.html
├── assets/
│   └── test.txt
└── [CSS/JS files]
```

### Verification Steps

1. **All pages generated**: 9 HTML files
2. **Links resolved**: All `[[links]]` work
3. **Assets copied**: `test.txt` in output
4. **Hierarchy preserved**: `concepts/` subdirectory
5. **Frontmatter processed**: Titles and tags extracted
6. **Code highlighted**: Syntax highlighting applied
7. **Formatting preserved**: Bold, italic, etc. rendered

## Test Cases

This graph provides test data for:

1. **Small graph performance** (9 pages)
2. **Link resolution accuracy** (50+ links)
3. **Nesting depth handling** (10 levels)
4. **Code block rendering** (multiple languages)
5. **Frontmatter parsing** (various formats)
6. **Asset handling** (file copying)
7. **Navigation generation** (hub structure)
8. **Cross-reference validation** (bidirectional links)

## Metrics for Benchmarking

Expected performance targets:

- **Parse time**: <50ms
- **Link resolution**: <10ms
- **HTML generation**: <100ms
- **Asset copying**: <5ms
- **Total time**: <200ms

Memory usage:
- **Peak memory**: <5MB
- **Average memory**: <2MB

## Extending the Test Graph

To add more test cases:

1. Create new pages in `pages/` or `pages/concepts/`
2. Add wiki-links to connect pages
3. Include various content types
4. Test edge cases (deep nesting, long pages, etc.)
5. Update this README with new statistics

## Known Edge Cases Tested

- ✅ Deep block nesting (10 levels)
- ✅ Multiple code block languages
- ✅ Mixed content in nested blocks
- ✅ Circular link references (safe)
- ✅ Page aliases in frontmatter
- ✅ Empty pages (none in this graph)
- ✅ Large pages with many blocks
- ✅ Nested directory structure

## License

This test graph is provided as example data for testing purposes.
Use freely for development and testing of the publish-spa project.
