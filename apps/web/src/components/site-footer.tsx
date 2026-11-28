"use client";
import { ContactLinks } from "./contact-links";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
export function SiteFooter() {
  const path = usePathname();
  if (
    [
      "/auth/invitacion",
      "/registro",
      "/registrar",
      "/register",
      "/recuperar-clave",
      "/actualizar-clave",
    ].some((p) => path.startsWith(p))
  )
    return null;
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Brand dark />
          <p>
            Aprendemos juntos.
            <br />
            Construimos el futuro.
          </p>
          <p>
            Unidad Educativa Iberdrola A<br />
            El Alto · La Paz · Bolivia
          </p>
        </div>
        <div>
          <h2>Hablemos</h2>
          <ContactLinks />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} U.E. Iberdrola A</span>
        <span>IberAcad · Gestión académica institucional</span>
      </div>
    </footer>
  );
}
