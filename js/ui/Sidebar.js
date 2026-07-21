export class Sidebar {
    constructor(store) {
        this.store = store;
        this.statsPanel = document.getElementById('panel-stats');
        
        this.store.addEventListener('graph_updated', (e) => {
            this.renderStats(e.detail);
        });
    }

    renderStats(graphData) {
        if (!this.statsPanel) return;
        
        const nodes = graphData.nodes;
        const links = graphData.links;
        
        const catCount = nodes.filter(n => n.type === 'category').length;
        const tagCount = nodes.filter(n => n.type === 'tag').length;
        const userCount = nodes.filter(n => n.type === 'user').length;
        
        let avgDegree = 0;
        if(userCount > 0) {
            const totalDegree = nodes.filter(n => n.type === 'user').reduce((sum, n) => sum + (n.degree || 0), 0);
            avgDegree = (totalDegree / userCount).toFixed(1);
        }

        this.statsPanel.innerHTML = `
            <h3>系統統計</h3>
            <div class="stat-item"><span>總分類數:</span> <span>${catCount}</span></div>
            <div class="stat-item"><span>總標籤數:</span> <span>${tagCount}</span></div>
            <div class="stat-item"><span>總使用者數:</span> <span>${userCount}</span></div>
            <div class="stat-item"><span>總關聯數:</span> <span>${links.length}</span></div>
            <div class="stat-item"><span>平均關聯度:</span> <span>${avgDegree}</span></div>
        `;
    }
}
