import { AnvisaResponse } from './types/anvisaResponse';
import { SearchBase } from './searchBase';

export interface Response extends AnvisaResponse {
    content: Bulario[];
}

export interface Bulario {
    idProduto: number;
    numeroRegistro: string;
    nomeProduto: string;
    expediente: string;
    razaoSocial: string;
    cnpj: string;
    numeroTransacao: string;
    data: string;
    numProcesso: string;
    idBulaPacienteProtegido?: string;
    linkBulaPacienteProtegido?: string;
    downloadBulaPacienteProtegido: () => Promise<any>;
    idBulaProfissionalProtegido?: string;
    linkBulaProfissionalProtegido?: string;
    downloadBulaProfissionalProtegido: () => Promise<any>;
    dataAtualizacao: string;
}

/**
 * @link https://consultas.anvisa.gov.br/#/bulario/
 */
export class SearchBulario extends SearchBase {
    constructor() {
        super('1', '20');
    }

    /**
     * @alias "Medicamento"
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
     * @alias "N° do Expediente da Bula Vigente"
     */
    dossierNumber(number: string) {
        this.append('filter[expediente]', number);
        return this;
    }

    /**
     * @alias "Categoria Regulatória"
     */
    regulatoryCategories(numCategories: number[]) {
        this.append('filter[categoriasRegulatorias]', numCategories.join(','));
        return this;
    }

    /**
     * @alias "Empresa"
     */
    cnpj(document: string) {
        this.append('filter[cnpj]', document);
        return this;
    }

    /**
     * @alias "Período de Publicação"
     */
    initialPublicationPeriod(initialPublicationPeriod: string) {
        this.append('filter[periodoPublicacaoInicial]', initialPublicationPeriod);
        return this;
    }

    /**
     * @alias "Período de Publicação"
     */
    finalPublicationPeriod(finalPublicationPeriod: string) {
        this.append('filter[periodoPublicacaoFinal]', finalPublicationPeriod);
        return this;
    }

    private getUrlBula(id?: string) {
        if (!id) return undefined;
        return `https://consultas.anvisa.gov.br/api/consulta/medicamentos/arquivo/bula/parecer/${id}/?Authorization=Guest`;
    }

    async request() {
        const data = await this.http.get<Response>('https://consultas.anvisa.gov.br/api/consulta/bulario?' + this.searchParams.toString());

        return data.content.map((x) => {
            x.linkBulaPacienteProtegido = this.getUrlBula(x.idBulaPacienteProtegido);
            x.downloadBulaPacienteProtegido = () => {
                if (!x.linkBulaPacienteProtegido) throw new Error("Don't have PDF");
                return this.http.get(x.linkBulaPacienteProtegido);
            };

            x.linkBulaProfissionalProtegido = this.getUrlBula(x.idBulaProfissionalProtegido);
            x.downloadBulaProfissionalProtegido = () => {
                if (!x.linkBulaProfissionalProtegido) throw new Error("Don't have PDF");
                return this.http.get(x.linkBulaProfissionalProtegido);
            };

            return x;
        });
    }
}
