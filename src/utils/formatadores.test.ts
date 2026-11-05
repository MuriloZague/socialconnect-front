import { describe, expect, it } from 'vitest';
import { formatarCpf, formatarData, formatarTelefone } from './formatadores';

describe('formatadores', () => {
  it('formata CPF', () => {
    expect(formatarCpf('52998224725')).toBe('529.982.247-25');
  });

  it('formata telefone fixo, celular e ausente', () => {
    expect(formatarTelefone('1133334444')).toBe('(11) 3333-4444');
    expect(formatarTelefone('11999998888')).toBe('(11) 99999-8888');
    expect(formatarTelefone(null)).toBe('—');
  });

  it('formata data sem voltar um dia por causa do fuso', () => {
    expect(formatarData('2026-11-05')).toBe('05/11/2026');
  });
});
