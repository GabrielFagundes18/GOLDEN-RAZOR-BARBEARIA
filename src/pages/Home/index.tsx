import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";
// 1. Importar o hook de autenticação do Clerk
import { useAuth } from "@clerk/clerk-react";

const HomeGlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Inter:wght@300;400;700;900&display=swap');
  body { font-family: 'Inter', sans-serif; background-color: #050505; margin: 0; }
  h1, h2, h3 { font-family: 'Syncopate', sans-serif; text-transform: uppercase; }
`;

const shine = keyframes` 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } `;

const Container = styled.div`
  min-height: 100vh;
  color: #fff;
  background: #050505;
`;

const Hero = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background:
    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid #1a1a1a;
`;

const Brand = styled.h1`
  font-size: clamp(3rem, 15vw, 8rem);
  font-weight: 700;
  letter-spacing: -5px;
  margin: 0;
  background: linear-gradient(90deg, #fff, #444, #fff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shine} 5s linear infinite;
`;

const AboutSection = styled.section`
  padding: 120px 10%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const AboutText = styled.div`
  h2 {
    font-size: 2.5rem;
    margin-bottom: 30px;
    color: #00f2ff;
  }
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #a1a1a1;
    margin-bottom: 20px;
  }
  strong {
    color: #fff;
  }
`;

const ImageStack = styled.div`
  position: relative;
  height: 500px;
  .img-main {
    width: 80%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    filter: grayscale(100%) contrast(110%);
  }
  .accent-box {
    position: absolute;
    bottom: -20px;
    right: 20px;
    background: #00f2ff;
    padding: 40px;
    color: #000;
    font-weight: 900;
    font-family: "Syncopate";
  }
`;

const ServiceCard = styled.div`
  background: #0a0a0a;
  padding: 50px;
  border: 1px solid #1a1a1a;
  transition: 0.4s;
  &:hover {
    border-color: #00f2ff;
    transform: translateY(-10px);
  }
`;

export default function Home() {
  // 2. Extrair o status de login
  const { isSignedIn } = useAuth();

  // 3. Definir para onde o botão vai mandar
  const destination = isSignedIn ? "/dashboardClient" : "/login";

  return (
    <>
      <HomeGlobalStyle />
      <Container>
        <Hero>
          <div
            style={{
              letterSpacing: "8px",
              fontSize: "0.9rem",
              marginBottom: "20px",
            }}
          >
            EST. 2026 // GUARULHOS
          </div>
          <Brand>
GOLDEN RAZOR</Brand>
          <p style={{ fontSize: "1.5rem", fontWeight: 300, color: "#ccc" }}>
            STUDIO & BARBER
          </p>

          <div style={{ marginTop: "50px", display: "flex", gap: "20px" }}>
            <Link
              to={destination}
              style={{
                padding: "20px 40px",
                background: isSignedIn ? "#00f2ff" : "#fff", // Muda de cor se logado
                color: "#000",
                textDecoration: "none",
                fontWeight: "bold",
                transition: "0.3s",
              }}
            >
              {isSignedIn ? "IR PARA MEU PAINEL" : "AGENDAR AGORA"}
            </Link>

            {/* Se não estiver logado, mostra o botão de Login */}
            {!isSignedIn && (
              <Link
                to="/login"
                style={{
                  padding: "20px 40px",
                  border: "1px solid #fff",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                LOGIN
              </Link>
            )}
          </div>
        </Hero>

        <AboutSection>
          <ImageStack>
            <img
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"
              alt="Rhino Studio"
              className="img-main"
            />
            <div className="accent-box">
              PONTUALIDADE
              <br />E RESPEITO.
            </div>
          </ImageStack>

          <AboutText>
            <h2>O STUDIO</h2>
            <p>
              O <strong>Rhino Barber Studio</strong> não é apenas uma barbearia
              em Guarulhos, é um refúgio tecnológico.
            </p>
            <p>
              Nascemos com a missão de unir a <strong>força bruta</strong> do
              estilo clássico com a <strong>agilidade</strong> do agendamento
              digital.
            </p>
          </AboutText>
        </AboutSection>

        <section style={{ padding: "100px 10%", background: "#080808" }}>
          <h2 style={{ textAlign: "center", marginBottom: "60px" }}>ARSENAL</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            <ServiceCard>
              <h3>CORTE BRUTO</h3>
              <p>O clássico degradê ou tesoura com acabamento impecável.</p>
              <div
                style={{
                  marginTop: "20px",
                  fontSize: "1.5rem",
                  color: "#00F2FF",
                }}
              >
                R$ 50
              </div>
            </ServiceCard>
            <ServiceCard>
              <h3>BARBA REAL</h3>
              <p>Tratamento com toalha quente e alinhamento milimétrico.</p>
              <div
                style={{
                  marginTop: "20px",
                  fontSize: "1.5rem",
                  color: "#00F2FF",
                }}
              >
                R$ 40
              </div>
            </ServiceCard>
            <ServiceCard>
              <h3>COMBO RHINO</h3>
              <p>Experiência completa: Corte + Barba + Lavagem.</p>
              <div
                style={{
                  marginTop: "20px",
                  fontSize: "1.5rem",
                  color: "#00F2FF",
                }}
              >
                R$ 80
              </div>
            </ServiceCard>
          </div>
        </section>

        <footer
          style={{
            padding: "80px 10%",
            borderTop: "1px solid #1a1a1a",
            textAlign: "center",
            color: "#444",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "20px",
            }}
          >
            RHINO.
          </div>
          <p>Guarulhos, SP // Todos os direitos reservados // 2026</p>
        </footer>
      </Container>
    </>
  );
}
