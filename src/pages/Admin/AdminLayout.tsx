import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/Sidebar";

/* =========================
   LAYOUT BASE
========================= */

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  color: #fff;
  font-family: "Inter", sans-serif;
`;

/* =========================
   CONTEÚDO
========================= */

const Main = styled.main`
  flex: 1;
  padding: 2rem 3rem;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const AdminLayout = () => {
  return (
    <Layout>
      {/* Sidebar fixa do admin */}
      <Sidebar />

      {/* Aqui entram TODAS as rotas filhas */}
      <Main>
        <Outlet />
      </Main>
    </Layout>
  );
};