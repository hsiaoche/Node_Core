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
            <h3>STATISTICS</h3>
            <div class="stat-item"><span>Total Categories:</span> <span>${catCount}</span></div>
            <div class="stat-item"><span>Total Tags:</span> <span>${tagCount}</span></div>
            <div class="stat-item"><span>Total Users:</span> <span>${userCount}</span></div>
            <div class="stat-item"><span>Total Edges:</span> <span>${links.length}</span></div>
            <div class="stat-item"><span>Avg User Degree:</span> <span>${avgDegree}</span></div>
        `;
    }
}
