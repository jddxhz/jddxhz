class Helper {
    // is DateStr?
    public isDateStr(s: string): boolean {
        const regStr = '^([0-9]{1,4})((-|/)([0-9]{1,2})){1,2}(\\s)*(([0-9]{1,2})((:|/)([0-9]{1,2})){1,2}((:|/)([0-9]{1,3}))*)*$'
        if (typeof s === 'string') return new RegExp(regStr).test(s)
        return false
    }

    // ? 转为 Date
    public toDate(d: string): Date | null {
        if (this.isDateStr(d)) return new Date(d)
        return null
    }

    // is 瑞年?
    public isRYear(y: number): boolean {
        return y % 400 == 0 ?? (y % 4 == 0 && y % 100 != 0)
    }

    // 每月天数表
    public mdMap(y: number): number[] {
        let map = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if (this.isRYear(y)) map[1] = 29
        return map
    }

    public GetProp<T>(o: unknown, k: string, v?: T): T {
        const discr = Object.getOwnPropertyDescriptor(o, k)
        return discr?.value ?? v
    }
}

export default new Helper()