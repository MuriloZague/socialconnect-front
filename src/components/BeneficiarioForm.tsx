import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../services/api';

export function BeneficiarioForm() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !cpf.trim()) {
      setMensagem('Preencha os campos obrigatórios: nome e CPF.');
      return;
    }

    setEnviando(true);
    setMensagem('');
    try {
      await api.post('/beneficiarios', {
        nome,
        cpf,
        telefone: telefone || undefined,
        endereco: endereco || undefined,
      });
      navigate('/', { state: { sucesso: 'Beneficiário cadastrado com sucesso!' } });
    } catch (error) {
      // A API responde no formato Problem Details (RFC 7807)
      const detalhe = isAxiosError(error) ? error.response?.data?.detail : undefined;
      setMensagem(detalhe ?? 'Erro ao criar beneficiário.');
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label>
        Nome (obrigatório)
        <input value={nome} onChange={e => setNome(e.target.value)} required />
      </label>
      <label>
        CPF (obrigatório)
        <input value={cpf} onChange={e => setCpf(e.target.value)} required />
      </label>
      <label>
        Telefone
        <input value={telefone} onChange={e => setTelefone(e.target.value)} />
      </label>
      <label>
        Endereço
        <input value={endereco} onChange={e => setEndereco(e.target.value)} />
      </label>

      {mensagem && <p role="alert">{mensagem}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      <Link to="/">Voltar para a listagem</Link>
    </form>
  );
}
