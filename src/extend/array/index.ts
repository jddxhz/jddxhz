import Extend from './extend'

declare global {
    interface Array<T> {
        Remove(elem: T): void
        Pick<T1, T2>(current: T1[], propA: string, propB: string): T2[],
    }
}

class MountArray {
    public Active() {
        const extend = new Extend()

        Array.prototype.Remove = function <T>(this: T[], elem: T): void {
            extend.Remove(this, elem)
        }

        Array.prototype.Pick = function <T1, T2, T3>(this: T1[], current: T2[], propA: string, propB: string): T3[] {
            return extend.Trans(this, current, propA, propB)
        }
    }
}

export default MountArray