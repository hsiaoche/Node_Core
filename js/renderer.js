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
            .nodeThreeObjectExtend(node => node.group !== 'trait')
            .nodeThreeObject(node => {
                try {
                    const sprite = new SpriteText(node.label || 'Unknown');
                    
                    if (node.group === 'trait') {
                        sprite.color = '#888888';
                        sprite.textHeight = node.size ? Math.max(4, node.size * 2) : 4;
                    } else {
                        sprite.color = node.group === 'admin' ? GRAPH_CONFIG.colors.text.admin : GRAPH_CONFIG.colors.text.default;
                        sprite.textHeight = node.group === 'admin' ? GRAPH_CONFIG.sizes.text.admin : GRAPH_CONFIG.sizes.text.default;
                        
                        const sphereSize = node.group === 'admin' ? GRAPH_CONFIG.sizes.nodes.admin : (node.group === 'student' ? GRAPH_CONFIG.sizes.nodes.student : (node.size || 3));
                        sprite.position.y = - (Math.cbrt(sphereSize) * 2.5 + 4); 
                    }
                    
                    // Professional Clean Text Styling (No bulky boxes)
                    sprite.backgroundColor = 'transparent';
                    sprite.borderColor = 'transparent';
                    sprite.strokeWidth = 0.5;
                    sprite.strokeColor = '#000000';
                    sprite.fontWeight = 'normal';
                    
                    return sprite;
                } catch(e) { return false; }
            })
            .linkColor(() => GRAPH_CONFIG.colors.link)
            .linkWidth(GRAPH_CONFIG.sizes.linkWidth)
            .showNavInfo(false)
            .onNodeClick(node => {
                if (node.group !== 'trait' && onNodeClick) onNodeClick(node.id);
            });

        // Professional Physics Tweaks: Spread out nodes
        this.instance.d3Force('charge').strength(-250);
        this.instance.d3Force('link').distance(80);

        // Add Window Resize Listener
        window.addEventListener('resize', () => {
            if (this.instance) {
                this.instance.width(this.container.clientWidth);
                this.instance.height(this.container.clientHeight);
            }
        });

        // Use built-in autoRotate instead of manual camera forcing to restore user mouse interaction
        setTimeout(() => {
            const controls = this.instance.controls();
            if (controls) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.5;
            }
        }, 100);
    }

    updateData(nodes, links) {
        if (this.instance) {
            this.instance.graphData({ nodes, links });
        }
    }
}