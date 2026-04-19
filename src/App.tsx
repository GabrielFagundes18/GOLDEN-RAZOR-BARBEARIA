import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import { useUser } from "@clerk/clerk-react";

// --- IMPORTS DE PÁGINAS EXISTENTES ---
import Home from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import ClientDashboard from "./pages/Client";
import ProductsPage from "./pages/Client/ProductsPage";
import ProductDetails from "./pages/Client/ProductDetails";
import HistoryPage from "./pages/Client/HistoryList";
import BookingForm from "./pages/Client/BookingForm";
import ProfileView from "./pages/Client/ProfileView";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";

// --- NOVOS IMPORTS DO DASHBOARD DO BARBEIRO ---
import DashboardBarbeiro from "./pages/barber/Dashboard";
import { AgendaDoDia } from "./pages/barber/Agenda";
import { Clientes } from "./pages/barber/Clientes";
import { Vendas } from "./pages/barber/Vendas";
import { NovoAgendamento } from "./pages/barber/NovoAgendamento";
import { HistoricoGlobal } from "./pages/barber/HistoricoGlobal"; 

// --- COMPONENTE DE PROTEÇÃO ---
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        {/* PÚBLICO */}
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/cadastro/*" element={<SignUpPage />} />

        {/* --- ÁREA DO BARBEIRO (DASHBOARD ADMINISTRATIVO) --- */}
        <Route path="/barber" element={<ProtectedRoute><DashboardBarbeiro /></ProtectedRoute>} />
        <Route path="/barber/agenda" element={<ProtectedRoute><AgendaDoDia /></ProtectedRoute>} />
        <Route path="/barber/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
        <Route path="/barber/vendas" element={<ProtectedRoute><Vendas /></ProtectedRoute>} />
        <Route path="/barber/novo-agendamento" element={<ProtectedRoute><NovoAgendamento /></ProtectedRoute>} />
        <Route path="/barber/historico" element={<ProtectedRoute><HistoricoGlobal /></ProtectedRoute>} />

        {/* --- ÁREA DO CLIENTE (DASHBOARD USUÁRIO) --- */}
        <Route path="/dashboardClient" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
        <Route path="/produtos" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/produtos/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
        
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <ClientDashboard>
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                  <BookingForm
                    clerkId={user?.id || ""}
                    userName={user?.firstName || "Cliente"}
                  />
                </div>
              </ClientDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ClientDashboard>
                <HistoryPage />
              </ClientDashboard>
            </ProtectedRoute>
          }
        />

        {/* ADMIN GERAL */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* REDIRECIONAMENTO PADRÃO */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}