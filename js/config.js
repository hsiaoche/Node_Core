export const GRAPH_CONFIG = {
    colors: {
        background: '#111111',
        nodes: { admin: '#ffffff', student: '#aaaaaa', default: '#555555' },
        text: { admin: '#ffffff', default: '#cccccc' },
        link: 'rgba(255, 255, 255, 0.1)'
    },
    sizes: {
        resolution: 32,
        nodes: { admin: 6, student: 3, minTrait: 2, traitMultiplier: 1.5 },
        text: { admin: 10, default: 8 },
        textOffset: { admin: 10, student: 6, default: 4 },
        linkWidth: 0.5
    },
    physics: {
        cameraRadius: 250,
        cameraHeight: 200,
        rotationSpeed: Math.PI / 2000
    }
};