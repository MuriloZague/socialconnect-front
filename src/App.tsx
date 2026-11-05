import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BeneficiarioEditar } from './components/BeneficiarioEditar';
import { BeneficiarioForm } from './components/BeneficiarioForm';
import { BeneficiarioList } from './components/BeneficiarioList';
import { Layout } from './components/Layout';
import { NaoEncontrado } from './components/NaoEncontrado';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BeneficiarioList />} />
          <Route path="/beneficiarios/novo" element={<BeneficiarioForm />} />
          <Route path="/beneficiarios/:id/editar" element={<BeneficiarioEditar />} />
          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
