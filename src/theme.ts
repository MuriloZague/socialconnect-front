import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

// #007acc com texto branco tem contraste 4.5:1, o mínimo do WCAG AA.
// O secondary da aula (#ff4081) não entra: com texto branco fica abaixo desse mínimo.
export const theme = createTheme(
  {
    palette: {
      primary: { main: '#007acc' },
    },
    components: {
      // Foco visível (WCAG 2.4.7) em tudo que é clicável, além do efeito padrão do MUI
      MuiButtonBase: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': {
              outline: '3px solid #1a1a1a',
              outlineOffset: 2,
            },
          },
        },
      },
    },
  },
  ptBR,
);
