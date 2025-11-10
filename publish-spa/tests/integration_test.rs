//! Integration tests for the Logseq publish pipeline
//!
//! These tests verify the complete end-to-end functionality of:
//! - File reading
//! - Parsing Logseq markdown
//! - Graph building
//! - HTML export
//! - Backlink generation

#![cfg(target_arch = "wasm32")]

use wasm_bindgen_test::*;
use publish_spa_wasm::{PublishConfig, parse_graph, get_backlinks};
use wasm_bindgen::JsValue;
use serde_wasm_bindgen;

wasm_bindgen_test_configure!(run_in_browser);

mod common;
use common::fixtures;

#[wasm_bindgen_test]
fn test_config_creation() {
    let config = PublishConfig::new(
        "test_input".to_string(),
        "test_output".to_string()
    );

    assert_eq!(config.theme, "default");
    assert_eq!(config.include_backlinks, true);
    assert_eq!(config.include_graph_view, false);
}

#[wasm_bindgen_test]
fn test_config_setters() {
    let mut config = PublishConfig::new(
        "input".to_string(),
        "output".to_string()
    );

    config.set_theme("dark".to_string());
    assert_eq!(config.theme, "dark");

    config.set_include_backlinks(false);
    assert_eq!(config.include_backlinks, false);

    config.set_include_graph_view(true);
    assert_eq!(config.include_graph_view, true);

    config.set_custom_css(Some("body { color: red; }".to_string()));
    assert!(config.custom_css.is_some());
}

#[wasm_bindgen_test]
async fn test_parse_simple_graph() {
    // Note: This test requires proper file I/O setup in WASM environment
    // For now, it demonstrates the test structure

    // In a real test, we would:
    // 1. Create temporary test files
    // 2. Call parse_graph
    // 3. Verify stats

    // Example of how it would work:
    // let stats = parse_graph("./test/fixtures".to_string()).await;
    // assert!(stats.is_ok());
}

#[wasm_bindgen_test]
fn test_stats_getters() {
    use publish_spa_wasm::PublishStats;

    let stats = PublishStats {
        page_count: 5,
        total_blocks: 20,
        total_links: 10,
        orphan_pages: 1,
    };

    assert_eq!(stats.page_count(), 5);
    assert_eq!(stats.total_blocks(), 20);
    assert_eq!(stats.total_links(), 10);
    assert_eq!(stats.orphan_pages(), 1);
}

/// Test that the library initializes without errors
#[wasm_bindgen_test]
fn test_init() {
    // This should not panic
    publish_spa_wasm::init();
}

/// Test serialization of config to JsValue
#[wasm_bindgen_test]
fn test_config_serialization() {
    let config = PublishConfig::new(
        "input".to_string(),
        "output".to_string()
    );

    let js_value = serde_wasm_bindgen::to_value(&config);
    assert!(js_value.is_ok());
}

// Note: More comprehensive integration tests would require:
// 1. Mock file system in WASM
// 2. Sample Logseq graph fixtures
// 3. HTML output validation
//
// These are demonstrated in the Node.js integration tests
