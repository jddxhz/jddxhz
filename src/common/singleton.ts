class Singleton {
    private static instance: Singleton
    private prop: string
    
    constructor(prop: string = 'instance') {
        this.prop = prop
        if (!Singleton.instance) Singleton.instance = this
        return Singleton.instance
    }

    public Create<T>(c: new (...p: any) => T, ...params: unknown[]): T {
        let res = this.GetProp<T>(c, this.prop)
        if (!res) {
            this.SetProp(c, this.prop, (res = new c(...params)))
        }
        return res
    }

    private GetProp<T>(o: unknown, k: string, v?: T): T {
        const discr = Object.getOwnPropertyDescriptor(o, k)
        return discr?.value ?? v
    }

    private SetProp(o: unknown, k: string, v: unknown): void {
        Object.defineProperty(o, k, {
            value: v,
            writable: false,
        })
    }
}

export default Singleton
