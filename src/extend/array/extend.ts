class Extend {
    public Remove<T>(arr: T[], elem: T): void {
        const index = arr.indexOf(elem)
        arr.splice(index, 1)
    }

    public Trans<T1, T2, T3>(target: T1[], current: T2[], propA: string, propB: string): T3[] {
        const res: T3[] = []
        target.map(e => {
            const temp = current.find(l => this.GetProp(e, propA) == l)
            if (temp) res.push(this.GetProp(e, propB))
        })
        return res
    }

    private GetProp<T>(o: unknown, k: string, v?: T): T {
        const discr = Object.getOwnPropertyDescriptor(o, k)
        return discr?.value ?? v
    }
}

export default Extend