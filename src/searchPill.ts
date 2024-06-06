import { AnvisaResponse } from './types/anvisaResponse';
import { SearchBase } from './searchBase';

export interface Response extends AnvisaResponse {
    content: Pill[];
}

export interface Pill {
    ordem: number;
    produto: Produto;
    empresa: Empresa;
    processo: Processo;
    linkDetalhes: string;
    getProductDetails: () => Promise<any>;
}

export interface Produto {
    codigo: number;
    nome: string;
    numeroRegistro: string;
    tipo: Tipo;
    categoria: any;
    situacaoRotulo: any;
    dataVencimento: string;
    mesAnoVencimento: string;
    dataVencimentoRegistro: string;
    principioAtivo: string;
    situacaoApresentacao: string;
    dataRegistro: string;
    categoriaRegulatoria: CategoriaRegulatoria;
    medicamentoReferencia: any;
    categoriaProduto: any;
    acancelar: boolean;
    numeroRegistroFormatado: string;
    mesAnoVencimentoFormatado: string;
}

export interface Tipo {
    codigo: number;
    descricao: any;
}

export interface CategoriaRegulatoria {
    codigo: number;
    descricao: string;
}

export interface Empresa {
    cnpj: string;
    razaoSocial: string;
    numeroAutorizacao: string;
    cnpjFormatado: string;
}

export interface Processo {
    numero: string;
    situacao: number;
    numeroProcessoFormatado: string;
}

/**
 * @link https://consultas.anvisa.gov.br/#/medicamentos/
 */
export class SearchPill extends SearchBase {
    constructor() {
        super('1', '100');

        this.append('filter[situacaoRegistro]', 'V');
    }

    /**
     * @alias "Nome do Produto"
     */
    medication(name: string) {
        this.append('filter[nomeProduto]', name);
        return this;
    }

    /**
     * @alias "Número do Registro"
     */
    registrationNumber(number: string) {
        this.append('filter[numeroRegistro]', number);
        return this;
    }

    /**
     * @alias "Número do CNPJ do Detentor do Registro"
     */
    cnpj(document: string) {
        this.append('filter[cnpj]', document);
        return this;
    }

    async requestWithRetry(tentativies: number): Promise<Pill[]> {
        return super.requestWithRetry(tentativies);
    }

    async request() {
        const data = await this.http.get<Response>(
            'https://consultas.anvisa.gov.br/api/consulta/medicamento/produtos?' + this.searchParams.toString(),
        );
        return data.content.map((x) => {
            x.linkDetalhes = `https://consultas.anvisa.gov.br/api/consulta/medicamento/produtos/${x.processo.numero}`;
            x.getProductDetails = () => {
                return this.http.get(x.linkDetalhes);
            };
            return x;
        });
    }
}
