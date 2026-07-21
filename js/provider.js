export class DataProvider {
    static async load() {
        const cached = localStorage.getItem('v8_node_data');
        if (cached) {
            try { return JSON.parse(cached); } catch(e) {}
        }
        return this.generateMock(); // 展示用，預設直接降級為 Mock
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