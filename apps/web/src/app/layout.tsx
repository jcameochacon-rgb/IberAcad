import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthLinkHandler } from "@/components/auth-link-handler";
export const metadata: Metadata = {
  title: {
    default: "Iberdrola A · Gestión académica",
    template: "%s · Iberdrola A",
  },
  description:
    "Sistema de gestión académica para Primaria de la U.E. Iberdrola A.",
  robots: { index: false, follow: false },
  applicationName: "IberAcad",
  appleWebApp: { capable: true, title: "IberAcad", statusBarStyle: "default" },
};
export const viewport: Viewport = {
  themeColor: "#102247",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <AuthLinkHandler />
        {children}
      </body>
    </html>
  );
}
