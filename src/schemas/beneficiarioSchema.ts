import { z } from 'zod';

const somenteDigitos = (valor: string) => valor.replace(/\D/g, '');

// Mesmo algoritmo de CpfValidator.java: evita ida à API para um CPF que ela recusaria
export function cpfValido(cpf: string): boolean {
  if (!/^[\d.-]+$/.test(cpf)) return false;

  const digitos = somenteDigitos(cpf);
  if (digitos.length !== 11) return false;
  if (new Set(digitos).size === 1) return false;

  const digitoVerificador = (tamanho: number) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(digitos[i]) * (tamanho + 1 - i);
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return digitoVerificador(9) === Number(digitos[9])
    && digitoVerificador(10) === Number(digitos[10]);
}

// Um input vazio chega como '' (e não undefined): sem isso, o .optional() da aula
// não adianta e o campo opcional em branco cairia na validação.
const vazioParaUndefined = (valor: string) => (valor === '' ? undefined : valor);

const textoOpcional = (maximo: number, mensagem: string) =>
  z.string().trim().max(maximo, mensagem).transform(vazioParaUndefined).optional();

export const beneficiarioSchema = z.object({
  nome: z.string()
    .trim()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(150, 'Nome deve ter no máximo 150 caracteres'),

  cpf: z.string()
    .trim()
    .min(1, 'CPF é obrigatório')
    .refine(cpfValido, 'CPF inválido: confira os 11 dígitos')
    .transform(somenteDigitos),

  telefone: z.string()
    .trim()
    .regex(/^[\d\s()-]*$/, 'Telefone deve ter apenas números')
    .transform(somenteDigitos)
    .refine(valor => valor === '' || /^\d{10,11}$/.test(valor), 'Telefone deve ter DDD e 8 ou 9 dígitos')
    .transform(vazioParaUndefined)
    .optional(),

  endereco: textoOpcional(255, 'Endereço deve ter no máximo 255 caracteres'),

  situacaoVulnerabilidade: textoOpcional(500, 'Situação deve ter no máximo 500 caracteres'),
});

// Input: o que está nos campos da tela. Output: o que vai para a API, já normalizado.
export type BeneficiarioFormInput = z.input<typeof beneficiarioSchema>;
export type BeneficiarioFormData = z.output<typeof beneficiarioSchema>;
