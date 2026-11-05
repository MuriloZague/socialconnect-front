import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Beneficiario, Page } from '../types/beneficiario';

export function BeneficiarioList() {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    api.get<Page<Beneficiario>>('/beneficiarios?page=0&size=10')
      .then(response => {
        setBeneficiarios(response.data.content);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar beneficiários:', error);
        setErro(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p role="alert">Não foi possível carregar os beneficiários. A API está no ar?</p>;

  return (
    <>
      <p><Link to="/beneficiarios/novo">Cadastrar beneficiário</Link></p>
      {beneficiarios.length === 0 ? (
        <p>Nenhum beneficiário encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
            {beneficiarios.map(b => (
              <tr key={b.idBeneficiario}>
                <td>{b.nome}</td>
                <td>{b.cpf}</td>
                <td>{b.telefone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
