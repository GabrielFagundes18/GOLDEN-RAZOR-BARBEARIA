# 💈 GOLDEN RAZOR - Sistema Tático de Gestão (Frontend Cliente)

Bem-vindo à documentação técnica do ecossistema de cliente da **Golden Razor**. Este projeto foi desenvolvido para oferecer uma experiência de "Barbearia de Elite", utilizando uma estética _Cyber-Noir_ com foco em gamificação e automação de reservas.

---

## 🏗️ Arquitetura de Engenharia e Fluxo de Dados

O sistema opera num modelo de **Single Page Application (SPA)** reativo, onde o estado do utilizador é sincronizado em tempo real entre o Clerk (Autenticação) e o PostgreSQL (Base de Dados).

### 1. Camada de Autenticação e Perfil (`index.tsx` & `useFetchProfile`)

O ponto de entrada do sistema realiza o _handshake_ de identidade.

- **Lógica de Sincronização:** O sistema captura o `clerkId` e verifica se o utilizador já existe no banco de dados através do hook `useFetchProfile`.
- **UUID Determinístico:** Para garantir integridade, os IDs são mapeados para garantir que agendamentos e pontos de fidelidade nunca se percam entre sessões.
- **Layout Adaptativo:** Utiliza um sistema de `Grid` que alterna entre `1fr 300px` (Desktop) e `1fr` (Mobile), garantindo que a barra de status lateral nunca quebre a experiência do utilizador.

### 2. Motor de Gamificação (`WelcomeBanner.tsx`)

Este componente é o coração da retenção de clientes.

- **Lógica de Ciclo de Fidelidade:** Implementa um algoritmo de `MOD 10`.
  - `pontos % 10` define o progresso visual na barra de 10 passos.
  - Se o resto for 0 e o total > 0, o sistema ativa o estado `isRewardReady`.
- **Sistema de Status:** O utilizador possui dois estados de benefício baseados nos pontos acumulados:
  - `pontos === 10` → **"Com Benefício"** (recompensa disponível para resgate)
  - Qualquer outro valor → **"Sem Benefício"** (em progressão)
- **Barra de XP:** Exibida no dashboard lateral (`index.tsx`) com animação de entrada, atualmente com valor visual fixo. O contador numérico de pontos é dinâmico via `useFetchProfile`.
- **Feedback Visual:** Utiliza `keyframes` de CSS para animação `pulse` no card de recompensa e animações de escala no `Framer Motion` para celebrar a conquista.

### 3. Sistema de Agendamento Inteligente (`BookingForm.tsx`)

O componente mais crítico em termos de lógica de negócio e UX.

- **Gerador de Time Slots:** O frontend calcula janelas de 40 minutos baseadas no horário de funcionamento da barbearia.
- **Prevenção de Overbooking:** Cruza a lista de horários gerados com os agendamentos já existentes retornados pela API em tempo real.
- **Injeção de Recompensa:** Se o utilizador tem 10 pontos, o formulário injeta automaticamente o metadado `is_reward: true` no payload da reserva, instruindo o backend a processar a transação com custo zero.

### 4. O Arsenal (Loja e Catálogo - `ProductArsenal.tsx`)

Uma vitrine tática projetada para conversão.

- **Filtros Dinâmicos por Memoização:** Utiliza `useMemo` para processar a busca e filtros de categoria. Isso garante que, mesmo com centenas de produtos, a interface não sofra _lag_ de renderização durante a digitação.
- **Lógica de Inventário:** Componentes de produto verificam `estoque_qtd`. Se o valor for 0, o componente renderiza automaticamente um overlay de "Esgotado" e desativa o botão de detalhe.
- **Deep Linking para Conversão:** O `ProductDetails.tsx` gera URLs de WhatsApp dinâmicas, incluindo o SKU e o nome do produto para facilitar o fechamento da venda.

### 5. Timeline de Missões (`HistoryList.tsx`)

Rastreabilidade e transparência de serviços.

- **Estado de Transição:** Mapeia os estados do backend para uma interface amigável com ícones e cores distintas:
  - `concluido` → Verde/Sólido + ícone `CheckCircle` (Missão Cumprida)
  - `cancelado` → Vermelho/Opaco + ícone `XCircle` (Abortado)
  - `agendado` / outros → Amarelo + ícone `Clock` (Missão Pendente)
- **Formatação Localizada:** Utiliza `Intl.NumberFormat` e `date-fns` com locale `pt-BR` para garantir que datas e valores monetários sigam o padrão brasileiro de forma rigorosa.

---

## 🎨 Design System & UI/UX

O design segue a filosofia **Tactical-Dark**, caracterizada por:

| Elemento             | Característica Técnica                                                      |
| :------------------- | :-------------------------------------------------------------------------- |
| **Glassmorphism**    | `backdrop-filter: blur(10–20px)` nos cards para profundidade.               |
| **Paleta**           | Base `#0a0a0a` com acentos em `var(--primary-color)` (Ouro/Âmbar).          |
| **Tipografia**       | Mistura de `Syncopate` (Títulos/Militar) e `Inter` (Leitura de Dados).      |
| **Micro-interações** | `whileHover` e `whileTap` em todos os botões para feedback táctil digital.  |
| **Efeito Scanline**  | `linear-gradient` repetido no `ProductHeroCarousel` para atmosfera CRT.     |

---

## 🛠️ Stack Tecnológica

- **Framework:** React 19 (Hooks, Memo, Callbacks)
- **Estilização:** Styled Components (CSS-in-JS)
- **Animações:** Framer Motion (Orquestração de transições)
- **Ícones:** Lucide React + React Icons (Hi, Fa)
- **Gestão de Datas:** Date-fns (Manipulação de fusos e slots)
- **Autenticação:** Clerk (`useUser`, `clerk-react`)
- **Comunicação:** Axios (Instância configurada com interceptors para API)
- **Roteamento:** React Router DOM (`Outlet`, `useNavigate`, `useParams`, `useLocation`)

---

## 🚀 Como Expandir o Projeto

1. **Novos Serviços:** Adicione o serviço no banco de dados; o `BookingForm` irá renderizá-lo automaticamente.
2. **Novas Recompensas:** Altere a lógica de `10` para uma variável de ambiente `REWARD_THRESHOLD` se quiser mudar a regra de negócio globalmente.
3. **Sistema de Patentes:** A estrutura do `WelcomeBanner` está preparada para receber um `switch` com múltiplos ranks progressivos baseados em faixas de pontos.
4. **XP Bar Dinâmica:** O componente `XPBar` em `index.tsx` está pronto para receber o cálculo real de `(pontos % 10) / 10 * 100` em substituição ao valor fixo atual.
5. **Analytics:** O sistema está preparado para disparar eventos de conversão no `handleFinish` do agendamento.

---

## ⚠️ Débitos Técnicos Conhecidos

| Item | Situação Atual | Melhoria Sugerida |
| :--- | :--- | :--- |
| XP Bar | Hardcoded em `65%` | Calcular com base em `pontos % 10` |
| Status `confirmado` | Não tratado explicitamente | Adicionar case no `getStatusColor` e nos ícones do `HistoryList` |
| `handleNext` no Carousel | Não memoizado com `useCallback` | Envolver em `useCallback` para estabilizar o `useEffect` do timer |
| `featured` em `index.tsx` | Recalculado a cada render | Envolver em `useMemo` dependente de `products` |