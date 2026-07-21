import { nodeStore } from './store.js';

export class ModalController {
    // 依賴注入：要求傳入模板 ID 與掛載目標
    constructor(templateId, mountTarget) {
        const tpl = document.getElementById(templateId);
        mountTarget.appendChild(tpl.content.cloneNode(true));

        this.modalEl = document.getElementById('edit-modal');
        this.titleEl = document.getElementById('modal-node-name');
        this.tagListEl = document.getElementById('modal-tag-list');
        this.inputEl = document.getElementById('new-trait-input');
        
        this.activeNodeId = null;
        this.tempTraits = [];

        this._bindEvents();
    }

    _bindEvents() {
        document.getElementById('btn-add-trait').addEventListener('click', () => this._addTrait());
        this.inputEl.addEventListener('keypress', (e) => { if(e.key === 'Enter') this._addTrait(); });
        document.getElementById('btn-cancel').addEventListener('click', () => this.close());
        document.getElementById('btn-commit').addEventListener('click', () => this._commit());
        
        this.tagListEl.addEventListener('click', (e) => {
            if(e.target.tagName === 'SPAN') {
                const index = parseInt(e.target.dataset.index, 10);
                this.tempTraits.splice(index, 1);
                this._renderTags();
            }
        });
    }

    open(nodeId) {
        const target = nodeStore.getAll().find(n => n.id === nodeId);
        if (!target) return;
        this.activeNodeId = nodeId;
        this.tempTraits = [...(target.traits || [])];
        this.titleEl.textContent = target.name || target.id;
        this._renderTags();
        this.modalEl.style.display = 'flex';
        this.inputEl.focus();
    }

    close() {
        this.modalEl.style.display = 'none';
        this.inputEl.value = '';
        this.activeNodeId = null;
    }

    _renderTags() {
        // [安全修正] 棄用 innerHTML，改用 DOM API 避免 XSS 注入攻擊
        this.tagListEl.innerHTML = ''; 
        this.tempTraits.forEach((trait, index) => {
            const tagDiv = document.createElement('div');
            tagDiv.className = 'sys-tag';
            tagDiv.appendChild(document.createTextNode(trait + ' '));

            const closeSpan = document.createElement('span');
            closeSpan.dataset.index = index;
            closeSpan.textContent = '×';
            
            tagDiv.appendChild(closeSpan);
            this.tagListEl.appendChild(tagDiv);
        });
    }

    _addTrait() {
        const val = this.inputEl.value.trim();
        if (val && !this.tempTraits.includes(val)) {
            this.tempTraits.push(val);
            this._renderTags();
            this.inputEl.value = '';
        }
    }

    _commit() {
        if (this.activeNodeId) {
            nodeStore.updateNodeTraits(this.activeNodeId, this.tempTraits);
        }
        this.close();
    }
}