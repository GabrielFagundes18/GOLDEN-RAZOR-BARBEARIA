import React from "react";
import styled from "styled-components";
import { Trophy, Crown, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

// --- Styled Components Refinados ---

const BannerContainer = styled(motion.div)`
  width: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: clamp(25px, 5vw, 40px);
  border-radius: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  &::before {
    content: "";
    position: absolute;
    top: -20%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: var(--primary-glow);
    filter: blur(100px);
    opacity: 0.15;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    gap: 35px;
  }
`;

const UserInfo = styled.div`
  z-index: 2;
  flex: 1;

  h2 {
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    margin: 15px 0;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1.1;

    span {
      background: linear-gradient(90deg, var(--primary-color), #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.95rem;
    max-width: 420px;
    line-height: 1.6;
  }
`;

const LoyaltyCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  border-radius: 22px;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(12px);
  z-index: 2;
  position: relative;
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.02);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
  }
`;

const ProgressTrack = styled.div`
  display: flex;
  gap: 8px;
  margin: 22px 0;
  width: 100%;
`;

const Step = styled(motion.div)<{ $active: boolean; $isReward: boolean }>`
  flex: 1;
  height: 10px;
  border-radius: 6px;
  background: ${(props) =>
    props.$active
      ? props.$isReward
        ? "var(--gold-color)"
        : "var(--primary-color)"
      : "rgba(255,255,255,0.05)"};
  box-shadow: ${(props) =>
    props.$active
      ? `0 0 12px ${props.$isReward ? "var(--gold-glow)" : "var(--primary-glow)"}`
      : "none"};
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;

  .label {
    font-size: 0.65rem;
    color: var(--text-dark);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-family: "Syncopate", sans-serif;
  }

  .count {
    font-size: 1.1rem;
    font-weight: 900;
    font-family: "Syncopate", sans-serif;
    color: #fff;

    span {
      color: var(--text-dark);
      font-size: 0.8rem;
    }
  }
`;

const RewardInfo = styled.div<{ $isReady: boolean }>`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: ${(props) =>
    props.$isReady ? "rgba(212, 175, 55, 0.1)" : "rgba(0,0,0,0.2)"};
  border-radius: 14px;
  border: 1px solid
    ${(props) => (props.$isReady ? "rgba(212, 175, 55, 0.3)" : "transparent")};

  .icon-box {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => (props.$isReady ? "var(--gold-color)" : "#111")};
    box-shadow: ${(props) =>
      props.$isReady ? "0 0 15px var(--gold-glow)" : "none"};
  }

  .text-box {
    h4 {
      margin: 0;
      font-size: 0.8rem;
      font-weight: 800;
      color: ${(props) => (props.$isReady ? "var(--gold-color)" : "#fff")};
      text-transform: uppercase;
    }
    p {
      margin: 0;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--primary-color);
  padding: 8px 16px;
  border-radius: 100px;
  font-family: "Syncopate", sans-serif;
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 1px;
`;

// --- Lógica do Componente ---

interface WelcomeBannerProps {
  pontos: number;
}

export default function WelcomeBanner({ pontos = 0 }: WelcomeBannerProps) {
  const { user, isLoaded } = useUser();

  const progressoNoCiclo = pontos > 0 && pontos % 10 === 0 ? 10 : pontos % 10;
  const isRewardReady = progressoNoCiclo === 10;

  const getRank = () => {
    if (pontos >= 50) return "AGENTE LENDÁRIO";
    if (pontos >= 20) return "AGENTE ELITE";
    if (pontos >= 10) return "MEMBRO VETERANO";
    return "MEMBRO RECRUTA";
  };

  if (!isLoaded) return null;

  return (
    <BannerContainer
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <UserInfo>
        <Badge>
          <Target size={14} /> {getRank()}
        </Badge>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          OLÁ, <span>{(user?.firstName || "GUERREIRO").toUpperCase()}</span>
        </motion.h2>
        <p>
          Seu arsenal de estilo está pronto para a próxima missão. Como vamos
          operar hoje?
        </p>
      </UserInfo>

      <LoyaltyCard
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <StatusHeader>
          <span className="label">Fidelidade</span>
          <span className="count">
            {progressoNoCiclo}
            <span>/10</span>
          </span>
        </StatusHeader>

        <ProgressTrack>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
            <Step
              key={s}
              $active={s <= progressoNoCiclo}
              $isReward={s === 10 && isRewardReady}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + s * 0.05 }}
            />
          ))}
        </ProgressTrack>

        <RewardInfo $isReady={isRewardReady}>
          <div className="icon-box">
            {isRewardReady ? (
              <Sparkles size={20} color="#000" />
            ) : (
              <Trophy size={18} color="#444" />
            )}
          </div>
          <div className="text-box">
            <h4>{isRewardReady ? "RESGATE DISPONÍVEL" : "PRÓXIMO ALVO"}</h4>
            <p>
              {isRewardReady
                ? "Missão cumprida! Corte grátis liberado."
                : `Mais ${10 - progressoNoCiclo} passos para a recompensa.`}
            </p>
          </div>
        </RewardInfo>
      </LoyaltyCard>
    </BannerContainer>
  );
}
