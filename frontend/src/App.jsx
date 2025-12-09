import { useState, useEffect } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import LeftSidebar from "./components/LeftSidebar";
import { Toaster } from "sonner";
import RightSidebar from "./components/RightSidebar";
import Dashboard from "./components/Dashboard";
import Wizard from "./components/Wizard.jsx";
import StepPage from "./components/StepPage";
import DocumentsPage from "./components/DocumentsPage";
import DocumentDetailPage1 from "./components/DocumentDetailPage1";
import DocumentDetailPage2 from "./components/DocumentDetailPage2";
import DocumentDetailPage3 from "./components/DocumentDetailPage3";
import CollaboratorsPage from "./components/CollaboratorsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import UserProfilePage from "./components/UserProfilePage";
import NotificationOverlay from "./components/NotificationOverlay";
import SettingsPage from "./components/SettingsPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import SWOTCSDPage from "./components/SWOTCSDPage";
import PersonasPage from "./components/PersonasPage";
import UserResearchPage from "./components/UserResearchPage";
import HypothesisTestingPage from "./components/HypothesisTestingPage";
import FeaturesPage from "./components/FeaturesPage";
import UserStoriesFlowsPage from "./components/UserStoriesFlowsPage";
import CriteriaMetricsPage from "./components/CriteriaMetricsPage";
import RoadmapBacklogPage from "./components/RoadmapBacklogPage";
import PrototypePage from "./components/PrototypePage";
import PRDFinalPage from "./components/PRDFinalPage";
import LaunchPage from "./components/LaunchPage";
import ContextoProblemaPag from "./components/ContextoProblemaPag";

const stepData = {
  "contexto-problema": {
    id: "contexto-problema",
    title: "Contexto e Problema",
    component: ContextoProblemaPag, // Usar o novo componente
    description:
      "IdentificaÃ§Ã£o inicial do problema e da oportunidade de mercado.",
    // Removido iaMessage, placeholder e tasks, pois o componente ContextoProblemaPag gerencia a UI completa
    // para esta etapa.

  },
  discovery: {
    id: "discovery",
    title: "Discovery",
    description: "ExploraÃƒÂ§ÃƒÂ£o do problema e levantamento de hipÃƒÂ³teses iniciais",
    iaMessage:
      "Hora do Discovery! Ã°ÂŸÂ”Â\n\nAgora que entendemos o problema, vamos explorar as oportunidades. Quais sÃƒÂ£o as hipÃƒÂ³teses iniciais que vocÃƒÂª tem para a soluÃƒÂ§ÃƒÂ£o? Quais funcionalidades vocÃƒÂª imagina?",
    placeholder: "Compartilhe suas hipÃƒÂ³teses e ideias de funcionalidades...",
    tasks: [
      { id: 1, text: "Levantar hipÃƒÂ³teses de soluÃƒÂ§ÃƒÂ£o" },
      { id: 2, text: "Brainstorm de funcionalidades" },
      { id: 3, text: "Mapear stakeholders" },
      { id: 4, text: "Definir escopo inicial" },
    ],
  },
  "swot-csd": {
    id: "swot-csd",
    title: "SWOT e CSD",
    component: SWOTCSDPage,
    description: "AnÃƒÂ¡lise de ForÃƒÂ§as, Fraquezas, Oportunidades, AmeaÃƒÂ§as e Matriz CSD (Certezas, SuposiÃƒÂ§ÃƒÂµes, DÃƒÂºvidas).",
    iaMessage: "AnÃƒÂ¡lise EstratÃƒÂ©gica! Ã°ÂŸÂ“ÂŠ\n\nVamos consolidar o entendimento do projeto com uma anÃƒÂ¡lise SWOT e a Matriz CSD. Quais sÃƒÂ£o os pontos fortes e fracos do seu produto? O que ÃƒÂ© certeza, suposiÃƒÂ§ÃƒÂ£o e dÃƒÂºvida?",
    placeholder: "Preencha a anÃƒÂ¡lise SWOT e a Matriz CSD...",
  },
  personas: {
    id: "personas",
    title: "Personas",
    component: PersonasPage,
    description: "CriaÃƒÂ§ÃƒÂ£o de Personas para representar os usuÃƒÂ¡rios-alvo.",
    iaMessage: "ConheÃƒÂ§a seu UsuÃƒÂ¡rio! Ã°ÂŸÂ§Â‘Ã¢Â€ÂÃ°ÂŸÂ’Â»\n\nDescreva suas Personas. Quem sÃƒÂ£o eles? Quais sÃƒÂ£o seus objetivos, frustraÃƒÂ§ÃƒÂµes e como seu produto se encaixa na vida deles?",
    placeholder: "Crie suas Personas...",
  },
  "pesquisa-usuarios": {
    id: "pesquisa-usuarios",
    title: "Pesquisa de UsuÃƒÂ¡rio",
    component: UserResearchPage,
    description: "Planejamento e execuÃƒÂ§ÃƒÂ£o da pesquisa de usuÃƒÂ¡rio.",
    iaMessage: "Pesquisa em AÃƒÂ§ÃƒÂ£o! Ã°ÂŸÂ“Â\n\nQuais mÃƒÂ©todos de pesquisa vocÃƒÂª usarÃƒÂ¡? Quais perguntas vocÃƒÂª precisa responder para validar suas hipÃƒÂ³teses?",
    placeholder: "Planeje sua pesquisa...",
  },
  "validacao-hipoteses": {
    id: "validacao-hipoteses",
    title: "Teste de HipÃƒÂ³teses",
    component: HypothesisTestingPage,
    description: "DefiniÃƒÂ§ÃƒÂ£o e teste das hipÃƒÂ³teses de soluÃƒÂ§ÃƒÂ£o.",
    iaMessage: "Hora de Testar! Ã¢ÂœÂ…\n\nQuais hipÃƒÂ³teses vocÃƒÂª vai testar? Como vocÃƒÂª vai medir o sucesso ou o fracasso de cada teste?",
    placeholder: "Defina seus testes de hipÃƒÂ³teses...",
  },
  "features-priorizacao": {
    id: "features-priorizacao",
    title: "Funcionalidades e PriorizaÃ§Ã£o",
    component: FeaturesPage,
    description: "DefiniÃƒÂ§ÃƒÂ£o e priorizaÃƒÂ§ÃƒÂ£o das funcionalidades do produto.",
    iaMessage: "O que o Produto Faz? Ã¢ÂšÂ™Ã¯Â¸Â\n\nListe e priorize as funcionalidades. Use mÃƒÂ©todos como MoSCoW ou Kano. Quais sÃƒÂ£o as essenciais (Must Have)?",
    placeholder: "Liste e priorize as funcionalidades...",
  },
  "user-stories-fluxos": {
    id: "user-stories-fluxos",
    title: "User Stories e Fluxos",
    component: UserStoriesFlowsPage,
    description: "CriaÃƒÂ§ÃƒÂ£o de User Stories e mapeamento dos fluxos de usuÃƒÂ¡rio.",
    iaMessage: "Como o UsuÃƒÂ¡rio Interage? Ã°ÂŸÂ—ÂºÃ¯Â¸Â\n\nEscreva as User Stories no formato 'Como um [tipo de usuÃƒÂ¡rio], eu quero [objetivo], para que [benefÃƒÂ­cio]'. Mapeie os fluxos principais.",
    placeholder: "Crie as User Stories e os fluxos...",
  },
  "criterios-metricas": {
    id: "criterios-metricas",
    title: "CritÃƒÂ©rios e MÃƒÂ©tricas",
    component: CriteriaMetricsPage,
    description: "DefiniÃƒÂ§ÃƒÂ£o dos critÃƒÂ©rios de sucesso e mÃƒÂ©tricas (KPIs).",
    iaMessage: "O que ÃƒÂ© Sucesso? Ã°ÂŸÂŒÂŸ\n\nDefina os critÃƒÂ©rios de sucesso para o lanÃƒÂ§amento e as mÃƒÂ©tricas (KPIs) que vocÃƒÂª usarÃƒÂ¡ para medir o desempenho do produto.",
    placeholder: "Defina critÃƒÂ©rios e mÃƒÂ©tricas...",
  },
  "roadmap-backlog": {
    id: "roadmap-backlog",
    title: "Roadmap e Backlog",
    component: RoadmapBacklogPage,
    description: "CriaÃƒÂ§ÃƒÂ£o do Roadmap e do Backlog do produto.",
    iaMessage: "Onde Vamos? Ã°ÂŸÂ›Â£Ã¯Â¸Â\n\nOrganize as funcionalidades no Roadmap (curto, mÃƒÂ©dio e longo prazo) e detalhe o Backlog para as prÃƒÂ³ximas iteraÃƒÂ§ÃƒÂµes.",
    placeholder: "Crie o Roadmap e o Backlog...",
  },
  prototipo: {
    id: "prototipo",
    title: "ProtÃƒÂ³tipo",
    component: PrototypePage,
    description: "CriaÃƒÂ§ÃƒÂ£o e teste do protÃƒÂ³tipo de alta fidelidade.",
    iaMessage: "MÃƒÂ£os ÃƒÂ  Obra! Ã°ÂŸÂŽÂ¨\n\nDescreva o protÃƒÂ³tipo. Quais sÃƒÂ£o as telas principais? Quais ferramentas vocÃƒÂª usou? Quais foram os resultados dos testes de usabilidade?",
    placeholder: "Descreva o protÃƒÂ³tipo e os testes...",
  },
  "prd-final": {
    id: "prd-final",
    title: "PRD Final",
    component: PRDFinalPage,
    description: "Documento de Requisitos de Produto (PRD) finalizado.",
    iaMessage: "O Documento Mestre! Ã°ÂŸÂ“Âœ\n\nRevise e finalize o PRD. Ele deve conter todas as informaÃƒÂ§ÃƒÂµes necessÃƒÂ¡rias para o time de desenvolvimento.",
    placeholder: "Finalize o PRD...",
  },
  lancamento: {
    id: "lancamento",
    title: "LanÃƒÂ§amento",
    component: LaunchPage,
    description: "Plano de lanÃƒÂ§amento e estratÃƒÂ©gia Go-to-Market.",
    iaMessage: "Pronto para o Mundo! Ã°ÂŸÂšÂ€\n\nQual ÃƒÂ© o seu plano de lanÃƒÂ§amento? Qual a estratÃƒÂ©gia de marketing e vendas? Como vocÃƒÂª vai medir o sucesso pÃƒÂ³s-lanÃƒÂ§amento?",
    placeholder: "Crie o plano de lanÃƒÂ§amento...",
  },
  // Adicionar dados para outras etapas aqui
};

// Componente principal da aplicaÃƒÂ§ÃƒÂ£o
function AppContent() {
  const { isAuthenticated, isLoading, user, login, register, logout } = useAuth();
  const PUBLIC_PAGES = ["login", "register", "forgot-password"];
  const getInitialPage = () => {
    if (typeof window === "undefined") {
      return "login";
    }
    const initialHash = window.location.hash.replace("#", "");
    return initialHash || "login";
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", ""); // Remove o #
      const targetPage = hash || (isAuthenticated ? "dashboard" : "login");
      const isPublicPage = PUBLIC_PAGES.includes(targetPage);

      if (!isAuthenticated && !isPublicPage) {
        setActivePage("login");
        if (window.location.hash !== "#login") {
          window.location.hash = "login";
        }
        return;
      }

      setActivePage(targetPage);
    };

    // Verificar hash inicial
    handleHashChange();

    // Escutar mudanÃƒÂ§as no hash
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isAuthenticated]);

  // Redirecionar para login se nÃƒÂ£o autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_PAGES.includes(activePage)) {
      setActivePage("login");
      if (typeof window !== "undefined") {
        window.location.hash = "login";
      }
    }
  }, [isAuthenticated, isLoading, activePage]);

  // Quando autenticar, levar usuÃƒÂ¡rio para o dashboard caso esteja em pÃƒÂ¡ginas pÃƒÂºblicas
  useEffect(() => {
    if (!isLoading && isAuthenticated && PUBLIC_PAGES.includes(activePage)) {
      setActivePage("dashboard");
      if (typeof window !== "undefined") {
        window.location.hash = "dashboard";
      }
    }
  }, [isAuthenticated, isLoading, activePage]);

  const handleNavigate = (page) => {
    const targetPage = page || (isAuthenticated ? "dashboard" : "login");
    if (!isAuthenticated && !PUBLIC_PAGES.includes(targetPage)) {
      setActivePage("login");
      if (typeof window !== "undefined") {
        window.location.hash = "login";
      }
      return;
    }

    setActivePage(targetPage);
    if (typeof window !== "undefined") {
      window.location.hash = targetPage;
    }
  };

  const handleToggleRightSidebar = () => {
    setIsRightSidebarCollapsed(!isRightSidebarCollapsed);
  };

  const handleOpenWizard = () => {
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
  };

  const handleOpenNotification = () => {
    setIsNotificationOpen(true);
  };

  const handleCloseNotification = () => {
    setIsNotificationOpen(false);
  };

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      handleNavigate('dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      handleNavigate('dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    await logout();
    handleNavigate('login');
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "documents":
        return <DocumentsPage onNavigate={handleNavigate} />;
      case "document-detail-1":
        return <DocumentDetailPage1 />;
      case "document-detail-2":
        return <DocumentDetailPage2 />;
      case "document-detail-3":
        return <DocumentDetailPage3 />;
      case "collaborators":
        return <CollaboratorsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "profile":
        return <UserProfilePage />;
      case "settings":
        return <SettingsPage />;
      case "login":
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />;
      case "forgot-password":
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case "wizard":
        return <Wizard stepData={stepData} onNavigate={handleNavigate} />;
      default:
        // Verifica se a pÃƒÂ¡gina ÃƒÂ© uma etapa do wizard
        const step = stepData[activePage];
        if (step) {
          // Se a etapa tem um componente customizado, renderiza ele
          if (step.component) {
            const CustomComponent = step.component;
            return <CustomComponent stepData={step} onAdvanceStep={() => handleNavigate(step.nextStep)} />;
          }
          // Caso contrÃƒÂ¡rio, renderiza o StepPage padrÃƒÂ£o
          return <StepPage stepData={step} onAdvanceStep={() => handleNavigate(step.nextStep)} />;
        }
        return <Dashboard />; // Fallback
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex h-screen overflow-hidden">
        <LeftSidebar onNavigate={handleNavigate} activePage={activePage} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header
            onToggleRightSidebar={handleToggleRightSidebar}
            onOpenWizard={handleOpenWizard}
            onOpenNotification={handleOpenNotification}
            onLogout={handleLogout}
            user={user}
          />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Carregando...</p>
              </div>
            ) : (
              renderPage()
            )}
          </main>
        </div>
        <RightSidebar
          isCollapsed={isRightSidebarCollapsed}
          onToggle={handleToggleRightSidebar}
        />
        <NotificationOverlay
          isOpen={isNotificationOpen}
          onClose={handleCloseNotification}
        />
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
