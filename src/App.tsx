import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import { useUser } from "@clerk/clerk-react";

// --- IMPORTS DE PÁGINAS EXISTENTES ---
import GoldenRazor from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import ClientDashboard from "./pages/Client";
import ProductsPage from "./pages/Client/ProductsPage";
import ProductDetails from "./pages/Client/ProductDetails";
import HistoryPage from "./pages/Client/HistoryList";
import BookingForm from "./pages/Client/BookingForm";
import ProfileView from "./pages/Client/ProfileView";
import { DashboardDono } from "./pages/Admin";

// --- NOVOS IMPORTS DO DASHBOARD DO BARBEIRO ---
import DashboardBarbeiro from "./pages/barber/Dashboard";
import { AgendaDoDia} from "./pages/barber/Agenda";
import { Clientes } from "./pages/barber/Clientes";
import { Vendas } from "./pages/barber/Vendas";
import { NovoAgendamento } from "./pages/barber/NovoAgendamento";
import { HistoricoGlobal } from "./pages/barber/HistoricoGlobal";
import { DetalhesCliente } from "./pages/barber/DetalhesCliente";
import { HistoricoVendas } from "./pages/barber/HistoricoVendas";
import { AgendaDono } from "./pages/Admin/Agenda";
import { Equipe } from "./pages/Admin/Equipe";
import { Financeiro } from "./pages/Admin/Financeiro";
import { ClientesDono } from "./pages/Admin/Clientes";
import { ProdutosDono } from "./pages/Admin/Produtos";
import { HistoricoAdmin } from "./pages/Admin/HistoricoAdmin";
import Overview from "./pages/Client/Overview";
import ProtectedRoute from "./components/ProtectedRoute";
import { AdminLayout } from "./pages/Admin/AdminLayout";
import  BarberLayout  from "./pages/barber/BarberLayout";

export default function App() {
  const { user} = useUser();


  return (
    <BrowserRouter>
      <GlobalStyles />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<GoldenRazor />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro/*" element={<SignUpPage />} />

        {/* CLIENT */}
        <Route
          path="/client"
          element={
            <ProtectedRoute role="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        >
          {/* 👇 ESSA LINHA FALTAVA */}
          <Route index element={<Overview />} />

          <Route
            path="agenda"
            element={
              <BookingForm
                clerkId={user?.id || ""}
                userName={user?.firstName || ""}
              />
            }
          />

          <Route path="produtos" element={<ProductsPage />} />
          <Route path="produtos/:id" element={<ProductDetails />} />
          <Route path="perfil" element={<ProfileView />} />
          <Route path="historico" element={<HistoryPage />} />
        </Route>

        {/* BARBER */}
        <Route
          path="/barber"
          element={
            <ProtectedRoute role="barber">
              <BarberLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardBarbeiro />} />
          <Route path="agenda" element={<AgendaDoDia />} />
          <Route path="novo" element={<NovoAgendamento />} />
          <Route path="vendas" element={<Vendas />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="historico" element={<HistoricoVendas />} />
          <Route path="HistoricoVendas" element={<HistoricoGlobal />} />
          <Route path="clientes/:id" element={< DetalhesCliente/>} />

        </Route>
        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardDono />} />

          <Route path="agenda" element={<AgendaDono />} />
          <Route path="clientes" element={<ClientesDono />} />
          <Route path="equipe" element={<Equipe />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="produtos" element={<ProdutosDono />} />
          <Route path="historico" element={<HistoricoAdmin />} />
        </Route>

        {/* DEFAULT */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
