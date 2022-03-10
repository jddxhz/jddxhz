class Extend {

    // 间隔毫秒数
    public Ellipsis(s: string, l: number): string {
        if (s.length > l) {
            return s.substring(0, l) + '...'
        }
        return s
    }
}

export default Extend