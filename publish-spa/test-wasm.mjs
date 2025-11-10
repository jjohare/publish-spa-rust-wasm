import * as wasm from './pkg/publish_spa_wasm.js';

console.log('WASM loaded successfully!');
console.log('Available exports:', Object.keys(wasm));
console.log('publish function type:', typeof wasm.publish);
console.log('\nAll functions:');
console.log('- init():', typeof wasm.init);
console.log('- publish():', typeof wasm.publish);
console.log('- parse_graph():', typeof wasm.parse_graph);
console.log('- get_backlinks():', typeof wasm.get_backlinks);
console.log('- PublishConfig class:', typeof wasm.PublishConfig);
console.log('- PublishStats class:', typeof wasm.PublishStats);
