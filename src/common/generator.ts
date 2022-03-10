class Generator {
    private id: number
    constructor() {
        this.id = 0
    }

    CreateKey() {
        this.id++
        const str = new Date().getTime() + this.id.toString()
        return str
    }

    // 生成 name
    CreateName(name: string, list: string[]) {
        const origName = name
        let nodeName = origName
        let index = 1
        while (index < 1000) {
            let repeat = false
            for (let i = 0; i < list.length; i++) {
                if (list[i] == nodeName) {
                    nodeName = origName + index
                    repeat = true
                }
            }
            if (!repeat) return nodeName
            index++
        }
        return name
    }
}

export default Generator
