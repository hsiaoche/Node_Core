export class InteractionCtrl {
    constructor(renderer) {
        this.hoverPanel = document.getElementById('panel-hover');
        
        renderer.onNodeHover(node => {
            this.renderHoverInfo(node);
        });
    }

    renderHoverInfo(node) {
        if (!this.hoverPanel) return;
        if (!node) {
            this.hoverPanel.style.display = 'none';
            return;
        }

        this.hoverPanel.style.display = 'block';
        
        let content = `<h3>${node.name || node.id}</h3>`;
        content += `<div class="hover-type">${node.type.toUpperCase()}</div>`;
        
        if (node.type === 'user') {
            content += `<p><strong>Degree:</strong> ${node.degree || 0}</p>`;
            content += `<p><strong>Community:</strong> ${node.community || 'N/A'}</p>`;
            content += `<p><strong>Status:</strong> ${node.status || 'N/A'}</p>`;
            content += `<p><strong>Traits:</strong> ${(node.traits || []).join(', ')}</p>`;
        } else if (node.type === 'tag') {
            content += `<p><strong>Category:</strong> ${node.category}</p>`;
            content += `<p><strong>Users Count:</strong> ${node.size}</p>`;
        } else if (node.type === 'category') {
            content += `<p><strong>Total Tags/Users:</strong> ${node.size}</p>`;
        }

        this.hoverPanel.innerHTML = content;
    }
}
