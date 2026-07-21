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
        
        this.hoverPanel.innerHTML = `
            <span class="hover-type">${node.type.toUpperCase()}</span>
            <h3>${node.name || node.id}</h3>
            ${node.alias ? `<p><strong>暱稱:</strong> ${node.alias}</p>` : ''}
            <p><strong>識別碼:</strong> ${node.id}</p>
            ${node.community ? `<p><strong>所屬社群:</strong> ${node.community}</p>` : ''}
            
            <div style="margin-top:15px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.1);">
                <p><strong>連線數 (Degree):</strong> ${node.degree || 0}</p>
                ${node.size ? `<p><strong>成員數 (Size):</strong> ${node.size}</p>` : ''}
            </div>
        `;
    }
}
