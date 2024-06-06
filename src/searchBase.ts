import { HttpModule } from './http/httpModule';

export class SearchBase {
    protected readonly http = new HttpModule();
    protected readonly searchParams = new URLSearchParams();

    constructor(page = '1', count = '20') {
        this.page(page);
        this.limit(count);
    }

    protected append(name: string, value: string) {
        this.searchParams.append(name, value);
    }

    page(value: string | number) {
        this.append('page', value.toString());
    }

    limit(value: string | number) {
        this.append('count', value.toString());
    }

    async requestWithRetry(tentativies: number): Promise<any> {
        while (tentativies >= 0) {
            try {
                return await this.request();
            } catch (error) {
                tentativies--;
            }
        }
    }

    async nextPage() {
        let page = parseInt(this.searchParams.get('page')!);
        this.page(page + 1);
        return this.request();
    }

    async request(): Promise<any> {}
}
