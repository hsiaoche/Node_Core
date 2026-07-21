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

        const existingNodes = new Map();
        if (this.renderer && this.renderer.instance) {
            const currentGraphData = this.renderer.instance.graphData();
            if (currentGraphData && currentGraphData.nodes) {
                currentGraphData.nodes.forEach(n => existingNodes.set(n.id, n));
            }
        }

        data.forEach(n => {
            const newNode = { id: n.id, label: n.name || n.id, group: n.id === 'SYS_ADMIN' ? 'admin' : 'student' };
            if (existingNodes.has(n.id)) {
                const old = existingNodes.get(n.id);
                ['x', 'y', 'z', 'vx', 'vy', 'vz'].forEach(prop => {
                    if (old[prop] !== undefined) newNode[prop] = old[prop];
                });
            }
            nodesMap.set(n.id, newNode);
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
            const traitId = 'T_' + t;
            const newNode = { 
                id: traitId, 
                label: t, 
                group: 'trait', 
                size: GRAPH_CONFIG.sizes.nodes.minTrait + (traitCounts[t] * GRAPH_CONFIG.sizes.nodes.traitMultiplier) 
            };
            if (existingNodes.has(traitId)) {
                const old = existingNodes.get(traitId);
                ['x', 'y', 'z', 'vx', 'vy', 'vz'].forEach(prop => {
                    if (old[prop] !== undefined) newNode[prop] = old[prop];
                });
            }
            nodesMap.set(traitId, newNode);
        });

        return { nodesArray: Array.from(nodesMap.values()), linksArray };
    }
}