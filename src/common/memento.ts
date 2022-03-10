interface Item { k: symbol, n: number, val: string[] }

class Memento {
    private map: Item[]

    constructor() {
        this.map = []
    }

    public Save<T>(val: T): void {
        let key = this.GetKey(val) ?? this.SetKey(val)
        const item = this.Find(key) ?? this.Create(key)
        item.n++
        item.val.push(JSON.stringify(val))
    }

    public Reset<T>(val: T): void {
        this.Revert(val, _ => 0)
    }

    public Prev<T>(val: T) {
        this.Revert(val, n => n--)
    }

    public Next<T>(val: T) {
        this.Revert(val, n => n++)
    }

    public Jump<T>(val: T, n: number) {
        this.Revert(val, _ => n)
    }

    public Drop<T>(val: T): void {
        console.log(val)
    }

    private Clamp(num: number, min: number, max: number): number {
        if (num < min) num = min
        if (num > max) num = max
        return num
    }

    private Find(k: symbol): Item | undefined {
        const item = this.map.find(i => i.k == k)
        return item
    }

    private Create(k: symbol): Item {
        const item = { k: k, n: -1, val: [] }
        this.map.push(item)
        return item
    }

    private Revert<T>(val: T,func: (n: number) => number): void {
        let key = this.GetKey(val)
        if(!key) return

        const item = this.Find(key)
        if (!item) return
        const index = this.Clamp(func(item.n), 0, item.val.length -1)
        const res = JSON.parse(item.val[index])
        this.Restore(val, res)
    }

    private Restore<T>(val: T, o: T): void {
        const keys = this.GetPropNames(val, o)
        
        keys.forEach(key => {
            const temp = this.GetProp(o, key)
            this.SetProp(val, key, temp)
        })
    }

    private GetPropNames<T>(...params: T[]): Set<string> {
        let keys: string[] = []
        params.forEach(e => {
            const temp = Object.getOwnPropertyNames(e)
            keys = keys.concat(temp)
        })
        const res = new Set(keys)
        res.delete('memento')
        return res
    }

    private GetKey<T>(val: T): symbol {
        const discr = Object.getOwnPropertyDescriptor(val, 'memento')
        return discr && discr.value
    }

    private SetKey<T>(val: T): symbol {
        const key = Symbol('memento')
        Object.defineProperty(val, 'memento', {value: key, writable: true})
        return key
    }

    private GetProp<T>(o: unknown, k: string, v?: T): T {
        const discr = Object.getOwnPropertyDescriptor(o, k)
        return discr?.value ?? v
    }

    private SetProp(o: unknown, k: string, v: unknown): void {
        Object.defineProperty(o, k, {
            value: v,
            writable: true,
        })
    }
}

export default Memento
