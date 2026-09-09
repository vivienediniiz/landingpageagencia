import type { ReactNode, PointerEvent, MouseEvent } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight, Check, Menu, X, MessageCircle, Sparkles, Layers, Gauge, Figma,
  Code2, PenTool, ShieldCheck, Zap, Clock, TrendingUp, UserRound, Plus,
  Mail, MoveHorizontal, ChevronLeft, ChevronRight,
} from "lucide-react";


/* ============================================================================
   ⚙️  CONFIG — altere aqui contatos, links, números e imagens
   ========================================================================= */
const CONFIG = {
  nome: "Viviene Diniz",
  foto: "/viviene.png",
  fotoSobre: "/sobre-mim.png",
  whatsapp: "5531971983044", // só números: DDI + DDD + número
  mensagemWhats:
    "Olá Viviene! Vim pelo seu site e quero um orçamento para o meu projeto.",
  email: "viviene.diniiz@gmail.com",
  linkedin: "https://www.linkedin.com/in/vivienediniz/",
  instagram: "https://instagram.com/agencia_diiniz",
  tiktok: "https://www.tiktok.com/@viviene_diniiz",
  // Cole aqui a URL de cada post que deve aparecer no site (Instagram > post > ... > Copiar link).
  instagramPosts: [] as string[],
  metricas: [
    { valor: "+200", label: "projetos entregues" },
    { valor: "100%", label: "código próprio e limpo" },
    { valor: "1:1", label: "atendimento direto" },
  ],
};

const waLink = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
  CONFIG.mensagemWhats
)}`;

/* ============================================================================
   🧩 Helper de animação no scroll
   ========================================================================= */
type RvVariante = "up" | "left" | "right" | "scale" | "fade";

function Reveal({ children, delay = 0, className = "", variante = "up" }: {
  children: ReactNode; delay?: number; className?: string; variante?: RvVariante;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv rv-${variante} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* Progresso de leitura: 0 a 1, com o scroll lido dentro do rAF para não
   forçar layout a cada evento. */
function useProgressoScroll() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const medir = () => {
      raf = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setP(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    const agendar = () => { if (!raf) raf = requestAnimationFrame(medir); };
    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);
  return p;
}

/* Parallax: desloca o elemento em fração da rolagem. Só decoração entra aqui —
   texto que se move junto do scroll fica difícil de ler. */
function useParallax(fator: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const mover = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const centro = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.setProperty("--py", `${(-centro * fator).toFixed(1)}px`);
    };
    const agendar = () => { if (!raf) raf = requestAnimationFrame(mover); };
    mover();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [fator]);
  return ref;
}

/* ============================================================================
   ✍️ CONTEÚDO — todos os textos ficam aqui
   ========================================================================= */
const NAV: [string, string][] = [
  ["Serviços", "servicos"], ["Planos", "planos"], ["Sobre", "sobre"],
  ["Processo", "processo"], ["FAQ", "faq"],
];

/* `categoria` é um classificador que vive sobre o mockup — o título lidera o texto. */
const SERVICOS = [
  { icon: Sparkles, categoria: "Redes sociais", titulo: "Um feed que parece de marca grande",
    texto: "Perfil sem padrão visual afasta cliente antes da primeira mensagem. Aqui, cada post segue uma identidade travada — cores, fontes e grade sempre no lugar certo.",
    mock: "Mockup: feed do Instagram com identidade aplicada",
    projetos: [
      { imagem: "/post.jpg" },
    ],
    cta: "Falar sobre redes sociais",
    itens: ["Templates de feed e stories", "Paleta e tipografia aplicadas", "Grade de publicação organizada", "Arquivos prontos para postar"] },
  { icon: Zap, categoria: "Landing pages", titulo: "Uma página única, feita pra converter",
    texto: "Site institucional bonito não vende sozinho. Uma landing page é construída em volta de um objetivo: fazer o visitante chamar no WhatsApp ou preencher um formulário.",
    mock: "Mockup: landing page em desktop e mobile",
    projetos: [
      { link: "https://draingridguimaraes.netlify.app/", label: "Dra. Ingrid Guimarães — advocacia de família",
        imagem: "/projeto-ingrid-guimaraes.png", acao: "ver projeto no ar" },
    ],
    cta: "Falar sobre landing page",
    itens: ["Estrutura pensada para conversão", "Copy escrita para o seu público", "Responsivo em qualquer tela", "Botão de contato em todas as seções"] },
  { icon: Layers, categoria: "Sites e e-commerce", titulo: "Uma loja pronta pra vender",
    texto: "Configurar uma Nuvemshop sozinho consome tempo que deveria ir para o produto. Eu monto a loja, aplico sua identidade e deixo integrada ao seu domínio.",
    mock: "Mockup: página de produto da loja",
    projetos: [
      { imagem: "/e-commerce.jpg" },
    ],
    cta: "Falar sobre minha loja",
    itens: ["Loja configurada na Nuvemshop", "Identidade visual aplicada", "Domínio próprio conectado", "Pagamento e frete configurados"] },
  { icon: Code2, categoria: "Sistemas e SaaS", titulo: "Quando a planilha já não aguenta",
    texto: "Ferramenta genérica resolve até certo ponto. Depois disso, o que falta é um sistema feito para o seu processo, do seu jeito, sem gambiarra.",
    mock: "Mockup: painel do sistema",
    projetos: [
      { link: "https://studiomaker3d.com.br/", label: "StudioMaker — gestão para estúdios 3D",
        imagem: "/projeto-studiomaker3d.png", acao: "ver projeto no ar" },
      { link: "https://www.figma.com/proto/R5vynUbcJHy0M7YfooS5dN/Saas-Clinica-est%C3%A9tica?node-id=1-39&t=EUmAfwXGB66hrcqX-1",
        label: "Estética Flowers — app de clínica estética",
        imagem: "/projeto-estetica-flowers-2.png", acao: "abrir protótipo" },
    ],
    cta: "Falar sobre um sistema",
    itens: ["Levantamento do seu processo real", "Sistema web sob medida", "Login e controle de acesso", "Suporte depois da entrega"] },
];

const CONSTRUO = [
  { icon: Layers, t: "Sistemas personalizados",
    d: "Plataformas web sob medida e dashboards que a sua equipe entende no primeiro uso. Arquitetura limpa, segurança e performance desde a primeira linha.",
    tags: ["Painéis administrativos", "Integrações e APIs", "Arquitetura escalável"] },
  { icon: Zap, t: "Landing pages de alta conversão",
    d: "Páginas rápidas, responsivas e escritas para vender. Cada bloco tem uma função: levar o visitante até o botão certo.",
    tags: ["Carregamento < 2s", "Copy orientada a oferta", "Testes e ajustes finos"] },
  { icon: PenTool, t: "UI/UX design & redesign",
    d: "Do wireframe ao protótipo navegável no Figma. Design system consistente, usabilidade testada e interfaces que dão gosto de usar.",
    tags: ["Wireframes e protótipos", "Design system", "Testes de usabilidade"] },
  { icon: Code2, t: "Desenvolvimento front-end exclusivo",
    d: "Código moderno e comentado, animações fluidas, SEO técnico e adaptação real para mobile — nada de tema pronto remendado.",
    tags: ["React, Next.js e Tailwind", "SEO técnico", "Mobile first de verdade"] },
];


const PLANOS = [
  { nome: "Essencial", desc: "Pra quem está começando e precisa aparecer com constância.", preco: "R$ 150,00", pop: false,
    itens: ["8 artes por mês (4 feed + 4 stories)", "Legenda pronta em cada post", "1 rodada de ajuste por arte", "Entrega quinzenal"] },
  { nome: "Constância", desc: "Pra quem já publica e quer ritmo sem quebrar a linha visual.", preco: "R$ 280,00", pop: false,
    itens: ["16 artes por mês (8 feed + 8 stories)", "Legenda pronta em cada post", "2 rodadas de ajuste por arte", "Entrega semanal"] },
  { nome: "Autoridade", desc: "Pra marcas que precisam de presença forte todos os dias.", preco: "R$ 450,00", pop: true,
    itens: ["24 artes por mês (12 feed + 12 stories)", "Legendas com chamada para ação", "Ajustes ilimitados dentro do mês", "Calendário editorial mensal"] },
  { nome: "Sob medida", desc: "Pra quem precisa de artes, site e sistema no mesmo pacote.", preco: "Sob consulta", pop: false,
    itens: ["Volume definido com você", "Design + web na mesma equipe", "Prioridade na fila de entrega", "Reunião mensal de estratégia"] },
];

const HABILIDADES: [string, string[]][] = [
  ["Design", ["Identidade visual", "Social media", "Direção de arte", "Copywriting", "UI Design"]],
  ["Web", ["Landing pages", "Sites institucionais", "Nuvemshop", "SEO técnico", "Performance"]],
  ["Sistemas", ["Sistemas web sob medida", "Automação de processos", "Integrações via API", "Painéis administrativos"]],
  ["Ferramentas", ["Figma", "Next.js", "Supabase", "Notion", "Nuvemshop"]],
];

/* faixa rolante: as mesmas habilidades da seção Ferramentas, em lista única */
const FAIXA = HABILIDADES.flatMap(([, itens]) => itens);


const BENEFICIOS = [
  { icon: UserRound, t: "Você fala direto comigo", d: "Sem intermediário e sem telefone sem fim. Quem desenha e escreve o código é quem responde você." },
  { icon: Sparkles, t: "Design e código na mesma pessoa", d: "O que foi desenhado é o que vai para o ar — pixel por pixel, sem perda na tradução." },
  { icon: Clock, t: "Prazo combinado é prazo entregue", d: "Cronograma definido no briefing e acompanhamento por etapa, com entregas parciais para validar." },
  { icon: TrendingUp, t: "Foco em conversão, não em enfeite", d: "Cada decisão visual tem uma razão: mais contatos, mais vendas, mais autoridade para a sua marca." },
  { icon: ShieldCheck, t: "Código proprietário e organizado", d: "O projeto é seu. Estrutura documentada para qualquer dev dar continuidade sem retrabalho." },
  { icon: Gauge, t: "Performance como requisito", d: "Otimização de imagens, carregamento inteligente e boas notas no Lighthouse antes de entregar." },
];

const PROCESSO = [
  { n: "01", t: "Alinhamento & briefing", d: "Uma conversa para entender o negócio, o público e o objetivo real do projeto. Saio dela com escopo, prazo e investimento definidos." },
  { n: "02", t: "Wireframe & design UI/UX", d: "Estrutura e protótipo navegável no Figma. Você aprova cada tela antes de existir uma linha de código." },
  { n: "03", t: "Desenvolvimento & testes", d: "Codificação do layout aprovado, testes em vários dispositivos e navegadores, ajustes de performance e SEO." },
  { n: "04", t: "Lançamento & suporte", d: "Publicação, configuração de domínio e analytics, entrega do código e 30 dias de acompanhamento." },
];

/* Portfólio desativado por enquanto — o Instagram assume o lugar dele.
   Volte para `true` quando os cases estiverem prontos. */
const MOSTRAR_PORTFOLIO = false;

const PROJETOS = [
  { tag: "SaaS", t: "StudioMaker3D", d: "ERP completo para estúdios de impressão 3D: orçamentos, pedidos, marketplaces e monitoramento de impressoras.", stack: "Next.js · Supabase" },
  { tag: "E-commerce", t: "Studio Diniz", d: "Loja própria com catálogo, checkout integrado, cálculo de frete e painel administrativo sob medida.", stack: "Next.js · Mercado Pago" },
  { tag: "Landing page", t: "Orça3D", d: "Página de vendas de um produto digital com calculadora interativa e pagamento em uma etapa.", stack: "React · Tailwind" },
  { tag: "App UI", t: "Painel de operações", d: "Interface de gestão com visualização de dados, filtros avançados e design system documentado.", stack: "Figma · Design system" },
];

const FAQ = [
  { q: "Qual o prazo médio de entrega?", a: "Uma landing page fica pronta em 7 a 15 dias. Sites institucionais levam de 3 a 4 semanas, e sistemas sob medida variam conforme o escopo — o prazo exato entra na proposta, com as datas de cada etapa." },
  { q: "Como funciona o pagamento?", a: "50% na aprovação da proposta para reservar a agenda e 50% na entrega final. Aceito Pix, cartão e boleto, com possibilidade de parcelamento em projetos maiores. Tudo formalizado em contrato." },
  { q: "Você entrega tanto o design quanto o código?", a: "Sim, e é justamente esse o diferencial. Você recebe o arquivo do Figma com o design system e o código-fonte completo, comentado e pronto para evoluir." },
  { q: "Como funciona o suporte pós-lançamento?", a: "Todo projeto inclui 30 dias de suporte para ajustes e correções. Depois disso, dá para contratar manutenção mensal ou pacotes de horas quando precisar." },
];

type SobreCard = [LucideIcon, string, string];
const SOBRE_CARDS: SobreCard[] = [
  [Figma, "Visão de designer", "Hierarquia, tipografia e usabilidade testada."],
  [Code2, "Rigor de desenvolvedora", "Componentes reutilizáveis e performance real."],
  [Clock, "Pontualidade", "Cronograma por etapas, sem surpresa na entrega."],
  [ShieldCheck, "Foco no seu objetivo", "Toda decisão volta para a meta do projeto."],
];

/* ============================================================================
   Logos de marca — o Lucide desenha ícones genéricos; marca é forma fechada,
   então cada uma vem do glifo oficial (Simple Icons, viewBox 24).
   ========================================================================= */
function Marca({ size = 17, titulo, d }: { size?: number; titulo: string; d: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" role="img" aria-hidden="true" focusable="false">
      <title>{titulo}</title>
      <path d={d} />
    </svg>
  );
}

const D_WHATSAPP = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";

const D_TIKTOK = "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z";

const D_INSTAGRAM = "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z";

const D_LINKEDIN = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

type SocialLink = [(p: { size?: number }) => ReactNode, string, string];
const SOCIAL_LINKS: SocialLink[] = [
  [(p) => <Marca {...p} titulo="WhatsApp" d={D_WHATSAPP} />, waLink, "WhatsApp"],
  [(p) => <Marca {...p} titulo="Instagram" d={D_INSTAGRAM} />, CONFIG.instagram, "Instagram"],
  [(p) => <Marca {...p} titulo="TikTok" d={D_TIKTOK} />, CONFIG.tiktok, "TikTok"],
  [(p) => <Marca {...p} titulo="LinkedIn" d={D_LINKEDIN} />, CONFIG.linkedin, "LinkedIn"],
  [Mail, `mailto:${CONFIG.email}`, "E-mail"],
];

/* posição do cursor vira variável CSS para o halo do card acompanhar */
function seguirCursor(e: MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/* ============================================================================
   🔢 Contador — anima de 0 até o valor ao carregar a página
   ========================================================================= */
function useContador(alvo: number, ativo: boolean, duracao = 1700) {
  const [n, setN] = useState(ativo ? 0 : alvo);

  useEffect(() => {
    if (!ativo) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setN(alvo);
      return;
    }
    let raf = 0;
    const inicio = performance.now();
    const passo = (t: number) => {
      const p = Math.min(1, (t - inicio) / duracao);
      setN(Math.round(alvo * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [alvo, ativo, duracao]);

  return n;
}

const NUM = /^(\D*)(\d+)(.*)$/;

function Metrica({ valor, label }: { valor: string; label: string }) {
  const m = NUM.exec(valor);
  const alvo = m ? Number(m[2]) : 0;
  /* "1:1" é proporção, não contagem: só anima o que vale contar */
  const anima = !!m && alvo >= 10;
  const n = useContador(alvo, anima);

  return (
    <div>
      <div className="hero-stat-num">
        {m ? `${m[1]}${anima ? n.toLocaleString("pt-BR") : m[2]}${m[3]}` : valor}
      </div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

type Projeto = { imagem: string; link?: string; label?: string; acao?: string };

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_IG = "https://www.instagram.com/embed.js";

/* Embed oficial do Instagram: cada post vira um blockquote que o script deles
   transforma em card. Sem token, sem serviço de terceiros no meio. */
function FeedInstagram({ posts }: { posts: string[] }) {
  useEffect(() => {
    const processar = () => window.instgrm?.Embeds.process();
    if (window.instgrm) {
      processar();
      return undefined;
    }
    const script =
      document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_IG}"]`) ??
      document.body.appendChild(
        Object.assign(document.createElement("script"), { src: SCRIPT_IG, async: true })
      );
    script.addEventListener("load", processar);
    return () => script.removeEventListener("load", processar);
  }, [posts]);

  return (
    <div className="ig-grade mt-14">
      {posts.map((url, i) => (
        <Reveal key={url} delay={(i % 3) * 90} variante="scale">
          <blockquote
            className="instagram-media ig-post"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
          />
        </Reveal>
      ))}
    </div>
  );
}

/* Vitrine do serviço: com um projeto é só a imagem clicável; com vários vira
   carrossel. Um card por vez — miniaturas lado a lado nesse espaço ficariam
   ilegíveis. */
/* Sem link publicado o projeto continua aparecendo, só não vira <a>:
   link vazio é armadilha de acessibilidade e frustra quem clica. */
function Slide({ p, categoria }: { p: Projeto; categoria: string }) {
  const conteudo = (
    <>
      <img
        src={p.imagem}
        alt={p.label ? `Prévia do projeto ${p.label}` : `Exemplo de ${categoria.toLowerCase()}`}
        width={1440}
        height={1080}
        loading="lazy"
      />
      {p.label && (
        <span className="svc-mock-legenda">
          {p.label}
          {p.acao && (
            <span className="svc-mock-cta">
              {p.acao} <ArrowUpRight size={14} />
            </span>
          )}
        </span>
      )}
    </>
  );

  if (!p.link) return <div className="svc-slide">{conteudo}</div>;
  return (
    <a className="svc-slide" href={p.link} target="_blank" rel="noreferrer">
      {conteudo}
    </a>
  );
}

function Vitrine({ projetos, categoria }: { projetos: Projeto[]; categoria: string }) {
  const [i, setI] = useState(0);
  const varios = projetos.length > 1;
  const p = projetos[i]!;
  const ir = (d: number) => setI((n) => (n + d + projetos.length) % projetos.length);

  return (
    <div className="svc-mock svc-mock-link">
      <span className="tag absolute" style={{ top: 16, left: 16, background: "var(--surface)", zIndex: 2 }}>
        {categoria}
      </span>

      <Slide p={p} categoria={categoria} />

      {varios && (
        <>
          <button type="button" className="svc-seta svc-seta-ant" onClick={() => ir(-1)} aria-label="Projeto anterior">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="svc-seta svc-seta-prox" onClick={() => ir(1)} aria-label="Próximo projeto">
            <ChevronRight size={18} />
          </button>
          <div className="svc-pontos">
            {projetos.map((q, n) => (
              <button key={q.imagem} type="button" className={`svc-ponto ${n === i ? "ativo" : ""}`}
                      onClick={() => setI(n)} aria-label={`Ver ${q.label ?? `projeto ${n + 1}`}`} aria-current={n === i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================================
   ✨ ASSINATURA — a mesma interface em dois estados: wireframe e final
   ========================================================================= */
const BARS = [34, 48, 40, 62, 53, 76, 58, 68, 50, 82, 66, 92];
const STATS: [string, string, string][] = [
  ["Taxa de conversão", "12,4%", "▲ 3,8 pts"],
  ["Receita no período", "R$ 48,2 mil", "▲ 12,1%"],
  ["Sessões", "1.284", "▲ 6,4%"],
];
const ROWS: [string, string][] = [
  ["Landing page — Orça3D", "publicado"],
  ["Loja Nuvemshop — Studio Diniz", "em revisão"],
  ["Painel de operações", "em produção"],
];

function Mock({ mode }: { mode: "wire" | "ui" }) {
  const wf = mode === "wire";
  const ink = "#6f5d4d";
  const fam = wf ? "var(--font-mono)" : "var(--font-display)";
  const famNum = wf ? "var(--font-mono)" : "var(--font-num)";

  return (
    <div className={`mk ${wf ? "blueprint" : ""}`} style={{ background: wf ? undefined : "var(--surface)" }}>
      <div className="mk-rail">
        <div className={wf ? "wf" : ""} style={{
          width: 26, height: 26, borderRadius: wf ? 6 : 8,
          background: wf ? "transparent" : "var(--grad-marrom)",
        }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={wf ? "wf" : ""} style={{
            width: 20, height: 20, borderRadius: 6,
            background: wf ? "transparent" : i === 0 ? "var(--rosa)" : "var(--creme)",
          }} />
        ))}
      </div>

      <div className="mk-main">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={wf ? "spec" : "label"} style={{ fontSize: 11, color: wf ? ink : "var(--ink-soft)" }}>
              PAINEL
            </div>
            <div style={{
              fontFamily: fam, fontSize: "clamp(17px, 1.8vw, 23px)", lineHeight: 1.25,
              color: wf ? ink : "var(--titulo)", marginTop: 5,
            }}>
              {wf ? "título / h2" : "Desempenho do mês"}
            </div>
          </div>
          <div className={wf ? "wf" : "badge"}
               style={wf
                 ? { padding: "6px 11px", borderRadius: 8, fontSize: 11, fontFamily: "var(--font-mono)", color: ink, flex: "none" }
                 : { fontSize: 13, padding: "6px 12px", flex: "none" }}>
            {wf ? "badge" : "últimos 30 dias"}
          </div>
        </div>

        <div className="mk-stats">
          {STATS.map(([label, valor, delta]) => (
            <div key={label} className={wf ? "wf" : ""} style={{
              borderRadius: wf ? 8 : 10, padding: "11px 13px",
              background: wf ? "transparent" : "var(--creme)",
            }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".08em",
                textTransform: "uppercase", color: wf ? ink : "var(--ink-soft)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {wf ? "label" : label}
              </div>
              <div style={{
                fontFamily: famNum, fontWeight: wf ? 400 : 600,
                fontSize: "clamp(16px, 1.7vw, 22px)", lineHeight: 1.2, letterSpacing: "-.02em",
                marginTop: 4, color: wf ? ink : "var(--titulo)",
                fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
              }}>
                {wf ? "0,00" : valor}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3, color: wf ? ink : "#237a41" }}>
                {wf ? "+delta" : delta}
              </div>
            </div>
          ))}
        </div>

        <div className="mk-chart">
          {BARS.map((h, i) => (
            <div key={i} className={wf ? "wf" : ""} style={{
              flex: 1, height: `${h}%`, borderRadius: wf ? 4 : 6,
              background: wf ? "transparent" : i === BARS.length - 1 ? "var(--rosa-forte)" : "rgba(255,159,219,.34)",
            }} />
          ))}
        </div>

        <div className="mk-rows">
          {ROWS.map(([nome, estado]) => (
            <div key={nome} className={wf ? "wf" : ""} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: wf ? "9px 11px" : "9px 0", borderRadius: 8,
              borderTop: wf ? undefined : "1px solid var(--line)",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: 99, flex: "none",
                background: wf ? "transparent" : "var(--rosa)",
                border: wf ? `1px dashed ${ink}` : undefined,
              }} />
              <span style={{
                flex: 1, minWidth: 0, fontSize: 13, color: wf ? ink : "var(--ink)",
                fontFamily: wf ? "var(--font-mono)" : undefined,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {wf ? "linha / item" : nome}
              </span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".08em",
                textTransform: "uppercase", flex: "none", color: wf ? ink : "var(--ink-soft)",
              }}>
                {wf ? "tag" : estado}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SplitDemo() {
  const [pos, setPos] = useState(44);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r || clientX == null) return;
    setPos(Math.min(94, Math.max(6, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const up = () => (dragging.current = false);
    const mv = (e: Event) => dragging.current && move((e as unknown as PointerEvent).clientX);
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
  }, [move]);

  return (
    <div ref={box} className="split"
         onPointerDown={(e: PointerEvent<HTMLDivElement>) => { dragging.current = true; move(e.clientX); }}>
      <div className="split-layer"><Mock mode="ui" /></div>
      <div className="split-layer" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Mock mode="wire" />
      </div>

      <div className="split-tag" style={{ left: 16, color: "var(--ink-soft)" }}>design</div>
      <div className="split-tag" style={{ right: 16, color: "var(--titulo)" }}>código</div>

      <div className="split-handle" style={{ left: `${pos}%` }}>
        <div className="split-knob" role="slider" tabIndex={0}
             aria-label="Comparar wireframe e interface final"
             aria-valuenow={Math.round(pos)} aria-valuemin={6} aria-valuemax={94}
             onKeyDown={(e) => {
               if (e.key === "ArrowLeft") setPos((p) => Math.max(6, p - 4));
               if (e.key === "ArrowRight") setPos((p) => Math.min(94, p + 4));
             }}>
          <MoveHorizontal size={18} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   🏠 PÁGINA
   ========================================================================= */
export function VivieneLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const progresso = useProgressoScroll();
  const auraA = useParallax(0.12);
  const auraB = useParallax(-0.08);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div className="vd">
      {/* ================= NAVBAR FLUTUANTE ================= */}
      <div className="scroll-bar" style={{ transform: `scaleX(${progresso})` }} aria-hidden="true" />

      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap">
          <div className="nav-inner">
            <a href="#top" className="brand" onClick={(e) => { e.preventDefault(); go("top"); }}>
              <img src="/logo-viviene.png" alt="Viviene Diniz" />
            </a>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV.map(([label, id]) => (
                <a key={id} href={`#${id}`} className="nav-link"
                   onClick={(e) => { e.preventDefault(); go(id); }}>{label}</a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm hidden sm:inline-flex">
                Iniciar projeto <ArrowUpRight size={15} />
              </a>
              <button className="lg:hidden btn btn-ghost btn-sm" onClick={() => setMenu((m) => !m)}
                      aria-label="Abrir menu" aria-expanded={menu}>
                {menu ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {menu && (
            <div className="glass lg:hidden mt-2 p-4" style={{ borderRadius: "var(--r-lg)" }}>
              {NAV.map(([label, id]) => (
                <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}
                   className="block py-3 nav-link">{label}</a>
              ))}
              <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-block mt-4">
                Fale comigo <MessageCircle size={16} />
              </a>
            </div>
          )}
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section id="top" className="relative pt-32 pb-20 md:pt-36 md:pb-28">
        <div ref={auraA} className="aura aura-px" style={{ width: 460, height: 460, background: "rgba(255,159,219,.5)", top: -160, right: -120 }} />
        <div ref={auraB} className="aura aura-px" style={{ width: 380, height: 380, background: "rgba(148,103,74,.16)", top: 220, left: -170 }} />

        <div className="wrap relative">
          <Reveal>
            <div className="flex justify-center">
              <span className="badge badge-sm"><i className="dot" /> Disponível para novos projetos</span>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center mt-10">
            <div className="lg:col-span-7">
              <Reveal delay={60} variante="left">
                <p className="meta-local">Brumadinho · MG — atendo o Brasil inteiro</p>
              </Reveal>
              <Reveal delay={80} variante="left">
                <h1 className="h-xl mt-5">
                  Sites, sistemas e design que fazem o cliente{" "}
                  <span className="em">chegar até você.</span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="lead mt-7 max-w-[58ch]">
                  Desenvolvimento de sites, lojas virtuais e sistemas sob medida, cuido do design
                  das suas redes sociais. Você fala comigo do primeiro orçamento à entrega — sem
                  intermediário.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-wrap gap-3 mt-10">
                  <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <MessageCircle size={17} /> Solicitar proposta
                  </a>
                  <button className="btn btn-ghost" onClick={() => go("servicos")}>
                    Ver serviços <ArrowUpRight size={16} />
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={200} variante="right">
                <div className="hero-foto">
                  {CONFIG.foto
                    ? <picture>
                        <source srcSet="/viviene.webp" type="image/webp" />
                        <img src={CONFIG.foto} alt={`${CONFIG.nome}, designer e desenvolvedora front-end`}
                             width={520} height={613} fetchPriority="high" />
                      </picture>
                    : <div className="hero-foto-vazia">
                        <UserRound size={26} />
                        <p className="h-sm">sua foto aqui</p>
                        <p className="hint">coloque o arquivo em <code>/public</code> e preencha <code>CONFIG.foto</code></p>
                      </div>}

                  <div className="hero-stats">
                    {CONFIG.metricas.map((m) => (
                      <Metrica key={m.label} valor={m.valor} label={m.label} />
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

        </div>

        {/* faixa de habilidades — largura total, fora do .wrap */}
        {/* decorativa: as mesmas habilidades fecham a página em forma de tags */}
        <div className="marquee-wrap mt-8 md:mt-10" aria-hidden="true">
          <div className="marquee">
            <div className="marquee-viewport">
              <div className="marquee-track">
                {[0, 1].map((copia) => (
                  <div key={copia} className="flex shrink-0">
                    {FAIXA.map((h) => (
                      <span key={h} className="marquee-item">{h}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="wrap relative">
          <Reveal delay={120} variante="fade">
            <p className="statement mt-4 md:mt-6">
              Transformo ideias complexas em interfaces bonitas, rápidas e prontas para rodar.
              Do protótipo no Figma até a publicação da sua aplicação.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-12 md:mt-14">
              <SplitDemo />
              <p className="hint mt-4 text-center">arraste para ver do wireframe ao produto final</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= O QUE EU CONSTRUO ================= */}
      <section id="construo" className="sec">
        <div className="wrap">
          <div className="sec-head">
            <Reveal>
              <span className="olho">O que eu construo</span>
              <h2 className="h-lg">O que eu construo para o seu negócio</h2>
            </Reveal>
            <Reveal delay={60}>
              <p>Escopo fechado, prazo definido e entrega completa — do primeiro rascunho ao site no ar.</p>
            </Reveal>
          </div>

          <div className="build-grid mt-14">
            {CONSTRUO.map((c, i) => (
              <Reveal key={c.t} delay={(i % 2) * 90} variante="scale">
                <div className="build-card">
                  <div className="icon-box"><c.icon size={20} /></div>
                  <h3 className="h-md mt-5">{c.t}</h3>
                  <p className="body-soft mt-3">{c.d}</p>
                  <div className="build-tags">
                    {c.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SERVIÇOS ================= */}
      <section id="servicos" className="sec sec-cont">
        <div className="wrap">
          <div className="sec-head">
            <Reveal>
              <span className="olho">Serviços</span>
              <h2 className="h-lg">Quatro frentes, um só jeito de trabalhar</h2>
            </Reveal>
            <Reveal delay={60}>
              <p>Escolha pelo problema que você tem hoje. Se for mais de um, a gente combina um pacote único.</p>
            </Reveal>
          </div>

          <div className="grid gap-6 mt-16">
            {SERVICOS.map((s, i) => (
              <Reveal key={s.titulo} delay={40}>
                <div className={`svc-row ${i % 2 === 1 ? "rev" : ""}`}>
                  {"projetos" in s && s.projetos ? (
                    <Vitrine projetos={s.projetos} categoria={s.categoria} />
                  ) : (
                    <div className="svc-mock">
                      <span className="tag absolute" style={{ top: 16, left: 16, background: "var(--surface)" }}>
                        {s.categoria}
                      </span>
                      {s.mock}
                    </div>
                  )}
                  <div>
                    <h3 className="h-md">{s.titulo}</h3>
                    <p className="body-soft mt-4">{s.texto}</p>
                    <ul className="svc-list">
                      {s.itens.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                    <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-accent btn-sm mt-7">
                      <MessageCircle size={15} /> {s.cta}
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PLANOS ================= */}
      <section id="planos" className="sec" style={{ background: "var(--creme)" }}>
        <div className="wrap">
          <div className="sec-head">
            <Reveal>
              <span className="olho">Planos</span>
              <h2 className="h-lg">Escolha o ritmo que a sua rede aguenta manter</h2>
            </Reveal>
            <Reveal delay={60}>
              <p>
                Todos os pacotes são mensais, sem fidelidade. As artes saem na sua identidade visual — se você
                ainda não tem uma, a gente resolve isso antes.
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-20">
            {PLANOS.map((p, i) => (
              <Reveal key={p.nome} delay={i * 80} variante="scale">
                <div className={`plan-card ${p.pop ? "pop" : ""}`}>
                  {p.pop && <span className="plan-flag">Recomendado</span>}
                  <h3 className="plan-nome">{p.nome}</h3>
                  <p className="body-soft mt-2" style={{ fontSize: "var(--fs-sm)" }}>{p.desc}</p>
                  <p className="label mt-6">por mês</p>
                  <p className="plan-price">{p.preco}</p>
                  <ul className="plan-feats">
                    {p.itens.map((it) => (
                      <li key={it}><span className="plan-check"><Check size={12} strokeWidth={3} /></span>{it}</li>
                    ))}
                  </ul>
                  <a href={waLink} target="_blank" rel="noreferrer"
                     className="btn btn-accent btn-sm btn-block mt-6">
                    Quero esse
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-12 text-center">
              <p className="body-soft" style={{ marginInline: "auto" }}>
                Todos os pacotes incluem identidade travada, arquivo final em alta e entrega organizada por pasta.
              </p>
              <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm mt-6">
                Montar um pacote sob medida
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SOBRE ================= */}
      <section id="sobre" className="sec">
        <div className="wrap">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <Reveal variante="left">
                <div className="flex justify-center lg:justify-start">
                  <div className="foto-wrap">
                    {CONFIG.fotoSobre
                      ? <img src={CONFIG.fotoSobre} alt={CONFIG.nome} width={500} height={500} loading="lazy" />
                      : <div className="foto-vazia">
                          sua foto aqui<br />
                          <span style={{ opacity: .7 }}>CONFIG.fotoSobre</span>
                        </div>}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
            <Reveal>
              <span className="olho">Quem sou eu</span>
              <h2 className="h-lg">Duas competências raras na mesma profissional.</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lead mt-7">
                A maioria dos projetos trava no mesmo ponto: o design fica lindo no Figma e chega diferente no navegador.
                Comigo esse ponto não existe — eu desenho e eu programo. O que você aprova é exatamente o que vai para o ar.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="body-soft mt-6">
                Trabalho com marcas que precisam de mais do que um site bonito: precisam de uma presença digital que
                sustente o preço que cobram. Isso significa hierarquia visual pensada, textos que guiam a decisão e um
                código limpo, rápido e seu — documentado para crescer junto com o negócio.
              </p>
            </Reveal>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
            {SOBRE_CARDS.map(([Icon, t, d], i) => (
              <Reveal key={t} delay={i * 80} variante="scale">
                <div className="card card-hover p-6 h-full">
                  <Icon size={20} style={{ color: "var(--marrom)" }} />
                  <h3 className="h-sm mt-4">{t}</h3>
                  <p className="body-soft mt-2" style={{ fontSize: "var(--fs-sm)" }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BENEFÍCIOS ================= */}
      <section id="beneficios" className="sec sec-cont">
        <div className="wrap">
          <div className="sec-head">
            <Reveal><span className="olho">Diferenciais</span>
              <h2 className="h-lg">Por que trabalhar direto comigo</h2></Reveal>
          </div>

          <div className="benefit-grid mt-14">
            {BENEFICIOS.map((b, i) => (
              <Reveal key={b.t} delay={(i % 3) * 90} variante="scale">
                <div className="benefit-card" onPointerMove={seguirCursor}>
                  <div className="icon-box"><b.icon size={20} /></div>
                  <h3 className="h-sm mt-5">{b.t}</h3>
                  <p className="body-soft mt-2" style={{ fontSize: "var(--fs-sm)" }}>{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESSO ================= */}
      <section id="processo" className="sec" style={{ background: "var(--creme)" }}>
        <div className="wrap">
          <div className="sec-head">
            <Reveal><span className="olho">Processo</span>
              <h2 className="h-lg">Quatro etapas, zero surpresa.</h2></Reveal>
            <Reveal delay={60}>
              <p>Você acompanha cada fase e aprova antes de seguir. Nada avança sem o seu sim.</p>
            </Reveal>
          </div>

          <div className="flex flex-col gap-10 mt-14 mx-auto" style={{ maxWidth: "48rem" }}>
            {PROCESSO.map((p, i) => (
              <Reveal key={p.n} delay={i * 90}>
                <div className="relative flex gap-6">
                  {i < PROCESSO.length - 1 && <div className="step-line hidden sm:block" />}
                  <div className="step-num">{p.n}</div>
                  <div style={{ paddingTop: 2 }}>
                    <h3 className="h-sm">{p.t}</h3>
                    <p className="body-soft mt-2">{p.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="text-center mt-14">
              <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary">
                Começar pela etapa 1 <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= PORTFÓLIO (desativado) ================= */}
      {MOSTRAR_PORTFOLIO && (
        <section id="projetos" className="sec sec-cont" style={{ background: "var(--creme)" }}>
          <div className="wrap">
            <div className="sec-head">
              <Reveal><span className="olho">Portfólio</span>
                <h2 className="h-lg">Trabalhos recentes em destaque</h2></Reveal>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-14">
              {PROJETOS.map((p, i) => (
                <Reveal key={p.t} delay={(i % 2) * 90} variante="scale">
                  <a href={waLink} target="_blank" rel="noreferrer"
                     className="card card-hover block p-0 overflow-hidden h-full" style={{ textDecoration: "none", color: "inherit" }}>
                    {/* mockup — troque por <img src="..." /> do projeto real */}
                    <div className="relative" style={{
                      aspectRatio: "16/9",
                      background: "linear-gradient(135deg,#FFFFFF 0%,#F5EBE3 100%)",
                      borderBottom: "1px solid var(--line)",
                    }}>
                      <div className="absolute" style={{ inset: 0, display: "grid", placeItems: "center" }}>
                        <div style={{
                          width: "62%", height: "58%", borderRadius: "var(--r-md)", background: "var(--surface)",
                          boxShadow: "var(--shadow-sm)", padding: 14,
                        }}>
                          <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                            {["#94674A", "#FF9FDB", "#E8DED6"].map((c) => (
                              <span key={c} style={{ width: 7, height: 7, borderRadius: 99, background: c }} />
                            ))}
                          </div>
                          <div style={{ height: 8, width: "70%", borderRadius: 99, background: "var(--rosa-forte)", marginBottom: 8 }} />
                          <div style={{ height: 7, width: "90%", borderRadius: 99, background: "#F1E9E3", marginBottom: 6 }} />
                          <div style={{ height: 7, width: "55%", borderRadius: 99, background: "#F1E9E3" }} />
                        </div>
                      </div>
                      <span className="tag absolute" style={{ top: 16, left: 16, background: "var(--surface)" }}>{p.tag}</span>
                    </div>

                    <div className="p-7">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="h-md">{p.t}</h3>
                        <ArrowUpRight size={18} style={{ color: "var(--rosa-forte)", flex: "none", marginTop: 6 }} />
                      </div>
                      <p className="body-soft mt-3" style={{ fontSize: "var(--fs-sm)" }}>{p.d}</p>
                      <p className="hint mt-6">{p.stack}</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= INSTAGRAM ================= */}
      {CONFIG.instagramPosts.length > 0 && (
        <section id="instagram" className="sec sec-cont" style={{ background: "var(--creme)" }}>
          <div className="wrap">
            <div className="sec-head">
              <Reveal><span className="olho">Instagram</span>
                <h2 className="h-lg">O que saiu do estúdio nos últimos dias</h2></Reveal>
              <Reveal delay={60}>
                <p>Bastidores, entregas e processo — publicado primeiro por lá.</p>
              </Reveal>
            </div>

            <FeedInstagram posts={CONFIG.instagramPosts} />

            <Reveal delay={120}>
              <div className="text-center mt-14">
                <a href={CONFIG.instagram} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  <Marca titulo="Instagram" d={D_INSTAGRAM} size={16} /> Seguir @agencia_diiniz
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ================= FAQ ================= */}
      <section id="faq" className="sec">
        <div className="wrap">
          <div className="sec-head">
            <Reveal><span className="olho">FAQ</span>
              <h2 className="h-lg">Perguntas frequentes</h2></Reveal>
            <Reveal delay={60}>
              <p>Não achou sua dúvida? Me chame no WhatsApp — respondo pessoalmente.</p>
            </Reveal>
          </div>

          <div className="mt-14 mx-auto" style={{ maxWidth: "48rem" }}>
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <div className="faq-item">
                  <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                          aria-expanded={faqOpen === i}>
                    {f.q}
                    <Plus size={20} className={`faq-icon ${faqOpen === i ? "open" : ""}`} style={{ flex: "none" }} />
                  </button>
                  <div className={`faq-body ${faqOpen === i ? "open" : ""}`}>
                    <div>
                      <p className="body-soft" style={{ padding: "0 4px 26px 4px", margin: 0 }}>
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="sec sec-cont">
        <div className="wrap">
          <Reveal>
            <div className="relative overflow-hidden p-10 sm:p-16 text-center"
                 style={{
                   borderRadius: "var(--r-lg)",
                   background: "linear-gradient(150deg,#FFE9F6 0%,#FDF3EC 55%,#F7E3D6 100%)",
                 }}>
              <div className="aura" style={{ width: 420, height: 420, background: "rgba(255,159,219,.55)", bottom: -240, left: "50%", transform: "translateX(-50%)", opacity: .5 }} />
              <div className="relative">
                <img src="/logo-viviene.png" alt="" style={{ height: 46, margin: "0 auto 24px" }} />
                <h2 className="h-lg" style={{ maxWidth: "34ch", marginInline: "auto", textWrap: "balance" }}>
                  Pronto para transformar sua ideia em um produto digital memorável?
                </h2>
                <p className="lead mt-6" style={{ marginInline: "auto" }}>
                  Me conte o que você precisa. Em até 24h você recebe um retorno com escopo, prazo e investimento.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-10">
                  <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <MessageCircle size={17} /> Falar no WhatsApp
                  </a>
                  <a href={`mailto:${CONFIG.email}`} className="btn btn-ghost">
                    <Mail size={16} /> Enviar e-mail
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= HABILIDADES (tags) ================= */}
      <section className="pb-24">
        <div className="wrap">
          <Reveal>
            <div className="flex flex-wrap justify-center gap-2.5">
              {FAIXA.map((h) => <span key={h} className="tag">{h}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={{ borderTop: "1px solid var(--line)", paddingBlock: "56px 40px" }}>
        <div className="wrap">
          <div className="flex flex-wrap items-start justify-between gap-10">
            <div>
              <div className="brand">
                <img src="/logo-viviene.png" alt="Viviene Diniz" />
              </div>
              <p className="body-soft mt-4" style={{ fontSize: "var(--fs-sm)", maxWidth: "36ch" }}>
                Soluções criativas que conectam o físico ao digital — design e desenvolvimento front-end sob medida.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(([Icon, href, label]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                   className="card card-hover" style={{ width: 44, height: 44, borderRadius: "var(--r-sm)", display: "grid", placeItems: "center", color: "var(--ink)" }}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-7"
               style={{ borderTop: "1px solid var(--line)" }}>
            <p className="hint m-0">
              © {new Date().getFullYear()} {CONFIG.nome} — todos os direitos reservados
            </p>
            <a href={`mailto:${CONFIG.email}`} className="hint" style={{ textDecoration: "none" }}>
              {CONFIG.email}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
