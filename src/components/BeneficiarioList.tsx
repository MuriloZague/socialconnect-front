import { useEffect, useRef, useState } from 'react';
import { isCancel } from 'axios';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, IconButton, Pagination, Paper, Skeleton, Snackbar, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Typography,
} from '@mui/material';
import { Add, Delete, Edit, PersonSearch } from '@mui/icons-material';
import { TituloPagina } from './TituloPagina';
import {
  excluirBeneficiario,
  extrairProblema,
  listarBeneficiarios,
} from '../services/beneficiarioService';
import type { Beneficiario } from '../types/beneficiario';
import { formatarCpf, formatarData, formatarTelefone } from '../utils/formatadores';

const TAMANHO_PAGINA = 10;

// Mobile-first: no celular ficam só nome e ações; as demais colunas aparecem conforme a largura
const COLUNAS = [
  { campo: 'nome', rotulo: 'Nome', display: 'table-cell' },
  { campo: 'cpf', rotulo: 'CPF', display: { xs: 'none', sm: 'table-cell' } },
  { campo: 'telefone', rotulo: 'Telefone', display: { xs: 'none', md: 'table-cell' } },
  { campo: 'dataCadastro', rotulo: 'Cadastro', display: { xs: 'none', md: 'table-cell' } },
] as const;

type Campo = (typeof COLUNAS)[number]['campo'];
type Direcao = 'asc' | 'desc';

export function BeneficiarioList() {
  const location = useLocation();
  const navigate = useNavigate();

  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const [pagina, setPagina] = useState(0); // a API conta a partir de 0
  const [campo, setCampo] = useState<Campo>('nome');
  const [direcao, setDirecao] = useState<Direcao>('asc');
  const [textoBusca, setTextoBusca] = useState('');
  const [nome, setNome] = useState('');
  const [recarga, setRecarga] = useState(0);

  const [aviso, setAviso] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(
    location.state?.sucesso ? { tipo: 'success', texto: location.state.sucesso } : null,
  );
  const [paraExcluir, setParaExcluir] = useState<Beneficiario | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const focoAposExcluir = useRef(false);
  const botaoCadastrar = useRef<HTMLAnchorElement>(null);

  // Limpa a mensagem do histórico para ela não voltar ao recarregar a página
  useEffect(() => {
    if (location.state?.sucesso) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  // Debounce: só consulta a API quando a pessoa para de digitar
  useEffect(() => {
    const busca = textoBusca.trim();
    if (busca === nome) return;
    const timer = setTimeout(() => {
      setNome(busca);
      setPagina(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [textoBusca, nome]);

  useEffect(() => {
    // Cancela a consulta anterior: uma resposta atrasada não pode sobrescrever a mais nova
    const controle = new AbortController();
    setCarregando(true);
    setErro(false);

    listarBeneficiarios(
      { page: pagina, size: TAMANHO_PAGINA, sort: `${campo},${direcao}`, nome: nome || undefined },
      controle.signal,
    )
      .then(dados => {
        // A página ficou vazia (ex.: excluiu o último item dela): volta para a última que existe
        if (dados.content.length === 0 && pagina > 0) {
          setPagina(Math.max(dados.page.totalPages - 1, 0));
          return;
        }
        setBeneficiarios(dados.content);
        setTotalPaginas(dados.page.totalPages);
        setTotalRegistros(dados.page.totalElements);
        setCarregando(false);
      })
      .catch(e => {
        if (isCancel(e)) return;
        setErro(true);
        setCarregando(false);
      });

    return () => controle.abort();
  }, [pagina, campo, direcao, nome, recarga]);

  // A linha excluída levou junto o botão que abriu o diálogo: o foco precisa de outro lugar
  useEffect(() => {
    if (!carregando && focoAposExcluir.current) {
      focoAposExcluir.current = false;
      botaoCadastrar.current?.focus();
    }
  }, [carregando]);

  const ordenarPor = (novoCampo: Campo) => {
    setDirecao(campo === novoCampo && direcao === 'asc' ? 'desc' : 'asc');
    setCampo(novoCampo);
    setPagina(0);
  };

  const confirmarExclusao = async () => {
    if (!paraExcluir) return;
    setExcluindo(true);
    try {
      await excluirBeneficiario(paraExcluir.idBeneficiario);
      focoAposExcluir.current = true;
      setAviso({ tipo: 'success', texto: `${paraExcluir.nome} foi excluído(a).` });
    } catch (e) {
      setAviso({
        tipo: 'error',
        texto: extrairProblema(e)?.detail ?? 'Não foi possível excluir: a API não respondeu.',
      });
    } finally {
      setExcluindo(false);
      setParaExcluir(null);
      setRecarga(r => r + 1);
    }
  };

  const semResultados = !carregando && !erro && beneficiarios.length === 0;

  return (
    <>
      <TituloPagina>Beneficiários</TituloPagina>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 2, justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <TextField
          label="Buscar por nome"
          type="search"
          size="small"
          value={textoBusca}
          onChange={e => setTextoBusca(e.target.value)}
          sx={{ minWidth: { sm: 320 } }}
        />
        <Button
          ref={botaoCadastrar}
          component={RouterLink}
          to="/beneficiarios/novo"
          variant="contained"
          startIcon={<Add />}
        >
          Cadastrar beneficiário
        </Button>
      </Stack>

      {/* Anuncia o resultado da busca para leitores de tela */}
      <Typography role="status" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {!carregando && !erro && `${totalRegistros} beneficiário(s) encontrado(s)`}
      </Typography>

      {erro && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => setRecarga(r => r + 1)}>
              Tentar novamente
            </Button>
          }
        >
          Não foi possível carregar os beneficiários: a API não respondeu.
        </Alert>
      )}

      {semResultados && (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <PersonSearch sx={{ fontSize: 64 }} />
          <Typography variant="h6" component="p">Nenhum beneficiário encontrado</Typography>
          <Typography variant="body2">
            {nome ? `Nenhum nome contém "${nome}".` : 'Comece cadastrando o primeiro beneficiário.'}
          </Typography>
        </Box>
      )}

      {!erro && !semResultados && (
        <TableContainer component={Paper} aria-busy={carregando}>
          <Table>
            <caption style={{ captionSide: 'top' }}>
              Lista de beneficiários. Use os botões do cabeçalho para ordenar.
            </caption>
            <TableHead>
              <TableRow>
                {COLUNAS.map(coluna => (
                  <TableCell
                    key={coluna.campo}
                    sortDirection={campo === coluna.campo ? direcao : false}
                    sx={{ display: coluna.display }}
                  >
                    <TableSortLabel
                      active={campo === coluna.campo}
                      direction={campo === coluna.campo ? direcao : 'asc'}
                      onClick={() => ordenarPor(coluna.campo)}
                    >
                      {coluna.rotulo}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carregando
                ? Array.from({ length: 5 }, (_, i) => (
                  <TableRow key={i}>
                    {COLUNAS.map(coluna => (
                      <TableCell key={coluna.campo} sx={{ display: coluna.display }}><Skeleton /></TableCell>
                    ))}
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
                : beneficiarios.map(b => (
                  <TableRow key={b.idBeneficiario} hover>
                    <TableCell sx={{ display: COLUNAS[0].display }}>{b.nome}</TableCell>
                    <TableCell sx={{ display: COLUNAS[1].display }}>{formatarCpf(b.cpf)}</TableCell>
                    <TableCell sx={{ display: COLUNAS[2].display }}>{formatarTelefone(b.telefone)}</TableCell>
                    <TableCell sx={{ display: COLUNAS[3].display }}>{formatarData(b.dataCadastro)}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <IconButton
                        component={RouterLink}
                        to={`/beneficiarios/${b.idBeneficiario}/editar`}
                        aria-label={`Editar ${b.nome}`}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => setParaExcluir(b)} aria-label={`Excluir ${b.nome}`}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!erro && totalPaginas > 1 && (
        <Pagination
          count={totalPaginas}
          page={pagina + 1}
          onChange={(_, novaPagina) => setPagina(novaPagina - 1)}
          color="primary"
          aria-label="Paginação da lista de beneficiários"
          getItemAriaLabel={(tipo, numero, selecionada) => {
            if (tipo === 'page') return `${selecionada ? 'Página atual, ' : 'Ir para a '}página ${numero}`;
            if (tipo === 'next') return 'Ir para a próxima página';
            if (tipo === 'previous') return 'Ir para a página anterior';
            return tipo === 'first' ? 'Ir para a primeira página' : 'Ir para a última página';
          }}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      )}

      <Dialog
        open={paraExcluir !== null}
        onClose={() => { if (!excluindo) setParaExcluir(null); }}
        aria-labelledby="titulo-excluir"
        aria-describedby="descricao-excluir"
      >
        <DialogTitle id="titulo-excluir">Excluir beneficiário?</DialogTitle>
        <DialogContent>
          <DialogContentText id="descricao-excluir">
            {paraExcluir?.nome} será removido(a) do sistema. Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setParaExcluir(null)} disabled={excluindo} autoFocus>Cancelar</Button>
          <Button
            onClick={confirmarExclusao}
            color="error"
            variant="contained"
            disabled={excluindo}
            startIcon={excluindo ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={aviso !== null}
        autoHideDuration={6000}
        onClose={(_, motivo) => { if (motivo !== 'clickaway') setAviso(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {aviso ? (
          <Alert severity={aviso.tipo} variant="filled" onClose={() => setAviso(null)}>
            {aviso.texto}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}
