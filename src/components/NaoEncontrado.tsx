import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { TituloPagina } from './TituloPagina';

export function NaoEncontrado() {
  return (
    <>
      <TituloPagina>Página não encontrada</TituloPagina>
      <Typography sx={{ mb: 2 }}>O endereço acessado não existe.</Typography>
      <Button component={RouterLink} to="/" variant="contained">Ir para a listagem</Button>
    </>
  );
}
