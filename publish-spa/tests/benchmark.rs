//! Performance benchmarks for the publish pipeline
//!
//! Note: These are manual benchmarks. For production use, consider:
//! - criterion crate for statistical benchmarking
//! - Integration with CI/CD for regression detection

#![cfg(all(target_arch = "wasm32", not(target_os = "unknown")))]

use wasm_bindgen_test::*;
use publish_spa_wasm::{PublishConfig, publish, parse_graph};
use serde_wasm_bindgen;
use std::time::Instant;

wasm_bindgen_test_configure!(run_in_node);

mod common;
use common::TestFixture;

/// Helper to generate N sample pages
fn generate_pages(count: usize) -> std::collections::HashMap<String, String> {
    let mut pages = std::collections::HashMap::new();

    for i in 0..count {
        let filename = format!("page_{}.md", i);
        let content = format!(
            r#"# Page {}

- This is page number {}
  - With some nested content
  - And links to [[Page {}]]
  - And [[Page {}]]
- Some more content with **bold** and *italic*
- Code block:
  ```rust
  fn page_{}() {{
      println!("Page {}")
  }}
  ```
- Tags: #tag{} #benchmark
- TODO Some task
"#,
            i,
            i,
            (i + 1) % count,
            (i + 2) % count,
            i,
            i,
            i % 10
        );

        pages.insert(filename, content);
    }

    pages
}

/// Benchmark parsing 100 pages
#[wasm_bindgen_test]
async fn bench_parse_100_pages() {
    let fixture = TestFixture::new("bench_100");
    let pages = generate_pages(100);

    // Convert to &str for create_sample_pages
    let pages_ref: std::collections::HashMap<&str, &str> = pages
        .iter()
        .map(|(k, v)| (k.as_str(), v.as_str()))
        .collect();

    fixture.create_sample_pages(pages_ref)
        .expect("Failed to create pages");

    let input_dir = fixture.pages_dir.to_str().unwrap().to_string();

    let start = Instant::now();
    let result = parse_graph(input_dir).await;
    let duration = start.elapsed();

    assert!(result.is_ok(), "Parse failed");

    web_sys::console::log_1(
        &format!("Parse 100 pages: {:?}", duration).into()
    );

    // Performance target: < 1 second for 100 pages
    assert!(duration.as_secs() < 1, "Parsing too slow: {:?}", duration);
}

/// Benchmark parsing 1000 pages
#[wasm_bindgen_test]
async fn bench_parse_1000_pages() {
    let fixture = TestFixture::new("bench_1000");
    let pages = generate_pages(1000);

    let pages_ref: std::collections::HashMap<&str, &str> = pages
        .iter()
        .map(|(k, v)| (k.as_str(), v.as_str()))
        .collect();

    fixture.create_sample_pages(pages_ref)
        .expect("Failed to create pages");

    let input_dir = fixture.pages_dir.to_str().unwrap().to_string();

    let start = Instant::now();
    let result = parse_graph(input_dir).await;
    let duration = start.elapsed();

    assert!(result.is_ok(), "Parse failed");

    web_sys::console::log_1(
        &format!("Parse 1000 pages: {:?}", duration).into()
    );

    // Performance target: < 10 seconds for 1000 pages
    assert!(duration.as_secs() < 10, "Parsing too slow: {:?}", duration);
}

/// Benchmark full publish pipeline with 100 pages
#[wasm_bindgen_test]
async fn bench_publish_100_pages() {
    let fixture = TestFixture::new("bench_pub_100");
    let pages = generate_pages(100);

    let pages_ref: std::collections::HashMap<&str, &str> = pages
        .iter()
        .map(|(k, v)| (k.as_str(), v.as_str()))
        .collect();

    fixture.create_sample_pages(pages_ref)
        .expect("Failed to create pages");

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

    let start = Instant::now();
    let result = publish(config_js).await;
    let duration = start.elapsed();

    assert!(result.is_ok(), "Publish failed");

    web_sys::console::log_1(
        &format!("Full publish 100 pages: {:?}", duration).into()
    );

    // Performance target: < 2 seconds for 100 pages
    assert!(duration.as_secs() < 2, "Publishing too slow: {:?}", duration);
}

/// Memory usage test (demonstrates pattern, actual measurement needs Node.js API)
#[wasm_bindgen_test]
async fn bench_memory_usage() {
    let fixture = TestFixture::new("bench_memory");
    let pages = generate_pages(500);

    let pages_ref: std::collections::HashMap<&str, &str> = pages
        .iter()
        .map(|(k, v)| (k.as_str(), v.as_str()))
        .collect();

    fixture.create_sample_pages(pages_ref)
        .expect("Failed to create pages");

    let input_dir = fixture.pages_dir.to_str().unwrap().to_string();

    // In a real benchmark, you would:
    // 1. Measure memory before
    // 2. Run operation
    // 3. Measure memory after
    // 4. Force GC and measure again

    let result = parse_graph(input_dir).await;
    assert!(result.is_ok());

    web_sys::console::log_1(
        &"Memory benchmark completed (manual measurement required)".into()
    );
}

/// Benchmark backlink resolution performance
#[wasm_bindgen_test]
async fn bench_backlinks() {
    let fixture = TestFixture::new("bench_backlinks");

    // Create heavily interconnected graph
    let mut pages = std::collections::HashMap::new();

    // Central page that many pages link to
    pages.insert(
        "central.md".to_string(),
        "# Central Page\n- The hub of the graph".to_string()
    );

    // 100 pages all linking to central page
    for i in 0..100 {
        let content = format!(
            "# Page {}\n- Links to [[Central Page]]\n- And [[Page {}]]",
            i,
            (i + 1) % 100
        );
        pages.insert(format!("page_{}.md", i), content);
    }

    let pages_ref: std::collections::HashMap<&str, &str> = pages
        .iter()
        .map(|(k, v)| (k.as_str(), v.as_str()))
        .collect();

    fixture.create_sample_pages(pages_ref)
        .expect("Failed to create pages");

    let input_dir = fixture.pages_dir.to_str().unwrap().to_string();

    let start = Instant::now();
    let result = publish_spa_wasm::get_backlinks(
        input_dir,
        "central.md".to_string()
    ).await;
    let duration = start.elapsed();

    assert!(result.is_ok());

    let backlinks: Vec<String> = serde_wasm_bindgen::from_value(result.unwrap()).unwrap();

    web_sys::console::log_1(
        &format!("Backlink resolution ({} links): {:?}", backlinks.len(), duration).into()
    );

    assert_eq!(backlinks.len(), 100, "Expected 100 backlinks");
}
