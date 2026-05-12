import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { Trophy, Target, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

// --- Animações ---
const scan = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0px rgba(212, 175, 55, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
  100% { box-shadow: 0 0 0 0px rgba(212, 175, 55, 0); }
`;

// --- Estilos ---

const BannerContainer = styled(motion.div)`
  width: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #141414 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: clamp(25px, 5vw, 40px);
  border-radius: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  // Efeito de iluminação de fundo
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: var(--primary-glow);
    filter: blur(120px);
    opacity: 0.1;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
`;

const UserInfo = styled.div`
  z-index: 2;

  h2 {
    font-size: clamp(2rem, 5vw, 2.8rem);
    margin: 12px 0;
    font-weight: 900;
    color: #fff;
    text-transform: uppercase;

    span {
      color: var(--primary-color);
      text-shadow: 0 0 20px var(--primary-glow);
    }
  }

  p {
    color: rgba(255, 255, 255, 0.4);
    font-size: 1rem;
    max-width: 380px;
    line-height: 1.5;
  }
`;

const LoyaltyCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 24px;
  border-radius: 24px;
  width: 100%;
  max-width: 380px;
  backdrop-filter: blur(20px);
  z-index: 2;
`;

const ProgressTrack = styled.div`
  display: flex;
  gap: 6px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
  padding: 4px 0;
`;

const Step = styled(motion.div)<{ $active: boolean; $isReward: boolean }>`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: ${(props) =>
    props.$active
      ? props.$isReward
        ? "var(--gold-color)"
        : "var(--primary-color)"
      : "rgba(255,255,255,0.05)"};
  box-shadow: ${(props) =>
    props.$active
      ? `0 0 10px ${props.$isReward ? "var(--gold-glow)" : "var(--primary-glow)"}`
      : "none"};
`;

const RewardInfo = styled.div<{ $isReady: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${(props) =>
    props.$isReady ? "rgba(212, 175, 55, 0.08)" : "rgba(255,255,255,0.03)"};
  border-radius: 16px;
  border: 1px solid
    ${(props) =>
      props.$isReady ? "rgba(212, 175, 55, 0.3)" : "rgba(255,255,255,0.05)"};
  animation: ${(props) => (props.$isReady ? pulse : "none")} 2s infinite;

  .icon-box {
    min-width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) =>
      props.$isReady ? "var(--gold-color)" : "#1a1a1a"};
    color: ${(props) => (props.$isReady ? "#000" : "#444")};
  }

  .text-box {
    h4 {
      margin: 0;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: ${(props) => (props.$isReady ? "var(--gold-color)" : "#fff")};
    }
    p {
      margin: 0;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const RankBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 243, 255, 0.05);
  border: 1px solid rgba(0, 243, 255, 0.15);
  color: var(--primary-color);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// --- Lógica ---

export default function WelcomeBanner({ pontos = 0 }: { pontos: number }) {
  const { user, isLoaded } = useUser();

  // Gamificação: Sistema de Patentes
  const rank = useMemo(() => {
    if (pontos === 10)
      return { name: "Com Beneficio", icon: <ShieldCheck size={14} /> };
    return { name: "Sem Beneficio", icon: <Target size={14} /> };
  }, [pontos]);

  const progressoNoCiclo = pontos % 10 === 0 && pontos > 0 ? 10 : pontos % 10;
  const isRewardReady = progressoNoCiclo === 10;

  if (!isLoaded) return null;

  return (
    <BannerContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <UserInfo>
        <RankBadge>
          {rank.icon} {rank.name}
        </RankBadge>

        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          OPERADOR <span>{(user?.firstName || "Usuário").toUpperCase()}</span>
        </motion.h2>

        
      </UserInfo>

      <LoyaltyCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 800,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            Progresso de Missão
          </span>
          <span style={{ fontSize: "1rem", fontWeight: 900, color: "#fff" }}>
            {progressoNoCiclo}
            <span style={{ opacity: 0.3, fontSize: "0.7rem" }}>/10</span>
          </span>
        </div>

        <ProgressTrack>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
            <Step
              key={s}
              $active={s <= progressoNoCiclo}
              $isReward={s === 10}
              initial={{ scaleY: 0.5 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.1 + s * 0.03 }}
            />
          ))}
        </ProgressTrack>

        <RewardInfo $isReady={isRewardReady}>
          <div className="icon-box">
            {isRewardReady ? <Sparkles size={22} /> : <Trophy size={18} />}
          </div>
          <div className="text-box">
            <h4>
              {isRewardReady ? "RECOMPENSA LIBERADA" : "BÔNUS DE FIDELIDADE"}
            </h4>
            <p>
              {isRewardReady
                ? "Corte gratuito disponível para resgate."
                : `Faltam ${10 - progressoNoCiclo} atendimentos para o prêmio.`}
            </p>
          </div>
        </RewardInfo>
      </LoyaltyCard>
    </BannerContainer>
  );
}
