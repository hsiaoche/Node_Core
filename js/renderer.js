export class GraphRenderer {
    constructor(containerElement) {
        this.container = containerElement;
        this.instance = null;
        this.rafId = null;
    }

    init(nodes, links, onNodeClick) {
        this.instance = ForceGraph3D()(this.container)
            .graphData({ nodes, links })
            .backgroundColor('#050505')
            .nodeResolution(32)
            .nodeColor(n => n.group === 'admin' ? '#ffffff' : (n.group === 'student' ? '#cccccc' : '#444444'))
            .nodeVal(n => n.group === 'admin' ? 18 : (n.group === 'student' ? 8 : n.size || 3))
            .nodeThreeObjectExtend(true)
            .nodeThreeObject(node => {
                try {
                    const sprite = new SpriteText(node.label || 'Unknown');
                    sprite.color = node.group === 'admin' ? '#ffffff' : '#aaaaaa';
                    sprite.textHeight = node.group === 'admin' ? 6 : 3;
                    sprite.position.y = node.group === 'admin' ? 22 : (node.group === 'student' ? 12 : 6);
                    return sprite;
                } catch(e) { return false; }
            })
            .linkColor(() => 'rgba(255, 255, 255, 0.15)')
            .linkWidth(1.5)
            .showNavInfo(false)
            .onNodeClick(node => {
                if (node.group !== 'trait' && onNodeClick) onNodeClick(node.id);
            });

        let angle = 0;
        const animate = () => {
            if (this.instance) {
                this.instance.cameraPosition({ x: 250 * Math.sin(angle), y: 200, z: 250 * Math.cos(angle) });
                angle += Math.PI / 2000;
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