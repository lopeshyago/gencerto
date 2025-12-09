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
      "Identificação inicial do problema e da oportunidade de mercado.",
    // Removido iaMessage, placeholder e tasks, pois o componente ContextoProblemaPag gerencia a UI completa
    // para esta etapa.

  },
  discovery: {
    id: "discovery",
    title: "Discovery",
    description: "ExploraÃ§Ã£o do problema e levantamento de hipÃ³teses iniciais",
    iaMessage:
      "Hora do Discovery! ð\n\nAgora que entendemos o problema, vamos explorar as oportunidades. Quais sÃ£o as hipÃ³teses iniciais que vocÃª tem para a soluÃ§Ã£o? Quais funcionalidades vocÃª imagina?",
    placeholder: "Compartilhe suas hipÃ³teses e ideias de funcionalidades...",
    tasks: [
      { id: 1, text: "Levantar hipÃ³teses de soluÃ§Ã£o" },
      { id: 2, text: "Brainstorm de funcionalidades" },
      { id: 3, text: "Mapear stakeholders" },
      { id: 4, text: "Definir escopo inicial" },
    ],
  },
  "swot-csd": {
    id: "swot-csd",
    title: "SWOT e CSD",
    component: SWOTCSDPage,
    description: "AnÃ¡lise de ForÃ§as, Fraquezas, Oportunidades, AmeaÃ§as e Matriz CSD (Certezas, SuposiÃ§Ãµes, DÃºvidas).",
    iaMessage: "AnÃ¡lise EstratÃ©gica! ð\n\nVamos consolidar o entendimento do projeto com uma anÃ¡lise SWOT e a Matriz CSD. Quais sÃ£o os pontos fortes e fracos do seu produto? O que Ã© certeza, suposiÃ§Ã£o e dÃºvida?",
    placeholder: "Preencha a anÃ¡lise SWOT e a Matriz CSD...",
  },
  personas: {
    id: "personas",
    title: "Personas",
    component: PersonasPage,
    description: "CriaÃ§Ã£o de Personas para representar os usuÃ¡rios-alvo.",
    iaMessage: "ConheÃ§a seu UsuÃ¡rio! ð§âð»\n\nDescreva suas Personas. Quem sÃ£o eles? Quais sÃ£o seus objetivos, frustraÃ§Ãµes e como seu produto se encaixa na vida deles?",
    placeholder: "Crie suas Personas...",
  },
  "pesquisa-usuarios": {
    id: "pesquisa-usuarios",
    title: "Pesquisa de UsuÃ¡rio",
    component: UserResearchPage,
    description: "Planejamento e execuÃ§Ã£o da pesquisa de usuÃ¡rio.",
    iaMessage: "Pesquisa em AÃ§Ã£o! ð\n\nQuais mÃ©todos de pesquisa vocÃª usarÃ¡? Quais perguntas vocÃª precisa responder para validar suas hipÃ³teses?",
    placeholder: "Planeje sua pesquisa...",
  },
  "validacao-hipoteses": {
    id: "validacao-hipoteses",
    title: "Teste de HipÃ³teses",
    component: HypothesisTestingPage,
    description: "DefiniÃ§Ã£o e teste das hipÃ³teses de soluÃ§Ã£o.",
    iaMessage: "Hora de Testar! â\n\nQuais hipÃ³teses vocÃª vai testar? Como vocÃª vai medir o sucesso ou o fracasso de cada teste?",
    placeholder: "Defina seus testes de hipÃ³teses...",
  },
  "features-priorizacao": {
    id: "features-priorizacao",
    title: "Funcionalidades e Priorização",
    component: FeaturesPage,
    description: "DefiniÃ§Ã£o e priorizaÃ§Ã£o das funcionalidades do produto.",
    iaMessage: "O que o Produto Faz? âï¸\n\nListe e priorize as funcionalidades. Use mÃ©todos como MoSCoW ou Kano. Quais sÃ£o as essenciais (Must Have)?",
    placeholder: "Liste e priorize as funcionalidades...",
  },
  "user-stories-fluxos": {
    id: "user-stories-fluxos",
    title: "User Stories e Fluxos",
    component: UserStoriesFlowsPage,
    description: "CriaÃ§Ã£o de User Stories e mapeamento dos fluxos de usuÃ¡rio.",
    iaMessage: "Como o UsuÃ¡rio Interage? ðºï¸\n\nEscreva as User Stories no formato 'Como um [tipo de usuÃ¡rio], eu quero [objetivo], para que [benefÃ­cio]'. Mapeie os fluxos principais.",
    placeholder: "Crie as User Stories e os fluxos...",
  },
  "criterios-metricas": {
    id: "criterios-metricas",
    title: "CritÃ©rios e MÃ©tricas",
    component: CriteriaMetricsPage,
    description: "DefiniÃ§Ã£o dos critÃ©rios de sucesso e mÃ©tricas (KPIs).",
    iaMessage: "O que Ã© Sucesso? ð\n\nDefina os critÃ©rios de sucesso para o lanÃ§amento e as mÃ©tricas (KPIs) que vocÃª usarÃ¡ para medir o desempenho do produto.",
    placeholder: "Defina critÃ©rios e mÃ©tricas...",
  },
  "roadmap-backlog": {
    id: "roadmap-backlog",
    title: "Roadmap e Backlog",
    component: RoadmapBacklogPage,
    description: "CriaÃ§Ã£o do Roadmap e do Backlog do produto.",
    iaMessage: "Onde Vamos? ð£ï¸\n\nOrganize as funcionalidades no Roadmap (curto, mÃ©dio e longo prazo) e detalhe o Backlog para as prÃ³ximas iteraÃ§Ãµes.",
    placeholder: "Crie o Roadmap e o Backlog...",
  },
  prototipo: {
    id: "prototipo",
    title: "ProtÃ³tipo",
    component: PrototypePage,
    description: "CriaÃ§Ã£o e teste do protÃ³tipo de alta fidelidade.",
    iaMessage: "MÃ£os Ã  Obra! ð¨\n\nDescreva o protÃ³tipo. Quais sÃ£o as telas principais? Quais ferramentas vocÃª usou? Quais foram os resultados dos testes de usabilidade?",
    placeholder: "Descreva o protÃ³tipo e os testes...",
  },
  "prd-final": {
    id: "prd-final",
    title: "PRD Final",
    component: PRDFinalPage,
    description: "Documento de Requisitos de Produto (PRD) finalizado.",
    iaMessage: "O Documento Mestre! ð\n\nRevise e finalize o PRD. Ele deve conter todas as informaÃ§Ãµes necessÃ¡rias para o time de desenvolvimento.",
    placeholder: "Finalize o PRD...",
  },
  lancamento: {
    id: "lancamento",
    title: "LanÃ§amento",
    component: LaunchPage,
    description: "Plano de lanÃ§amento e estratÃ©gia Go-to-Market.",
    iaMessage: "Pronto para o Mundo! ð\n\nQual Ã© o seu plano de lanÃ§amento? Qual a estratÃ©gia de marketing e vendas? Como vocÃª vai medir o sucesso pÃ³s-lanÃ§amento?",
    placeholder: "Crie o plano de lanÃ§amento...",
  },
  // Adicionar dados para outras etapas aqui
};

// Componente principal da aplicaÃ§Ã£o
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

    // Escutar mudanÃ§as no hash
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isAuthenticated]);

  // Redirecionar para login se nÃ£o autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_PAGES.includes(activePage)) {
      setActivePage("login");
      if (typeof window !== "undefined") {
        window.location.hash = "login";
      }
    }
  }, [isAuthenticated, isLoading, activePage]);

  // Quando autenticar, levar usuÃ¡rio para o dashboard caso esteja em pÃ¡ginas pÃºblicas
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
        // Verifica se a pÃ¡gina Ã© uma etapa do wizard
        const step = stepData[activePage];
        if (step) {
          // Se a etapa tem um componente customizado, renderiza ele
          if (step.component) {
            const CustomComponent = step.component;
            return <CustomComponent stepData={step} onAdvanceStep={() => handleNavigate(step.nextStep)} />;
          }
          // Caso contrÃ¡rio, renderiza o StepPage padrÃ£o
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

    // Escutar mudanÃ§as no hash
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isAuthenticated]);

  // Redirecionar para login se nÃ£o autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_PAGES.includes(activePage)) {
      setActivePage("login");
      if (typeof window !== "undefined") {
        window.location.hash = "login";
      }
    }
  }, [isAuthenticated, isLoading, activePage]);

  // Quando autenticar, levar usuÃ¡rio para o dashboard caso esteja em pÃ¡ginas pÃºblicas
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
        // Verifica se a pÃ¡gina Ã© uma etapa do wizard
        const step = stepData[activePage];
        if (step) {
          // Se a etapa tem um componente customizado, renderiza ele
          if (step.component) {
            const CustomComponent = step.component;
            return <CustomComponent stepData={step} onAdvanceStep={() => handleNavigate(step.nextStep)} />;
          }
          // Caso contrÃ¡rio, renderiza o StepPage padrÃ£o
          return <StepPage stepData={step} onAdvanceStep={() => handleNavigate(step.nextStep)} />;
        }
        return <Dashboard />; // Fallback
    }
  };

  return (
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

    // Escutar mudanÃ§as no hash
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isAuthenticated]);

  // Redirecionar para login se nÃ£o autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_PAGES.includes(activePage)) {
      setActivePage("login");
      if (typeof window !== "undefined") {
        window.location.hash = "login";
      }
    }
  }, [isAuthenticated, isLoading, activePage]);

  // Quando autenticar, levar usuÃ¡rio para o dashboard caso esteja em pÃ¡ginas pÃºblicas
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

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">GenesiX</h2>
          <p className="text-gray-600">Carregando sua experiÃªncia...</p>
        </div>
      </div>
    );
  }

  // PÃ¡ginas de autenticaÃ§Ã£o (sem layout principal)
  if (['login', 'register', 'forgot-password'].includes(activePage)) {
    return (
      <div>
        {activePage === 'login' && (
          <LoginPage 
            onNavigate={handleNavigate} 
            onLogin={handleLogin}
          />
        )}
        {activePage === 'register' && (
          <RegisterPage 
            onNavigate={handleNavigate} 
            onRegister={handleRegister}
          />
        )}
        {activePage === 'forgot-password' && (
          <ForgotPasswordPage onNavigate={handleNavigate} />
        )}
      </div>
    );
  }

  // Layout principal da aplicaÃ§Ã£o (apenas para usuÃ¡rios autenticados)
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Header
        onNavigate={handleNavigate}
        onOpenNotification={handleOpenNotification}
        onLogout={handleLogout}
        user={user}
      />

      <LeftSidebar activeStep={activePage} onStepChange={handleNavigate} />

      {isNotificationOpen && (
        <NotificationOverlay
          isOpen={handleOpenNotification}
          onClose={handleCloseNotification}
        />
      )}

      <main
        className={`flex-1 overflow-auto pt-16 transition-all duration-300 ${isRightSidebarCollapsed ? "mr-16" : "mr-64"} ml-64`}
      >
        {activePage === "dashboard" && (
          <Dashboard
            onNavigate={handleNavigate}
            onOpenWizard={handleOpenWizard}
          />
        )}
        {activePage === "documents" && <DocumentsPage />}
        {activePage === "documents-step-1" && (
          <DocumentDetailPage1 onBack={() => handleNavigate("documents")} />
        )}
        {activePage === "documents-step-2" && (
          <DocumentDetailPage2 onBack={() => handleNavigate("documents")} />
        )}
        {activePage === "documents-step-3" && (
          <DocumentDetailPage3 onBack={() => handleNavigate("documents")} />
        )}
        {activePage === "collaboration" && <CollaboratorsPage />}
        {activePage === "analytics" && <AnalyticsPage />}
        {activePage === "profile" && <UserProfilePage />}
        {activePage === "settings" && <SettingsPage />}
        {activePage === "contexto-problema" && (
          <StepPage
            stepData={stepData["contexto-problema"]}
            onAdvanceStep={() => handleNavigate("discovery")}
          />
        )}
        {activePage === "discovery" && (
          <StepPage
            stepData={stepData["discovery"]}
            onAdvanceStep={() => handleNavigate("swot-csd")}
          />
        )}
        {activePage === "swot-csd" && <SWOTCSDPage onAdvanceStep={() => handleNavigate("personas")} />}
        {activePage === "personas" && <PersonasPage onAdvanceStep={() => handleNavigate("pesquisa-usuarios")} />}
        {activePage === "pesquisa-usuarios" && <UserResearchPage onAdvanceStep={() => handleNavigate("validacao-hipoteses")} />}
        {activePage === "validacao-hipoteses" && <HypothesisTestingPage onAdvanceStep={() => handleNavigate("features-priorizacao")} />}
        {activePage === "features-priorizacao" && <FeaturesPage onAdvanceStep={() => handleNavigate("user-stories-fluxos")} />}
        {activePage === "user-stories-fluxos" && <UserStoriesFlowsPage onAdvanceStep={() => handleNavigate("criterios-metricas")} />}
        {activePage === "criterios-metricas" && <CriteriaMetricsPage onAdvanceStep={() => handleNavigate("roadmap-backlog")} />}
        {activePage === "roadmap-backlog" && <RoadmapBacklogPage onAdvanceStep={() => handleNavigate("prototipo")} />}
        {activePage === "prototipo" && <PrototypePage onAdvanceStep={() => handleNavigate("prd-final")} />}
        {activePage === "prd-final" && <PRDFinalPage onAdvanceStep={() => handleNavigate("lancamento")} />}
        {activePage === "lancamento" && <LaunchPage onAdvanceStep={() => handleNavigate("dashboard")} />}
      </main>

      <RightSidebar
        collapsed={isRightSidebarCollapsed}
        onToggle={handleToggleRightSidebar}
      />
      {isWizardOpen && <Wizard onClose={handleCloseWizard} />}
    </div>
  );
}

// Componente App com Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

