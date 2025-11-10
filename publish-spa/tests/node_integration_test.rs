//! Node.js-specific integration tests
//!
//! These tests run in Node.js environment and can test:
//! - File I/O operations
//! - Full publish pipeline
//! - HTML output validation

#![cfg(all(target_arch = "wasm32", not(target_os = "unknown")))]

use wasm_bindgen_test::*;
use publish_spa_wasm::{PublishConfig, publish, parse_graph};
use serde_wasm_bindgen;
use std::collections::HashMap;

wasm_bindgen_test_configure!(run_in_node);

mod common;
use common::{TestFixture, fixtures};

/// Test parsing a graph with sample pages
#[wasm_bindgen_test]
async fn test_parse_sample_graph() {
    let fixture = TestFixture::new("parse_test");

    // Create sample pages
    let pages = fixtures::test_graph();
    fixture.create_sample_pages(pages).expect("Failed to create pages");

    // Parse the graph
    let input_dir = fixture.pages_dir.to_str().unwrap().to_string();
    let result = parse_graph(input_dir).await;

    assert!(result.is_ok(), "Failed to parse graph: {:?}", result.err());

    // Verify stats
    let stats: publish_spa_wasm::PublishStats =
        serde_wasm_bindgen::from_value(result.unwrap()).unwrap();

    assert_eq!(stats.page_count(), 5, "Expected 5 pages");
    assert!(stats.total_blocks() > 0, "Expected some blocks");
    assert!(stats.total_links() > 0, "Expected some links");
}

/// Test the full publish pipeline
#[wasm_bindgen_test]
async fn test_full_publish_pipeline() {
    let fixture = TestFixture::new("publish_test");

    // Create sample pages
    fixture.create_page("index.md", fixtures::simple_page())
        .expect("Failed to create index page");
    fixture.create_page("advanced.md", fixtures::advanced_page())
        .expect("Failed to create advanced page");

    // Create output directory
    std::fs::create_dir_all(&fixture.output_dir)
        .expect("Failed to create output dir");

    // Create config
    let config = PublishConfig {
        input_dir: fixture.pages_dir.to_str().unwrap().to_string(),
        output_dir: fixture.output_dir.to_str().unwrap().to_string(),
        theme: "default".to_string(),
        include_backlinks: true,
        include_graph_view: false,
        custom_css: None,
    };

    let config_js = serde_wasm_bindgen::to_value(&config).unwrap();

    // Run publish
    let result = publish(config_js).await;

    assert!(result.is_ok(), "Publish failed: {:?}", result.err());

    // Verify output files exist
    assert!(fixture.output_dir.join("index.html").exists(), "index.html not created");
    assert!(fixture.output_dir.join("advanced.html").exists(), "advanced.html not created");
}

/// Test backlink generation
#[wasm_bindgen_test]
async fn test_backlink_generation() {
    let fixture = TestFixture::new("backlinks_test");

    // Create pages with backlinks
    fixture.create_page("source.md", fixtures::page_with_backlinks())
        .expect("Failed to create source page");
    fixture.create_page("target.md", fixtures::target_page())
        .expect("Failed to create target page");

    // Get backlinks for target page
    let input_dir = fixture.pages_dir.to_str().unwrap().to_string();
    let result = publish_spa_wasm::get_backlinks(
        input_dir,
        "target.md".to_string()
    ).await;

    assert!(result.is_ok(), "Failed to get backlinks: {:?}", result.err());

    let backlinks: Vec<String> = serde_wasm_bindgen::from_value(result.unwrap()).unwrap();
    assert!(!backlinks.is_empty(), "Expected backlinks");
}

/// Test HTML output structure
#[wasm_bindgen_test]
async fn test_html_output_structure() {
    let fixture = TestFixture::new("html_test");

    fixture.create_page("test.md", fixtures::simple_page())
        .expect("Failed to create test page");

    std::fs::create_dir_all(&fixture.output_dir)
        .expect("Failed to create output dir");

    let config = PublishConfig {
        input_dir: fixture.pages_dir.to_str().unwrap().to_string(),
        output_dir: fixture.output_dir.to_str().unwrap().to_string(),
        theme: "default".to_string(),
        include_backlinks: true,
        include_graph_view: false,
        custom_css: None,
    };

    let config_js = serde_wasm_bindgen::to_value(&config).unwrap();
    let _ = publish(config_js).await.expect("Publish failed");

    // Read and validate HTML
    let html_path = fixture.output_dir.join("test.html");
    let html = std::fs::read_to_string(html_path).expect("Failed to read HTML");

    // Validate structure using our helpers
    use common::html;
    assert!(html::is_valid_document(&html), "Invalid HTML document structure");
    assert!(html::has_element(&html, "h1"), "Missing h1 element");
    assert!(html::has_element(&html, "ul"), "Missing list elements");
}

/// Test error handling with invalid input
#[wasm_bindgen_test]
async fn test_invalid_input_handling() {
    let config = PublishConfig {
        input_dir: "/nonexistent/directory".to_string(),
        output_dir: "/tmp/output".to_string(),
        theme: "default".to_string(),
        include_backlinks: true,
        include_graph_view: false,
        custom_css: None,
    };

    let config_js = serde_wasm_bindgen::to_value(&config).unwrap();
    let result = publish(config_js).await;

    // Should return an error, not panic
    assert!(result.is_err(), "Expected error for nonexistent directory");
}

/// Test custom CSS injection
#[wasm_bindgen_test]
async fn test_custom_css() {
    let fixture = TestFixture::new("css_test");

    fixture.create_page("test.md", fixtures::simple_page())
        .expect("Failed to create test page");

    std::fs::create_dir_all(&fixture.output_dir)
        .expect("Failed to create output dir");

    let custom_css = "body { background: blue; }";
    let config = PublishConfig {
        input_dir: fixture.pages_dir.to_str().unwrap().to_string(),
        output_dir: fixture.output_dir.to_str().unwrap().to_string(),
        theme: "default".to_string(),
        include_backlinks: true,
        include_graph_view: false,
        custom_css: Some(custom_css.to_string()),
    };

    let config_js = serde_wasm_bindgen::to_value(&config).unwrap();
    let _ = publish(config_js).await.expect("Publish failed");

    let html = std::fs::read_to_string(fixture.output_dir.join("test.html"))
        .expect("Failed to read HTML");

    assert!(html.contains(custom_css), "Custom CSS not included in output");
}
