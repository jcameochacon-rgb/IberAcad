import type { MetadataRoute } from "next";

/** Permite instalar IberAcad en el celular como una app (pantalla de inicio). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IberAcad · U.E. Iberdrola A",
    short_name: "IberAcad",
    description:
      "Sistema de gestión académica de Primaria de la U.E. Iberdrola A.",
    lang: "es",
    start_url: "/panel",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#102247",
    icons: [
      { src: "/app-icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/app-icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/app-icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
