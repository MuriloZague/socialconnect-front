export function formatarCpf(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function formatarTelefone(telefone: string | null): string {
  if (!telefone) return '—';
  return telefone.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
}

// Não usa new Date('2026-11-05'): isso seria meia-noite em UTC,
// que no Brasil vira o dia anterior.
export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}
