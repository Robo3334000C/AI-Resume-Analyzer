# Curator AI: The Obsidian Career Architect

![Branding](https://lh3.googleusercontent.com/aida-public/AB6AXuBB4u6X1GzryJMBLWZLksjraoY08ApSG__UygN1LdlQD6nWu5UTIIZ1P-a76hQncJXC0jIm2mpZRS767STAeX1gaMuE1ELRGYIW0E4HhBier3Ofvx6MAFRZ42bbeLi5_z-dkVOa8AaO0EWxkfQQ1H_cDWhaGppTfRRAoHztkqOcyoXzJiwxt__dp-ofGc4UgbsnXy7aPcKK0x3HVO-3o-0k_4Vc3kS46tIgP_zl6PrXunsC1YgrHuHXBi1es7ruC5k3VSHftWNL-Js)

**Curator AI** (formerly AI Resume Analyzer) is the obsidian standard for career curation. It leverages deep AI analytics and a premium "Liquid Glass" aesthetic to transform professional narratives into high-performance career engines.

---

## 🚀 Key Modules

### 🧠 AI Resume Optimizer
Deploying neural-linguistic models to reconstruct your experience into high-conversion bullet points that outperform top-tier ATS benchmarks.

### 🔍 Resume Scanner
Instant, multi-dimensional compatibility scoring against job descriptions, identifying critical market gaps in real-time.

### 🧬 Skill DNA
Map technical and cognitive abilities onto a multi-dimensional graph to visualize your professional trajectory and identify growth leverage.

### 🎙️ Interview Simulator
Face custom-tailored AI personas in high-stakes simulations. Features real-time adaptive feedback, spoken interaction (TTS), and difficulty scaling.

---

## 🛠️ Technology Stack

### Frontend & UI/UX
- **Core**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Material Web](https://material-web.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Liquid Glass Aesthetics)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)
- **Scrolling**: [Lenis](https://lenis.darkroom.engineering/) for premium smooth-scrolling.

### Cloud Infrastructure (Backend as a Service)
- **Engine**: [Puter.js SDK](https://puter.com/)
- **AI**: Puter AI (Generative Language Models)
- **Authentication**: Puter Auth (Google, GitHub, Puter)
- **Database**: Puter KV (distributed key-value store)
- **Storage**: Puter FS (cloud file system for resume management)

### Utilities
- **PDF Parsing**: [PDF.js](https://mozilla.github.io/pdf.js/) (Local client-side extraction)
- **State Mgmt**: [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack Query](https://tanstack.com/query/latest)
- **Forms**: React Hook Form + [Zod](https://zod.dev/)

---

## 📦 Requirements & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [Puter.com](https://puter.com) Account (for cloud features)

### Local Setup
1. **Clone the repository**:
   ```sh
   git clone https://github.com/Robo3334000C/AI-Resume-Analyzer.git
   cd AI-Resume-Analyzer
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Launch Development Server**:
   ```sh
   npm run dev
   ```

---

## 📂 Project Architecture

```text
src/
├── components/       # Premium shadcn & custom UI components
├── data/             # Industry-specific keyword datasets
├── hooks/            # Custom React hooks (mobile, analysis, toast)
├── integrations/     # Cloud service bridges
├── lib/              # Core logic (Resume analyzer, utils)
├── pages/            # Main application modules (Dashboard, Simulator, etc.)
├── store/            # Global state (Zustand)
└── types/            # TypeScript schemas & global definitions
```

---

## 🖥️ Development Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server |
| `npm run build` | Compiles production-ready bundle |
| `npm run lint` | Runs ESLint for code quality |
| `npm test` | Executes the Vitest test suite |
| `npm run preview` | Locally previews the build |

---

## 🛡️ Security & Privacy
Curator AI follows the "Obsidian Standard":
- **Client-Side Extraction**: PDF parsing happens locally in your browser.
- **Encrypted Storage**: Data is stored securely via Puter's decentralized infrastructure.
- **Filtered Environment**: Sensitive environment variables are managed via cloud-native secrets.

---

© 2026 Curator AI. Architecting the future of professional performance.
