"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronRight, PenTool as Figma, Image as ImageIcon, X } from "lucide-react";
import "./UiuxShowcase.css";
import StudioDevice from "./StudioDevice";

/* ==============================================================
   EDIT DATA PROJECT KAMU DI SINI
   Gambar taruh di public/uiux/ (contoh: public/uiux/hero.png).
   Link figma harus URL lengkap https://... ; jika kosong tombol nonaktif.
   ============================================================== */
const FEATURED_PROJECT = {
  title: "OutFind",
  tagline: "Temukan outfit yang cocok, lebih mudah dan personal.",
  description:
    "OutFind adalah konsep aplikasi fashion yang saya rancang untuk membantu pengguna memilih pakaian sesuai gaya dan kebutuhan. Desainnya mencakup rekomendasi outfit, lemari digital, Outfit Canvas, serta konsep OutAI dan OutCamera untuk personalisasi dan virtual try-on. Saya mengembangkan alur pengguna, wireframe, antarmuka, dan prototipe interaktif, kemudian mengumpulkan masukan dari calon pengguna melalui uji coba.",
  role: "UI/UX Designer",
  scope: "User Flow · Wireframe · UI Design · Prototype · Uji Coba",
  platform: "Mobile App Concept",
  tools: ["Figma", "UI Design", "Prototyping"],
  image: "/content/outfind.png", // isi dengan screenshot OutFind, contoh: "/uiux/outfind-home.png"
  secondImage: "", // opsional screenshot kedua: "/uiux/outfind-profile.png"
  figmaUrl: "https://www.figma.com/proto/8lpWkGGg3Q9POTDxMyo1Jg/Project-UTS-IMK?node-id=433-493&node-type=frame&t=H3vkivZOLLRxP0jF-1&scaling=scale-down&content-scaling=fixed&page-id=9%3A143&starting-point-node-id=433%3A493",
};

type MiniProject = {
  id: string;
  title: string;
  kind: string;
  note: string;
  image: string;
  link: string;
  color: string;
};

const OTHER_PROJECTS: MiniProject[] = [
  { id: "01", title: "UI/UX HRIS App", kind: "Mobile UI", note: "Deskripsikan rancangan UI ini dan eksplorasi desainnya.", image: "/content/login.png", link: "https://www.figma.com/design/gSpfyw7TOlOYZk8tLqTkEk/PROJECT-HRIS--34?node-id=1-2&t=do9UaXjbcoWcHrH3-1", color: "#d7ef91" },
  { id: "02", title: "UI/UX Bid Perfect (Lelang App)", kind: "Web UI", note: "Deskripsikan rancangan UI ini dan eksplorasi desainnya.", image: "/content/bid.png", link: "https://www.figma.com/design/0UaqM5NZx8XOIFRRIlgnBD/Lelang-Bid-Perfect?node-id=2312-4&t=ZlbtipgowgFHwoSC-1", color: "#fbd49b" },
  { id: "03", title: "UI/UX NimoBaby App", kind: "Dashboard", note: "Deskripsikan rancangan UI ini dan eksplorasi desainnya.", image: "/content/nimo.png", link: "https://www.figma.com/design/uOALLXg5MLZeqymW0KoHQH/NimoBaby-App?node-id=142-1854&t=NWw60SNax1SwKF7g-1", color: "#cdbdea" },
  { id: "04", title: "UI/UX Siparkir App", kind: "Mobile UI", note: "Deskripsikan rancangan UI ini dan eksplorasi desainnya.", image: "/content/siparkir.png", link: "https://www.figma.com/design/etuHxJMj6vROA8f6b4meZY/Integrasi-Aplikasi-Informasi?node-id=8-585&t=nRS3BwpzOPPtzuzM-1", color: "#a8e1d0" },
  { id: "05", title: "UI/UX Applywise App", kind: "Exploration", note: "Deskripsikan rancangan UI ini dan eksplorasi desainnya.", image: "/content/appwise.png", link: "https://www.figma.com/design/DDunyZfWetrkVXtqrrBnug/Applywise?node-id=0-1&t=Wt3i69QujNcg4N6K-1", color: "#fac4ad" },
];


// POSTER & GRAPHIC DESIGN — ganti image, judul dan deskripsi sesuai karya asli.
// Letakkan poster di public/uiux/posters/. Gunakan ratio "4:5" atau "A4".
type PosterWork = {
  id: string;
  title: string;
  image: string;
  ratio: "4:5" | "A4";
  description: string;
};

const POSTER_WORKS: PosterWork[] = [
  { id: "poster-01", title: "Poster Edukasi", image: "/content/01.png", ratio: "A4", description: "Desain poster untuk kebutuhan acara dan publikasi." },
  { id: "poster-02", title: "Poster Edukasi", image: "/content/02.png", ratio: "4:5", description: "Eksplorasi komposisi, warna, dan tipografi untuk konten digital." },
  { id: "poster-03", title: "Cover Buku", image: "/content/03.png", ratio: "4:5", description: "Konsep poster promosi dengan pendekatan visual yang komunikatif." },
  { id: "poster-04", title: "Poster Kreatif ", image: "/content/04.png", ratio: "A4", description: "Penyampaian informasi melalui visual yang terstruktur." },
  { id: "poster-05", title: "Poster Kreatif", image: "/content/05.png", ratio: "4:5", description: "Eksplorasi visual dan layout untuk karya desain grafis." },
  { id: "poster-06", title: "Poster Editorial", image: "/content/06.png", ratio: "A4", description: "Eksperimen tipografi dan elemen visual untuk poster editorial." },
  { id: "poster-07", title: "Poster Informasi", image: "/content/07.png", ratio: "A4", description: "Eksperimen tipografi dan elemen visual untuk poster editorial." },
];

function PosterTile({ poster, onOpen, duplicate = false }: { poster: PosterWork; onOpen: (poster: PosterWork) => void; duplicate?: boolean }) {
  return (
    <button
      type="button"
      className={`ux-poster__tile ${poster.ratio === "A4" ? "ux-poster__tile--a4" : "ux-poster__tile--four-five"}`}
      onClick={() => onOpen(poster)}
      tabIndex={duplicate ? -1 : 0}
      aria-hidden={duplicate || undefined}
      aria-label={`Lihat poster ${poster.title}`}
    >
      <div className="ux-poster__art">
        {poster.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster.image} alt={duplicate ? "" : poster.title} draggable={false} loading="lazy" />
        ) : (
          <div className="ux-poster__empty" aria-hidden="true">
            <ImageIcon size={28} strokeWidth={1.4} />
            <span>Tambahkan poster</span>
            <small>{poster.ratio === "A4" ? "A4" : "4:5"}</small>
          </div>
        )}
      </div>
      <span className="ux-poster__tile-title">{poster.title}<ArrowUpRight size={15} /></span>
    </button>
  );
}

function PosterRow({ posters, reverse, onOpen, staticMotion }: { posters: PosterWork[]; reverse?: boolean; onOpen: (poster: PosterWork) => void; staticMotion: boolean }) {
  return (
    <div className="ux-poster__viewport">
      <div className={`ux-poster__track ${reverse ? "ux-poster__track--reverse" : ""} ${staticMotion ? "ux-poster__track--still" : ""}`}>
        {[false, true].map(duplicate => (
          <div className="ux-poster__set" key={String(duplicate)} aria-hidden={duplicate || undefined}>
            {[...posters, ...posters].map((poster, index) => <PosterTile key={`${poster.id}-${index}`} poster={poster} onOpen={onOpen} duplicate={duplicate} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function isExternalLink(url: string): boolean {
  return /^https:\/\/\S+/i.test(url.trim());
}

function ProjectImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) {
    return (
      <div className={`ux-showcase__image-empty ${className}`} role="img" aria-label={`${alt} — belum ada gambar`}>
        <ImageIcon size={29} strokeWidth={1.4} />
        <span>Tambahkan gambar project</span>
              </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} draggable={false} onError={() => setFailed(true)} />;
}

export default function UiuxShowcase() {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<MiniProject | null>(null);
  const [selectedPoster, setSelectedPoster] = useState<PosterWork | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  useEffect(() => {
    if (!selectedPoster) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSelectedPoster(null); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedPoster]);

  const reveal = (delay: number) => ({
    initial: reduceMotion ? false as const : { opacity: 0, y: 25, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  return (
    <main className="ux-showcase" aria-label="UI UX highlight project">
      <div className="ux-showcase__texture" aria-hidden="true" />
      <div className="ux-showcase__stage">

        <div className="ux-showcase__hero">
          <div className="ux-showcase__copy">
            <motion.div {...reveal(0.08)}>
              <h1>{FEATURED_PROJECT.title}<span>.</span></h1>
              <h2>{FEATURED_PROJECT.tagline}</h2>
              <p className="ux-showcase__desc">{FEATURED_PROJECT.description}</p>
            </motion.div>

            <motion.div {...reveal(0.18)} className="ux-showcase__details">
              <strong>{FEATURED_PROJECT.role}</strong>
              <strong>{FEATURED_PROJECT.platform}</strong>
              <strong>{FEATURED_PROJECT.scope}</strong>
            </motion.div>

            <motion.div {...reveal(0.24)} className="ux-showcase__actions">
              {isExternalLink(FEATURED_PROJECT.figmaUrl) ? (
                <a className="ux-showcase__figma" href={FEATURED_PROJECT.figmaUrl} target="_blank" rel="noopener noreferrer">
                  <Figma size={17} aria-hidden="true" /> View Figma Prototype <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              ) : (
                <span className="ux-showcase__figma ux-showcase__figma--disabled" title="Isi FEATURED_PROJECT.figmaUrl untuk mengaktifkan" aria-disabled="true">
                  <Figma size={17} aria-hidden="true" /> View Figma Prototype
                </span>
              )}
              <div className="ux-showcase__tooltags" aria-label="Design tools">
                {FEATURED_PROJECT.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </motion.div>

            <motion.div {...reveal(0.30)} className="ux-showcase__other">
              <div className="ux-showcase__other-heading">
                <div>
                  <h3>Other explorations</h3>
                </div>
              </div>
              <div className="ux-showcase__mini-grid">
                {OTHER_PROJECTS.map((project) => (
                  <button key={project.id} className="ux-showcase__mini" type="button" onClick={() => setSelected(project)} aria-label={`Lihat ${project.title}`}>
                    <span className="ux-showcase__mini-copy"><strong>{project.title}</strong></span>
                    <ChevronRight size={15} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div {...reveal(0.15)} className="ux-showcase__visual" aria-label="Mockup aplikasi highlight">
            <div className="ux-showcase__circle ux-showcase__circle--outer" aria-hidden="true" />
            <div className="ux-showcase__circle ux-showcase__circle--middle" aria-hidden="true" />
            <div className="ux-showcase__circle ux-showcase__circle--inner" aria-hidden="true" />
            <div className="ux-showcase__orbit-dot ux-showcase__orbit-dot--a" aria-hidden="true" />
            <div className="ux-showcase__orbit-dot ux-showcase__orbit-dot--b" aria-hidden="true" />
            {FEATURED_PROJECT.secondImage && (
              <div className="ux-showcase__studio-slot ux-showcase__studio-slot--back" aria-hidden="true">
                <StudioDevice image={FEATURED_PROJECT.secondImage} alt="Layar aplikasi pendamping" width={175} secondary />
              </div>
            )}
            <div className="ux-showcase__studio-slot ux-showcase__studio-slot--front">
              <StudioDevice image={FEATURED_PROJECT.image} alt={`Tampilan ${FEATURED_PROJECT.title}`} width={215} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Poster & graphic design: galeri 2 baris bergerak berlawanan tanpa jeda. */}
      <section className="ux-poster" aria-labelledby="ux-poster-title">
        <motion.div
          className="ux-poster__heading"
          initial={reduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
        >
          <div>
            <h2 id="ux-poster-title">Poster &amp; <em>Graphic Design</em></h2>
            <p>
              Selain merancang antarmuka aplikasi, saya juga mengeksplorasi desain poster untuk
              publikasi, acara, dan konten digital. Saya mengolah komposisi, warna, dan tipografi
              agar pesan tersampaikan dengan jelas dan menarik.
            </p>
          </div>
        </motion.div>
        <div className="ux-poster__gallery" aria-label="Galeri karya poster bergerak">
          {/* Entrance animation terpisah dari CSS marquee supaya loop tetap seamless. */}
          <motion.div
            className="ux-poster__reveal-row"
            initial={reduceMotion ? false : { opacity: 0, x: -72, y: 22, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: reduceMotion ? 0 : 0.82, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <PosterRow posters={POSTER_WORKS.slice(0, 3)} onOpen={setSelectedPoster} staticMotion={!!reduceMotion} />
          </motion.div>
          <motion.div
            className="ux-poster__reveal-row"
            initial={reduceMotion ? false : { opacity: 0, x: 72, y: 28, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: reduceMotion ? 0 : 0.86, delay: reduceMotion ? 0 : 0.23, ease: [0.22, 1, 0.36, 1] }}
          >
            <PosterRow posters={POSTER_WORKS.slice(3)} onOpen={setSelectedPoster} reverse staticMotion={!!reduceMotion} />
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedPoster && (
          <motion.div className="ux-showcase__overlay" role="presentation"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onMouseDown={e => { if (e.target === e.currentTarget) setSelectedPoster(null); }}>
            <motion.section className="ux-showcase__dialog ux-poster__dialog"
              role="dialog" aria-modal="true" aria-label={selectedPoster.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}>
              <div className="ux-showcase__dialog-head">
                <h2>{selectedPoster.title}</h2>
                <button type="button" aria-label="Tutup poster" onClick={() => setSelectedPoster(null)}><X size={20} /></button>
              </div>
              <div className="ux-poster__dialog-art">
                {selectedPoster.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedPoster.image} alt={selectedPoster.title} />
                ) : (
                  <div className="ux-poster__empty"><ImageIcon size={35} /><span>Isi gambar di POSTER_WORKS</span></div>
                )}
              </div>
              <p>{selectedPoster.description}</p>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.div className="ux-showcase__overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.section className="ux-showcase__dialog" role="dialog" aria-modal="true" aria-label={selected.title} initial={reduceMotion ? false : { y: 25, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 15, opacity: 0, scale: 0.98 }}>
              <div className="ux-showcase__dialog-head"><div><h2>{selected.title}</h2></div><button type="button" onClick={() => setSelected(null)} aria-label="Tutup project"><X size={21}/></button></div>
              <div className="ux-showcase__dialog-visual"><ProjectImage src={selected.image} alt={selected.title} className="ux-showcase__dialog-img" /></div>
              <p>{selected.note}</p>
              {isExternalLink(selected.link) ? <a className="ux-showcase__dialog-link" href={selected.link} target="_blank" rel="noopener noreferrer">Lihat karya <ArrowUpRight size={16}/></a> : <p className="ux-showcase__dialog-hint">Isi link project ini pada OTHER_PROJECTS bila sudah tersedia.</p>}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
