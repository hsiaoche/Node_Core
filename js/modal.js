import { nodeStore } from './store.js';

export class ModalController {
    constructor() {
        const tpl = document.getElementById('tpl-edit-modal');
        document.body.appendChild(tpl.content.cloneNode(true));

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
        
        // 委派刪除標籤事件
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
        this.tagListEl.innerHTML = this.tempTraits.map((t, i) => 
            `<div class="sys-tag">${t} <span data-index="${i}">×</span></div>`
        ).join('');
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