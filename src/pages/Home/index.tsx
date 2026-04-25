import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useAuth, useUser} from "@clerk/clerk-react";
import { ChevronRight, Star } from "lucide-react";

import { api } from "../../services/api";
import { HomeGlobalStyle, shine } from "./HomeStyles";
import { MainButton, PriceCard } from "./HomeComponents";

import UltraPremiumFooter from "./Footer";

const Hero = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background:
    linear-gradient(rgba(0, 0, 0, 0.4), var(--bg-color)),
    url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 0 20px;
`;

const Brand = styled.h1`
  font-size: clamp(3.5rem, 18vw, 9rem);
  font-weight: 900;
  letter-spacing: -6px;
  line-height: 0.9;
  background: linear-gradient(
    90deg,
    var(--text-color),
    var(--primary-color),
    var(--text-color)
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shine} 6s linear infinite;
  margin-bottom: 20px;
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  background: var(--bg-darker);
  padding: 80px 10%;
  border-bottom: 1px solid var(--border-color);
`;

const StatLabel = styled.p`
  font-size: 0.55rem;
  color: var(--primary-color);
  letter-spacing: 4px;
  font-weight: 900;
  margin-top: 5px;
  text-transform: uppercase;
`;

const GalleryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 350px);
  gap: 20px;
  padding: 100px 10%;
  background: var(--bg-color);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 300px);
  }

  .photo-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    &:nth-child(1) {
      grid-column: span 2;
      grid-row: span 2;
    }
  }

  .photo {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    filter: grayscale(100%) brightness(0.6);
    transition: all 0.8s cubic-bezier(0.2, 1, 0.3, 1);
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    opacity: 0;
    transition: 0.4s;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 30px;
    span {
      font-family: "Syncopate";
      font-size: 0.7rem;
      color: var(--primary-color);
      letter-spacing: 3px;
      transform: translateY(20px);
      transition: 0.4s;
    }
  }

  .photo-wrapper:hover {
    .photo {
      filter: grayscale(0%) brightness(1);
      transform: scale(1.08);
    }
    .overlay {
      opacity: 1;
      span {
        transform: translateY(0);
      }
    }
  }
`;

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2.5, ease: "circOut" });
    return controls.stop;
  }, [value]);

  return (
    <motion.h4
      style={{
        color: "var(--text-color)",
        fontSize: "3.5rem",
        fontWeight: 200,
        marginBottom: "5px",
        fontFamily: "Syncopate",
      }}
    >
      {rounded}
    </motion.h4>
  );
}

export default function Home() {
  const { isSignedIn } = useAuth();
  const [data, setData] = useState({
    stats: { barbers: 0, totalCuts: 0, rating: "5.0", totalClients: 0 },
    services: [],
  });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const response = await api.get("/landing-data");
        setData(response.data);
      } catch (err) {
        console.error("Erro ao carregar dados da Home:", err);
      }
    };
    loadHomeData();
  }, []);

  const { user } = useUser();

  const getDestination = () => {
    if (!isSignedIn) return "/login";

    const role = user?.publicMetadata?.role;

    if (role === "admin") return "/admin";
    if (role === "barber") return "/barber";

    return "/client";
  };

  const destination = getDestination();

  return (
    <>
      <HomeGlobalStyle />

      <Hero>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span
            style={{
              letterSpacing: "12px",
              color: "var(--text-color)",
              fontSize: "0.6rem",
              fontWeight: 900,
              opacity: 0.5,
            }}
          >
            UMA EXPERIÊNCIA EXCLUSIVA
          </span>
          <Brand>
            GOLDEN
            <br />
            RAZOR
          </Brand>
          <p
            style={{
              color: "var(--text-muted)",
              letterSpacing: "10px",
              fontSize: "0.8rem",
              fontWeight: 300,
              marginBottom: "40px",
            }}
          >
            DOMÍNIO DA NAVALHA // ARTE EM CADA DETALHE
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link to={destination} style={{ textDecoration: "none" }}>
              <MainButton
                $primary
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSignedIn ? "VOLTAR AO PAINEL" : "RESERVAR EXPERIÊNCIA"}
                <ChevronRight size={18} />
              </MainButton>
            </Link>
          </div>
        </motion.div>
      </Hero>

      <StatsBar>
        <div style={{ textAlign: "center" }}>
          <AnimatedNumber value={data.stats.totalCuts} />
          <StatLabel>CORTES REALIZADOS</StatLabel>
        </div>

        <div style={{ textAlign: "center" }}>
          <AnimatedNumber value={data.stats.totalClients} />
          <StatLabel>MEMBROS ATIVOS</StatLabel>
        </div>

        <div style={{ textAlign: "center" }}>
          <AnimatedNumber value={data.stats.barbers} />
          <StatLabel>BARBEIROS ELITE</StatLabel>
        </div>

        <div style={{ textAlign: "center" }}>
          <h4
            style={{
              color: "var(--text-color)",
              fontSize: "3.5rem",
              fontWeight: 200,
              marginBottom: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: "Syncopate",
            }}
          >
            {data.stats.rating}{" "}
            <Star
              size={24}
              fill="var(--primary-color)"
              color="var(--primary-color)"
            />
          </h4>
          <StatLabel>AVALIAÇÃO GOOGLE</StatLabel>
        </div>
      </StatsBar>

      <section style={{ padding: "150px 10%", background: "var(--bg-color)" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "80px",
            letterSpacing: "8px",
            fontSize: "0.8rem",
            color: "var(--primary-color)",
          }}
        >
          NOSSO ARSENAL
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {data.services.length > 0 ? (
            data.services.map((service: any) => (
              <PriceCard key={service.id}>
                <h3>{service.name.toUpperCase()}</h3>
                <p>{service.description}</p>
                <div className="price">
                  R$ {Number(service.price).toFixed(0)}
                </div>
              </PriceCard>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "var(--text-dark)",
                width: "100%",
                gridColumn: "1/-1",
              }}
            >
              Sincronizando arsenal com o banco de dados...
            </p>
          )}
        </div>
      </section>

      <GalleryGrid>
        <div className="photo-wrapper">
          <div
            className="photo"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1599351431247-f10b21ce5602?w=1200)",
            }}
          />
          <div className="overlay">
            <span>SHARP & CLEAN</span>
          </div>
        </div>
        <div className="photo-wrapper">
          <div
            className="photo"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800)",
            }}
          />
          <div className="overlay">
            <span>MASTER TOUCH</span>
          </div>
        </div>
        <div className="photo-wrapper">
          <div
            className="photo"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1512690196252-740713d335ce?w=800)",
            }}
          />
          <div className="overlay">
            <span>ELITE CUT</span>
          </div>
        </div>
        <div className="photo-wrapper">
          <div
            className="photo"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800)",
            }}
          />
          <div className="overlay">
            <span>LEGACY STYLE</span>
          </div>
        </div>
      </GalleryGrid>

      <UltraPremiumFooter />
    </>
  );
}
