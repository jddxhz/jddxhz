import helper from './helper'

class Trans {
    // 毫秒 -> 秒
    public ms2s(S: number): number[] {
        const s = Math.floor(S / 1000)
        S = S % 1000
        return [s, S]
    }

    // 毫秒 -> 分
    public s2m(S: number): number[] {
        let s
        [s, S] = this.ms2s(S)
        const m = Math.floor(s / 60)
        s = s % 60
        return [m, s, S]
    }

    // 毫秒 -> 时
    public m2h(n: number): number[] {
        let [m, s, S] = this.s2m(n)
        const h = Math.floor(m / 60)
        m = m % 60
        return [h, m, s, S]
    }

    // 毫秒 -> 日
    public h2d(n: number): number[] {
        let [h, m, s, S] = this.m2h(n)
        const D = Math.floor(h / 24)
        h = h % 24
        return [D, h, m, s, S]
    }

    // 毫秒 -> 月
    public d2m(sd: Date, n: number): number[] {
        let [D, h, m, s, S] = this.h2d(n)
        let M = 0
        let ty = sd.getFullYear()
        let tm = sd.getMonth()
        while (D > helper.mdMap(ty)[tm]) {
            D = D - helper.mdMap(ty)[tm]
            tm++
            M++
            if (tm > 11) {
                tm = 0
                ty++
            }
        }
        return [M, D, h, m, s, S]
    }

    // 毫秒 -> 年
    public m2y(sd: Date, n: number): number[] {
        let [M, D, h, m, s, S] = this.d2m(sd, n)
        let Y = Math.floor(M / 12)
        M = M % 12
        return [Y, M, D, h, m, s, S]
    }
}

export default new Trans()