import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createHash } from 'crypto';

export class CacheInterceptor {
    private cache = new Map<string, any>();

    requestInterceptor = (config: InternalAxiosRequestConfig<any>) => {
        if (config.headers['local-cache']) {
            let hash = this.generateKey(config);
            const response = this.cache.get(hash);
            if (response) {
                config.adapter = function (config) {
                    response.config = config;
                    return Promise.resolve(response);
                };
            }
        }
        return config;
    };

    responseInterceptor = (response: AxiosResponse<any, any>) => {
        if (response.config.headers['local-cache']) {
            let hash = this.generateKey(response.config);
            this.cache.set(hash, response);
        }
        return response;
    };

    private generateKey(config: InternalAxiosRequestConfig<any>) {
        const str = JSON.stringify({
            url: config.url,
            method: config.method,
            data: config.data,
        });
        return createHash('md5').update(str).digest('base64');
    }
}
