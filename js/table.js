import { nodeStore } from './store.js';

export class TableController {
    constructor(modalController) {
        this.tbody = document.getElementById('data-table-body');
        this.modalController = modalController;
    }

    render() {
        if (!this.tbody) return;
        
        const allNodes = nodeStore.getAll();
        
        // We only want to show actual entities (admin/student/default), not the trait nodes
        const entities = allNodes.filter(n => n.group !== 'trait');
        
        this.tbody.innerHTML = '';
        
        if (entities.length === 0) {
            this.tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 30px;">No data available</td></tr>';
            return;
        }

        entities.forEach(node => {
            const tr = document.createElement('tr');
            
            // Generate tags HTML
            const tagsHtml = (node.traits || []).map(t => `<span class="table-tag">${t}</span>`).join('');
            
            tr.innerHTML = `
                <td><code>${node.id}</code></td>
                <td style="font-weight: 500;">${node.label || '-'}</td>
                <td><span class="group-badge ${node.group}">${node.group}</span></td>
                <td><div class="table-tag-list">${tagsHtml || '-'}</div></td>
                <td>
                    <button class="sys-btn btn-edit-table" data-id="${node.id}">Edit</button>
                </td>
            `;
            this.tbody.appendChild(tr);
        });

        // Add event listeners to edit buttons
        const editButtons = this.tbody.querySelectorAll('.btn-edit-table');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nodeId = e.target.getAttribute('data-id');
                this.modalController.open(nodeId);
            });
        });
    }
}
