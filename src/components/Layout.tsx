import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Container, Link, Toolbar } from '@mui/material';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Quem navega por teclado pula o cabeçalho (WCAG 2.4.1) */}
      <Link
        href="#conteudo"
        sx={{
          position: 'absolute',
          left: -9999,
          zIndex: 'tooltip',
          p: 1,
          bgcolor: 'background.paper',
          '&:focus': { left: 8, top: 8 },
        }}
      >
        Pular para o conteúdo
      </Link>

      <AppBar position="static" component="header">
        <Toolbar>
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            underline="hover"
            variant="h6"
            sx={{ '&:focus-visible': { outline: '3px solid #fff', outlineOffset: 2 } }}
          >
            SocialConnect
          </Link>
        </Toolbar>
      </AppBar>

      <Container component="main" id="conteudo" tabIndex={-1} maxWidth="lg" sx={{ py: 3, outline: 'none' }}>
        {children}
      </Container>
    </>
  );
}
