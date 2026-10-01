export type ProjectCategory = "sites" | "sistemas" | "design";

export interface Project {
  id?: string;
  slug: string;
  title: string;
  client: string;
  category: ProjectCategory;
  year: number;
  /** Frase curta exibida acima do título (ex: "Site para contabilidade no Canadá"). */
  summary: string;
  description: string;
  tags: string[];
  /** URL do print (grande). Sem imagem, exibe um mockup desenhado em código. */
  image?: string;
  /** URL do print em tamanho médio, usado nos cards. */
  imageSmall?: string;
  /** Link externo do projeto publicado. */
  href?: string;
  /** Destaques aparecem no carrossel da home. */
  featured?: boolean;
  /** Cor de destaque do mockup quando não há imagem. */
  accent?: string;
  /** Marca projetos fictícios, exibidos enquanto o banco não tem projetos. */
  placeholder?: boolean;
}

export const categoryLabels: Record<ProjectCategory, string> = {
  sites: "Site",
  sistemas: "Sistema",
  design: "UI/UX",
};

export const categoryOptions: { value: ProjectCategory; label: string }[] = [
  { value: "sites", label: "Sites" },
  { value: "sistemas", label: "Sistemas" },
  { value: "design", label: "UI/UX" },
];

/** Exemplos exibidos no site enquanto nenhum projeto foi publicado pelo painel. */
export const placeholderProjects: Project[] = [
  {
    slug: "exemplo-site-institucional",
    title: "Site institucional",
    summary: "Site institucional para clínica de estética",
    client: "Cliente exemplo",
    category: "sites",
    year: 2026,
    description:
      "Site rápido e otimizado para SEO, com páginas de serviços, blog e integração com WhatsApp para captação de clientes.",
    tags: ["Next.js", "Tailwind", "SEO"],
    featured: true,
    accent: "#6467F2",
    placeholder: true,
  },
  {
    slug: "exemplo-dashboard-gestao",
    title: "Dashboard de gestão",
    summary: "Sistema de gestão para rede de lojas",
    client: "Cliente exemplo",
    category: "sistemas",
    year: 2026,
    description:
      "Painel com indicadores em tempo real, controle de estoque e relatórios financeiros para acompanhar o negócio de perto.",
    tags: ["React", "Node.js", "PostgreSQL"],
    featured: true,
    accent: "#3FB5A3",
    placeholder: true,
  },
  {
    slug: "exemplo-app-agendamento",
    title: "App de agendamento",
    summary: "App de agendamento para salões de beleza",
    client: "Cliente exemplo",
    category: "design",
    year: 2025,
    description:
      "Design completo de aplicativo para agendamento online, do fluxo de reserva ao painel do profissional.",
    tags: ["Figma", "Design System", "Protótipo"],
    featured: true,
    accent: "#E08A4B",
    placeholder: true,
  },
  {
    slug: "exemplo-loja-virtual",
    title: "Loja virtual",
    summary: "E-commerce para marca de roupas",
    client: "Cliente exemplo",
    category: "sites",
    year: 2025,
    description:
      "E-commerce com catálogo, carrinho e checkout integrado, pensado para converter no celular.",
    tags: ["Next.js", "Stripe", "CMS"],
    featured: true,
    accent: "#C85C8E",
    placeholder: true,
  },
  {
    slug: "exemplo-landing-page",
    title: "Landing page de lançamento",
    summary: "Landing page para lançamento de curso",
    client: "Cliente exemplo",
    category: "sites",
    year: 2025,
    description: "Página de alta conversão para lançamento de produto.",
    tags: ["Next.js", "Animações"],
    accent: "#8B7CF6",
    placeholder: true,
  },
  {
    slug: "exemplo-sistema-atendimento",
    title: "Sistema de atendimento",
    summary: "Central de atendimento para provedor de internet",
    client: "Cliente exemplo",
    category: "sistemas",
    year: 2025,
    description: "Central de chamados com filas, SLA e histórico de clientes.",
    tags: ["React", "API REST"],
    accent: "#4A9FE0",
    placeholder: true,
  },
  {
    slug: "exemplo-redesign-marca",
    title: "Redesign de plataforma",
    summary: "Redesign de plataforma de ensino",
    client: "Cliente exemplo",
    category: "design",
    year: 2024,
    description: "Nova interface e design system para uma plataforma web.",
    tags: ["Figma", "UX Research"],
    accent: "#D4A94A",
    placeholder: true,
  },
  {
    slug: "exemplo-portal-cliente",
    title: "Portal do cliente",
    summary: "Portal do cliente para escritório contábil",
    client: "Cliente exemplo",
    category: "sistemas",
    year: 2024,
    description: "Área logada para clientes acompanharem pedidos e faturas.",
    tags: ["Next.js", "Auth"],
    accent: "#5FB36B",
    placeholder: true,
  },
  {
    slug: "exemplo-cardapio-digital",
    title: "Cardápio digital",
    summary: "Cardápio digital para hamburgueria",
    client: "Cliente exemplo",
    category: "design",
    year: 2024,
    description: "Cardápio mobile com pedidos direto pelo WhatsApp.",
    tags: ["UI Mobile", "Protótipo"],
    accent: "#E0605A",
    placeholder: true,
  },
];

export const splitProjects = (projects: Project[]) => ({
  featured: projects.filter((project) => project.featured),
  others: projects.filter((project) => !project.featured),
});
