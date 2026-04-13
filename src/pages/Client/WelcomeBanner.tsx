import React from "react";
import styled from "styled-components";
import { Trophy, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

// --- ESTILOS ---
const BannerContainer = styled(motion.div)`
  width: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #050505 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 35px;
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: rgba(225, 29, 72, 0.05);
    filter: blur(80px);
    border-radius: 50%;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
    text-align: center;
    padding: 30px 20px;
  }
`;

const UserInfo = styled.div`
  z-index: 1;
  flex: 1;

  h2 {
    font-size: clamp(1.5rem, 5vw, 2.2rem);
    margin: 12px 0;
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    span {
      color: #e11d48;
    }
  }
  p {
    color: #666;
    font-size: 0.9rem;
    max-width: 400px;
  }
`;

const LoyaltyCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: clamp(15px, 4vw, 25px);
  border-radius: 18px;
  width: 100%;
  max-width: 380px;
  backdrop-filter: blur(10px);
  z-index: 1;
  box-sizing: border-box;

  @media (max-width: 900px) {
    max-width: 100%;
  }
`;

const ProgressTrack = styled.div`
  display: flex;
  gap: 6px;
  margin: 20px 0;
  width: 100%;
`;

const Step = styled.div<{ $active: boolean; $isReward: boolean }>`
  flex: 1;
  height: clamp(8px, 2vw, 12px);
  border-radius: 4px;
  background: ${(props) =>
    props.$active ? (props.$isReward ? "#FFD700" : "#e11d48") : "#1a1a1a"};
  box-shadow: ${(props) =>
    props.$active
      ? `0 0 15px ${props.$isReward ? "#FFD70044" : "#e11d4844"}`
      : "none"};
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(225, 29, 72, 0.1);
  color: #e11d48;
  padding: 6px 12px;
  border-radius: 20px;
  font-family: "Syncopate", sans-serif;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 1px;
`;

// --- COMPONENTE ---

interface WelcomeBannerProps {
  pontos: number;
}

export default function WelcomeBanner({ pontos = 0 }: WelcomeBannerProps) {
  const { user, isLoaded } = useUser();

  // Lógica de Ciclo: Se pontos = 10, 20, 30... mostra 10/10 (Dourado)
  // Se pontos = 12, mostra 2/10 (Vermelho)
  const progressoNoCiclo = pontos > 0 && pontos % 10 === 0 ? 10 : pontos % 10;
  const isRewardReady = progressoNoCiclo === 10;

  const getRank = () => {
    if (pontos >= 50) return "AGENTE LENDÁRIO";
    if (pontos >= 20) return "AGENTE ELITE";
    if (pontos >= 10) return "MEMBRO VETERANO";
    return "MEMBRO RECRUTA";
  };

  const displayName = user?.firstName || "GUERREIRO";

  if (!isLoaded) return null;

  return (
    <BannerContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <UserInfo>
        <Badge>
          <Crown size={12} /> {getRank()}
        </Badge>
        <h2>
          OLÁ, <span>{displayName.toUpperCase()}</span>
        </h2>
        <p>Seu arsenal de estilo está pronto. Próxima missão?</p>
      </UserInfo>

      <LoyaltyCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              color: "#666",
              fontWeight: 900,
              letterSpacing: "1px",
            }}
          >
            STATUS DO CARTÃO
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              fontFamily: "Syncopate",
              color: isRewardReady ? "#FFD700" : "#fff",
            }}
          >
            {progressoNoCiclo}/10
          </span>
        </div>

        <ProgressTrack>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
            <Step
              key={s}
              $active={s <= progressoNoCiclo}
              $isReward={s === 10 && isRewardReady}
            />
          ))}
        </ProgressTrack>

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              background: isRewardReady ? "#FFD70022" : "#111",
              padding: "10px",
              borderRadius: "10px",
              border: isRewardReady ? "1px solid #FFD70044" : "1px solid #222",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trophy size={18} color={isRewardReady ? "#FFD700" : "#333"} />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                fontWeight: "bold",
                color: isRewardReady ? "#FFD700" : "#fff",
              }}
            >
              {isRewardReady ? "RECOMPENSA DISPONÍVEL!" : "PRÓXIMO ALVO"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.7rem",
                color: "#666",
                lineHeight: 1.4,
              }}
            >
              {isRewardReady
                ? "O próximo corte é por nossa conta."
                : `Faltam ${10 - progressoNoCiclo} atendimentos para o bônus.`}
            </p>
          </div>
        </div>
      </LoyaltyCard>
    </BannerContainer>
  );
}
