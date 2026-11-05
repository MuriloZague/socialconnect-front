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

// Corpo de erro da API (RFC 7807, ver ProblemDetail.java)
export interface ProblemDetail {
  title: string;
  status: number;
  detail: string;
  errors?: { field: string; message: string }[];
}
