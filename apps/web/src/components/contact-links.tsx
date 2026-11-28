import { Mail, MessageCircle } from "lucide-react";
export function ContactLinks() {
  return (
    <div className="contact-links">
      <a href="mailto:unidadeducativaiberdrolaa@gmail.com">
        <Mail size={20} />
        <span>unidadeducativaiberdrolaa@gmail.com</span>
      </a>
      <a
        href="https://wa.me/59174075453"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={20} />
        <span>WhatsApp · 74075453</span>
      </a>
      <a
        href="https://www.facebook.com/p/Unidad-Educativa-Iberdrola-A-61571717954342/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M14 21v-8h3l.5-4H14V7c0-1 .3-2 2-2h2V1h-3c-3.5 0-5 2.2-5 5v3H7v4h3v8z" />
        </svg>
        <span>Iberdrola A en Facebook</span>
      </a>
    </div>
  );
}
