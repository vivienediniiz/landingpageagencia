import { createFileRoute } from "@tanstack/react-router";
import { VivieneLanding } from "@/components/landing/VivieneLanding";

const TITLE = "Agencia Diniz - Desenvolvimento web";
const DESCRIPTION =
  "Agência de arte e design em Brumadinho (MG) com atendimento online para o mundo todo: social media, identidade visual, landing pages, sites, e-commerce e sistemas web.";
const SITE_URL = "https://vivienediniz.site";
const OG_IMAGE = `${SITE_URL}/logo-viviene.png`;

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "agência de arte Brumadinho, agência de design Brumadinho, social media Brumadinho, criação de artes para redes sociais, identidade visual, landing page, criação de sites, e-commerce Nuvemshop, sistemas web, designer em Minas Gerais",
      },
      { name: "author", content: "Viviene Diniz" },
      { name: "robots", content: "index, follow" },
      { name: "geo.region", content: "BR-MG" },
      { name: "geo.placename", content: "Brumadinho, Minas Gerais" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Agencia Diniz - Desenvolvimento web" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Agencia Diniz - Desenvolvimento web",
          description: DESCRIPTION,
          image: OG_IMAGE,
          url: SITE_URL + "/",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Brumadinho",
            addressRegion: "MG",
            addressCountry: "BR",
          },
          areaServed: [
            { "@type": "City", name: "Brumadinho" },
            { "@type": "State", name: "Minas Gerais" },
            { "@type": "Country", name: "Brasil" },
            { "@type": "Place", name: "Atendimento online no mundo todo" },
          ],
          knowsLanguage: ["pt-BR"],
          serviceType: [
            "Agência de arte",
            "Social media",
            "Identidade visual",
            "Landing pages",
            "Criação de sites e e-commerce",
            "Sistemas web sob medida",
          ],
        }),
      },
    ],
  }),
});

function Home() {
  return <VivieneLanding />;
}
