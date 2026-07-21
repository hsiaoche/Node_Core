import { graphStore } from './core/Store.js';
import { DataProvider } from './provider.js';
import { Renderer3D } from './renderer/Renderer3D.js';
import { Sidebar } from './ui/Sidebar.js';
import { InteractionCtrl } from './ui/Interaction.js';
import { TableView } from './ui/TableView.js';

class EnterpriseGraphApp {
    static async boot() {
        console.log('[SYS] Booting Enterprise Knowledge Graph...');
        
        // 1. Setup UI Shell
        const containerEl = document.getElementById('network-container');
        
        // 2. Init Modules
        const renderer = new Renderer3D(containerEl);
        const sidebar = new Sidebar(graphStore);
        const interaction = new InteractionCtrl(renderer);
        const tableView = new TableView(graphStore);

        // 2.5 Setup Navigation
        const navNet = document.getElementById('nav-network');
        const navTable = document.getElementById('nav-table');
        
        navNet.addEventListener('click', (e) => {
            e.preventDefault();
            navNet.classList.add('active'); navTable.classList.remove('active');
            containerEl.style.display = 'block';
            document.getElementById('sidebar-left').style.display = 'block';
            document.getElementById('sidebar-right').style.display = 'block';
            tableView.hide();
        });
        navTable.addEventListener('click', (e) => {
            e.preventDefault();
            navTable.classList.add('active'); navNet.classList.remove('active');
            containerEl.style.display = 'none';
            document.getElementById('sidebar-left').style.display = 'none';
            document.getElementById('sidebar-right').style.display = 'none';
            tableView.show();
        });

        // 3. Bind Store Updates to Renderer
        graphStore.addEventListener('graph_updated', (e) => {
            renderer.updateData(e.detail);
        });

        // 4. Initial Render Setup
        renderer.init({ nodes: [], links: [] });

        // 5. Load Data & Hydrate
        try {
            const rawData = await DataProvider.load();
            graphStore.hydrate(rawData);
            console.log('[SYS] Graph Hydrated successfully.');
        } catch(err) {
            console.error('[SYS] Failed to load graph data:', err);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    EnterpriseGraphApp.boot();
});