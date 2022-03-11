import originAxios, { AxiosInstance } from 'axios'

class CustomAxios {
    private filter: Function | null
    public axios: AxiosInstance
    private rules: Map<string, { keys: string[], filter: (v: unknown) => unknown }>
    private config: { url: string, timeout: number }
    private header: Map<string, string>

    constructor(url: string, timeout: number = 9999) {
        this.config = { url, timeout }
        this.filter = null
        this.rules = new Map()
        this.header = new Map()

        this.axios = this.CreateAxios(url, timeout)
    }

    /**
     * 重置并初始化 http
     * @param url baseURL
     * @param timeout 超时时间 ms
     */
     public Reset(url: string, timeout: number = 9999) {
        this.header.clear()
        this.CreateAxios(url, timeout)
    }

    private CreateAxios(url?: string, timeout?: number) {
        if (url) this.config.url = url
        if (timeout) this.config.timeout = timeout

        const axios = originAxios.create({ baseURL: this.config.url, timeout: this.config.timeout })
        this.DealResponse(axios)
        return axios
    }

    /**
     * 设置 header
     * @param key 属性名
     * @param val 属性值
     */
    public SetHeader(key: string, val: string) {
        this.header.set(key, val)
        this.axios = this.CreateAxios()
        this.axios.interceptors.request.use(config => {
            this.header.forEach((val, key) => config.headers && (config.headers[key] = val))
            return config
        }, err => {
            return Promise.reject(err)
        })
    }

    /**
     * 获取 header
     * @param key 属性名
     * @returns 属性值
     */
    public GetHeader(key: string) {
        return this.header.get(key)
    }

    // 接口拦截
    private DealResponse(axios: AxiosInstance) {
        axios.interceptors.response.use(res => {
            if(this.filter) return this.filter(res.data)
            return Promise.resolve(res.data)
        }, err => {
            const code = err.response?.status ?? err.status ?? 404
            const data = err.response?.data ?? err ?? '网络异常'
            const error = this.CreateErrMsg(code, data.message)
            if(this.filter) return this.filter(error)
            return Promise.reject(error)
        })
    }

    /**
     * 自定义规则
     * @param type
     * `pass`: 判断请求是否成功, 默认值 res.data.code == 200
     * `data`: 处理请求成功后的结果, 默认值 res.data.data
     * `fail`: 处理失败结果, 默认值 err.message ?? res.data.message
     * @param keys 属性名数组
     * @param func 回调, 参数为属性值
     */
    public SetRule(type: 'pass'|'data'|'fail', keys: string[], func?: ((...params: unknown[]) => unknown)){
        const filter = (data: unknown) => {
            if (func) {
                if (keys.length < 1) return func(data)
                return func(...this.GetProps(data, keys))
            }
            const res = this.GetProps(data, keys).find(p => p)
            return res
        }
        this.rules.set(type, { keys, filter })

        const pass = this.rules.get('pass') ?? { keys: ['code'], filter: (data: unknown) => this.GetProp(data, 'code') == 200 }
        const data = this.rules.get('data') ?? { keys: ['data'], filter: (data: unknown) => this.GetProp(data, 'data') }
        const fail = this.rules.get('fail') ?? { keys: ['message'], filter: (data: unknown) => this.GetProp(data, 'message') }

        // 设置过滤器
        this.filter = (res: unknown) => {
            if (pass.filter(res)) return Promise.resolve(data.filter(res))
            const code = this.GetProps(res, pass.keys).find(c => c) as number
            const msg = this.GetProps(res, fail.keys).find(c => c) as string
            const error = this.CreateErrMsg(code, msg)
            return Promise.reject(error)
        }
    }

    private CreateErrMsg(code: number, msg: string) {
        const err = { }
        const pass = this.rules.get('pass')?.keys[0] ?? 'status'
        const fail = this.rules.get('fail')?.keys[0] ?? 'message'
        this.SetProp(err, pass, code)
        this.SetProp(err, fail, msg)
        return err
    }

    private GetProps<T>(o: unknown, keys: string[]): T[] {
        const res: T[] = []
        keys.map(k => res.push(this.GetProp(o, k)))
        return res
    }

    protected GetProp<T>(o: unknown, k: string, v?: T): T {
        const discr = Object.getOwnPropertyDescriptor(o, k)
        return discr?.value ?? v
    }

    protected SetProp(o: unknown, k: string, v: unknown) {
        Object.defineProperty(o, k, {
            value: v,
            writable: true,
            enumerable: true
        })
    }
}


export default CustomAxios