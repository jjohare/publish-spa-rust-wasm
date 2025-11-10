use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use regex::Regex;
use crate::errors::PublishError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Page {
    pub path: String,
    pub title: String,
    pub properties: HashMap<String, String>,
    pub blocks: Vec<Block>,
    pub tags: Vec<String>,
    pub links: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Block {
    pub id: String,
    pub content: String,
    pub children: Vec<Block>,
    pub properties: HashMap<String, String>,
    pub level: usize,
}

/// Parse a Logseq markdown page
pub fn parse_logseq_page(content: &str, path: &str) -> Result<Page, PublishError> {
    let mut page = Page {
        path: path.to_string(),
        title: extract_title(path),
        properties: HashMap::new(),
        blocks: Vec::new(),
        tags: Vec::new(),
        links: Vec::new(),
    };

    let lines: Vec<&str> = content.lines().collect();
    let mut i = 0;

    // Parse frontmatter properties
    if lines.first() == Some(&"---") {
        i = parse_properties(&lines[1..], &mut page.properties)
            .map_err(|e| PublishError::parse(path, e))?;
        i += 2; // Skip the opening and closing ---
    }

    // Parse blocks
    if i < lines.len() {
        page.blocks = parse_blocks(&lines[i..], 0)
            .map_err(|e| PublishError::parse(path, e))?;
    }

    // Extract tags and links from blocks
    extract_tags_and_links(&page.blocks, &mut page.tags, &mut page.links);

    Ok(page)
}

fn extract_title(path: &str) -> String {
    path.split('/')
        .last()
        .unwrap_or(path)
        .trim_end_matches(".md")
        .trim_end_matches(".markdown")
        .to_string()
}

fn parse_properties(lines: &[&str], properties: &mut HashMap<String, String>) -> Result<usize, String> {
    for (i, line) in lines.iter().enumerate() {
        if *line == "---" {
            return Ok(i);
        }

        if let Some((key, value)) = line.split_once(':') {
            properties.insert(
                key.trim().to_string(),
                value.trim().to_string(),
            );
        }
    }

    Err("Unclosed frontmatter".to_string())
}

fn parse_blocks(lines: &[&str], base_level: usize) -> Result<Vec<Block>, String> {
    let mut blocks = Vec::new();
    let mut i = 0;

    while i < lines.len() {
        let line = lines[i];

        // Skip empty lines
        if line.trim().is_empty() {
            i += 1;
            continue;
        }

        // Detect indentation level (count leading tabs or 2-space groups)
        let indent = count_indent(line);
        let level = indent;

        // Extract bullet content
        let content = extract_block_content(line);

        let mut block = Block {
            id: format!("block-{}-{}", base_level, blocks.len()),
            content: content.to_string(),
            children: Vec::new(),
            properties: HashMap::new(),
            level,
        };

        // Look ahead for child blocks
        let mut child_lines = Vec::new();
        let mut j = i + 1;
        while j < lines.len() {
            let next_line = lines[j];
            if next_line.trim().is_empty() {
                j += 1;
                continue;
            }

            let next_indent = count_indent(next_line);
            if next_indent > indent {
                child_lines.push(next_line);
                j += 1;
            } else {
                break;
            }
        }

        if !child_lines.is_empty() {
            block.children = parse_blocks(&child_lines, level + 1)?;
            i = j;
        } else {
            i += 1;
        }

        blocks.push(block);
    }

    Ok(blocks)
}

fn count_indent(line: &str) -> usize {
    let mut indent = 0;
    let chars: Vec<char> = line.chars().collect();
    let mut i = 0;

    while i < chars.len() {
        match chars[i] {
            '\t' => {
                indent += 1;
                i += 1;
            }
            ' ' => {
                // Count two spaces as one indent level
                if i + 1 < chars.len() && chars[i + 1] == ' ' {
                    indent += 1;
                    i += 2;
                } else {
                    i += 1;
                }
            }
            _ => break,
        }
    }

    indent
}

fn extract_block_content(line: &str) -> &str {
    let trimmed = line.trim();

    // Handle different bullet styles
    if trimmed.starts_with("- ") {
        &trimmed[2..]
    } else if trimmed.starts_with("* ") {
        &trimmed[2..]
    } else if trimmed.starts_with("+ ") {
        &trimmed[2..]
    } else {
        trimmed
    }
}

fn extract_tags_and_links(blocks: &[Block], tags: &mut Vec<String>, links: &mut Vec<String>) {
    let tag_regex = Regex::new(r"#(\w+)").unwrap();
    let link_regex = Regex::new(r"\[\[([^\]]+)\]\]").unwrap();

    for block in blocks {
        // Extract tags
        for cap in tag_regex.captures_iter(&block.content) {
            let tag = cap[1].to_string();
            if !tags.contains(&tag) {
                tags.push(tag);
            }
        }

        // Extract wiki-style links
        for cap in link_regex.captures_iter(&block.content) {
            let link = cap[1].to_string();
            if !links.contains(&link) {
                links.push(link);
            }
        }

        // Recurse into children
        extract_tags_and_links(&block.children, tags, links);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple_page() {
        let content = r#"---
title: Test Page
---
- This is a block
- Another block with #tag
- Block with [[link]]"#;

        let page = parse_logseq_page(content, "test.md").unwrap();
        assert_eq!(page.title, "test");
        assert_eq!(page.blocks.len(), 3);
        assert!(page.tags.contains(&"tag".to_string()));
        assert!(page.links.contains(&"link".to_string()));
    }

    #[test]
    fn test_parse_nested_blocks() {
        let content = r#"- Parent block
  - Child block
    - Grandchild block"#;

        let page = parse_logseq_page(content, "nested.md").unwrap();
        assert_eq!(page.blocks.len(), 1);
        assert_eq!(page.blocks[0].children.len(), 1);
        assert_eq!(page.blocks[0].children[0].children.len(), 1);
    }

    #[test]
    fn test_extract_title() {
        assert_eq!(extract_title("test.md"), "test");
        assert_eq!(extract_title("pages/test.md"), "test");
        assert_eq!(extract_title("test.markdown"), "test");
    }

    #[test]
    fn test_indent_counting() {
        assert_eq!(count_indent("  - Block"), 1);
        assert_eq!(count_indent("    - Block"), 2);
        assert_eq!(count_indent("\t- Block"), 1);
        assert_eq!(count_indent("\t\t- Block"), 2);
    }
}
