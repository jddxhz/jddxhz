import Extend from './extend'

declare global {
    interface Date {
        Gap(e: Date | string): number
        GapFmt(e: Date | string, fmt: string): string
        Format(fmt: string): string
        ToFloat(type: 'year'|'month'|'day'|'hour'): number
        AddTime(num: number): Date
        AddDay(num: number): Date
        AddMonth(num: number): Date
        AddYear(num: number): Date
    }
}

class MountDate {
    public Active(): void {
        const dateExt = new Extend()

        Date.prototype.Gap = function (this: Date, e: Date | string): number {
            return dateExt.Gap(this, e)
        }

        Date.prototype.GapFmt = function (this: Date, e: Date | string, fmt: string): string {
            return dateExt.GapFmt(this, e, fmt)
        }

        Date.prototype.Format = function (this: Date, fmt: string): string {
            return dateExt.Format(this, fmt)
        }

        Date.prototype.ToFloat = function (this: Date, type: 'year'|'month'|'day'|'hour'): number {
            return dateExt.ToFloat(this, type)
        }

        Date.prototype.AddTime = function (this: Date, num: number): Date {
            return dateExt.AddTime(this, num)
        }

        Date.prototype.AddDay = function (this: Date, num: number): Date {
            return dateExt.AddDay(this, num)
        }

        Date.prototype.AddMonth = function (this: Date, num: number): Date {
            return dateExt.AddMonth(this, num)
        }

        Date.prototype.AddYear = function (this: Date, num: number): Date {
            return dateExt.AddYear(this, num)
        }
    }
}

export default MountDate