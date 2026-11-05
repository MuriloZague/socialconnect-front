import { isAxiosError } from 'axios';
import api from './api';
import type { BeneficiarioFormData } from '../schemas/beneficiarioSchema';
import type { Beneficiario, Page, ProblemDetail } from '../types/beneficiario';

export interface ListarParams {
  page: number;
  size: number;
  sort: string;
  nome?: string;
}

export async function listarBeneficiarios(params: ListarParams, signal?: AbortSignal) {
  const { data } = await api.get<Page<Beneficiario>>('/beneficiarios', { params, signal });
  return data;
}

export async function buscarBeneficiario(id: string, signal?: AbortSignal) {
  const { data } = await api.get<Beneficiario>(`/beneficiarios/${id}`, { signal });
  return data;
}

export async function criarBeneficiario(dados: BeneficiarioFormData) {
  const { data } = await api.post<Beneficiario>('/beneficiarios', dados);
  return data;
}

export async function atualizarBeneficiario(id: string, dados: BeneficiarioFormData) {
  const { data } = await api.put<Beneficiario>(`/beneficiarios/${id}`, dados);
  return data;
}

export async function excluirBeneficiario(id: number) {
  await api.delete(`/beneficiarios/${id}`);
}

// Devolve o Problem Details da API, ou undefined se ela nem respondeu (fora do ar, CORS...)
export function extrairProblema(erro: unknown): ProblemDetail | undefined {
  return isAxiosError<ProblemDetail>(erro) ? erro.response?.data : undefined;
}
