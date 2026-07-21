export class NodeStore extends EventTarget {
    constructor() {
        super();
        this._nodes = new Map();
    }

    hydrate(dataArray) {
        this._nodes.clear();
        dataArray.forEach(node => this._nodes.set(node.id, node));
        this._emitUpdate();
    }

    updateNodeTraits(id, newTraits) {
        if (!this._nodes.has(id)) return false;
        const node = this._nodes.get(id);
        node.traits = [...newTraits];
        this._nodes.set(id, node);
        this._emitUpdate();
        return true;
    }

    getAll() {
        return Array.from(this._nodes.values());
    }

    _emitUpdate() {
        this.dispatchEvent(new CustomEvent('store_updated', { detail: this.getAll() }));
    }
}

export const nodeStore = new NodeStore();