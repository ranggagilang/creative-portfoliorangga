"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/project-data";
import "./ProjectFolders.css";
import { useDockOpen } from "@/hooks/useDockOpen";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, Code2, PenTool, Play } from "lucide-react";
const styles = {
  "arrow": "pc-arrow [display:inline-flex] [flex-shrink:0] [transition:transform_.4s]",
  "art": "pc-art [position:absolute] [top:0] [left:7%] [width:86%] [height:255px] [pointer-events:none] [transition:transform_.65s_cubic-bezier(.22,1,.36,1)] [@media((max-width:760px))]:[max-width:310px] [@media((max-width:760px))]:[left:calc((100%_-_min(86%,_310px))_/_2)] [@media((max-width:760px))]:[margin-left:0] [@media((max-width:370px))]:[width:86%] [@media((max-width:370px))]:[left:7%] [@media((max-width:370px))]:[margin:0] [@media((prefers-reduced-motion:reduce))]:[transition:none]!",
  "back": "pc-back [display:inline-flex] [align-items:center] [gap:8px] [font-size:12px] [color:#c1d5e8] [padding:8px_0]",
  "cardWrap": "pc-cardWrap [min-width:0]",
  "cards": "pc-cards [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:26px] [padding-top:36px] [@media((max-width:999px))]:[gap:18px] [@media((max-width:760px))]:[grid-template-columns:1fr] [@media((max-width:760px))]:[gap:46px] [@media((max-width:760px))]:[max-width:420px] [@media((max-width:760px))]:[margin:auto] [@media((max-width:760px))]:[padding-top:28px]",
  "categoryLabel": "pc-categoryLabel [font-size:9px] [letter-spacing:.12em] [font-weight:700] [opacity:.7]",
  "close": "pc-close [position:absolute] [top:16px] [right:16px] [border:1px_solid_#ffffff40] [border-radius:50%] [width:36px] [height:36px] [display:grid] [place-items:center] [background:transparent] [color:white] [cursor:pointer]",
  "codeSticker": "pc-codeSticker [position:absolute] [display:grid] [place-items:center] [box-shadow:0_5px_10px_#001b3230] [border:4px_solid_#fffaf0] [right:-13px] [top:19px] [width:65px] [height:65px] [border-radius:16px] [background:#0077b6] [color:white] [transform:rotate(12deg)]",
  "description": "pc-description [color:#bfd7e6] [font-size:14px] [line-height:1.8] [max-width:590px]",
  "designLabel": "pc-designLabel [font-size:8px]",
  "designSheet": "pc-designSheet [position:absolute] [top:15px] [left:0] [width:74%] [height:217px] [background:#f8f6e9] [color:#283c2c] [padding:17px] [transform:rotate(-8deg)] [box-shadow:0_5px_20px_#001f4140]",
  "dialog": "pc-dialog [width:min(860px,calc(100%_-_28px))] [max-height:calc(100svh_-_56px)] [margin:auto] [border:1px_solid_#90e0ef40] [border-radius:20px] [background:#092849] [color:#f5fafb] [padding:0] [overscroll-behavior:contain] [box-shadow:0_30px_100px_#0008]",
  "dialogBody": "pc-dialogBody [position:relative] [padding:clamp(24px,5vw,48px)]",
  "dialogLabel": "pc-dialogLabel [font-size:10px] [letter-spacing:.13em]",
  "empty": "pc-empty [padding:40px_0] [margin:26px_0] [border-block:1px_solid_#ffffff24]",
  "eyebrow": "pc-eyebrow [font-size:13px] [color:#90e0ef] [margin:0_0_10px]",
  "film": "pc-film [position:absolute] [right:-4px] [top:45px] [height:220px] [width:78px] [background:#302f30] [padding:10px_8px] [border-left:5px_dashed_#f2d4ae] [border-right:5px_dashed_#f2d4ae] [transform:rotate(12deg)] [display:grid] [gap:8px]",
  "flower": "pc-flower [font-size:55px] [line-height:1.4] [text-align:center]",
  "folder": "pc-folder [display:block] [position:relative] [width:100%] [height:374px] [cursor:pointer] [border:0] [padding:0] [text-align:left] [background:transparent] [color:var(--ink)] [perspective:1000px] [isolation:isolate] [@media((max-width:999px))]:[height:350px] [@media((max-width:760px))]:[height:385px]",
  "folderBack": "pc-folderBack [position:absolute] [inset:62px_0_0] [background:var(--folder)] [border-radius:0_18px_18px_18px] [filter:brightness(.8)]",
  "folderFront": "pc-folderFront [position:absolute] [inset:185px_0_0] [display:flex] [flex-direction:column] [padding:24px] [border-radius:14px_14px_18px_18px] [background:var(--folder)] [box-shadow:inset_0_1px_0_#ffffff70,_0_18px_35px_#020b333b] [transform-origin:bottom] [transition:transform_.65s_cubic-bezier(.22,1,.36,1)] [@media((max-width:999px))]:[padding:18px] [@media((max-width:760px))]:[top:200px] [@media((max-width:760px))]:[padding:24px] [@media((max-width:370px))]:[padding:20px]",
  "folderHeading": "pc-folderHeading [display:flex] [justify-content:space-between] [align-items:center] [gap:10px] [font-size:clamp(21px,2.2vw,29px)] [font-weight:800] [letter-spacing:-.055em] [margin-top:9px] [line-height:1.15] [@media((max-width:999px))]:[font-size:21px] [@media((max-width:760px))]:[font-size:28px] [@media((max-width:370px))]:[font-size:24px]",
  "header": "pc-header [display:flex] [align-items:end] [justify-content:space-between] [gap:24px] [@media((max-width:760px))]:[align-items:start] [@media((max-width:760px))]:[flex-direction:column] [@media((max-width:760px))]:[gap:20px] [@media((max-width:760px))]:[margin-top:28px] [margin:0_0_22px]",
  "hill": "pc-hill [position:absolute] [bottom:-40px] [left:-35px] [width:270px] [height:115px] [background:#2c6f69] [border-radius:50%] [transform:rotate(-25deg)]",
  "inner": "pc-inner [max-width:1240px] [margin:auto] [width:100%] [transform-origin:top_center]",
  "intro": "pc-intro [font-size:13px] [line-height:1.8] [color:#c1d5e8] [margin:0_0_5px]",
  "miniButton": "pc-miniButton [display:block] [width:fit-content] [font-size:7px] [margin-top:12px] [background:#092f50] [color:white] [padding:6px_9px] [border-radius:3px]",
  "miniGrid": "pc-miniGrid [display:flex] [gap:8px] [margin-top:18px]",
  "miniNav": "pc-miniNav [display:flex] [align-items:center] [gap:9px] [padding-bottom:15px] [border-bottom:1px_solid_#dae1e0]",
  "orbit": "pc-orbit [position:relative] [height:95px] [@media((max-width:999px))]:[transform:scale(.8)] [@media((max-width:999px))]:[transform-origin:left] [@media((max-width:760px))]:[transform:none]",
  "page": "pc-page [min-height:100svh] [color:#f5fafb] [&_.pc-back:hover]:[color:white] [&_.pc-header_h2]:[font-size:clamp(48px,_6.8vw,_88px)] [&_.pc-header_h2]:[font-weight:800] [&_.pc-header_h2]:[letter-spacing:-.065em] [&_.pc-header_h2]:[line-height:1.02] [&_.pc-header_h2]:[margin:0] [&_.pc-header_h2_span]:[color:#90e0ef] [&_.pc-folderBack::before]:[content:''] [&_.pc-folderBack::before]:[position:absolute] [&_.pc-folderBack::before]:[top:-19px] [&_.pc-folderBack::before]:[left:0] [&_.pc-folderBack::before]:[width:42%] [&_.pc-folderBack::before]:[height:26px] [&_.pc-folderBack::before]:[background:inherit] [&_.pc-folderBack::before]:[border-radius:12px_18px_0_0] [&_.pc-tags_span]:[font-size:9px] [&_.pc-tags_span]:[padding:5px_7px] [&_.pc-tags_span]:[border:1px_solid_currentColor] [&_.pc-tags_span]:[border-radius:5px] [&_.pc-folder:focus-visible]:[outline:3px_solid_#fff] [&_.pc-folder:focus-visible]:[outline-offset:10px] [&_.pc-folder:focus-visible]:[border-radius:18px] [&_.pc-folder:focus-visible_.pc-art]:[transform:translateY(-14px)] [@media((hover:hover)_and_(pointer:fine))]:[&_.pc-folder:hover_.pc-art]:[transform:translateY(-19px)_rotate(-2deg)] [@media((hover:hover)_and_(pointer:fine))]:[&_.pc-folder:hover_.pc-folderFront]:[transform:rotateX(-9deg)] [@media((hover:hover)_and_(pointer:fine))]:[&_.pc-folder:hover_.pc-arrow]:[transform:translate(3px,-3px)] [&_.pc-miniNav_i]:[width:18px] [&_.pc-miniNav_i]:[height:18px] [&_.pc-miniNav_i]:[background:#006ea8] [&_.pc-miniNav_i]:[border-radius:50%] [&_.pc-miniNav_i]:[margin-right:auto] [&_.pc-miniNav_span]:[height:3px] [&_.pc-miniNav_span]:[width:25px] [&_.pc-miniNav_span]:[background:#c0cacc] [&_.pc-webLayout_b]:[font-size:31px] [&_.pc-webLayout_b]:[letter-spacing:-.06em] [&_.pc-webLayout_b]:[line-height:.97] [&_.pc-orbit_i]:[position:absolute] [&_.pc-orbit_i]:[width:77px] [&_.pc-orbit_i]:[height:77px] [&_.pc-orbit_i]:[border-radius:22px] [&_.pc-orbit_i]:[transform:rotate(30deg)] [&_.pc-orbit_i]:[background:#00b4d8] [&_.pc-orbit_i]:[top:0] [&_.pc-orbit_i]:[left:10px] [&_.pc-orbit_i:nth-child(2)]:[background:#0077b6] [&_.pc-orbit_i:nth-child(2)]:[top:12px] [&_.pc-orbit_i:nth-child(2)]:[left:22px] [&_.pc-orbit_i:nth-child(3)]:[background:#90e0ef] [&_.pc-orbit_i:nth-child(3)]:[top:24px] [&_.pc-orbit_i:nth-child(3)]:[left:34px] [&_.pc-miniGrid_i]:[flex:1] [&_.pc-miniGrid_i]:[height:35px] [&_.pc-miniGrid_i]:[border-radius:4px] [&_.pc-miniGrid_i]:[background:#d8e4e4] [&_.pc-designSheet_b]:[display:block] [&_.pc-designSheet_b]:[font-size:72px] [&_.pc-designSheet_b]:[font-weight:600] [&_.pc-designSheet_b]:[letter-spacing:-.08em] [&_.pc-designSheet_b]:[line-height:1.5] [&_.pc-designSheet_b_span]:[font-size:32px] [&_.pc-designSheet_b_span]:[margin-left:8px] [&_.pc-swatches_i]:[width:25%] [&_.pc-swatches_i]:[height:30px] [&_.pc-swatches_i]:[background:#344723] [&_.pc-swatches_i:nth-child(2)]:[background:#d5ee87] [&_.pc-swatches_i:nth-child(3)]:[background:#ff977b] [&_.pc-swatches_i:nth-child(4)]:[background:#cac0e8] [&_.pc-phone>span]:[display:block] [&_.pc-phone>span]:[width:25px] [&_.pc-phone>span]:[height:4px] [&_.pc-phone>span]:[background:#344723] [&_.pc-phone>span]:[border-radius:10px] [&_.pc-phone>span]:[margin:auto] [&_.pc-phone_b]:[font-size:15px] [&_.pc-phone_b]:[line-height:1.1] [&_.pc-phone_b]:[display:block] [&_.pc-phone_b]:[letter-spacing:-.04em] [&_.pc-phone>i]:[display:block] [&_.pc-phone>i]:[width:100%] [&_.pc-phone>i]:[height:15px] [&_.pc-phone>i]:[border-radius:8px] [&_.pc-phone>i]:[background:#344723] [&_.pc-phone>i]:[margin-top:12px] [&_.pc-poster>span]:[font-size:9px] [&_.pc-poster>span]:[letter-spacing:.12em] [&_.pc-poster_b]:[position:relative] [&_.pc-poster_b]:[z-index:2] [&_.pc-poster_b]:[display:block] [&_.pc-poster_b]:[font-size:37px] [&_.pc-poster_b]:[font-weight:800] [&_.pc-poster_b]:[line-height:.93] [&_.pc-poster_b]:[letter-spacing:-.055em] [&_.pc-poster_b]:[margin-top:10px] [&_.pc-film_span]:[background:linear-gradient(135deg,#ffb29a_50%,#e87251_50%)] [&_.pc-film_span:nth-child(2)]:[background:linear-gradient(40deg,#2c6f69_50%,#b1d1ba_50%)] [&_.pc-dialog::backdrop]:[background:#020d29c9] [&_.pc-dialog::backdrop]:[backdrop-filter:blur(8px)] [&_.pc-dialog_h2]:[font-size:clamp(30px,5vw,52px)] [&_.pc-dialog_h2]:[line-height:1.1] [&_.pc-dialog_h2]:[letter-spacing:-.05em] [&_.pc-dialog_h2]:[font-weight:800] [&_.pc-dialog_h2]:[margin:15px_30px_18px_0] [&_.pc-empty>span]:[color:#90e0ef] [&_.pc-empty>span]:[font-size:35px] [&_.pc-empty_h3]:[font-weight:600] [&_.pc-empty_h3]:[margin-top:8px] [&_.pc-empty_p]:[font-size:13px] [&_.pc-empty_p]:[color:#bfd7e6] [&_.pc-empty_p]:[margin-top:8px] [&_.pc-switcher_button]:[background:transparent] [&_.pc-switcher_button]:[color:#bed5e6] [&_.pc-switcher_button]:[border:1px_solid_#ffffff30] [&_.pc-switcher_button]:[border-radius:8px] [&_.pc-switcher_button]:[padding:9px_12px] [&_.pc-switcher_button]:[font-size:11px] [&_.pc-switcher_button]:[cursor:pointer] [&_.pc-switcher_button[aria-pressed=\"true\"]]:[color:#092849] [&_.pc-switcher_button[aria-pressed=\"true\"]]:[background:#90e0ef] [&_.pc-switcher_button[aria-pressed=\"true\"]]:[border-color:#90e0ef] [&_.pc-projectGrid_h3]:[font-weight:700] [&_.pc-projectGrid_h3]:[margin-top:12px] [&_.pc-projectGrid_p]:[font-size:13px] [&_.pc-projectGrid_p]:[color:#bfd7e6] [&_.pc-projectGrid_p]:[margin:8px_0] [&_.pc-projectGrid_a]:[display:inline-flex] [&_.pc-projectGrid_a]:[align-items:center] [&_.pc-projectGrid_a]:[gap:7px] [&_.pc-projectGrid_a]:[font-size:13px] [&_.pc-projectGrid_a]:[color:#90e0ef] [@media((max-width:999px))]:[&_.pc-webLayout_b]:[font-size:26px] [@media((max-width:760px))]:[&_.pc-header_h2]:[font-size:clamp(46px,11vw,76px)] [@media((max-width:760px))]:[&_.pc-webLayout_b]:[font-size:31px] [@media((max-width:370px))]:[&_.pc-tags_span]:[font-size:8px] [@media((prefers-reduced-motion:reduce))]:[&_.pc-folder_*]:[transition:none]! [@media((prefers-reduced-motion:reduce))]:[&_.pc-folder:hover_.pc-art]:[transform:none] [@media((prefers-reduced-motion:reduce))]:[&_.pc-folder:focus-visible_.pc-art]:[transform:none] [@media((prefers-reduced-motion:reduce))]:[&_.pc-folder:hover_.pc-folderFront]:[transform:none] [background:linear-gradient(180deg,#03045e_0%,#082b51_100%)] [box-sizing:border-box] [padding:56px_5vw_112px] [scroll-margin-top:0px] [@media((max-width:760px))]:[padding:64px_24px_120px]",
  "penSticker": "pc-penSticker [position:absolute] [display:grid] [place-items:center] [box-shadow:0_5px_10px_#001b3230] [border:4px_solid_#fffaf0] [background:#d5ee87] [color:#344723] [width:53px] [height:53px] [border-radius:50%] [left:-12px] [top:8px] [transform:rotate(-15deg)]",
  "phone": "pc-phone [position:absolute] [right:0] [top:35px] [width:104px] [height:200px] [border-radius:17px] [background:#e8edce] [border:5px_solid_#344723] [transform:rotate(9deg)] [color:#344723] [padding:10px] [@media((max-width:999px))]:[width:85px] [@media((max-width:760px))]:[width:104px]",
  "playSticker": "pc-playSticker [position:absolute] [display:grid] [place-items:center] [box-shadow:0_5px_10px_#001b3230] [border:4px_solid_#fffaf0] [border-radius:50%] [width:60px] [height:60px] [top:5px] [right:3px] [background:#ffa58b] [color:#713825] [transform:rotate(12deg)]",
  "poster": "pc-poster [position:absolute] [left:15px] [top:12px] [width:76%] [height:240px] [overflow:hidden] [background:#ffeac8] [color:#723e2e] [transform:rotate(-7deg)] [padding:17px] [box-shadow:0_5px_20px_#001f4140]",
  "projectGrid": "pc-projectGrid [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:25px] [margin:30px_0] [@media((max-width:760px))]:[grid-template-columns:1fr]",
  "projectImage": "pc-projectImage [width:100%] [aspect-ratio:4/3] [object-fit:cover] [border-radius:8px]",
  "subtitle": "pc-subtitle [margin-top:9px] [font-size:11px]",
  "sun": "pc-sun [width:75px] [height:75px] [border-radius:50%] [background:#ef794a] [position:absolute] [bottom:22px] [right:20px]",
  "swatches": "pc-swatches [display:flex] [gap:5px]",
  "switcher": "pc-switcher [display:flex] [flex-wrap:wrap] [gap:8px]",
  "tags": "pc-tags [display:flex] [flex-wrap:wrap] [gap:6px] [margin-top:auto] [padding-top:17px] [@media((max-width:370px))]:[gap:4px]",
  "webLayout": "pc-webLayout [display:grid] [grid-template-columns:1fr_1fr] [align-items:center] [padding-top:15px]",
  "webSheet": "pc-webSheet [position:absolute] [inset:20px_6px_0] [background:#f6f5ed] [border-radius:6px] [padding:17px] [box-shadow:0_5px_20px_#001f4140] [transform:rotate(-5deg)] [color:#092f50]"
} as const;

// Ilustrasi kategori, bukan screenshot atau klaim proyek nyata.
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

export default function ProjectsSection() {
  const reduce = useReducedMotion();
  const dockOpen = useDockOpen();
  const bottomSpace = dockOpen ? 112 : 36;
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visible = useInView(sectionRef, { amount: 0.25 });
  const [frame, setFrame] = useState({ scale: 1, height: 0 });

  // Fit the whole desktop composition between menu bar and dock.
  // Measure layout height (not transformed bounds) to avoid resize feedback.
  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    const measure = () => {
      if (window.innerWidth <= 760) {
        setFrame(previous => previous.scale === 1 && previous.height === 0 ? previous : { scale: 1, height: 0 });
        return;
      }
      const css = getComputedStyle(section);
      const available = Math.max(1, window.innerHeight - parseFloat(css.paddingTop) - bottomSpace);
      const naturalHeight = content.offsetHeight;
      const scale = Math.min(dockOpen ? 0.96 : 1, available / Math.max(1, naturalHeight));
      const height = Math.ceil(naturalHeight * scale);
      setFrame(previous => Math.abs(previous.scale - scale) < 0.001 && previous.height === height ? previous : { scale, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [dockOpen, bottomSpace]);
  return <section ref={sectionRef} id="projects" aria-labelledby="projects-heading" className={styles.page} style={{ paddingBottom: bottomSpace, transition: reduce ? "none" : "padding-bottom 500ms ease" }}>
    <div style={{ height: frame.height || "auto", transition: reduce ? "none" : "height 500ms ease" }}>
    <div ref={contentRef} className={styles.inner} style={{ transform: `scale(${frame.scale})`, transition: reduce ? "none" : "transform 500ms ease" }}>
      <header className={styles.header}>
        <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={visible || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: reduce ? 0 : 0.5 }}>
          <h2 id="projects-heading">My projects<span>.</span></h2>
        </motion.div>
        <p className={styles.intro}>Kode, desain, dan cerita.<br />Pilih folder yang ingin kamu jelajahi.</p>
      </header>
      <div className={styles.cards}>
        {CATEGORIES.map((category, index) => <motion.div key={category.id}
          className={styles.cardWrap}
          initial={reduce ? false : { opacity: 0, y: 32, scale: 0.96 }}
          animate={visible || reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 32, scale: 0.96 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 17, mass: 0.8, delay: visible ? 0.12 + index * 0.1 : 0 }}>
          <Link href={`/projects/${category.id}`} className={styles.folder}
            aria-label={`Buka kategori ${category.title}`}
            style={{ "--folder": category.color, "--ink": category.ink } as CSSProperties}>
            <span className={styles.folderBack} />
            <CoverArt kind={category.id} />
            <span className={styles.folderFront}>
              <span className={styles.categoryLabel}>PROJECT COLLECTION</span>
              <span className={styles.folderHeading}>{category.title}<span className={styles.arrow}><ArrowUpRight size={23} /></span></span>
              <span className={styles.subtitle}>{category.subtitle}</span>
              <span className={styles.tags}>{category.tags.map(tag => <span key={tag}>{tag}</span>)}</span>
            </span>
          </Link>
        </motion.div>)}
      </div>
    </div>
    </div>
  </section>;
}
