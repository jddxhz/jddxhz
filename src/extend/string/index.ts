import Extend from './extend'

declare global {
    interface String {
        Ellipsis(length: number): string
    }
}

class Mount {
    public Active(): void {
        const extend = new Extend()

        String.prototype.Ellipsis = function (this: string, l: number): string {
            return extend.Ellipsis(this, l)
        }
    }
}

export default Mount