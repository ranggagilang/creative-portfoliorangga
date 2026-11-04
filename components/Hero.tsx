"use client";
import { useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import Widgets from "@/components/Widgets";
import Link from "next/link";
import { ArrowUpRight, Code2, PenTool, Play, Repeat2 } from "lucide-react";

type Tool = {
  name: string; // nama yang muncul saat diklik
  file: string; // file di public/tools/
  left: number; // posisi horizontal, % dari lebar judul
  top: number; // posisi vertikal, % dari tinggi judul
  size: number; // ukuran maksimum (px) di layar besar
};

// Posisi relatif terhadap blok judul "MY PORTFOLIO" (skala 90% proporsional)
const TOOLS: Tool[] = [
  { name: "Figma", file: "figma.svg", left: 28, top: 22, size: 44 },
  { name: "React", file: "react.svg", left: 38, top: -7, size: 36 },
  { name: "Flutter", file: "flutter.svg", left: 51, top: -9, size: 42 },
  { name: "Tailwind CSS", file: "tailwind.svg", left: 63, top: -6, size: 36 },
  { name: "Next.js", file: "nextjs.svg", left: 72, top: 20, size: 43 },
  { name: "VS Code", file: "vscode.svg", left: 63, top: 50, size: 35 },
  { name: "TypeScript", file: "typescript.svg", left: 12, top: 68, size: 38 },
  { name: "Git", file: "git.svg", left: 30, top: 100, size: 36 },
  { name: "Node.js", file: "nodejs.svg", left: 69, top: 102, size: 40 },
  { name: "Laravel", file: "laravel.svg", left: 90, top: 70, size: 41 },
];

function ToolIcon({
  tool,
  index,
  active,
  onToggle,
}: {
  tool: Tool;
  index: number;
  active: boolean;
  onToggle: () => void;
}) {
  const width = `clamp(26px, ${(tool.size / 14.4).toFixed(2)}vw, ${tool.size}px)`;

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${active ? "z-40" : "z-20"}`}
      style={{ left: `${tool.left}%`, top: `${tool.top}%`, width }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.8 + index * 0.08 }}
      >
        <motion.button
          type="button"
          aria-label={tool.name}
          aria-pressed={active}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          animate={{
            y: [0, -5, 0, 4, 0],
            x: [0, 2.5, 0, -2.5, 0],
            rotate: [0, 3.5, 0, -3.5, 0],
          }}
          transition={{
            duration: 5 + (index % 4) * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.25,
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="block aspect-square w-full cursor-pointer rounded-2xl outline-none [filter:drop-shadow(0_0_2px_rgba(255,255,255,0.75))_drop-shadow(0_10px_16px_rgba(0,0,0,0.5))] focus-visible:ring-2 focus-visible:ring-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/tools/${tool.file}`} alt="" draggable={false} className="h-full w-full select-none" />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, y: 7, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-tile pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-xl px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap shadow-xl"
          >
            {tool.name}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  "arrow": "hero-folder-arrow [display:inline-flex] [flex-shrink:0] [transition:transform_.4s]",
  "art": "hero-folder-art [position:absolute] [top:0] [left:7%] [width:86%] [height:255px] [pointer-events:none] [transition:transform_.65s_cubic-bezier(.22,1,.36,1)]",
  "back": "hero-folder-back [display:inline-flex] [align-items:center] [gap:8px] [font-size:12px] [color:#c1d5e8] [padding:8px_0]",
  "cardWrap": "hero-folder-cardWrap [min-width:0]",
  "cards": "hero-folder-cards [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:26px] [padding-top:36px]",
  "categoryLabel": "hero-folder-categoryLabel [font-size:9px] [letter-spacing:.12em] [font-weight:700] [opacity:.7]",
  "close": "hero-folder-close [position:absolute] [top:16px] [right:16px] [border:1px_solid_#ffffff40] [border-radius:50%] [width:36px] [height:36px] [display:grid] [place-items:center] [background:transparent] [color:white] [cursor:pointer]",
  "codeSticker": "hero-folder-codeSticker [position:absolute] [display:grid] [place-items:center] [box-shadow:0_5px_10px_#001b3230] [border:4px_solid_#fffaf0] [right:-13px] [top:19px] [width:65px] [height:65px] [border-radius:16px] [background:#0077b6] [color:white] [transform:rotate(12deg)]",
  "description": "hero-folder-description [color:#bfd7e6] [font-size:14px] [line-height:1.8] [max-width:590px]",
  "designLabel": "hero-folder-designLabel [font-size:8px]",
  "designSheet": "hero-folder-designSheet [position:absolute] [top:15px] [left:0] [width:74%] [height:217px] [background:#f8f6e9] [color:#283c2c] [padding:17px] [transform:rotate(-8deg)] [box-shadow:0_5px_20px_#001f4140]",
  "dialog": "hero-folder-dialog [width:min(860px,calc(100%_-_28px))] [max-height:calc(100svh_-_56px)] [margin:auto] [border:1px_solid_#90e0ef40] [border-radius:20px] [background:#092849] [color:#f5fafb] [padding:0] [overscroll-behavior:contain] [box-shadow:0_30px_100px_#0008]",
  "dialogBody": "hero-folder-dialogBody [position:relative] [padding:clamp(24px,5vw,48px)]",
  "dialogLabel": "hero-folder-dialogLabel [font-size:10px] [letter-spacing:.13em]",
  "empty": "hero-folder-empty [padding:40px_0] [margin:26px_0] [border-block:1px_solid_#ffffff24]",
  "eyebrow": "hero-folder-eyebrow [font-size:13px] [color:#90e0ef] [margin:0_0_10px]",
  "film": "hero-folder-film [position:absolute] [right:-4px] [top:45px] [height:220px] [width:78px] [background:#302f30] [padding:10px_8px] [border-left:5px_dashed_#f2d4ae] [border-right:5px_dashed_#f2d4ae] [transform:rotate(12deg)] [display:grid] [gap:8px]",
  "flower": "hero-folder-flower [font-size:55px] [line-height:1.4] [text-align:center]",
  "folder": "hero-folder-folder [display:block] [position:relative] [width:100%] [height:374px] [cursor:pointer] [border:0] [padding:0] [text-align:left] [background:transparent] [color:var(--ink)] [perspective:1000px] [isolation:isolate]",
  "folderBack": "hero-folder-folderBack [position:absolute] [inset:62px_0_0] [background:var(--folder)] [border-radius:0_18px_18px_18px] [filter:brightness(.8)]",
  "folderFront": "hero-folder-folderFront [position:absolute] [inset:185px_0_0] [display:flex] [flex-direction:column] [padding:24px] [border-radius:14px_14px_18px_18px] [background:var(--folder)] [box-shadow:inset_0_1px_0_#ffffff70,_0_18px_35px_#020b333b] [transform-origin:bottom] [transition:transform_.65s_cubic-bezier(.22,1,.36,1)]",
  "folderHeading": "hero-folder-folderHeading [display:flex] [justify-content:space-between] [align-items:center] [gap:10px] [font-size:clamp(21px,2.2vw,29px)] [font-weight:800] [letter-spacing:-.055em] [margin-top:9px] [line-height:1.15]",
  "header": "hero-folder-header [display:flex] [align-items:end] [justify-content:space-between] [gap:24px] [margin:0_0_22px]",
  "hill": "hero-folder-hill [position:absolute] [bottom:-40px] [left:-35px] [width:270px] [height:115px] [background:#2c6f69] [border-radius:50%] [transform:rotate(-25deg)]",
  "inner": "hero-folder-inner [max-width:1240px] [margin:auto] [width:100%] [transform-origin:top_center]",
  "intro": "hero-folder-intro [font-size:13px] [line-height:1.8] [color:#c1d5e8] [margin:0_0_5px]",
  "miniButton": "hero-folder-miniButton [display:block] [width:fit-content] [font-size:7px] [margin-top:12px] [background:#092f50] [color:white] [padding:6px_9px] [border-radius:3px]",
  "miniGrid": "hero-folder-miniGrid [display:flex] [gap:8px] [margin-top:18px]",
  "miniNav": "hero-folder-miniNav [display:flex] [align-items:center] [gap:9px] [padding-bottom:15px] [border-bottom:1px_solid_#dae1e0]",
  "orbit": "hero-folder-orbit [position:relative] [height:95px]",
  "page": "hero-folder-page   [&_.hero-folder-back:hover]:[color:white] [&_.hero-folder-header_h2]:[font-size:clamp(48px,_6.8vw,_88px)] [&_.hero-folder-header_h2]:[font-weight:800] [&_.hero-folder-header_h2]:[letter-spacing:-.065em] [&_.hero-folder-header_h2]:[line-height:1.02] [&_.hero-folder-header_h2]:[margin:0] [&_.hero-folder-header_h2_span]:[color:#90e0ef] [&_.hero-folder-folderBack::before]:[content:''] [&_.hero-folder-folderBack::before]:[position:absolute] [&_.hero-folder-folderBack::before]:[top:-19px] [&_.hero-folder-folderBack::before]:[left:0] [&_.hero-folder-folderBack::before]:[width:42%] [&_.hero-folder-folderBack::before]:[height:26px] [&_.hero-folder-folderBack::before]:[background:inherit] [&_.hero-folder-folderBack::before]:[border-radius:12px_18px_0_0] [&_.hero-folder-tags_span]:[font-size:9px] [&_.hero-folder-tags_span]:[padding:5px_7px] [&_.hero-folder-tags_span]:[border:1px_solid_currentColor] [&_.hero-folder-tags_span]:[border-radius:5px] [&_.hero-folder-folder:focus-visible]:[outline:3px_solid_#fff] [&_.hero-folder-folder:focus-visible]:[outline-offset:10px] [&_.hero-folder-folder:focus-visible]:[border-radius:18px] [&_.hero-folder-folder:focus-visible_.hero-folder-art]:[transform:translateY(-14px)] [&_.hero-folder-miniNav_i]:[width:18px] [&_.hero-folder-miniNav_i]:[height:18px] [&_.hero-folder-miniNav_i]:[background:#006ea8] [&_.hero-folder-miniNav_i]:[border-radius:50%] [&_.hero-folder-miniNav_i]:[margin-right:auto] [&_.hero-folder-miniNav_span]:[height:3px] [&_.hero-folder-miniNav_span]:[width:25px] [&_.hero-folder-miniNav_span]:[background:#c0cacc] [&_.hero-folder-webLayout_b]:[font-size:31px] [&_.hero-folder-webLayout_b]:[letter-spacing:-.06em] [&_.hero-folder-webLayout_b]:[line-height:.97] [&_.hero-folder-orbit_i]:[position:absolute] [&_.hero-folder-orbit_i]:[width:77px] [&_.hero-folder-orbit_i]:[height:77px] [&_.hero-folder-orbit_i]:[border-radius:22px] [&_.hero-folder-orbit_i]:[transform:rotate(30deg)] [&_.hero-folder-orbit_i]:[background:#00b4d8] [&_.hero-folder-orbit_i]:[top:0] [&_.hero-folder-orbit_i]:[left:10px] [&_.hero-folder-orbit_i:nth-child(2)]:[background:#0077b6] [&_.hero-folder-orbit_i:nth-child(2)]:[top:12px] [&_.hero-folder-orbit_i:nth-child(2)]:[left:22px] [&_.hero-folder-orbit_i:nth-child(3)]:[background:#90e0ef] [&_.hero-folder-orbit_i:nth-child(3)]:[top:24px] [&_.hero-folder-orbit_i:nth-child(3)]:[left:34px] [&_.hero-folder-miniGrid_i]:[flex:1] [&_.hero-folder-miniGrid_i]:[height:35px] [&_.hero-folder-miniGrid_i]:[border-radius:4px] [&_.hero-folder-miniGrid_i]:[background:#d8e4e4] [&_.hero-folder-designSheet_b]:[display:block] [&_.hero-folder-designSheet_b]:[font-size:72px] [&_.hero-folder-designSheet_b]:[font-weight:600] [&_.hero-folder-designSheet_b]:[letter-spacing:-.08em] [&_.hero-folder-designSheet_b]:[line-height:1.5] [&_.hero-folder-designSheet_b_span]:[font-size:32px] [&_.hero-folder-designSheet_b_span]:[margin-left:8px] [&_.hero-folder-swatches_i]:[width:25%] [&_.hero-folder-swatches_i]:[height:30px] [&_.hero-folder-swatches_i]:[background:#344723] [&_.hero-folder-swatches_i:nth-child(2)]:[background:#d5ee87] [&_.hero-folder-swatches_i:nth-child(3)]:[background:#ff977b] [&_.hero-folder-swatches_i:nth-child(4)]:[background:#cac0e8] [&_.hero-folder-phone>span]:[display:block] [&_.hero-folder-phone>span]:[width:25px] [&_.hero-folder-phone>span]:[height:4px] [&_.hero-folder-phone>span]:[background:#344723] [&_.hero-folder-phone>span]:[border-radius:10px] [&_.hero-folder-phone>span]:[margin:auto] [&_.hero-folder-phone_b]:[font-size:15px] [&_.hero-folder-phone_b]:[line-height:1.1] [&_.hero-folder-phone_b]:[display:block] [&_.hero-folder-phone_b]:[letter-spacing:-.04em] [&_.hero-folder-phone>i]:[display:block] [&_.hero-folder-phone>i]:[width:100%] [&_.hero-folder-phone>i]:[height:15px] [&_.hero-folder-phone>i]:[border-radius:8px] [&_.hero-folder-phone>i]:[background:#344723] [&_.hero-folder-phone>i]:[margin-top:12px] [&_.hero-folder-poster>span]:[font-size:9px] [&_.hero-folder-poster>span]:[letter-spacing:.12em] [&_.hero-folder-poster_b]:[position:relative] [&_.hero-folder-poster_b]:[z-index:2] [&_.hero-folder-poster_b]:[display:block] [&_.hero-folder-poster_b]:[font-size:37px] [&_.hero-folder-poster_b]:[font-weight:800] [&_.hero-folder-poster_b]:[line-height:.93] [&_.hero-folder-poster_b]:[letter-spacing:-.055em] [&_.hero-folder-poster_b]:[margin-top:10px] [&_.hero-folder-film_span]:[background:linear-gradient(135deg,#ffb29a_50%,#e87251_50%)] [&_.hero-folder-film_span:nth-child(2)]:[background:linear-gradient(40deg,#2c6f69_50%,#b1d1ba_50%)] [&_.hero-folder-dialog::backdrop]:[background:#020d29c9] [&_.hero-folder-dialog::backdrop]:[backdrop-filter:blur(8px)] [&_.hero-folder-dialog_h2]:[font-size:clamp(30px,5vw,52px)] [&_.hero-folder-dialog_h2]:[line-height:1.1] [&_.hero-folder-dialog_h2]:[letter-spacing:-.05em] [&_.hero-folder-dialog_h2]:[font-weight:800] [&_.hero-folder-dialog_h2]:[margin:15px_30px_18px_0] [&_.hero-folder-empty>span]:[color:#90e0ef] [&_.hero-folder-empty>span]:[font-size:35px] [&_.hero-folder-empty_h3]:[font-weight:600] [&_.hero-folder-empty_h3]:[margin-top:8px] [&_.hero-folder-empty_p]:[font-size:13px] [&_.hero-folder-empty_p]:[color:#bfd7e6] [&_.hero-folder-empty_p]:[margin-top:8px] [&_.hero-folder-switcher_button]:[background:transparent] [&_.hero-folder-switcher_button]:[color:#bed5e6] [&_.hero-folder-switcher_button]:[border:1px_solid_#ffffff30] [&_.hero-folder-switcher_button]:[border-radius:8px] [&_.hero-folder-switcher_button]:[padding:9px_12px] [&_.hero-folder-switcher_button]:[font-size:11px] [&_.hero-folder-switcher_button]:[cursor:pointer] [&_.hero-folder-switcher_button[aria-pressed=\"true\"]]:[color:#092849] [&_.hero-folder-switcher_button[aria-pressed=\"true\"]]:[background:#90e0ef] [&_.hero-folder-switcher_button[aria-pressed=\"true\"]]:[border-color:#90e0ef] [&_.hero-folder-projectGrid_h3]:[font-weight:700] [&_.hero-folder-projectGrid_h3]:[margin-top:12px] [&_.hero-folder-projectGrid_p]:[font-size:13px] [&_.hero-folder-projectGrid_p]:[color:#bfd7e6] [&_.hero-folder-projectGrid_p]:[margin:8px_0] [&_.hero-folder-projectGrid_a]:[display:inline-flex] [&_.hero-folder-projectGrid_a]:[align-items:center] [&_.hero-folder-projectGrid_a]:[gap:7px] [&_.hero-folder-projectGrid_a]:[font-size:13px] [&_.hero-folder-projectGrid_a]:[color:#90e0ef]",
  "penSticker": "hero-folder-penSticker [position:absolute] [display:grid] [place-items:center] [box-shadow:0_5px_10px_#001b3230] [border:4px_solid_#fffaf0] [background:#d5ee87] [color:#344723] [width:53px] [height:53px] [border-radius:50%] [left:-12px] [top:8px] [transform:rotate(-15deg)]",
  "phone": "hero-folder-phone [position:absolute] [right:0] [top:35px] [width:104px] [height:200px] [border-radius:17px] [background:#e8edce] [border:5px_solid_#344723] [transform:rotate(9deg)] [color:#344723] [padding:10px]",
  "playSticker": "hero-folder-playSticker [position:absolute] [display:grid] [place-items:center] [box-shadow:0_5px_10px_#001b3230] [border:4px_solid_#fffaf0] [border-radius:50%] [width:60px] [height:60px] [top:5px] [right:3px] [background:#ffa58b] [color:#713825] [transform:rotate(12deg)]",
  "poster": "hero-folder-poster [position:absolute] [left:15px] [top:12px] [width:76%] [height:240px] [overflow:hidden] [background:#ffeac8] [color:#723e2e] [transform:rotate(-7deg)] [padding:17px] [box-shadow:0_5px_20px_#001f4140]",
  "projectGrid": "hero-folder-projectGrid [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:25px] [margin:30px_0]",
  "projectImage": "hero-folder-projectImage [width:100%] [aspect-ratio:4/3] [object-fit:cover] [border-radius:8px]",
  "subtitle": "hero-folder-subtitle [margin-top:9px] [font-size:11px]",
  "sun": "hero-folder-sun [width:75px] [height:75px] [border-radius:50%] [background:#ef794a] [position:absolute] [bottom:22px] [right:20px]",
  "swatches": "hero-folder-swatches [display:flex] [gap:5px]",
  "switcher": "hero-folder-switcher [display:flex] [flex-wrap:wrap] [gap:8px]",
  "tags": "hero-folder-tags [display:flex] [flex-wrap:wrap] [gap:6px] [margin-top:auto] [padding-top:17px]",
  "webLayout": "hero-folder-webLayout [display:grid] [grid-template-columns:1fr_1fr] [align-items:center] [padding-top:15px]",
  "webSheet": "hero-folder-webSheet [position:absolute] [inset:20px_6px_0] [background:#f6f5ed] [border-radius:6px] [padding:17px] [box-shadow:0_5px_20px_#001f4140] [transform:rotate(-5deg)] [color:#092f50]"
} as const;


function CoverArt({ kind }: { kind: string }) {
  return <div className={styles.art} aria-hidden="true">
    {kind === "web" ? <>
      <div className={styles.webSheet}><div className={styles.miniNav}><i /><span /><span /></div>
        <div className={styles.webLayout}><div><b>Make<br />it work.</b><span className={styles.miniButton}>Let’s build ↗</span></div><div className={styles.orbit}><i /><i /><i /></div></div>
        <div className={styles.miniGrid}><i /><i /><i /></div>
      </div>
      <span className={styles.codeSticker}><Code2 size={33} strokeWidth={2.5} /></span>
    </> : kind === "design" ? <>
      <div className={styles.designSheet}><span className={styles.designLabel}>Shape / Type / Color</span><b>Aa<span>↗</span></b><div className={styles.swatches}><i /><i /><i /><i /></div></div>
      <div className={styles.phone}><span /><div className={styles.flower}>✳</div><b>Good<br />by design.</b><i /></div>
      <span className={styles.penSticker}><PenTool size={27} /></span>
    </> : <>
      <div className={styles.poster}><span>PAUSE &</span><b>LOOK<br />CLOSER.</b><div className={styles.sun} /><div className={styles.hill} /></div>
      <div className={styles.film}><span /><span /><span /></div>
      <span className={styles.playSticker}><Play size={29} fill="currentColor" /></span>
    </>}
  </div>;
}


const HERO_CATEGORIES = [
  { id: "web", title: "Web Application", subtitle: "From idea to interaction.", color: "#62d3ee", ink: "#083b56", tags: ["Website", "Application", "Development"] },
  { id: "design", title: "UI/UX & Design", subtitle: "A little thought. A lot of detail.", color: "#d7ed87", ink: "#354c20", tags: ["UI/UX", "Visual Design", "Prototype"] },
  { id: "content", title: "Content", subtitle: "Stories, frame by frame.", color: "#ffa58d", ink: "#713c2b", tags: ["Photography", "Video", "Social Content"] },
];

function FeaturedProject() {
  const [order, setOrder] = useState([0, 1, 2]);
  const [hovered, setHovered] = useState(false);
  const dragging = useRef(false);
  const lockedUntil = useRef(0);
  const reduce = useReducedMotion();
  const swap = () => {
    if (Date.now() < lockedUntil.current) return;
    lockedUntil.current = Date.now() + 350;
    setOrder(([first, second, third]) => [second, third, first]);
  };
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 110, damping: 16, delay: 0.7 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="relative w-[248px] select-none"
      role="region" aria-label="Folder kategori project"
    >
      <div className="relative h-[250px] w-full">
        {order.map((categoryIndex, position) => {
          const category = HERO_CATEGORIES[categoryIndex];
          const front = position === 0;
          return <motion.div
            key={category.id}
            style={{ zIndex: 30 - position * 10, pointerEvents: front ? "auto" : "none", touchAction: "pan-y" }}
            animate={{ rotate: reduce || front ? 0 : position === 1 ? (hovered ? 5 : 2.5) : (hovered ? -6 : -3), y: reduce ? 0 : -position * (hovered ? 6 : 3.5), scale: 1 - position * 0.05, opacity: front ? 1 : position === 1 ? 0.8 : 0.55 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22, mass: 0.8 }}
            drag={front ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.4}
            onPointerDown={() => { dragging.current = false; }}
            onDragStart={() => { dragging.current = true; }}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 35 || Math.abs(info.velocity.x) > 300) swap(); }}
            aria-hidden={!front}
            className="absolute inset-0 origin-bottom cursor-grab active:cursor-grabbing"
          >
            <div className={styles.page} style={{ width: 360, transform: "scale(.68)", transformOrigin: "top left" }}>
              <Link href={`/projects/${category.id}`} tabIndex={front ? 0 : -1}
                onClick={(event) => { event.stopPropagation(); if (dragging.current) event.preventDefault(); }}
                onDragStart={(event) => event.preventDefault()} draggable={false}
                className={styles.folder} aria-label={`Buka kategori ${category.title}`}
                style={{ "--folder": category.color, "--ink": category.ink } as CSSProperties}>
                <span className={styles.folderBack} />
                <CoverArt kind={category.id} />
                <span className={styles.folderFront}>
                  <span className={styles.categoryLabel}>PROJECT COLLECTION</span>
                  <span className={styles.folderHeading}>{category.title}<ArrowUpRight size={23} /></span>
                  <span className={styles.subtitle}>{category.subtitle}</span>
                  <span className={styles.tags}>{category.tags.map(tag => <span key={tag}>{tag}</span>)}</span>
                </span>
              </Link>
            </div>
          </motion.div>;
        })}
      </div>
      <div className="relative z-40 mt-3 flex items-center justify-between text-[11px] text-white">
        <span aria-live="polite" aria-atomic="true">{order[0] + 1} / 3 · {HERO_CATEGORIES[order[0]].title}</span>
        <button type="button" onClick={event => { event.stopPropagation(); swap(); }}
          className="flex min-h-9 items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 backdrop-blur-md hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Tampilkan folder berikutnya"><Repeat2 size={14} />Swap</button>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="home"
        onClick={() => setActive(null)}
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 pt-10 pb-16"
      >
        <Widgets />

        {/* Blok Utama Tengah: Teks & Ikon terkalibrasi ke skala 90% (sehingga di zoom 100% tampil pas persis seperti 90%) */}
        <div className="relative z-10 mx-auto w-fit text-center translate-y-2 sm:translate-y-3 lg:translate-y-4">
          <div className="relative mx-auto w-fit">
            <motion.h1
              initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="title-shadow mx-auto select-none text-center text-[clamp(3.2rem,10.2vw,8.8rem)] leading-[0.88] font-extrabold tracking-[-0.045em] uppercase"
            >
              My
              <br />
              Portfolio
            </motion.h1>

            {TOOLS.map((tool, i) => (
              <ToolIcon
                key={tool.name}
                tool={tool}
                index={i}
                active={active === tool.name}
                onToggle={() => setActive(active === tool.name ? null : tool.name)}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto mt-4 max-w-md text-sm text-white/90 sm:text-base"
          >
            Saya membuat website dan desain digital yang rapi dan enak dipakai.
          </motion.p>
        </div>

        {/* Kiri bawah: teks polos TANPA efek glass */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="title-shadow absolute bottom-7 left-7 hidden max-w-[13rem] text-xs leading-snug text-white/90 lg:block"
        >
          Bukan sekadar tampilan.
          <br />
          Saya membuat produk digital yang terasa hidup.
        </motion.p>

        {/* Kanan bawah: proyek unggulan swap card deck */}
        <div className="absolute right-7 bottom-7 hidden lg:block z-30">
          <FeaturedProject />
        </div>
      </section>
    </MotionConfig>
  );
}