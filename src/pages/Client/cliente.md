# 💈 GOLDEN RAZOR - Client Side (Frontend)

Este repositório contém a interface do cliente de uma plataforma de gestão de barbearias de alto padrão. O foco principal é a experiência do utilizador (UX), utilizando uma estética "Cyber-Noir" e funcionalidades de autoatendimento para agendamentos e fidelização.

## 🚀 Funcionalidades da Interface

### 📅 Sistema de Agendamento Inteligente (`BookingForm.tsx`)
O coração da aplicação, permitindo ao cliente marcar serviços em poucos segundos:
* **Fluxo em Etapas:** Separação clara entre escolha de serviço, profissional, data e hora.
* **Filtro de Disponibilidade:** O sistema cruza os horários gerados (janelas de 40 min) com os dados de ocupação do servidor em tempo real, impedindo conflitos.
* **Regras de Data:** Bloqueio automático de dias passados e períodos de folga da barbearia.

### 🏆 Gamificação e Fidelidade (`index.tsx`)
A aplicação incentiva o retorno do cliente através de feedback visual:
* **Missão #10:** Um contador dinâmico monitoriza quantos cortes faltam para o utilizador ganhar o bónus.
* **Resgate Automático:** Quando o utilizador atinge 10 pontos, o sistema identifica a elegibilidade e marca o próximo agendamento como "CORTE PONTO" (`is_reward: true`).

### 📦 Vitrine de Produtos (`ProductArsenal.tsx`)
Um catálogo interativo para consulta de stock e detalhes:
* **Filtros Rápidos:** Pesquisa por nome e categoria (ex: Pomadas, Óleos, Acessórios).
* **Integração de Venda:** Botão direto para finalização ou consulta via WhatsApp e links para tutoriais no YouTube.

### 👤 Gestão de Perfil VIP (`ProfileView.tsx`)
Área dedicada à conta do utilizador:
* **Identidade Visual:** Estética "Gold Member" com tons dourados exclusivos.
* **Segurança:** Integração com Clerk para gestão de perfil, e-mail e segurança da conta.

---

## 🛠️ Stack Tecnológica

* **Framework:** [React 19](https://react.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Styled Components](https://styled-components.com/) (CSS-in-JS)
* **Animações:** [Framer Motion](https://www.framer.com/motion/)
* **Autenticação:** [Clerk](https://clerk.com/)
* **Manipulação de Datas:** [Date-fns](https://date-fns.org/)
* **Ícones:** Lucide React & React Icons

---

## 🎨 Design System

A interface segue uma linha de design **Dark Premium**:
* **Background:** `#030303` (Deep Black)
* **Accent:** `#e11d48` (Crimson) para ações principais.
* **Status:** `#D4AF37` (Gold) para elementos de fidelidade e recompensa.
* **Efeitos Visuais:** Uso de gradientes radiais, transparências (glassmorphism) e animações de *scanline* para simular interfaces tecnológicas.

---

## ⚙️ Regras de Negócio no Frontend

1.  **Segurança de Dados:** O `clerkId` é utilizado como identificador único em todas as chamadas de API para garantir que o utilizador só acede ao seu próprio histórico.
2.  **Validação de Formulário:** O botão de confirmação de agendamento apenas é ativado quando todos os campos obrigatórios (serviço, barbeiro, data e hora) estão preenchidos.
3.  **Responsividade:** O layout adapta-se de uma barra lateral fixa (Desktop) para um menu otimizado (Mobile), garantindo que o cliente possa agendar pelo telemóvel com facilidade.

---

## 💻 Instalação

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install