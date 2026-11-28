"use client";
import { useEffect, useRef } from "react";
export function ScrollExperience({
  scene,
  title,
}: {
  scene: string;
  title: string;
}) {
  const ref = useRef<HTMLElement>(null),
    frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    let raf = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const p = reduced.matches
        ? 0.4
        : Math.max(
            0.035,
            Math.min(
              0.98,
              -el.getBoundingClientRect().top /
                Math.max(1, el.offsetHeight - innerHeight + 80),
            ),
          );
      frame.current?.contentWindow?.postMessage(
        { type: "iberacad.scene", progress: p },
        "*",
      );
    };
    const scroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("resize", scroll);
    const iframe = frame.current;
    iframe?.addEventListener("load", update);
    update();
    return () => {
      removeEventListener("scroll", scroll);
      removeEventListener("resize", scroll);
      iframe?.removeEventListener("load", update);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <section className="scroll-experience" ref={ref} aria-label={title}>
      <div className="experience-sticky">
        <iframe
          ref={frame}
          src={`/experiencias/${scene}.html`}
          title={title}
          sandbox="allow-scripts"
          tabIndex={-1}
        />
        <a className="experience-next" href={`#despues-${scene}`}>
          Continuar explorando ↓
        </a>
      </div>
      <div id={`despues-${scene}`} className="experience-end" />
    </section>
  );
}
