import trans from './trans'
import helper from './helper'

class Extend {

    // 间隔毫秒数
    public Gap(s: Date, e: Date | string): number {
        const sd = s
        const ed = typeof e == 'string' ? helper.toDate(e) : e
        let stime = sd.getTime()
        let etime = ed?.getTime() ?? 0
        let dur = etime - stime
        return dur
    }

    /**
     * 计算时间间隔并格式化
     * @param {Number|String|Date} e 结束日期
     * @param {String} fmt 'Y-M-D h:m:s:S'
     * @returns 格式化后的字符串
     */
    public GapFmt(sd: Date, ed: Date | string, fmt: string): string {
        let Y, M, D, h, m, s, S

        if (!ed) return ''
        S = typeof ed === 'number' ? ed : this.Gap(sd, ed)
        if (S < 0) return ''

        if (/(Y+)/.test(fmt)) [Y, M, D, h, m, s, S] = trans.m2y(sd, S)
        else if (/(M+)/.test(fmt)) [M, D, h, m, s, S] = trans.d2m(sd, S)
        else if (/(D+)/.test(fmt)) [D, h, m, s, S] = trans.h2d(S)
        else if (/(h+)/.test(fmt)) [h, m, s, S] = trans.m2h(S)
        else if (/(m+)/.test(fmt)) [m, s, S] = trans.s2m(S)
        else if (/(s+)/.test(fmt)) [s, S] = trans.ms2s(S)

        const o = { Y, M, D, h, m, s, S }

        return fmt.replace(/([YMDhmsS])+/g, (_, k) => helper.GetProp(o, k))
    }

    /**
     * 日期格式化
     * @param {String} fmt 'YYYY-MM-DD hh:mm:ss:SSS'
     * @returns 格式化后的字符串
     */
    public Format(d: Date, fmt: string): string {
        const w = ['日', '一', '二', '三', '四', '五', '六']
        const o = {
            'Y': d.getFullYear(),                       //年
            'M': d.getMonth() + 1,                      //月
            'D': d.getDate(),                           //日
            'd': w[d.getDay()],                         //周几
            'h': d.getHours(),                          //时
            'm': d.getMinutes(),                        //分
            's': d.getSeconds(),                        //秒
            'q': Math.floor((d.getMonth() + 3) / 3),    //季度
            'S': d.getMilliseconds()                    //毫秒
        }
        return fmt.replace(/([YMDdhmsqS])+/g, (v, k) => {
            const prop = '000' + helper.GetProp<string>(o, k)
            return prop.substring(prop.length - v.length)
        })
    }

    // 时间转小数
    public ToFloat(d: Date, type: 'year'|'month'|'day'|'hour' = 'hour'): number {
        const o = {
            'Y': d.getFullYear(),                       //年
            'M': d.getMonth() + 1,                      //月
            'D': d.getDate(),                           //日
            'h': d.getHours(),                          //时
            'm': d.getMinutes(),                        //分
            's': d.getSeconds(),                        //秒
            'q': Math.floor((d.getMonth() + 3) / 3),    //季度
            'S': d.getMilliseconds()                    //毫秒
        }
        const ct = d.getTime()

        switch (type) {
            case 'year':
                const sy = new Date(o.Y, 0, 1).getTime()
                const ey = new Date(o.Y + 1, 0, 1).getTime()
                return o.Y + (ct - sy) / (ey - sy)
            case 'month':
                const sm = new Date(o.Y, o.M, 1).getTime()
                const em = new Date(o.Y, o.M + 1, 1).getTime()
                return o.M + (ct - sm) / (em - sm)
            case 'day':
                const sd = new Date(o.Y, o.M, o.D).getTime()
                const ed = new Date(o.Y, o.M, o.D + 1).getTime()
                return o.D + (ct - sd) / (ed - sd)
            case 'hour':
                const sh = new Date(o.Y, o.M, o.D, o.h).getTime()
                const eh = new Date(o.Y, o.M, o.D, o.h + 1).getTime()
                return o.D + (ct - sh) / (eh - sh)
            default:
                return ct
        }
    }

    public AddTime(d: Date, num: number) {
        return new Date(d.getTime() + num)
    }

    public GetMonthDay(d: Date): number
    public GetMonthDay(d: Date, m: number): number
    public GetMonthDay(y: number, m: number): number
    public GetMonthDay(y: number|Date, m?: number): number {
        if (typeof y == 'number') {
            const date = new Date(y, (m ?? 1) + 1, 0)
            return date.getDate()
        } else {
            const date = new Date(y.getFullYear(), (m ?? y.getMonth()) + 1, 0)
            return date.getDate()
        }
    }

    // 按日加减
    public AddDay(d: Date, num: number): Date {
        return this.AddTime(d, num * 24 * 3600000)
    }

    // 按月加减
    public AddMonth(d: Date, num: number): Date {
        const o = {
            'Y': d.getFullYear(),                       //年
            'M': d.getMonth() + 1,                      //月
            'D': d.getDate(),                           //日
            'h': d.getHours(),                          //时
            'm': d.getMinutes(),                        //分
            's': d.getSeconds(),                        //秒
            'q': Math.floor((d.getMonth() + 3) / 3),    //季度
            'S': d.getMilliseconds()                    //毫秒
        }

        if (num < 0) {
            num = -num
            if (o.M < 0) {
                o.Y--
            }
            o.M -= num
        } else {
            o.M += num
            if (o.M > 11) {
                o.M = 0
                o.Y++
            }
        }
        const max = this.GetMonthDay(o.Y, o.M)
        if (o.D > max) o.D = max

        return new Date(o.Y, o.M, o.D, o.h, o.m, o.s, o.S)
    }

    // 按年加减
    public AddYear(d: Date, num: number): Date {
        const o = {
            'Y': d.getFullYear(),                       //年
            'M': d.getMonth() + 1,                      //月
            'D': d.getDate(),                           //日
            'h': d.getHours(),                          //时
            'm': d.getMinutes(),                        //分
            's': d.getSeconds(),                        //秒
            'q': Math.floor((d.getMonth() + 3) / 3),    //季度
            'S': d.getMilliseconds()                    //毫秒
        }

        return new Date(o.Y + num, o.M, o.D, o.h, o.m, o.s, o.S)
    }
}

export default Extend