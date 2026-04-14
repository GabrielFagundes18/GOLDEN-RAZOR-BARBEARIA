import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import { useUser } from "@clerk/clerk-react";

import Home from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import ClientDashboard from "./pages/Client";
import ProductsPage from "./pages/Client/ProductsPage";
import ProductDetails from "./pages/Client/ProductDetails";
import HistoryPage from "./pages/Client/HistoryList";
import BookingForm from "./pages/Client/BookingForm";
import ProfileView from "./pages/Client/ProfileView";

// 1. Componente de Proteção Tipado
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Routes>
        {/* Tela Pública */}
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/cadastro/*" element={<SignUpPage />} />

        {/* Rotas de Produtos (Públicas ou Privadas conforme sua escolha) */}
        <Route
          path="/produtos"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/produtos/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />

        {/* Rotas Protegidas */}
        <Route
          path="/dashboardClient"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <ClientDashboard>
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                  {/* O uso do optional chaining (?) é vital aqui para o TS não reclamar */}
                  <BookingForm
                    clerkId={user?.id || ""}
                    userName={user?.firstName || "Cliente"}
                    onBookingSuccess={() => console.log("Agendado!")}
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
      </Routes>
    </BrowserRouter>
  );
}
