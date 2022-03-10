class FormField {
    // 去层级转换
    public Trans<T>(target: unknown, parent: string = ''): T {
        const res: unknown = {}
        const keys = this.GetPropNames(target)
        keys.forEach(key => {
            const keyName = parent? `${parent}$${key}` : key
            const temp = this.GetProp(target, key)
            if(this.Escape(temp)) {
                this.SetProp(res, keyName, temp)
            } else if (Array.isArray(temp)) {
                const arr: unknown[] = []
                const push = Array.prototype.push
                for (const i in temp) {
                    push.call(arr, this.Trans(temp[i]))
                }
                this.SetProp(res, keyName, arr)
            } else {
                Object.assign(res, this.Trans(temp, keyName))
            }
        })
        return res as T
    }

    // 恢复层级
    public Revert<T>(target: unknown): T {
        const res: unknown = {}

        const setVal = (key: string, val: unknown) => {
            const arr = key.split('$')
            let temp = res
            arr.forEach((el, index) => {
                if (!this.GetProp(temp, el)) this.SetProp(temp, el, {})
                if (index == arr.length - 1) this.SetProp(temp, el, val)
                temp = this.GetProp(temp, el)
            })
        }

        const keys = this.GetPropNames(target)
        
        const fuzzy = this.GetProp<string[]>(target, 'fuzzy', [])
        fuzzy.map(f => !keys.has(f) && keys.add(f))
        keys.delete('fuzzy')
        keys.forEach(key => {
            const temp = this.GetProp(target, key)
            if(this.Escape(temp)) {
                const result = fuzzy.includes(key)? this.Fuzzy(temp as string) : temp
                setVal(key, result)
            } else if (Array.isArray(temp)) {
                const arr: unknown[] = []
                const push = Array.prototype.push
                for (const i in temp) {
                    push.call(arr, this.Revert(temp[i]))
                }
                setVal(key, arr)
            } else {
                setVal(key, this.Revert(temp))
            }
        })
        return res as T
    }

    private Fuzzy(param: string) {
        if (!param) return '%%'
        param = '%' + param + '%'
        param.replace(/(\s)+/, '%')
        return param
    }

    private Escape(target: unknown) {
        const isNull = (el: unknown) => el == null
        const isObject = (el: unknown) => typeof el == 'object'
        const isDate = (el: unknown) => el instanceof Date
        const isRegExp = (el: unknown) => el instanceof RegExp

        return isNull(target) ?? !isObject(target) ?? isDate(target) ?? isRegExp(target)
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

    private GetProp<T>(o: unknown, k: string, v?: T): T {
        const discr = Object.getOwnPropertyDescriptor(o, k)
        return discr?.value ?? v
    }

    private SetProp(o: unknown, k: string, v: unknown): void {
        Object.defineProperty(o, k, {
            value: v,
            writable: true,
            enumerable: true
        })
    }
}

export default FormField
