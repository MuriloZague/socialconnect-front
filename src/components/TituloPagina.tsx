import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';

// Chave da primeira página aberta (ou recarregada) nesta sessão da aplicação
let chaveInicial: string | undefined;

// Em uma SPA o navegador não recarrega ao trocar de rota, então o leitor de tela
// não percebe a mudança. Por isso movemos o foco para o título e atualizamos a aba.
export function TituloPagina({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { key } = useLocation();
  chaveInicial ??= key;

  useEffect(() => {
    document.title = `${children} | SocialConnect`;
    // Na página inicial o foco fica onde o navegador deixou,
    // para o primeiro Tab cair no link "Pular para o conteúdo".
    if (key !== chaveInicial) ref.current?.focus();
  }, [children, key]);

  return (
    <Typography ref={ref} tabIndex={-1} variant="h4" component="h1" sx={{ outline: 'none', mb: 2 }}>
      {children}
    </Typography>
  );
}
