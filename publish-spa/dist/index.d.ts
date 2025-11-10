/**
 * TypeScript definitions for Logseq Publisher
 */

export interface PublishOptions {
    /** Input directory containing Logseq graph */
    inputDir: string;
    /** Output directory for generated HTML */
    outputDir: string;
    /** Theme name (default: 'default') */
    theme?: string;
    /** Include backlinks in pages (default: true) */
    includeBacklinks?: boolean;
    /** Include interactive graph view (default: false) */
    includeGraphView?: boolean;
    /** Custom CSS to inject */
    customCss?: string;
}

export interface PublishStats {
    /** Number of pages in the graph */
    page_count: number;
    /** Total number of blocks */
    total_blocks: number;
    /** Total number of links */
    total_links: number;
    /** Number of orphan pages (no links or backlinks) */
    orphan_pages: number;
}

/**
 * Publish a Logseq graph as a static HTML site
 *
 * @param options - Publishing options
 * @returns Publishing statistics
 */
export function publish(options: PublishOptions): Promise<PublishStats>;

/**
 * Parse a Logseq graph and return statistics
 *
 * @param inputDir - Input directory containing Logseq graph
 * @returns Graph statistics
 */
export function parseGraph(inputDir: string): Promise<PublishStats>;

/**
 * Get backlinks for a specific page
 *
 * @param inputDir - Input directory containing Logseq graph
 * @param pagePath - Path to the page
 * @returns Array of backlink paths
 */
export function getBacklinks(inputDir: string, pagePath: string): Promise<string[]>;

declare const _default: {
    publish: typeof publish;
    parseGraph: typeof parseGraph;
    getBacklinks: typeof getBacklinks;
};

export default _default;
