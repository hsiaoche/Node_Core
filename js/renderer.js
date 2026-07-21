import { GRAPH_CONFIG } from './config.js';

export class GraphRenderer {
    constructor(containerElement) {
        this.container = containerElement;
        this.instance = null;
        this.rafId = null;
    }

    init(nodes, links, onNodeClick) {
        this.instance = ForceGraph3D()(this.container)
            .graphData({ nodes, links })
            .backgroundColor(GRAPH_CONFIG.colors.background)
            .nodeResolution(GRAPH_CONFIG.sizes.resolution)
            .nodeColor(n => n.group === 'admin' ? GRAPH_CONFIG.colors.nodes.admin : (n.group === 'student' ? GRAPH_CONFIG.colors.nodes.student : GRAPH_CONFIG.colors.nodes.default))
            .nodeVal(n => n.group === 'admin' ? GRAPH_CONFIG.sizes.nodes.admin : (n.group === 'student' ? GRAPH_CONFIG.sizes.nodes.student : n.size || 3))
            .nodeThreeObjectExtend(true)
            .nodeThreeObject(node => {
                try {
                    const sprite = new SpriteText(node.label || 'Unknown');
                    sprite.color = node.group === 'admin' ? GRAPH_CONFIG.colors.text.admin : GRAPH_CONFIG.colors.text.default;
                    sprite.textHeight = node.group === 'admin' ? GRAPH_CONFIG.sizes.text.admin : GRAPH_CONFIG.sizes.text.default;
                    sprite.position.y = node.group === 'admin' ? GRAPH_CONFIG.sizes.textOffset.admin : (node.group === 'student' ? GRAPH_CONFIG.sizes.textOffset.student : GRAPH_CONFIG.sizes.textOffset.default);
                    return sprite;
                } catch(e) { return false; }
            })
            .linkColor(() => GRAPH_CONFIG.colors.link)
            .linkWidth(GRAPH_CONFIG.sizes.linkWidth)
            .showNavInfo(false)
            .onNodeClick(node => {
                if (node.group !== 'trait' && onNodeClick) onNodeClick(node.id);
            });

        let angle = 0;
        const animate = () => {
            if (this.instance) {
                this.instance.cameraPosition({ 
                    x: GRAPH_CONFIG.physics.cameraRadius * Math.sin(angle), 
                    y: GRAPH_CONFIG.physics.cameraHeight, 
                    z: GRAPH_CONFIG.physics.cameraRadius * Math.cos(angle) 
                });
                angle += GRAPH_CONFIG.physics.rotationSpeed;
            }
            this.rafId = requestAnimationFrame(animate);
        };
        animate();
    }

    updateData(nodes, links) {
        if (this.instance) {
            this.instance.graphData({ nodes, links });
        }
    }
}