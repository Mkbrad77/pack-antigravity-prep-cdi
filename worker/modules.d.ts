declare module '*.wasm' {
  const wasmModule: WebAssembly.Module;
  export default wasmModule;
}
declare module 'sql.js/dist/sql-wasm-browser.js' {
  import initSqlJs from 'sql.js';
  export default initSqlJs;
}
