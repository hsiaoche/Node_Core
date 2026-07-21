import { nodeStore } from './store.js';
import { DataProvider } from './provider.js';
import { GraphController } from './controller.js';
import { ModalController } from './modal.js';

class Application {
    static async boot() {
        // 1. 初始化 DOM
        const appRoot = document.getElementById('app-root');
        const graphTpl = document.getElementById('tpl-network-view');
        appRoot.appendChild(graphTpl.content.cloneNode(true));

        // 2. 實例化 UI 控制器
        const modalCtrl = new ModalController();
        const graphCtrl = new GraphController('network-container', (nodeId) => {
            modalCtrl.open(nodeId);
        });

        // 3. 綁定 Export 按鈕
        document.getElementById('btn-export').addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(nodeStore.getAll(), null, 2));
            const a = document.createElement('a');
            a.href = dataStr; a.download = "nodes.json";
            a.click();
        });
        
        // 4. 綁定事件總線 (SSOT)
        nodeStore.addEventListener('store_updated', (e) => {
            DataProvider.save(e.detail);
            graphCtrl.render(e.detail); 
        });

        // 5. 系統點火
        const initialData = await DataProvider.load();
        nodeStore.hydrate(initialData);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Application.boot();
});