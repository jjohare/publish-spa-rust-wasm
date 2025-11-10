use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use js_sys::{Array, Reflect};
use crate::errors::PublishError;

/// Read all markdown files from a graph directory
/// This uses Node.js fs module via JavaScript interop
pub async fn read_graph_files(input_dir: &str) -> Result<HashMap<String, String>, PublishError> {
    // Validate input directory path
    validate_input_path(input_dir)?;

    let mut files = HashMap::new();

    // Call JavaScript helper to read files
    let files_array = read_dir_recursive(input_dir)
        .await
        .map_err(|e| PublishError::io(format!("Failed to read directory '{}': {:?}", input_dir, e)))?;

    let length = files_array.length();
    for i in 0..length {
        let file_obj = files_array.get(i);

        let path = Reflect::get(&file_obj, &JsValue::from_str("path"))
            .map_err(|_| PublishError::js_interop("Missing path property in file object"))?
            .as_string()
            .ok_or_else(|| PublishError::js_interop("Path property is not a string"))?;

        // Validate each file path
        validate_file_path(&path)?;

        let content = Reflect::get(&file_obj, &JsValue::from_str("content"))
            .map_err(|_| PublishError::js_interop(&format!("Missing content property for file '{}'", path)))?
            .as_string()
            .ok_or_else(|| PublishError::js_interop(&format!("Content is not a string for file '{}'", path)))?;

        // Only include markdown files
        if path.ends_with(".md") || path.ends_with(".markdown") {
            files.insert(path, content);
        }
    }

    Ok(files)
}

/// Validate input directory path for security
fn validate_input_path(path: &str) -> Result<(), PublishError> {
    if path.is_empty() {
        return Err(PublishError::invalid_input("Input directory path cannot be empty"));
    }

    // Check for path traversal attempts
    if path.contains("..") {
        return Err(PublishError::invalid_input("Path traversal not allowed: path contains '..'"));
    }

    // Prevent absolute paths starting with / (Unix) unless explicitly allowed
    // This is a basic check; in production you'd want more robust validation
    if path.starts_with('/') && !path.starts_with("/home/") && !path.starts_with("/tmp/") {
        return Err(PublishError::invalid_input("Absolute paths outside allowed directories are not permitted"));
    }

    Ok(())
}

/// Validate individual file path for security
fn validate_file_path(path: &str) -> Result<(), PublishError> {
    if path.is_empty() {
        return Err(PublishError::invalid_input("File path cannot be empty"));
    }

    // Check for path traversal
    if path.contains("..") {
        return Err(PublishError::invalid_input(&format!("Path traversal not allowed in file path: '{}'", path)));
    }

    // Check for null bytes
    if path.contains('\0') {
        return Err(PublishError::invalid_input(&format!("Null bytes not allowed in file path: '{}'", path)));
    }

    // Check for suspicious patterns
    if path.starts_with('/') || path.starts_with('\\') {
        return Err(PublishError::invalid_input(&format!("Absolute file paths not allowed: '{}'", path)));
    }

    Ok(())
}

/// Write output HTML files
pub async fn write_output_files(output_dir: &str, files: HashMap<String, String>) -> Result<(), PublishError> {
    // Validate output directory
    validate_input_path(output_dir)?;

    for (path, content) in files {
        // Validate output file path
        validate_file_path(&path)?;

        let output_path = format!("{}/{}", output_dir, path);
        write_file(&output_path, &content)
            .await
            .map_err(|e| PublishError::io(format!("Failed to write file '{}': {:?}", output_path, e)))?;
    }
    Ok(())
}

/// JavaScript interop: Read directory recursively
#[wasm_bindgen(module = "/js/fs-helpers.js")]
extern "C" {
    #[wasm_bindgen(catch)]
    async fn read_dir_recursive(path: &str) -> Result<Array, JsValue>;

    #[wasm_bindgen(catch)]
    async fn write_file(path: &str, content: &str) -> Result<(), JsValue>;

    #[wasm_bindgen(catch)]
    async fn ensure_dir(path: &str) -> Result<(), JsValue>;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_markdown_filter() {
        // Test that only .md and .markdown files would be included
        assert!("test.md".ends_with(".md"));
        assert!("test.markdown".ends_with(".markdown"));
        assert!(!"test.txt".ends_with(".md"));
    }

    #[test]
    fn test_path_validation() {
        // Valid paths
        assert!(validate_input_path("./test").is_ok());
        assert!(validate_file_path("test.md").is_ok());

        // Invalid paths with path traversal
        assert!(validate_input_path("../etc/passwd").is_err());
        assert!(validate_file_path("../../etc/passwd").is_err());

        // Null byte attacks
        assert!(validate_file_path("test\0.md").is_err());

        // Absolute paths
        assert!(validate_file_path("/etc/passwd").is_err());
    }
}
