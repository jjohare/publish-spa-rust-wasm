use crate::parser::Page;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct Graph {
    pages: HashMap<String, Page>,
    backlinks: HashMap<String, Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GraphStats {
    pub page_count: usize,
    pub total_blocks: usize,
    pub total_links: usize,
    pub orphan_pages: usize,
}

impl Graph {
    pub fn new() -> Self {
        Self {
            pages: HashMap::new(),
            backlinks: HashMap::new(),
        }
    }

    pub fn add_page(&mut self, page: Page) {
        let path = page.path.clone();

        // Update backlinks for all links in this page
        for link in &page.links {
            self.backlinks
                .entry(link.clone())
                .or_insert_with(Vec::new)
                .push(path.clone());
        }

        self.pages.insert(path, page);
    }

    #[allow(dead_code)]
    pub fn get_page(&self, path: &str) -> Option<&Page> {
        self.pages.get(path)
    }

    pub fn get_backlinks(&self, path: &str) -> Vec<String> {
        self.backlinks
            .get(path)
            .cloned()
            .unwrap_or_default()
    }

    #[allow(dead_code)]
    pub fn page_count(&self) -> usize {
        self.pages.len()
    }

    pub fn pages(&self) -> impl Iterator<Item = &Page> {
        self.pages.values()
    }

    pub fn stats(&self) -> GraphStats {
        let total_blocks: usize = self.pages.values()
            .map(|p| count_blocks(&p.blocks))
            .sum();

        let total_links: usize = self.pages.values()
            .map(|p| p.links.len())
            .sum();

        let orphan_pages = self.pages.values()
            .filter(|p| {
                p.links.is_empty() &&
                self.backlinks.get(&p.path).map_or(true, |bl| bl.is_empty())
            })
            .count();

        GraphStats {
            page_count: self.pages.len(),
            total_blocks,
            total_links,
            orphan_pages,
        }
    }
}

fn count_blocks(blocks: &[crate::parser::Block]) -> usize {
    blocks.iter()
        .map(|b| 1 + count_blocks(&b.children))
        .sum()
}

impl Default for Graph {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::parser::Page;
    use std::collections::HashMap;

    #[test]
    fn test_graph_creation() {
        let graph = Graph::new();
        assert_eq!(graph.page_count(), 0);
    }

    #[test]
    fn test_add_page_and_backlinks() {
        let mut graph = Graph::new();

        let page1 = Page {
            path: "page1.md".to_string(),
            title: "Page 1".to_string(),
            properties: HashMap::new(),
            blocks: Vec::new(),
            tags: Vec::new(),
            links: vec!["page2.md".to_string()],
        };

        graph.add_page(page1);

        let backlinks = graph.get_backlinks("page2.md");
        assert_eq!(backlinks, vec!["page1.md"]);
    }

    #[test]
    fn test_stats() {
        let graph = Graph::new();
        let stats = graph.stats();
        assert_eq!(stats.page_count, 0);
        assert_eq!(stats.total_blocks, 0);
        assert_eq!(stats.total_links, 0);
    }
}
