import axios from 'axios';
import { Agent } from 'https';
import { CacheInterceptor } from './cacheInterceptor';

export type HttpOptions = {
    signal?: AbortSignal;
    useCache?: boolean;
};

export class HttpModule {
    private readonly axiosInstance = axios.create();
    private readonly cacheInterceptor = new CacheInterceptor();

    constructor() {
        this.axiosInstance.interceptors.request.use(this.cacheInterceptor.requestInterceptor);
        this.axiosInstance.interceptors.response.use(this.cacheInterceptor.responseInterceptor);
    }

    async get<T = any>(url: string, opts?: HttpOptions) {
        const response = await this.axiosInstance.get<T>(url, {
            httpsAgent: new Agent({ rejectUnauthorized: false }),
            headers: {
                authorization: 'Guest',
                'local-cache': opts?.useCache,
            },
            signal: opts?.signal,
        });

        return response.data;
    }
}
