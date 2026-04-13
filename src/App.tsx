import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import { DashboardLayout } from "./components/Layout";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminAgenda from "./pages/Admin/Agenda";
import AdminServices from "./pages/Admin/Services";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import ClientDashboard from "./pages/Client";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        {/* Tela Pública */}
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/cadastro/*" element={<SignUpPage />} />
        <Route path="/dashboardClient" element={<ClientDashboard />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/agenda"
          element={
            <DashboardLayout>
              <AdminAgenda />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/servicos"
          element={
            <DashboardLayout>
              <AdminServices />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
