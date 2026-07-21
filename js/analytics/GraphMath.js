export class GraphMath {
    /**
     * Infer category for a given tag/trait based on keywords
     */
    static inferCategory(tag) {
        const keywords = {
            '遊戲': ['傳說對決', 'LOL', 'Roblox', 'FPS', '寶可夢'],
            '人格': ['沈默', '外向', '內向', '認真寫考卷'],
            '社群': ['IG', 'Discord', 'Facebook', 'Line'],
            '戶外': ['腳踏車', '露營', '去澎湖', '獨旅'],
            '興趣': ['星座', '機車', '電機', '童軍'],
            '系統': ['核心系統', '兄弟']
        };
        for (const [category, words] of Object.entries(keywords)) {
            if (words.includes(tag)) return category;
        }
        return '其他';
    }

    /**
     * Calculate Jaccard Similarity between two arrays
     */
    static jaccard(setA, setB) {
        const intersection = setA.filter(x => setB.includes(x));
        const union = new Set([...setA, ...setB]);
        if (union.size === 0) return 0;
        return intersection.length / union.size;
    }

    /**
     * Calculate similarities and return new Similarity Edges
     * @param {Array} nodes List of user nodes with .traits array
     * @param {Number} threshold Minimum similarity to create an edge (0~1)
     */
    static calculateSimilarities(userNodes, threshold = 0.3) {
        const edges = [];
        for (let i = 0; i < userNodes.length; i++) {
            for (let j = i + 1; j < userNodes.length; j++) {
                const n1 = userNodes[i];
                const n2 = userNodes[j];
                const sim = this.jaccard(n1.traits || [], n2.traits || []);
                if (sim >= threshold) {
                    edges.push({
                        source: n1.id,
                        target: n2.id,
                        type: 'Similarity',
                        weight: sim,
                        color: 'rgba(0, 255, 255, 0.4)'
                    });
                }
            }
        }
        return edges;
    }

    /**
     * Centrality & Graph Metrics Calculation
     * Updates nodes in-place with .degree and .centrality
     */
    static calculateMetrics(nodes, links) {
        // Init
        nodes.forEach(n => { n.degree = 0; n.neighbors = []; });
        
        // Degree
        links.forEach(l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            const sn = nodes.find(n => n.id === s);
            const tn = nodes.find(n => n.id === t);
            if (sn) { sn.degree++; sn.neighbors.push(t); }
            if (tn) { tn.degree++; tn.neighbors.push(s); }
        });

        // Normalize Centrality (Simple Degree Centrality)
        const maxDegree = Math.max(...nodes.map(n => n.degree), 1);
        nodes.forEach(n => {
            n.centrality = n.degree / maxDegree;
        });
    }

    /**
     * Simple Label Propagation Algorithm for Community Detection
     */
    static detectCommunities(nodes, links) {
        // Init each node as its own community
        nodes.forEach((n, i) => n.community = i);
        
        // 5 iterations is usually enough for small graphs
        for(let iter=0; iter<5; iter++) {
            nodes.forEach(node => {
                if (node.neighbors.length === 0) return;
                
                // Count frequencies of neighboring communities
                const counts = {};
                node.neighbors.forEach(nid => {
                    const neighbor = nodes.find(n => n.id === nid);
                    if(neighbor) {
                        counts[neighbor.community] = (counts[neighbor.community] || 0) + 1;
                    }
                });

                // Find most frequent community
                let maxC = node.community;
                let maxCount = 0;
                for(const [c, count] of Object.entries(counts)) {
                    if(count > maxCount) {
                        maxCount = count;
                        maxC = parseInt(c);
                    }
                }
                node.community = maxC;
            });
        }
        
        // Normalize community IDs to 1, 2, 3...
        const uniqueComms = [...new Set(nodes.map(n => n.community))];
        nodes.forEach(n => {
            n.community = uniqueComms.indexOf(n.community) + 1;
        });
    }
}
