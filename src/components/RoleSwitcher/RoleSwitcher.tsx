import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {api} from "../../services/api";
import { User, Scissors, ShieldCheck, Loader2 } from "lucide-react";
import styled from "styled-components";

export const RoleSwitcher = ({ $isOpen }: { $isOpen: boolean }) => {
  const { user, isLoaded } = useUser();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const roles = [
    { id: "client", label: "Cli", icon: <User size={18} />, color: "#888" },
    {
      id: "barber",
      label: "Bar",
      icon: <Scissors size={18} />,
      color: "#d4af37",
    },
    {
      id: "admin",
      label: "Adm",
      icon: <ShieldCheck size={18} />,
      color: "#ef4444",
    },
  ];

  const handleSwitch = async (nextRole: string) => {
    if (!user || !isLoaded || loadingRole) return;
    setLoadingRole(nextRole);
    try {
      await api.post("/update-role", {
        userId: user.id,
        newRole: nextRole,
      });
      await user.reload();
      window.location.reload();
    } catch (error: any) {
      alert(`Erro: ${error.response?.data?.details || "Falha"}`);
    } finally {
      setLoadingRole(null);
    }
  };

  if (!isLoaded) return null;
  const currentRole =
    (user?.publicMetadata.role as string)?.toLowerCase() || "client";

  return (
    <Container $isOpen={$isOpen}>
      {roles.map((role) => (
        <IconButton
          key={role.id}
          $active={currentRole === role.id}
          $activeColor={role.color}
          $isOpen={$isOpen}
          onClick={() => handleSwitch(role.id)}
          title={role.label}
        >
          {loadingRole === role.id ? (
            <Loader2 size={18} className="spinner" />
          ) : (
            role.icon
          )}
          {$isOpen && <span>{role.label}</span>}
        </IconButton>
      ))}
    </Container>
  );
};

const Container = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isOpen ? "row" : "column")};
  gap: 8px;
  padding: ${(props) => (props.$isOpen ? "0 1.2rem" : "0")};
  margin-bottom: 1.5rem;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
`;

const IconButton = styled.button<{
  $active: boolean;
  $activeColor: string;
  $isOpen: boolean;
}>`
  background: ${(props) =>
    props.$active ? "rgba(255,255,255,0.05)" : "transparent"};
  border: 1px solid
    ${(props) => (props.$active ? props.$activeColor : "transparent")};
  color: ${(props) => (props.$active ? props.$activeColor : "#555")};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${(props) => (props.$isOpen ? "8px 12px" : "10px")};
  transition: all 0.2s;
  width: ${(props) => (props.$isOpen ? "100%" : "44px")};

  &:hover {
    color: ${(props) => props.$activeColor};
    background: rgba(255, 255, 255, 0.03);
  }

  span {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
