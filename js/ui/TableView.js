export class TableView {
    constructor(store) {
        this.store = store;
        this.container = document.createElement('div');
        this.container.id = 'table-container';
        this.container.style.display = 'none';
        this.container.innerHTML = `
            <div style="padding: 40px;">
                <h2>資料表格維護</h2>
                <div class="table-wrapper">
                    <table id="sys-table">
                        <thead>
                            <tr>
                                <th>類型</th>
                                <th>識別碼</th>
                                <th>名稱 / 暱稱</th>
                                <th>關聯度</th>
                                <th>社群</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="sys-table-body"></tbody>
                    </table>
                </div>
            </div>
        `;
        document.getElementById('app-root').appendChild(this.container);

        this.store.addEventListener('graph_updated', (e) => {
            this.renderTable(e.detail);
        });
    }

    show() {
        this.container.style.display = 'block';
    }

    hide() {
        this.container.style.display = 'none';
    }

    renderTable(graphData) {
        const tbody = document.getElementById('sys-table-body');
        if (!tbody) return;

        let html = '';
        graphData.nodes.forEach(node => {
            html += `
                <tr>
                    <td><span class="hover-type">${node.type.toUpperCase()}</span></td>
                    <td>${node.id}</td>
                    <td>${node.name || '-'} ${node.alias ? '('+node.alias+')' : ''}</td>
                    <td>${node.degree || 0}</td>
                    <td>${node.community || '-'}</td>
                    <td><button class="sys-btn" disabled>編輯</button></td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }
}
