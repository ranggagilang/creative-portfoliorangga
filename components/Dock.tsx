"use client";
import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  HouseIcon,
  SmileyWinkIcon,
  GraduationCapIcon,
  FolderIcon,
  CertificateIcon,
  PaperPlaneTiltIcon,
  type Icon,
} from "@phosphor-icons/react";
import { ChevronDown } from "lucide-react";
import { dockStore, useDockOpen } from "@/hooks/useDockOpen";

type Item = {
  label: string;
  href: string;
  icon: Icon;
  gradient: string;
  glow: string;
};

// Ikon: Berwarna cerah ala icon pack macOS / iOS yang hidup & menarik
const ITEMS: Item[] = [
  {
    label: "Home",
    href: "/",
    icon: HouseIcon,
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    glow: "shadow-[0_10px_22px_rgba(37,99,235,0.45)]",
  },
  {
    label: "About",
    href: "/about",
    icon: SmileyWinkIcon,
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    glow: "shadow-[0_10px_22px_rgba(249,115,22,0.45)]",
  },
  {
    label: "Study & Experience",
    href: "/#study-details",
    icon: GraduationCapIcon,
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    glow: "shadow-[0_10px_22px_rgba(147,51,234,0.45)]",
  },
  {
    label: "Projects",
    href: "/#projects",
    icon: FolderIcon,
    gradient: "from-sky-500 via-cyan-500 to-teal-500",
    glow: "shadow-[0_10px_22px_rgba(6,182,212,0.45)]",
  },
  {
    label: "Certificates",
    href: "/#certificates",
    icon: CertificateIcon,
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    glow: "shadow-[0_10px_22px_rgba(245,158,11,0.45)]",
  },
  {
    label: "Contact",
    href: "/#contact",
    icon: PaperPlaneTiltIcon,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    glow: "shadow-[0_10px_22px_rgba(16,185,129,0.45)]",
  },
];

// Di halaman utama, tentukan bagian yang sedang terlihat (Home, About, atau Study & Experience) dari posisi scroll
type Section = "home" | "about" | "study" | "projects" | "certificates" | "contact";
function getSection(): Section {
  const half = window.innerHeight * 0.5;
  const contact = document.getElementById("contact");
  if (contact && contact.getBoundingClientRect().top <= half) return "contact";
  const certificates = document.getElementById("certificates");
  if (certificates && certificates.getBoundingClientRect().top <= half) return "certificates";
  const projects = document.getElementById("projects");
  if (projects && projects.getBoundingClientRect().top <= half) return "projects";
  const study = document.getElementById("study-details");
  if (study && study.getBoundingClientRect().top <= half) return "study";
  const about = document.getElementById("about");
  if (!about) return "home";
  return about.getBoundingClientRect().top <= half ? "about" : "home";
}
function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  window.addEventListener("resize", cb);
  return () => {
    window.removeEventListener("scroll", cb);
    window.removeEventListener("resize", cb);
  };
}

const BASE = 48;
const MAX = 70;

function DockIcon({
  item,
  mouseX,
  active,
}: {
  item: Item;
  mouseX: MotionValue<number>;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - box.x - box.width / 2;
  });
  const sizeRaw = useTransform(distance, [-125, 0, 125], [BASE, MAX, BASE]);
  const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 180, damping: 14 });
  const IconComp = item.icon;

  return (
    <motion.div ref={ref} style={{ width: size, height: size }} className="group relative">
      <Link
        href={item.href}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        onClick={(e) => {
          if (item.href === "/about" || item.href === "/#about") {
            // Di desktop, tujuannya titik "About terbuka penuh" (animasi ikut jalan saat scroll menuju ke sana)
            const openMark = document.getElementById("about-open");
            const el = openMark && openMark.offsetParent !== null ? openMark : document.getElementById("about");
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          } else if ((item.href === "/#projects" || item.href === "/#certificates" || item.href === "/#contact")) {
            const el = document.getElementById(item.href.slice(2));
            if (el) {
              e.preventDefault();
              el.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                block: "start",
              });
            }
          } else if (item.href === "/#study-details") {
            const el = document.getElementById("study-details");
            if (el) {
              e.preventDefault();
              window.dispatchEvent(new Event("about-scroll-bypass")); // lewati gerbang About
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          } else if (item.href === "/" || item.href === "/#home") {
            const el = document.getElementById("home");
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: "smooth" });
            }
          }
        }}
        className={`flex h-full w-full items-center justify-center rounded-[22%] bg-gradient-to-b ${item.gradient} ${item.glow} outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-white active:scale-90 border border-white/30 [box-shadow:inset_0_1.5px_0_rgba(255,255,255,0.55),inset_0_-2px_4px_rgba(0,0,0,0.25)]`}
      >
        <IconComp
          weight="fill"
          className="h-[56%] w-[56%] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-110"
          aria-hidden
        />
      </Link>

      {/* Tooltip Nama Menu */}
      <span className="glass pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-xl px-2 py-0.5 text-[11px] font-semibold text-white whitespace-nowrap opacity-0 shadow-lg transition-all duration-150 group-hover:-top-11 group-hover:opacity-100">
        {item.label}
      </span>

      {/* Titik indikator aktif */}
      <span
        className={`absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_6px_#fff] transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"
          }`}
      />
    </motion.div>
  );
}

// Seberapa jauh dock turun saat ditutup (hanya tab kecil yang tersisa di tepi bawah)
const COLLAPSE_Y = 80;

export default function Dock() {
  const pathname = usePathname();
  const mouseX = useMotionValue(Infinity);
  const open = useDockOpen();
  const section = useSyncExternalStore(subscribeScroll, getSection, () => "home" as Section);

  const isActive = (href: string) => {
    if (pathname === "/") {
      if (href === "/") return section === "home";
      if (href === "/about") return section === "about";
      if (href === "/#study-details") return section === "study";
      if (href === "/#projects") return section === "projects";
      if (href === "/#certificates") return section === "certificates";
      if (href === "/#contact") return section === "contact";
      return false;
    }
    return href === "/" ? false : pathname.startsWith(href);
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: open ? 0 : COLLAPSE_Y, opacity: 1 }}
        transition={{ type: "spring", stiffness: 170, damping: 22 }}
        className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-1.5"
      >
        {/* Tab kecil: panah ke bawah untuk menutup, berputar jadi panah ke atas untuk membuka */}
        <button
          type="button"
          onClick={() => dockStore.set(!open)}
          aria-label={open ? "Tutup dock" : "Buka dock"}
          aria-expanded={open}
          className="glass flex h-7 w-11 items-center justify-center rounded-xl text-white outline-none transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white"
        >
          <motion.span
            animate={{ rotate: open ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex"
          >
            <ChevronDown size={17} strokeWidth={2.6} aria-hidden />
          </motion.span>
        </button>

        <motion.nav
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          inert={!open}
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="glass flex items-end gap-2.5 rounded-[26px] border border-white/25 bg-black/25 px-3 pt-2.5 pb-3 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          aria-label="Navigasi utama"
        >
          {ITEMS.map((item) => (
            <DockIcon
              key={item.href}
              item={item}
              mouseX={mouseX}
              active={isActive(item.href)}
            />
          ))}
        </motion.nav>
      </motion.div>
    </MotionConfig>
  );
}