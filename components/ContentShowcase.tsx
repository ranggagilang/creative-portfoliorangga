"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Film, Image as ImageIcon, Play, X } from "lucide-react";
import "./ContentShowcase.css";

type MediaKind = "image" | "video";
type FrameAspect = "portrait" | "landscape";

type SocialMockup = {
  id: string;
  title: string;
  subtitle: string;
  caption: string;
  image: string;
  accent?: string;
};
type FrameItem = {
  id: string;
  title: string;
  typeLabel: string;
  aspect: FrameAspect;
  image: string; // Cover/thumbnail, bisa kosong bila pakai video langsung
  media?: string; // Khusus gambar (opsional); video tidak lagi disimpan di project
  href?: string; // Isi link Google Drive video (https://drive.google.com/file/d/.../view)
  format: MediaKind;
  description: string;
};

// ============================================================
// ISI SEMUA KARYA CONTENT DI SINI SAJA
// Taruh file di public/content/
// ============================================================
const SOCIAL_MOCKUPS: SocialMockup[] = [
  {
    id: "social-01",
    title: "Video Tiktok",
    subtitle: "@mymaren / handled by me",
    caption: "TikTok Content Management & Video Editing",
    image: "/content/fanbase.jpeg",
    accent: "Content / Feed",
  },
  {
    id: "social-02",
    title: "Akun Tiktok",
    subtitle: "Short-form content",
    caption: "Following Accounts Tiktok",
    image: "/content/foll.jpeg",
    accent: "Vertical / Social",
  },
  {
    id: "social-03",
    title: "Video Tiktok Game",
    subtitle: "@regysu / handled by me",
    caption: "TikTok Content Management & Video Editing",
    image: "/content/gem.jpeg",
    accent: "Content / Game",
  },
];
const CONTENT_FRAMES: FrameItem[] = [
  {
    id: "landscape-01",
    title: "Short Film Scene",
    typeLabel: "LANDSCAPE 01",
    aspect: "landscape",
    image: "",
    href: "https://drive.google.com/drive/folders/1Qln5HqVM9RuOIHO04yvEyJA3gjuF1MDs?usp=drive_link", // TEMPEL LINK GOOGLE DRIVE VIDEO DI SINI
    format: "video",
    description: "Video landscape short film, menggabungkan teknik pengambilan video dan editing",
  },
  {
    id: "portrait-01",
    title: "Reels / TikTok 01",
    typeLabel: "PORTRAIT 01",
    aspect: "portrait",
    image: "",
    href: "https://drive.google.com/drive/folders/1Qln5HqVM9RuOIHO04yvEyJA3gjuF1MDs?usp=drive_link", // TEMPEL LINK GOOGLE DRIVE VIDEO DI SINI
    format: "video",
    description: "Konten vertical dengan pacing cepat dan hook yang kuat.",
  },
  {
    id: "portrait-02",
    title: "Reels / TikTok 02",
    typeLabel: "PORTRAIT 02",
    aspect: "portrait",
    image: "",
    href: "https://drive.google.com/drive/folders/1Qln5HqVM9RuOIHO04yvEyJA3gjuF1MDs?usp=drive_link", // TEMPEL LINK GOOGLE DRIVE VIDEO DI SINI
    format: "video",
    description: "Konten review tempat untuk social media.",
  },
  {
    id: "landscape-02",
    title: "GMV / Video Edit",
    typeLabel: "LANDSCAPE 02",
    aspect: "landscape",
    image: "",
    href: "https://drive.google.com/drive/folders/1Qln5HqVM9RuOIHO04yvEyJA3gjuF1MDs?usp=drive_link", // TEMPEL LINK GOOGLE DRIVE VIDEO DI SINI
    format: "video",
    description: "GMV, montage, atau video edit dengan beat sync.",
  },
  {
    id: "portrait-03",
    title: "A day in my life",
    typeLabel: "PORTRAIT 03",
    aspect: "portrait",
    image: "",
    href: "https://drive.google.com/drive/folders/1Qln5HqVM9RuOIHO04yvEyJA3gjuF1MDs?usp=drive_link", // TEMPEL LINK GOOGLE DRIVE VIDEO DI SINI
    format: "video",
    description: "Konten personal yang menampilkan perjalanan sehari-hari.",
  },
];
function MediaPreview({ src, alt, className, kind }: { src: string; alt: string; className?: string; kind: MediaKind }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = Boolean(src) && failedSrc === src;
  if (src && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} loading="eager" decoding="async" draggable={false}
      onError={() => { console.error(`[ContentShowcase] Gagal memuat gambar: ${src}`); setFailedSrc(src); }} />;
  }
  return (
    <div className={`content-showcase__placeholder ${className ?? ""}`} aria-label={failed ? `Gambar tidak dapat dimuat: ${src}` : `Belum ada gambar untuk ${alt}`}>
      <span className="content-showcase__placeholder-badge">{failed ? "GAMBAR GAGAL DIMUAT" : "VIDEO DI DRIVE"}</span>
      {kind === "video" ? <Film size={28} strokeWidth={1.5} /> : <ImageIcon size={28} strokeWidth={1.5} />}
      <span className="content-showcase__placeholder-text">{failed ? src : "Redirect ke Google Drive"}</span>
    </div>
  );
}
export default function ContentShowcase() {
  const reduce = useReducedMotion();
  const [activePhone, setActivePhone] = useState(0);
  const [activeWork, setActiveWork] = useState<FrameItem | null>(null);
  useEffect(() => {
    if (!activeWork) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveWork(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeWork]);
  const currentMockup = SOCIAL_MOCKUPS[activePhone] ?? SOCIAL_MOCKUPS[0];
  const nextMockup = useMemo(() => SOCIAL_MOCKUPS[(activePhone + 1) % SOCIAL_MOCKUPS.length] ?? SOCIAL_MOCKUPS[0], [activePhone]);
  const handlePrev = () => setActivePhone((prev) => (prev - 1 + SOCIAL_MOCKUPS.length) % SOCIAL_MOCKUPS.length);
  const handleNext = () => setActivePhone((prev) => (prev + 1) % SOCIAL_MOCKUPS.length);
  const landscapes = CONTENT_FRAMES.filter((item) => item.aspect === "landscape");
  const portraits = CONTENT_FRAMES.filter((item) => item.aspect === "portrait");
  const openWork = (item: FrameItem) => {
    // Link Drive sengaja masih kosong sampai kamu upload dan bagikan videonya.
    if (item.format === "video" && /^https:\/\/drive\.google\.com\//i.test(item.href ?? "")) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    setActiveWork(item);
  };
  return (
    <main className="content-showcase">
      <div className="content-showcase__noise" aria-hidden="true" />
      <div className="content-showcase__blob content-showcase__blob--one" aria-hidden="true" />
      <div className="content-showcase__blob content-showcase__blob--two" aria-hidden="true" />
      <div className="content-showcase__wrap">
        <motion.header
          className="content-showcase__header"
          initial={reduce ? false : { opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="content-showcase__eyebrow">CONTENT / CREATIVE ARCHIVE</p>
            <h1 className="content-showcase__title">Content <span>showcase.</span></h1>
            <p className="content-showcase__intro">
              Kumpulan karya kreatif yang mencakup pengelolaan konten TikTok, video editing, hingga produksi konten visual dalam format portrait dan landscape. Setiap karya menampilkan eksplorasi storytelling, kreativitas penyuntingan, dan pengalaman mengembangkan konten untuk berbagai kebutuhan digital.
            </p>
          </div>
          <div className="content-showcase__mini-note">
            <span>CURATED VIEW</span>
            <p>Menggabungkan kreativitas, visual storytelling, dan teknik editing untuk menciptakan konten yang tidak hanya menarik secara visual, tetapi juga mampu menyampaikan pesan dengan efektif.</p>
          </div>
        </motion.header>
        <section className="content-showcase__board" aria-label="Content portfolio board">
          <motion.div
            className="content-showcase__left"
            initial={reduce ? false : { opacity: 0, y: 38, scale: 0.975 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: reduce ? 0 : 0.65, delay: reduce ? 0 : 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="content-showcase__section-title">
              <span className="content-showcase__pill">SOCIAL MEDIA</span>
              <h2>Accounts & social content</h2>
              <p>Portofolio konten TikTok yang menampilkan pengalaman dalam video editing, pengembangan konten kreatif.</p>
            </div>
            <div className="content-showcase__phones">
              <div className="content-showcase__phone-stack" aria-hidden="true">
                <div className="content-showcase__phone content-showcase__phone--back">
                  <div className="content-showcase__phone-notch" />
                  <div className="content-showcase__phone-screen">
                    <MediaPreview key={nextMockup.id} src={nextMockup?.image ?? ""} alt={nextMockup?.title ?? "Next social content"} className="content-showcase__phone-media" kind="image" />
                  </div>
                </div>
              </div>
              <motion.div
                key={currentMockup.id}
                initial={reduce ? false : { opacity: 0, x: 18, rotate: -1.5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: reduce ? 0 : 0.35 }}
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.23}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -52 || info.velocity.x < -420) handleNext();
                  else if (info.offset.x > 52 || info.velocity.x > 420) handlePrev();
                }}
                tabIndex={0}
                role="group"
                aria-label={`Mockup ${activePhone + 1} dari ${SOCIAL_MOCKUPS.length}. Geser ke kiri atau kanan untuk mengganti.`}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") { event.preventDefault(); handlePrev(); }
                  if (event.key === "ArrowRight") { event.preventDefault(); handleNext(); }
                }}
                className="content-showcase__phone content-showcase__phone--front content-showcase__phone--swipe"
              >
                <div className="content-showcase__phone-notch" />
                <div className="content-showcase__phone-screen">
                  <div className="content-showcase__phone-topbar">
                    <span>{currentMockup.accent}</span>
                    <b>{String(activePhone + 1).padStart(2, "0")} / {String(SOCIAL_MOCKUPS.length).padStart(2, "0")}</b>
                  </div>
                  <MediaPreview key={currentMockup.id} src={currentMockup.image} alt={currentMockup.title} className="content-showcase__phone-media" kind="image" />
                  <div className="content-showcase__phone-meta">
                    <h3>{currentMockup.title}</h3>
                    <p>{currentMockup.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            </div>
              <div className="content-showcase__controls content-showcase__controls--swipe">
                <div className="content-showcase__dots" aria-label={`Slide ${activePhone + 1} dari ${SOCIAL_MOCKUPS.length}`}>
                  {SOCIAL_MOCKUPS.map((item, index) => (
                    <span key={item.id} className={index === activePhone ? "is-active" : ""} />
                  ))}
                </div>
                <span className="content-showcase__swipe-hint">← Geser HP untuk melihat konten lainnya →</span>
              </div>
            <div className="content-showcase__left-caption">
              <strong>{currentMockup.caption}</strong>
              <span>
                Berpengalaman dalam mengedit konten video pendek untuk
                platform TikTok, mulai dari pemilihan cuplikan hingga
                penyuntingan visual. Salah satu video yang dikerjakan
                berhasil mencapai <b>18,6 juta penayangan</b>.
              </span>
            </div>
          </motion.div>
          <motion.div
            className="content-showcase__right"
            initial={reduce ? false : { opacity: 0, y: 44, scale: 0.975 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: reduce ? 0 : 0.67, delay: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="content-showcase__section-title content-showcase__section-title--right">
              <span className="content-showcase__pill">SELECTED FRAMES</span>
              <h2>Portrait & landscape showcase</h2>
              <p>Kumpulan karya video editing dalam berbagai format, mulai dari konten vertikal untuk media sosial hingga video sinematik dan gaming montage, dengan fokus pada kreativitas visual, ritme editing, dan storytelling.</p>
            </div>
            <div className="content-showcase__frame-grid">
              {landscapes[0] && (
                <motion.article className="content-showcase__frame content-showcase__frame--landscape content-showcase__frame--top" initial={reduce ? false : { opacity: 0, y: 25, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.1 }}>
                  <button type="button" className="content-showcase__frame-media content-showcase__frame-button" onClick={() => openWork(landscapes[0])} aria-label={`Buka ${landscapes[0].title}`}>
                    <MediaPreview src={landscapes[0].image || ""} alt={landscapes[0].title} className="content-showcase__frame-image" kind={landscapes[0].format} />
                    <span className="content-showcase__frame-chip">{landscapes[0].typeLabel}</span>
                    {landscapes[0].format === "video" && <span className="content-showcase__play"><Play size={16} fill="currentColor" /></span>}
                  </button>
                  <div className="content-showcase__frame-caption">
                    <h3>{landscapes[0].title}</h3>
                    <p>{landscapes[0].description}</p>
                  </div>
                </motion.article>
              )}
              {portraits.map((item, index) => (
                <motion.article key={item.id} className={`content-showcase__frame content-showcase__frame--portrait content-showcase__frame--portrait-${index + 1}`} initial={reduce ? false : { opacity: 0, y: 25, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.15 + index * 0.07 }}>
                  <button type="button" className="content-showcase__frame-media content-showcase__frame-button" onClick={() => openWork(item)} aria-label={`Buka ${item.title}`}>
                    <MediaPreview src={item.image || ""} alt={item.title} className="content-showcase__frame-image" kind={item.format} />
                    <span className="content-showcase__frame-chip">{item.typeLabel}</span>
                    {item.format === "video" ? <span className="content-showcase__play"><Play size={16} fill="currentColor" /></span> : <span className="content-showcase__play content-showcase__play--still"><ArrowUpRight size={15} /></span>}
                  </button>
                  <div className="content-showcase__frame-caption">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </motion.article>
              ))}
              {landscapes[1] && (
                <motion.article className="content-showcase__frame content-showcase__frame--landscape content-showcase__frame--bottom" initial={reduce ? false : { opacity: 0, y: 25, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.22 }}>
                  <button type="button" className="content-showcase__frame-media content-showcase__frame-button" onClick={() => openWork(landscapes[1])} aria-label={`Buka ${landscapes[1].title}`}>
                    <MediaPreview src={landscapes[1].image || ""} alt={landscapes[1].title} className="content-showcase__frame-image" kind={landscapes[1].format} />
                    <span className="content-showcase__frame-chip">{landscapes[1].typeLabel}</span>
                    {landscapes[1].format === "video" && <span className="content-showcase__play"><Play size={16} fill="currentColor" /></span>}
                  </button>
                  <div className="content-showcase__frame-caption">
                    <h3>{landscapes[1].title}</h3>
                    <p>{landscapes[1].description}</p>
                  </div>
                </motion.article>
              )}
            </div>
          </motion.div>
        </section>
        {activeWork && (
          <div className="content-showcase__modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveWork(null); }}>
            <section className="content-showcase__modal" role="dialog" aria-modal="true" aria-label={activeWork.title}>
              <div className="content-showcase__modal-head">
                <div><span>{activeWork.typeLabel}</span><h2>{activeWork.title}</h2></div>
                <button type="button" autoFocus aria-label="Tutup preview" onClick={() => setActiveWork(null)}><X size={22} /></button>
              </div>
              {activeWork.format === "video" ? (
                <div className="content-showcase__modal-empty">
                  Video akan dibuka melalui Google Drive. Isi <code>href</code> pada item ini di <code>CONTENT_FRAMES</code> setelah video diunggah dan aksesnya disetel ke <strong>Siapa saja yang memiliki link</strong>.
                </div>
              ) : activeWork.format === "image" && (activeWork.media || activeWork.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeWork.media || activeWork.image} alt={activeWork.title} className="content-showcase__modal-media" />
              ) : (
                <div className="content-showcase__modal-empty">Isi <code>image</code> dengan path gambar pada <code>CONTENT_FRAMES</code>.</div>
              )}
              <p>{activeWork.description}</p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
