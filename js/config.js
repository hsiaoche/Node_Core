export const GRAPH_CONFIG = {
    colors: {
        background: '#050505',
        nodes: { admin: '#ffffff', student: '#cccccc', default: '#444444' },
        text: { admin: '#ffffff', default: '#aaaaaa' },
        link: 'rgba(255, 255, 255, 0.15)'
    },
    sizes: {
        resolution: 32,
        nodes: { admin: 18, student: 8, minTrait: 4, traitMultiplier: 1.5 },
        text: { admin: 6, default: 3 },
        textOffset: { admin: 22, student: 12, default: 6 },
        linkWidth: 1.5
    },
    physics: {
        cameraRadius: 250,
        cameraHeight: 200,
        rotationSpeed: Math.PI / 2000
    }
};