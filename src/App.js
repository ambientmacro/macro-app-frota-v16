import "@/App.css";
import "@/index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import PendingApprovalPage from "@/pages/PendingApprovalPage";
import DashboardRouter from "@/pages/DashboardRouter";
import RequerimentoWizard from "@/pages/RequerimentoWizard";
import RequerimentosList from "@/pages/RequerimentosList";
import RequerimentoDetail from "@/pages/RequerimentoDetail";
import VistoriaEntrada from "@/pages/VistoriaEntrada";
import VistoriasList from "@/pages/VistoriasList";
import ChecklistTemplates from "@/pages/ChecklistTemplates";
import ChecklistFill from "@/pages/ChecklistFill";
import ChecklistList from "@/pages/ChecklistList";
import VeiculosList from "@/pages/VeiculosList";
import VehicleDetail from "@/pages/VehicleDetail";
import FrotaRelatorios from "@/pages/FrotaRelatorios";
import ChecklistDetail from "@/pages/ChecklistDetail";
import MotoristasList from "@/pages/MotoristasList";
import UsersAdmin from "@/pages/UsersAdmin";
import TeamsAdmin from "@/pages/TeamsAdmin";
import { ROLES } from "@/lib/constants";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/aguardando" element={<PendingApprovalPage />} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<DashboardRouter />} />
            <Route path="/requerimentos" element={<RequerimentosList />} />
            <Route path="/requerimentos/novo" element={
              <ProtectedRoute allow={[ROLES.ENCARREGADO, ROLES.FROTA, ROLES.SEGURANCA, ROLES.ADMIN]}>
                <RequerimentoWizard />
              </ProtectedRoute>
            } />
            <Route path="/requerimentos/:id" element={<RequerimentoDetail />} />

            <Route path="/vistorias" element={
              <ProtectedRoute allow={[ROLES.SEGURANCA, ROLES.ADMIN]}><VistoriasList /></ProtectedRoute>
            } />
            <Route path="/vistoria/:reqId" element={
              <ProtectedRoute allow={[ROLES.SEGURANCA, ROLES.ADMIN]}><VistoriaEntrada /></ProtectedRoute>
            } />

            <Route path="/templates" element={
              <ProtectedRoute allow={[ROLES.SEGURANCA, ROLES.ADMIN]}><ChecklistTemplates /></ProtectedRoute>
            } />

            <Route path="/checklist/digital" element={
              <ProtectedRoute allow={[ROLES.MOTORISTA, ROLES.ENCARREGADO, ROLES.ADMIN]}>
                <ChecklistFill mode="digital" />
              </ProtectedRoute>
            } />
            <Route path="/checklist/manual" element={
              <ProtectedRoute allow={[ROLES.ENCARREGADO, ROLES.ADMIN]}>
                <ChecklistFill mode="manual" />
              </ProtectedRoute>
            } />
            <Route path="/checklists" element={<ChecklistList />} />
            <Route path="/checklists/:id" element={<ChecklistDetail />} />

            <Route path="/veiculos" element={<VeiculosList />} />
            <Route path="/veiculos/:id" element={<VehicleDetail />} />
            <Route path="/frota/relatorios" element={
              <ProtectedRoute allow={[ROLES.FROTA, ROLES.ADMIN]}><FrotaRelatorios /></ProtectedRoute>
            } />
            <Route path="/motoristas" element={
              <ProtectedRoute allow={[ROLES.ENCARREGADO, ROLES.FROTA, ROLES.SEGURANCA, ROLES.DP, ROLES.ADMIN]}>
                <MotoristasList />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute allow={[ROLES.DP, ROLES.ADMIN]}><TeamsAdmin /></ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute allow={[ROLES.ADMIN, ROLES.ENCARREGADO, ROLES.FROTA, ROLES.DP]}><UsersAdmin /></ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
