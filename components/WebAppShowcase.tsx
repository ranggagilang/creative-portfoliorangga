"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, ImageIcon, Layers3 } from "lucide-react";
import "./WebAppShowcase.css";

type WebProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  role: string;
  stack: string[];
  image: string;
  websiteUrl: string;
  repositoryUrl?: string;
  accent: string;
};

// GANTI DATA 3 PROYEK WEB ASLIMU DI SINI.
// Screenshot simpan di public/projects/web/, misalnya public/projects/web/web-01.png.
// Link kosong = tombol otomatis tidak ditampilkan (tidak ada link palsu).
const WEB_PROJECTS: WebProject[] = [
  {
    id: "web-01",
    title: "Web Application HRIS",
    category: "Frontend Development / WEB APP",
    description: "Mengembangkan tampilan antarmuka dan pengalaman pengguna untuk aplikasi web HRIS, termasuk implementasi desain responsif dan interaksi dinamis.",
    role: "Frontend Development",
    stack: ["Next.js", "JavaScript", "Responsive UI"],
    image: "/content/web1.png",
    websiteUrl: "https://workify-fe.vercel.app/login",
    repositoryUrl: "https://github.com/Workify-HRIS",
    accent: "#56E1E9",
  },
  {
    id: "web-02",
    title: "Web Application ICIEE UNTIRTA",
    category: "WEB PLATFORM / PRODUCT",
    description: "Membuat tampilan antarmuka dan pengalaman pengguna untuk platform web ICIEE UNTIRTA, termasuk implementasi desain responsif dan interaksi dinamis.",
    role: "Web Development",
    stack: ["React", "UI Implementation", "API"],
    image: "/content/web2.png",
    websiteUrl: "https://www.icieeuntirta.com/",
    repositoryUrl: "",
    accent: "#BB63FF",
  },
  {
    id: "web-03",
    title: "Web Application SIMAJU Untirta",
    category: "DASHBOARD / WEB SYSTEM",
    description: "Membuat aplikasi fullstack untuk keperluan kerja praktik mahasiswa, termasuk pengembangan antarmuka, interaksi pengguna, dan integrasi sistem backend.",
    role: "Frontend & UI",
    stack: ["TypeScript", "Dashboard", "Responsive UI"],
    image: "/content/web3.png",
    websiteUrl: "",
    repositoryUrl: "https://github.com/ranggagilang/SIMAJU",
    accent: "#5B58EB",
  },
];

const spring = { type: "spring" as const, stiffness: 250, damping: 28, mass: 0.9 };

function WebScreenshot({ project }: { project: WebProject }) {
  const [failedPath, setFailedPath] = useState("");
  const failed = !project.image || failedPath === project.image;
  return (
    <div className="webdeck__browser">
      <div className="webdeck__browserbar">
        <span className="webdeck__traffic"><i /><i /><i /></span>
        <span className="webdeck__address"><Globe size={12} /> {project.title}</span>
        <span className="webdeck__browser-dots">•••</span>
      </div>
      <div className="webdeck__browser-view">
        {failed ? (
          <div className="webdeck__empty"><ImageIcon size={33} strokeWidth={1.25} /><strong>{project.title}</strong><span>Masukkan screenshot website di {project.image || "/projects/web/"}</span></div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt={`Tampilan website ${project.title}`} loading="eager" draggable={false} onError={() => setFailedPath(project.image)} />
        )}
      </div>
    </div>
  );
}

export default function WebAppShowcase() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = WEB_PROJECTS[active];
  const next = () => setActive((prev) => (prev + 1) % WEB_PROJECTS.length);
  const previous = () => setActive((prev) => (prev - 1 + WEB_PROJECTS.length) % WEB_PROJECTS.length);
  const validLink = (url?: string) => Boolean(url && /^https?:\/\/\S+/i.test(url));

  return (
    <main className="webdeck" aria-label="Web Application Portfolio">
      <div className="webdeck__grid-texture" aria-hidden="true" />
      <div className="webdeck__glow webdeck__glow--a" aria-hidden="true" />
      <div className="webdeck__glow webdeck__glow--b" aria-hidden="true" />
      <div className="webdeck__content">
        <motion.div className="webdeck__copy" initial={reduce ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="webdeck__eyebrow"><span /> WEB APPLICATIONS</div>
          <h1>Ideas built<br /><em>for the web.</em></h1>
          <p className="webdeck__lead">Tiga proyek pengembangan website yang menampilkan proses membangun antarmuka, fungsi, dan pengalaman digital.</p>
          <div className="webdeck__project-info" key={current.id}>
            <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <span className="webdeck__category" style={{ color: current.accent }}>{current.category}</span>
              <h2>{current.title}</h2>
              <p>{current.description}</p>
              <div className="webdeck__stack">{current.stack.map((tool) => <span key={tool}>{tool}</span>)}</div>
              <div className="webdeck__links">
                {validLink(current.websiteUrl) && <a href={current.websiteUrl} target="_blank" rel="noopener noreferrer" className="webdeck__primary">Lihat Website <ArrowUpRight size={16}/></a>}
                {validLink(current.repositoryUrl) && <a href={current.repositoryUrl} target="_blank" rel="noopener noreferrer" className="webdeck__secondary">Source Code <ArrowUpRight size={16}/></a>}
              </div>
            </motion.div>
          </div>
          <div className="webdeck__navigation">
            <button type="button" className="webdeck__arrow" onClick={previous} aria-label="Project sebelumnya"><ArrowLeft size={19}/></button>
            <span className="webdeck__count"><b>0{active + 1}</b><span> / 0{WEB_PROJECTS.length}</span></span>
            <button type="button" className="webdeck__arrow" onClick={next} aria-label="Project berikutnya"><ArrowRight size={19}/></button>
            <span className="webdeck__hint">Geser kartu untuk melihat project lain</span>
          </div>
        </motion.div>

        <motion.div className="webdeck__scene" initial={reduce ? false : { opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.68, delay: 0.12 }} aria-label="Tiga kartu website bertumpuk">
          <div className="webdeck__orbit" aria-hidden="true" />
          <div className="webdeck__orbit webdeck__orbit--two" aria-hidden="true" />
          {WEB_PROJECTS.map((project, index) => {
            const depth = (index - active + WEB_PROJECTS.length) % WEB_PROJECTS.length;
            const isFront = depth === 0;
            return (
              <motion.article
                key={project.id}
                className={`webdeck__card ${isFront ? "webdeck__card--front" : "webdeck__card--back"}`}
                style={{ zIndex: WEB_PROJECTS.length - depth, cursor: isFront ? "grab" : "pointer", touchAction: isFront ? "pan-y" : "auto" }}
                animate={{ x: depth * 27, y: depth * 28, scale: 1 - depth * 0.075, rotate: depth === 0 ? -2 : depth === 1 ? 3 : 7, opacity: 1 }}
                transition={reduce ? { duration: 0 } : spring}
                drag={isFront && !reduce ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.24}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -65 || info.velocity.x < -450) next();
                  else if (info.offset.x > 65 || info.velocity.x > 450) previous();
                }}
                onClick={() => { if (!isFront) setActive(index); }}
                aria-label={`${project.title}${isFront ? ", aktif. Geser kiri atau kanan" : ", klik untuk memilih"}`}
                tabIndex={isFront ? 0 : -1}
                onKeyDown={(event) => {
                  if (!isFront) return;
                  if (event.key === "ArrowRight") { event.preventDefault(); next(); }
                  if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
                }}
              >
                <div className="webdeck__card-top"><span><Layers3 size={14} /> {project.title}</span><span className="webdeck__card-no">0{index + 1} / 03</span></div>
                <WebScreenshot project={project} />
                <div className="webdeck__card-bottom"><span>{project.role}</span><span className="webdeck__card-dot" style={{ background: project.accent }}/></div>
              </motion.article>
            );
          })}
          <div className="webdeck__scene-note">DRAG TO EXPLORE <ArrowRight size={15} /></div>
        </motion.div>
      </div>
    </main>
  );
}
