use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

mod converter;
mod parser;
mod graph;
mod exporter;
pub mod errors;

pub use errors::PublishError;

/// Initialize panic hook for better error messages in WASM
#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// Console logging helper
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

/// Configuration for publishing
#[derive(Debug, Serialize, Deserialize)]
#[wasm_bindgen]
pub struct PublishConfig {
    #[wasm_bindgen(skip)]
    pub input_dir: String,
    #[wasm_bindgen(skip)]
    pub output_dir: String,
    #[wasm_bindgen(skip)]
    pub theme: String,
    #[wasm_bindgen(skip)]
    pub include_backlinks: bool,
    #[wasm_bindgen(skip)]
    pub include_graph_view: bool,
    #[wasm_bindgen(skip)]
    pub custom_css: Option<String>,
}

#[wasm_bindgen]
impl PublishConfig {
    #[wasm_bindgen(constructor)]
    pub fn new(input_dir: String, output_dir: String) -> Self {
        Self {
            input_dir,
            output_dir,
            theme: "default".to_string(),
            include_backlinks: true,
            include_graph_view: false,
            custom_css: None,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn theme(&self) -> String {
        self.theme.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_theme(&mut self, theme: String) {
        self.theme = theme;
    }

    #[wasm_bindgen(getter)]
    pub fn include_backlinks(&self) -> bool {
        self.include_backlinks
    }

    #[wasm_bindgen(setter)]
    pub fn set_include_backlinks(&mut self, include: bool) {
        self.include_backlinks = include;
    }

    #[wasm_bindgen(getter)]
    pub fn include_graph_view(&self) -> bool {
        self.include_graph_view
    }

    #[wasm_bindgen(setter)]
    pub fn set_include_graph_view(&mut self, include: bool) {
        self.include_graph_view = include;
    }
}

/// Publishing statistics
#[derive(Debug, Serialize, Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct PublishStats {
    pub page_count: usize,
    pub total_blocks: usize,
    pub total_links: usize,
    pub orphan_pages: usize,
}

/// Main publish function - Entry point from JavaScript
///
/// # Arguments
/// * `config_obj` - JavaScript object containing configuration
///
/// # Returns
/// Promise that resolves to PublishStats
#[wasm_bindgen]
pub async fn publish(config_obj: JsValue) -> Result<JsValue, JsValue> {
    let config: PublishConfig = serde_wasm_bindgen::from_value(config_obj)
        .map_err(|e| PublishError::invalid_input(format!("Invalid config: {}", e)))?;

    // Read all markdown files from input directory
    let files = converter::read_graph_files(&config.input_dir).await?;

    // Build graph from files
    let mut graph = graph::Graph::new();
    for (path, content) in files {
        match parser::parse_logseq_page(&content, &path) {
            Ok(page) => graph.add_page(page),
            Err(e) => {
                log(&format!("Warning: Failed to parse {}: {}", path, e));
                continue;
            }
        }
    }

    // Export to HTML
    let export_config = exporter::ExportConfig {
        theme: config.theme.clone(),
        include_backlinks: config.include_backlinks,
        include_graph_view: config.include_graph_view,
        custom_css: config.custom_css.clone(),
    };

    let html_files = exporter::export_graph_to_html(&graph, &export_config)?;

    // Write output files
    converter::write_output_files(&config.output_dir, html_files).await?;

    // Return statistics
    let stats = graph.stats();
    let pub_stats = PublishStats {
        page_count: stats.page_count,
        total_blocks: stats.total_blocks,
        total_links: stats.total_links,
        orphan_pages: stats.orphan_pages,
    };

    serde_wasm_bindgen::to_value(&pub_stats)
        .map_err(|e| PublishError::from(e).into())
}

/// Parse a Logseq graph and return statistics
#[wasm_bindgen]
pub async fn parse_graph(input_dir: String) -> Result<JsValue, JsValue> {
    let files = converter::read_graph_files(&input_dir).await?;

    let mut graph = graph::Graph::new();
    for (path, content) in files {
        match parser::parse_logseq_page(&content, &path) {
            Ok(page) => graph.add_page(page),
            Err(e) => {
                log(&format!("Warning: Failed to parse {}: {}", path, e));
                continue;
            }
        }
    }

    let stats = graph.stats();
    let pub_stats = PublishStats {
        page_count: stats.page_count,
        total_blocks: stats.total_blocks,
        total_links: stats.total_links,
        orphan_pages: stats.orphan_pages,
    };

    serde_wasm_bindgen::to_value(&pub_stats)
        .map_err(|e| PublishError::from(e).into())
}

/// Get backlinks for a specific page
#[wasm_bindgen]
pub async fn get_backlinks(input_dir: String, page_path: String) -> Result<JsValue, JsValue> {
    let files = converter::read_graph_files(&input_dir).await?;

    let mut graph = graph::Graph::new();
    for (path, content) in files {
        match parser::parse_logseq_page(&content, &path) {
            Ok(page) => graph.add_page(page),
            Err(e) => {
                log(&format!("Warning: Failed to parse {}: {}", path, e));
                continue;
            }
        }
    }

    let backlinks = graph.get_backlinks(&page_path);
    serde_wasm_bindgen::to_value(&backlinks)
        .map_err(|e| PublishError::from(e).into())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config_creation() {
        let config = PublishConfig::new("./input".to_string(), "./output".to_string());
        assert_eq!(config.input_dir, "./input");
        assert_eq!(config.output_dir, "./output");
        assert_eq!(config.theme, "default");
        assert!(config.include_backlinks);
    }
}
