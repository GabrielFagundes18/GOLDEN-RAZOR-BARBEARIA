import styled from "styled-components";
import { MapPin, Clock, Camera, ArrowUpRight } from "lucide-react"; // ou lucide-react / react-icons

const StyledFooter = styled.footer`
  background: var(--bg-darker);
  padding: 120px 10% 60px;
  border-top: 1px solid var(--border-color);
  position: relative;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr; /* Coluna da marca maior */
  gap: 60px;
  margin-bottom: 100px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const BrandColumn = styled.div`
  .logo {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    letter-spacing: 5px;
    color: var(--primary-color);
    margin-bottom: 20px;
  }
  p {
    color: var(--text-dark);
    font-size: 0.85rem;
    line-height: 1.8;
    max-width: 280px;
  }
`;

const ColumnTitle = styled.h4`
  color: var(--primary-color);
  font-size: 0.65rem;
  letter-spacing: 4px;
  margin-bottom: 30px;
  text-transform: uppercase;
  font-weight: 600;
`;

const FooterLink = styled.a`
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  opacity: 0.5;
  transition: all 0.3s ease;
  margin-bottom: 12px;

  &:hover {
    opacity: 1;
    color: var(--gold-bright);
    transform: translateX(5px);
  }
`;

const Copyright = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  opacity: 0.4;
  font-size: 0.6rem;
  color: var(--text-color);
  letter-spacing: 3px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
`;

export default function ModernFooter() {
  return (
    <StyledFooter>
      <FooterGrid>
  
        <BrandColumn>
          <div className="logo">GOLDEN RAZOR</div>
          <p>
            Redefinindo a estética masculina através da precisão e do cuidado atemporal em Guarulhos.
          </p>
        </BrandColumn>

        {/* Coluna 2: Local */}
        <div>
          <ColumnTitle>Localização</ColumnTitle>
          <FooterLink href="https://maps.google.com" target="_blank">
            <MapPin size={16} strokeWidth={1.5} />
            <span>Rua das Américas, 450</span>
          </FooterLink>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)', marginLeft: '26px' }}>
            São Paulo, SP
          </p>
        </div>

        {/* Coluna 3: Horários */}
        <div>
          <ColumnTitle>Disponibilidade</ColumnTitle>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
            <Clock size={16} strokeWidth={1.5} />
            <span>Seg — Sáb</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginTop: '8px', marginLeft: '26px' }}>
            09:00 às 20:00
          </p>
        </div>

        {/* Coluna 4: Social */}
        <div>
          <ColumnTitle>Social</ColumnTitle>
          <FooterLink href="#">
            <Camera size={16} strokeWidth={1.5} />
            <span>Instagram</span>
            <ArrowUpRight size={12} opacity={0.5} />
          </FooterLink>
          <FooterLink href="#">
            <span style={{ marginLeft: '26px' }}>WhatsApp</span>
            <ArrowUpRight size={12} opacity={0.5} />
          </FooterLink>
        </div>
      </FooterGrid>

      <Copyright>
        <span>© 2026 Golden Razor Studio</span>
        <span style={{ opacity: 0.5 }}>Handcrafted by Gabriel Fagundes</span>
        <span>Guarulhos — SP</span>
      </Copyright>
    </StyledFooter>
  );
}