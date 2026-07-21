import { GraphRenderer } from './renderer.js';
import { GRAPH_CONFIG } from './config.js';

export class GraphController {
    // 依賴注入：containerElement 由外部提供
    constructor(containerElement, onNodeClickCallback) {
        this.renderer = new GraphRenderer(containerElement);
        this.onNodeClick = onNodeClickCallback;
    }

    render(rawData) {
        const { nodesArray, linksArray } = this._parseData(rawData);
        if (!this.renderer.instance) {
            this.renderer.init(nodesArray, linksArray, this.onNodeClick);
        } else {
            this.renderer.updateData(nodesArray, linksArray);
        }
    }

    _parseData(data) {
        const nodesMap = new Map();
        const linksArray = [];
        const traitCounts = {};

        data.forEach(n => {
            nodesMap.set(n.id, { id: n.id, label: n.name || n.id, group: n.id === 'SYS_ADMIN' ? 'admin' : 'student' });
        });

        data.forEach(n => {
            if (n.traits) {
                n.traits.forEach(t => {
                    traitCounts[t] = (traitCounts[t] || 0) + 1;
                    linksArray.push({ source: n.id, target: 'T_' + t });
                });
            }
            if (n.familiar_with) {
                n.familiar_with.forEach(targetId => {
                    if (nodesMap.has(targetId)) linksArray.push({ source: n.id, target: targetId });
                });
            }
        });

        Object.keys(traitCounts).forEach(t => {
            nodesMap.set('T_' + t, { 
                id: 'T_' + t, 
                label: t, 
                group: 'trait', 
                size: GRAPH_CONFIG.sizes.nodes.minTrait + (traitCounts[t] * GRAPH_CONFIG.sizes.nodes.traitMultiplier) 
            });
        });

        return { nodesArray: Array.from(nodesMap.values()), linksArray };
    }
}