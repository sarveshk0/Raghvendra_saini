import swaggerSpec from "../../lib/swaggerSpec";

export const metadata = {
  title: `${swaggerSpec.info.title} — API Docs`,
  description: swaggerSpec.info.description,
  robots: { index: false, follow: false },
};

export default function ApiDocsLayout({ children }) {
  return children;
}
