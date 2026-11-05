import { describe, expect, it } from 'vitest';
import { beneficiarioSchema, cpfValido } from './beneficiarioSchema';

const valido = { nome: 'Maria da Silva', cpf: '52998224725' };

describe('cpfValido', () => {
  it.each(['52998224725', '529.982.247-25'])('aceita %s', cpf => {
    expect(cpfValido(cpf)).toBe(true);
  });

  it.each([
    ['dígito verificador errado', '52998224724'],
    ['todos os dígitos iguais', '11111111111'],
    ['menos de 11 dígitos', '5299822472'],
    ['letras', '5299822472a'],
    ['vazio', ''],
  ])('recusa %s', (_caso, cpf) => {
    expect(cpfValido(cpf)).toBe(false);
  });
});

describe('beneficiarioSchema', () => {
  it('aceita só os campos obrigatórios', () => {
    expect(beneficiarioSchema.safeParse(valido).success).toBe(true);
  });

  it('transforma opcionais em branco em undefined', () => {
    const dados = beneficiarioSchema.parse({
      ...valido, telefone: '', endereco: '   ', situacaoVulnerabilidade: '',
    });
    expect(dados.telefone).toBeUndefined();
    expect(dados.endereco).toBeUndefined();
    expect(dados.situacaoVulnerabilidade).toBeUndefined();
  });

  it('envia CPF e telefone só com dígitos', () => {
    const dados = beneficiarioSchema.parse({
      ...valido, cpf: '529.982.247-25', telefone: '(11) 99999-9999',
    });
    expect(dados.cpf).toBe('52998224725');
    expect(dados.telefone).toBe('11999999999');
  });

  it.each(['123', 'abc', '119999999999'])('recusa telefone %s', telefone => {
    expect(beneficiarioSchema.safeParse({ ...valido, telefone }).success).toBe(false);
  });

  it('recusa nome curto ou só com espaços', () => {
    expect(beneficiarioSchema.safeParse({ ...valido, nome: 'Jo' }).success).toBe(false);
    expect(beneficiarioSchema.safeParse({ ...valido, nome: '     ' }).success).toBe(false);
  });

  it('respeita os limites de tamanho da API', () => {
    expect(beneficiarioSchema.safeParse({ ...valido, nome: 'a'.repeat(150) }).success).toBe(true);
    expect(beneficiarioSchema.safeParse({ ...valido, nome: 'a'.repeat(151) }).success).toBe(false);
    expect(beneficiarioSchema.safeParse({ ...valido, endereco: 'a'.repeat(256) }).success).toBe(false);
    expect(beneficiarioSchema.safeParse({ ...valido, situacaoVulnerabilidade: 'a'.repeat(501) }).success).toBe(false);
  });
});
