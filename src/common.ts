import { AnvisaResponse } from './types/anvisaResponse';
import { HttpModule, HttpOptions } from './http/httpModule';

const apiUrl = 'https://consultas.anvisa.gov.br/api/';
const http = new HttpModule();

export async function getHttp(url: string) {
    return http.get(url);
}

export type TipoCategoriaRegulatoria = {
    ativo: string;
    descricao: string;
    id: number;
};

export async function getTipoCategoriaRegulatoria() {
    return http.get<TipoCategoriaRegulatoria[]>(`${apiUrl}tipoCategoriaRegulatoria`);
}

export async function getByAutoCompleteByName(text: string, opts?: HttpOptions) {
    return http.get<string[]>(`${apiUrl}produto/listaMedicamentoBula/${text}`, opts);
}

export interface Response extends AnvisaResponse {
    content: Company[];
}

export interface Company {
    cnpj: string;
    razaoSocial: string;
    nomeFantasia?: string;
}

export async function getCnpj(text: string) {
    const searchParams = new URLSearchParams();
    searchParams.set('count', '20');
    searchParams.set('page', '1');
    searchParams.set('filter[razaoSocial]', text);

    return http.get<Response[]>(`${apiUrl}empresa?${searchParams.toString()}`);
}
