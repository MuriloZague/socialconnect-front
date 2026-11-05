import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { BeneficiarioForm } from './components/BeneficiarioForm';
import { BeneficiarioList } from './components/BeneficiarioList';

function Listagem() {
  const { state } = useLocation();
  return (
    <>
      {state?.sucesso && <p role="status">{state.sucesso}</p>}
      <BeneficiarioList />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <main>
        <h1>SocialConnect - Beneficiários</h1>
        <Routes>
          <Route path="/" element={<Listagem />} />
          <Route path="/beneficiarios/novo" element={<BeneficiarioForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
