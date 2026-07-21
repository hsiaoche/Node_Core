import { GraphMath } from '../analytics/GraphMath.js';

export class GraphBuilder {
    /**
     * Transforms flat JSON into a 3-tier Knowledge Graph (Category -> Tag -> User)
     * @param {Array} rawNodes Raw JSON from data/nodes.json
     * @returns {Object} { nodes, links }
     */
    static build(rawNodes) {
        const nodesMap = new Map();
        const links = [];
        const userNodes = [];

        // 1. Process User Nodes
        rawNodes.forEach(rn => {
            const userNode = {
                id: rn.id,
                name: rn.name || rn.id,
                alias: rn.alias,
                type: 'user',
                group: rn.id.includes('Admin') ? 'admin' : 'student',
                status: rn.runtime_status,
                traits: rn.traits || [],
                familiar_with: rn.familiar_with || []
            };
            nodesMap.set(userNode.id, userNode);
            userNodes.push(userNode);

            // Add FamiliarWith explicit edges
            userNode.familiar_with.forEach(targetId => {
                links.push({
                    source: userNode.id,
                    target: targetId,
                    type: 'FamiliarWith',
                    weight: 1,
                    color: 'rgba(255,255,255,0.2)'
                });
            });
        });

        // 2. Process Tags & Categories dynamically
        const tagMap = new Map(); // TagName -> TagNode
        const catMap = new Map(); // CatName -> CatNode

        userNodes.forEach(user => {
            user.traits.forEach(traitName => {
                const tagId = `Tag_${traitName}`;
                const catName = GraphMath.inferCategory(traitName);
                const catId = `Cat_${catName}`;

                // Ensure Category exists
                if (!catMap.has(catId)) {
                    catMap.set(catId, {
                        id: catId,
                        name: catName,
                        type: 'category',
                        size: 0
                    });
                }
                const catNode = catMap.get(catId);
                catNode.size += 1;

                // Ensure Tag exists
                if (!tagMap.has(tagId)) {
                    tagMap.set(tagId, {
                        id: tagId,
                        name: traitName,
                        type: 'tag',
                        category: catName,
                        size: 0
                    });
                    
                    // Link Tag to Category (BelongCategory)
                    links.push({
                        source: tagId,
                        target: catId,
                        type: 'BelongCategory',
                        weight: 2,
                        color: 'rgba(255,255,0,0.3)'
                    });
                }
                const tagNode = tagMap.get(tagId);
                tagNode.size += 1; // Increment Tag weight

                // Link User to Tag (HasTag)
                links.push({
                    source: user.id,
                    target: tagId,
                    type: 'HasTag',
                    weight: 1,
                    color: 'rgba(100,100,100,0.5)'
                });
            });
        });

        // 3. Add generated Category and Tag nodes to main map
        catMap.forEach(v => nodesMap.set(v.id, v));
        tagMap.forEach(v => nodesMap.set(v.id, v));

        // 4. Compute Similarities and add Edges
        const simEdges = GraphMath.calculateSimilarities(userNodes, 0.4); // Threshold 0.4
        links.push(...simEdges);

        const nodesList = Array.from(nodesMap.values());

        // 5. Run Graph Math Algorithms (Degree & Community)
        GraphMath.calculateMetrics(nodesList, links);
        GraphMath.detectCommunities(nodesList, links);

        return { nodes: nodesList, links };
    }
}
