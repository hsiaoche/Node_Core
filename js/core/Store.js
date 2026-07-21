import { GraphBuilder } from './GraphBuilder.js';

export class Store extends EventTarget {
    constructor() {
        super();
        this.rawNodes = [];
        this.graphData = { nodes: [], links: [] };
        
        // Filter states
        this.filters = {
            searchQuery: '',
            nodeTypes: new Set(['user', 'tag', 'category'])
        };
    }

    hydrate(rawNodesData) {
        this.rawNodes = rawNodesData;
        this.rebuildGraph();
    }

    rebuildGraph() {
        this.graphData = GraphBuilder.build(this.rawNodes);
        this.emitUpdate();
    }

    getGraphData() {
        return this.graphData;
    }
    
    getFilteredGraphData() {
        // Apply filters
        let nodes = this.graphData.nodes.filter(n => this.filters.nodeTypes.has(n.type));
        
        if (this.filters.searchQuery) {
            const q = this.filters.searchQuery.toLowerCase();
            nodes = nodes.filter(n => (n.name || '').toLowerCase().includes(q) || (n.id || '').toLowerCase().includes(q));
        }

        const validNodeIds = new Set(nodes.map(n => n.id));
        const links = this.graphData.links.filter(l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            return validNodeIds.has(s) && validNodeIds.has(t);
        });

        return { nodes, links };
    }

    setSearchQuery(query) {
        this.filters.searchQuery = query;
        this.emitUpdate();
    }

    emitUpdate() {
        this.dispatchEvent(new CustomEvent('graph_updated', { 
            detail: this.getFilteredGraphData() 
        }));
    }
}

export const graphStore = new Store();
