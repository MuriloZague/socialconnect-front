import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { CampoTexto } from './CampoTexto';
import { TituloPagina } from './TituloPagina';
import { beneficiarioSchema } from '../schemas/beneficiarioSchema';
import type { BeneficiarioFormData, BeneficiarioFormInput } from '../schemas/beneficiarioSchema';
import {
  atualizarBeneficiario,
  criarBeneficiario,
  extrairProblema,
} from '../services/beneficiarioService';
import type { Beneficiario } from '../types/beneficiario';
import { formatarCpf } from '../utils/formatadores';

interface Props {
  // Com um beneficiário, o formulário edita; sem, cadastra
  beneficiario?: Beneficiario;
}

const CAMPOS = ['nome', 'cpf', 'telefone', 'endereco', 'situacaoVulnerabilidade'] as const;

export function BeneficiarioForm({ beneficiario }: Props) {
  const navigate = useNavigate();
  const [erroGeral, setErroGeral] = useState('');

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<BeneficiarioFormInput, unknown, BeneficiarioFormData>({
    resolver: zodResolver(beneficiarioSchema),
    defaultValues: {
      nome: beneficiario?.nome ?? '',
      cpf: beneficiario ? formatarCpf(beneficiario.cpf) : '',
      telefone: beneficiario?.telefone ?? '',
      endereco: beneficiario?.endereco ?? '',
      situacaoVulnerabilidade: beneficiario?.situacaoVulnerabilidade ?? '',
    },
  });

  const onSubmit = async (dados: BeneficiarioFormData) => {
    setErroGeral('');
    try {
      if (beneficiario) {
        await atualizarBeneficiario(String(beneficiario.idBeneficiario), dados);
      } else {
        await criarBeneficiario(dados);
      }
      navigate('/', {
        state: {
          sucesso: beneficiario
            ? 'Beneficiário atualizado com sucesso!'
            : 'Beneficiário cadastrado com sucesso!',
        },
      });
    } catch (erro) {
      const problema = extrairProblema(erro);

      if (problema?.status === 409) {
        setError('cpf', { message: problema.detail }, { shouldFocus: true });
        return;
      }

      const errosDeCampo = problema?.errors?.filter(e =>
        (CAMPOS as readonly string[]).includes(e.field)) ?? [];
      if (errosDeCampo.length > 0) {
        errosDeCampo.forEach((e, i) => setError(
          e.field as (typeof CAMPOS)[number],
          { message: e.message },
          { shouldFocus: i === 0 },
        ));
        return;
      }

      setErroGeral(problema?.detail ?? 'Não foi possível salvar: a API não respondeu. Tente novamente.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <TituloPagina>{beneficiario ? 'Editar beneficiário' : 'Cadastrar beneficiário'}</TituloPagina>

      <Typography variant="body2" color="text.secondary">
        Campos marcados com * são obrigatórios.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <CampoTexto name="nome" control={control} label="Nome" required autoComplete="name" />
        <CampoTexto
          name="cpf"
          control={control}
          label="CPF"
          required
          autoComplete="off"
          helperText="11 dígitos, com ou sem pontuação"
          slotProps={{ htmlInput: { inputMode: 'numeric' } }}
        />
        <CampoTexto
          name="telefone"
          control={control}
          label="Telefone"
          autoComplete="tel-national"
          helperText="Com DDD, por exemplo (11) 99999-8888"
          slotProps={{ htmlInput: { inputMode: 'tel' } }}
        />
        <CampoTexto name="endereco" control={control} label="Endereço" autoComplete="street-address" />
        <CampoTexto
          name="situacaoVulnerabilidade"
          control={control}
          label="Situação de vulnerabilidade"
          multiline
          minRows={3}
        />

        {erroGeral && <Alert severity="error" sx={{ mt: 2 }}>{erroGeral}</Alert>}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            {isSubmitting ? 'Salvando...' : beneficiario ? 'Salvar alterações' : 'Cadastrar'}
          </Button>
          <Button component={RouterLink} to="/">Cancelar</Button>
        </Stack>
      </Box>
    </Box>
  );
}
