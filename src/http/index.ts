import CustomAxios from './axios'
import { Method } from 'axios'

class Http extends CustomAxios {
    private loading: () => void
    private finally: () => void

    /**
     * 构造函数
     * @param url baseURL
     * @param timeout 超时时间 ms
     */
    constructor(url: string, timeout: number = 9999) {
        super(url, timeout)

        this.loading = () => console.log('http 请求开始')
        this.finally = () => console.log('http 请求结束')
    }

    /**
     * 加载中的回调
     * @param action 无参匿名函数
     */
    public OnLoading(action: () => void) {
        this.loading = action
    }

    /**
     * 完成时的回调
     * @param action 
     */
    public OnFinally(action: () => void) {
        this.finally = action
    }

    /**
     * http get 请求
     * @param url 路由
     * @param params 参数
     * @returns promise 对象
     */
    public Get<T>(url: string, params?: T) {
        return this.Action('GET', url, params)
    }

    /**
     * http post 请求
     * @param url 路由
     * @param params 参数
     * @returns promise 对象
     */
    public Post<T>(url: string, data?: T) {
        return this.Action('POST', url, data)
    }

    /**
     * http delete 请求
     * @param url 路由
     * @param params 参数
     * @returns promise 对象
     */
    public Delete<T>(url: string, data?: T) {
        return this.Action('DELETE', url, data)
    }

    /**
     * http put 请求
     * @param url 路由
     * @param params 参数
     * @returns promise 对象
     */
    public Put<T>(url: string, data?: T) {
        return this.Action('PUT', url, data)
    }
    
    /**
     * http blob 请求
     * @param url 路由
     * @param params 参数
     * @param action 回调函数
     * @returns promise 对象
     */
    public Blob<T>(url: string, params: T, action?: (progress: number) => void) {
        return this.Action('GET', url, params, { responseType: "blob", onDownloadProgress(e: any){
            const load = e.loaded
            const total = e.srcElement?.response?.size ?? e.total ?? 1
            const progress = (load / total) * 100
            if (action) action(progress)
        }})
    }

    public Jsonp<T>(url: string, params: T, cbName: string = 'callback') {
        return new Promise<any>((resolve, reject) => {
            const paramString = Object.keys(params).map(key => {
                return `${key}=${this.GetProp(params, key)}`
            }).join('&')
    
            const script = document.createElement('script')
            script.type = 'text'
            script.setAttribute('src', `${url}?${paramString}`)             
            script.onload = () => {
                resolve(script.text)
                document.body.removeChild(script)
            }
    
            const callback = this.GetProp(window, cbName)
            this.SetProp(window, cbName, (e: any) => {
                resolve(script.text)
                this.SetProp(window, cbName, callback)
            })
            document.body.appendChild(script)
        })
    }

    private Action<T>(method: Method, url: string, data: T, config?: object) {
        this.loading()
        const params = ['GET'].includes(method) ? { url, method, params: data, ...config } : { url, method, data, ...config }
        return new Promise<any>((resolve, reject) => {
            this.axios(params).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            }).finally(() => {
                this.finally()
            })
        })
    }
}

export default Http