export class DataProvider {
    static async load() {
        const cached = localStorage.getItem('v8_node_data');
        if (cached) {
            try { 
                return JSON.parse(cached); 
            } catch(e) {
                console.error("[SYS_ERROR] Local cache corrupted. Purging data.", e);
                localStorage.removeItem('v8_node_data');
            }
        }
        
        try {
            const response = await fetch('./data/nodes.json');
            if (response.ok) {
                const data = await response.json();
                this.save(data);
                return data;
            } else {
                console.error("[SYS_ERROR] Failed to fetch nodes.json. Status:", response.status);
            }
        } catch(e) {
            console.error("[SYS_ERROR] Fetch error:", e);
        }

        return this.generateMock();
    }

    static save(dataArray) {
        localStorage.setItem('v8_node_data', JSON.stringify(dataArray));
    }

    static generateMock() {
        return [
            { id: "SYS_ADMIN", name: "System Admin", traits: ["核心系統", "全局規劃"], familiar_with: ["N1", "N2"] },
            { id: "N1", name: "Node01", traits: ["除錯能力", "邏輯重構"], familiar_with: ["N2"] },
            { id: "N2", name: "Node02", traits: ["國數理解"], familiar_with: [] }
        ];
    }
}