class Clone {
    public JSON<T>(obj: T): T {
        const str = JSON.stringify(obj)
        return JSON.parse(str)
    }

    public Deep<T>(obj: T): T {
        const isNull = obj == null
        if (isNull) return obj

        const isObject = typeof obj == 'object'
        if (!isObject) return obj

        const isDate = obj instanceof Date
        if (isDate) return obj

        const isRegExp = obj instanceof RegExp
        if (isRegExp) return obj

        const isArray = Array.isArray(obj)
        let res: unknown
        if (isArray) {
            res = []
            const push = Array.prototype.push
            for (const i in obj) {
                push.call(res, this.Deep(obj[i]))
            }
        } else {
            res = {}
            const proto = Object.getPrototypeOf(obj)
            Object.setPrototypeOf(res, proto)
            for (const k in obj) {
                this.SetProp(res, k, this.Deep(obj[k]))
            }
        }
        return res as T
    }

    private SetProp(o: unknown, k: string, v: unknown): void {
        Object.defineProperty(o, k, {
            value: v,
            writable: true,
            enumerable: true
        })
    }
}

export default Clone