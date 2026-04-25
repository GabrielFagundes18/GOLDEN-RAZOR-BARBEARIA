// BarberLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Sidebar } from "../../components/Sidebar/Sidebar";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-color);
`;

const Content = styled.main`
  flex: 1;
  padding: 0 3rem ;
`;

export default function BarberLayout() {
  return (
    <Layout>
      <Sidebar />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}