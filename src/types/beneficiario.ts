export interface Beneficiario {
  idBeneficiario: number;
  nome: string;
  cpf: string;
  telefone: string | null;
  endereco: string | null;
  situacaoVulnerabilidade: string | null;
  dataCadastro: string;
}

// A API usa PageSerializationMode.VIA_DTO (ver WebConfig.java):
// os metadados da paginação vêm aninhados em "page", não na raiz do JSON.
export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface BeneficiarioRequest {
  nome: string;
  cpf: string;
  telefone?: string;
  endereco?: string;
  situacaoVulnerabilidade?: string;
}
