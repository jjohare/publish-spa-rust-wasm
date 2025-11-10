use thiserror::Error;
use wasm_bindgen::JsValue;
use serde::{Deserialize, Serialize};

/// Main error type for the publish-spa library
#[derive(Debug, Error, Serialize, Deserialize)]
#[serde(tag = "type", content = "details")]
pub enum PublishError {
    /// Parse error in a specific file
    #[error("Parse error in {file}: {message}")]
    Parse {
        file: String,
        message: String,
    },

    /// IO error during file operations
    #[error("IO error: {0}")]
    Io(String),

    /// Graph-related error (e.g., missing page, invalid reference)
    #[error("Graph error: {0}")]
    Graph(String),

    /// Export/rendering error
    #[error("Export error: {0}")]
    Export(String),

    /// Invalid input provided by user
    #[error("Invalid input: {0}")]
    InvalidInput(String),

    /// Invalid path
    #[error("Invalid path: {0}")]
    InvalidPath(String),

    /// JavaScript interop error
    #[error("JavaScript error: {0}")]
    JsInterop(String),

    /// Serialization/deserialization error
    #[error("Serialization error: {0}")]
    Serialization(String),

    /// Generic error with context
    #[error("{context}: {message}")]
    WithContext {
        context: String,
        message: String,
    },
}

impl PublishError {
    /// Create a parse error with file and message
    pub fn parse(file: impl Into<String>, message: impl Into<String>) -> Self {
        Self::Parse {
            file: file.into(),
            message: message.into(),
        }
    }

    /// Create an IO error
    pub fn io(message: impl Into<String>) -> Self {
        Self::Io(message.into())
    }

    /// Create a graph error
    pub fn graph(message: impl Into<String>) -> Self {
        Self::Graph(message.into())
    }

    /// Create an export error
    pub fn export(message: impl Into<String>) -> Self {
        Self::Export(message.into())
    }

    /// Create an invalid input error
    pub fn invalid_input(message: impl Into<String>) -> Self {
        Self::InvalidInput(message.into())
    }

    /// Create an invalid path error
    pub fn invalid_path(path: impl Into<String>) -> Self {
        Self::InvalidPath(path.into())
    }

    /// Create a JS interop error
    pub fn js_interop(message: impl Into<String>) -> Self {
        Self::JsInterop(message.into())
    }

    /// Add context to an error
    pub fn with_context(self, context: impl Into<String>) -> Self {
        let message = self.to_string();
        Self::WithContext {
            context: context.into(),
            message,
        }
    }
}

/// Convert PublishError to JsValue for WASM interop
impl From<PublishError> for JsValue {
    fn from(err: PublishError) -> Self {
        // Serialize error to JSON for JavaScript
        match serde_wasm_bindgen::to_value(&err) {
            Ok(val) => val,
            Err(_) => {
                // Fallback to string representation if serialization fails
                JsValue::from_str(&err.to_string())
            }
        }
    }
}

/// Convert serde_wasm_bindgen error to PublishError
impl From<serde_wasm_bindgen::Error> for PublishError {
    fn from(err: serde_wasm_bindgen::Error) -> Self {
        Self::Serialization(err.to_string())
    }
}

/// Convert JsValue to PublishError
impl From<JsValue> for PublishError {
    fn from(val: JsValue) -> Self {
        Self::JsInterop(
            val.as_string()
                .unwrap_or_else(|| format!("{:?}", val))
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_error() {
        let err = PublishError::parse("test.md", "invalid syntax");
        assert!(err.to_string().contains("test.md"));
        assert!(err.to_string().contains("invalid syntax"));
    }

    #[test]
    fn test_io_error() {
        let err = PublishError::io("file not found");
        assert!(err.to_string().contains("IO error"));
    }

    #[test]
    fn test_graph_error() {
        let err = PublishError::graph("missing page reference");
        assert!(err.to_string().contains("Graph error"));
    }

    #[test]
    fn test_export_error() {
        let err = PublishError::export("failed to render HTML");
        assert!(err.to_string().contains("Export error"));
    }

    #[test]
    fn test_invalid_input_error() {
        let err = PublishError::invalid_input("empty config");
        assert!(err.to_string().contains("Invalid input"));
    }

    #[test]
    fn test_invalid_path_error() {
        let err = PublishError::invalid_path("/invalid/path");
        assert!(err.to_string().contains("Invalid path"));
    }

    #[test]
    fn test_with_context() {
        let err = PublishError::io("read failed").with_context("Loading configuration");
        assert!(err.to_string().contains("Loading configuration"));
    }

    #[test]
    fn test_error_to_jsvalue() {
        let err = PublishError::parse("test.md", "syntax error");
        let js_val: JsValue = err.into();
        assert!(!js_val.is_undefined());
    }

    #[test]
    fn test_serialization() {
        let err = PublishError::parse("test.md", "syntax error");
        let json = serde_json::to_string(&err).unwrap();
        assert!(json.contains("Parse"));
        assert!(json.contains("test.md"));
    }
}
