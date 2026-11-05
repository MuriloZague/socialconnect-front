import { useEffect, useState } from 'react';
import { isCancel } from 'axios';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Alert, Box, Button, Skeleton } from '@mui/material';
import { BeneficiarioForm } from './BeneficiarioForm';
import { buscarBeneficiario, extrairProblema } from '../services/beneficiarioService';
import type { Beneficiario } from '../types/beneficiario';

export function BeneficiarioEditar() {
  const { id = '' } = useParams();
  const [beneficiario, setBeneficiario] = useState<Beneficiario>();
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controle = new AbortController();
    buscarBeneficiario(id, controle.signal)
      .then(setBeneficiario)
      .catch(e => {
        if (isCancel(e)) return;
        const problema = extrairProblema(e);
        setErro(problema?.status === 404 || problema?.status === 400
          ? 'Beneficiário não encontrado.'
          : 'Não foi possível carregar o beneficiário: a API não respondeu.');
      });
    return () => controle.abort();
  }, [id]);

  if (erro) {
    return (
      <Alert
        severity="error"
        action={<Button component={RouterLink} to="/" color="inherit" size="small">Voltar</Button>}
      >
        {erro}
      </Alert>
    );
  }

  if (!beneficiario) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto' }} role="status" aria-label="Carregando beneficiário">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} height={72} />)}
      </Box>
    );
  }

  // O formulário só monta com os dados prontos, então eles entram como valores iniciais
  return <BeneficiarioForm beneficiario={beneficiario} />;
}
