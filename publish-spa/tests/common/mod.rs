//! Shared test utilities and helpers

use std::path::{Path, PathBuf};
use std::collections::HashMap;

/// Create a temporary test directory structure
pub struct TestFixture {
    pub root: PathBuf,
    pub pages_dir: PathBuf,
    pub output_dir: PathBuf,
}

impl TestFixture {
    /// Create a new test fixture with sample Logseq graph
    pub fn new(name: &str) -> Self {
        let root = PathBuf::from(format!("/tmp/logseq-test-{}", name));
        let pages_dir = root.join("pages");
        let output_dir = root.join("output");

        Self {
            root,
            pages_dir,
            output_dir,
        }
    }

    /// Create sample pages for testing
    pub fn create_sample_pages(&self, pages: HashMap<&str, &str>) -> std::io::Result<()> {
        std::fs::create_dir_all(&self.pages_dir)?;

        for (filename, content) in pages {
            let path = self.pages_dir.join(filename);
            std::fs::write(path, content)?;
        }

        Ok(())
    }

    /// Create a single sample page
    pub fn create_page(&self, filename: &str, content: &str) -> std::io::Result<PathBuf> {
        std::fs::create_dir_all(&self.pages_dir)?;
        let path = self.pages_dir.join(filename);
        std::fs::write(&path, content)?;
        Ok(path)
    }

    /// Cleanup test files
    pub fn cleanup(&self) -> std::io::Result<()> {
        if self.root.exists() {
            std::fs::remove_dir_all(&self.root)?;
        }
        Ok(())
    }
}

impl Drop for TestFixture {
    fn drop(&mut self) {
        let _ = self.cleanup();
    }
}

/// Sample Logseq pages for testing
pub mod fixtures {
    use std::collections::HashMap;

    /// Get a simple test page
    pub fn simple_page() -> &'static str {
        r#"# Welcome to Logseq

- This is a simple page
  - With some nested content
  - And [[Page Links]]
- Some more content
"#
    }

    /// Get a page with advanced features
    pub fn advanced_page() -> &'static str {
        r#"# Advanced Features

- **Bold text** and *italic text*
- Code blocks:
  ```rust
  fn main() {
      println!("Hello, world!");
  }
  ```
- Links: [[Another Page]], [[Third Page]]
- Tags: #important #testing
- Properties:
  - id:: 123456
  - tags:: [[tag1]], [[tag2]]
- Backlinks should work
- TODO Task item
  SCHEDULED: <2025-11-10>
"#
    }

    /// Get a page with backlinks
    pub fn page_with_backlinks() -> &'static str {
        r#"# Page With Backlinks

- This page references [[Target Page]]
- And [[Another Target]]
- Multiple times: [[Target Page]] again
"#
    }

    /// Get the target page referenced by backlinks
    pub fn target_page() -> &'static str {
        r#"# Target Page

- This is the target of backlinks
- Should show pages that link here
"#
    }

    /// Get a complete test graph with multiple interconnected pages
    pub fn test_graph() -> HashMap<&'static str, &'static str> {
        let mut pages = HashMap::new();
        pages.insert("index.md", simple_page());
        pages.insert("advanced.md", advanced_page());
        pages.insert("links.md", page_with_backlinks());
        pages.insert("target.md", target_page());
        pages.insert("orphan.md", "# Orphan Page\n\n- No links to or from this page\n");
        pages
    }
}

/// HTML validation helpers
pub mod html {
    /// Check if HTML contains expected structure
    pub fn has_element(html: &str, tag: &str) -> bool {
        html.contains(&format!("<{}", tag)) && html.contains(&format!("</{}>", tag))
    }

    /// Check if HTML has proper document structure
    pub fn is_valid_document(html: &str) -> bool {
        has_element(html, "html") &&
        has_element(html, "head") &&
        has_element(html, "body")
    }

    /// Extract text content between tags
    pub fn extract_text(html: &str, start_tag: &str, end_tag: &str) -> Option<String> {
        let start = html.find(start_tag)?;
        let start_content = start + start_tag.len();
        let end = html[start_content..].find(end_tag)?;
        Some(html[start_content..start_content + end].to_string())
    }

    /// Count occurrences of a tag
    pub fn count_tag(html: &str, tag: &str) -> usize {
        html.matches(&format!("<{}", tag)).count()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fixture_creation() {
        let fixture = TestFixture::new("test");
        assert!(fixture.root.to_str().unwrap().contains("logseq-test-test"));
    }

    #[test]
    fn test_html_validation() {
        let html = "<html><head><title>Test</title></head><body><h1>Hello</h1></body></html>";
        assert!(html::is_valid_document(html));
        assert!(html::has_element(html, "h1"));
        assert_eq!(html::count_tag(html, "h1"), 1);
    }

    #[test]
    fn test_html_extract() {
        let html = "<h1>Title</h1>";
        let text = html::extract_text(html, "<h1>", "</h1>");
        assert_eq!(text, Some("Title".to_string()));
    }
}
