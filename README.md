# Node_Core

Node_Core 是一個基於 3D 拓撲結構的視覺化網路節點系統。該系統可以解析並展示不同節點（例如人員、單元等）之間的關聯性，並將其視覺化為立體的互動圖表。

## 系統特色

*   **3D 視覺化拓撲圖**：使用 `three.js` 與 `3d-force-graph`，提供流暢的立體網路關係展示。
*   **動態標籤編輯**：支援點擊節點後在模態視窗 (Modal) 中動態新增或刪除特質 (Traits)。
*   **資料持久化**：系統啟動時會透過非同步拉取 `./data/nodes.json` 作為初始資料，並於 Local Storage 中進行狀態快取 (`node_core_data`)。
*   **資料匯出**：提供 `[ EXPORT_DATA ]` 功能，允許使用者將當前的拓撲狀態匯出為 `.json` 檔案。

## 系統架構

*   `js/app.js`: 系統入口與點火程序。
*   `js/store.js`: 基於 EventTarget 的單一真相來源 (SSOT) 狀態管理器。
*   `js/provider.js`: 負責處理資料拉取 (Fetch JSON) 以及本機快取 (Local Storage)。
*   `js/controller.js` / `js/renderer.js`: 負責 3D 圖表的繪製邏輯與設定。
*   `js/modal.js`: 編輯模態視窗的 DOM 操作。
*   `css/main.css`: 深色模式 (Dark Theme) UI 配置。

## 如何運行

這是一個純前端的靜態網站，基於原生 JavaScript 開發（包含 ES6 Modules）。
由於使用了 ES6 `import/export` 模組以及 `fetch()` API，你需要透過一個本地伺服器來運行它（避免 CORS 或 file:// 協定的限制）。

例如使用 Python：
```bash
python3 -m http.server 8000
```
或者使用 Node.js 的 `serve` 或 `live-server` 啟動。
