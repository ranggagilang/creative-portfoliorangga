"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, Repeat2 } from "lucide-react";
import { useNow } from "@/hooks/useNow";

// ====== EDIT DATA KAMU DI SINI ======
const PROFILE = {
  name: "TB Rangga Gilang Yanuari",
  role: "IT Developer",
  photo: "/profile.png", // taruh foto di public/profile.png
};

// Data proyek unggulan untuk swap card stack
const FEATURED_PROJECTS = [
  {
    id: "fintech-app",
    title: "Fintech Mobile App",
    category: "Mobile & UI/UX",
    tag: "Flutter · Riverpod",
    gradient: "from-blue-600 via-indigo-600 to-purple-700",
    stats: "⭐ 4.9 App Store",
  },
  {
    id: "ai-assistant",
    title: "AI Design Assistant",
    category: "Web Platform & AI",
    tag: "Next.js 15 · Gemini · Tailwind",
    gradient: "from-fuchsia-600 via-pink-600 to-rose-700",
    stats: "🚀 12k+ Active Users",
  },
  {
    id: "ecommerce-luxury",
    title: "E-Commerce Luxury",
    category: "Fullstack Platform",
    tag: "React · Node · Stripe",
    gradient: "from-emerald-600 via-teal-600 to-cyan-700",
    stats: "💎 $150k GMV",
  },
];
// =====================================

function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay }}
      className={`glass rounded-[24px] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ProfileCard() {
  return (
    <Card delay={0.15} className="flex items-center gap-2.5 p-2.5">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-500">
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
          {PROFILE.name.charAt(0)}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROFILE.photo}
          alt={`Foto ${PROFILE.name}`}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[10px] text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          Open to work
        </p>
        <p className="truncate text-xs font-semibold">{PROFILE.name}</p>
        <p className="truncate text-[11px] text-white/70">{PROFILE.role}</p>
      </div>
    </Card>
  );
}

function ClockWidget() {
  const now = useNow(1000);
  const h = now?.getHours() ?? 10;
  const m = now?.getMinutes() ?? 10;
  const s = now?.getSeconds() ?? 0;
  const hourDeg = ((h % 12) + m / 60) * 30;
  const minDeg = (m + s / 60) * 6;
  const secDeg = s * 6;

  return (
    <Card delay={0.25} className="flex items-center justify-center p-3.5">
      <svg viewBox="0 0 100 100" className="h-28 w-28" role="img" aria-label="Jam analog">
        <circle cx="50" cy="50" r="47" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.45)" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="6"
            x2="50"
            y2={i % 3 === 0 ? 12 : 9}
            stroke="white"
            strokeOpacity={i % 3 === 0 ? 0.95 : 0.5}
            strokeWidth={i % 3 === 0 ? 2 : 1}
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="27"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          transform={`rotate(${hourDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="16"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform={`rotate(${minDeg} 50 50)`}
        />
        <line
          x1="50"
          y1="56"
          x2="50"
          y2="12"
          stroke="#ff303b"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform={`rotate(${secDeg} 50 50)`}
        />
        <circle cx="50" cy="50" r="2.6" fill="#ff303b" />
      </svg>
    </Card>
  );
}

function CalendarWidget() {
  const now = useNow(60_000);
  const labels = ["S", "S", "R", "K", "J", "S", "M"]; // Sen..Min
  const month = now?.toLocaleDateString("id-ID", { month: "long" }) ?? "";

  const days = (() => {
    if (!now) return [];
    const offset = (now.getDay() + 6) % 7; // Senin = 0
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - offset + i);
      return { n: d.getDate(), today: i === offset };
    });
  })();

  return (
    <Card delay={0.2} className="p-3.5">
      <p className="text-[11px] font-semibold text-rose-300 capitalize">{month}</p>
      <div className="mt-1.5 grid grid-cols-7 gap-1 text-center">
        {labels.map((l, i) => (
          <span key={i} className="text-[9px] text-white/60">
            {l}
          </span>
        ))}
        {(days.length ? days : Array.from({ length: 7 }).map(() => ({ n: 0, today: false }))).map((d, i) => (
          <span
            key={i}
            className={`mx-auto flex h-5 w-5 items-center justify-center rounded-full text-[11px] tabular-nums ${d.today ? "bg-rose-500 font-bold" : ""
              }`}
          >
            {d.n || "–"}
          </span>
        ))}
      </div>
    </Card>
  );
}

// Stacked Cards dengan animasi SWAP (depan pindah ke belakang, ke-2 maju ke depan)
function FeaturedProject() {
  const [order, setOrder] = useState([0, 1, 2]);
  const [isHovered, setIsHovered] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    if (isSwapping) return;
    setIsSwapping(true);
    setOrder(([first, second, third]) => [second, third, first]);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const frontProject = FEATURED_PROJECTS[order[0]];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 110, damping: 16, delay: 0.7 }}
      className="relative hidden w-64 md:block select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow dinamis di belakang kartu */}
      <div
        className={`pointer-events-none absolute -inset-3 rounded-[28px] bg-gradient-to-r ${frontProject.gradient} opacity-0 blur-2xl transition-opacity duration-500 ${isHovered ? "opacity-40" : "opacity-0"
          }`}
      />

      {/* Kontainer Tumpukan Kartu (Membesar saat hover) */}
      <motion.div
        animate={{
          scale: isHovered ? 1.05 : 1,
          y: isHovered ? -5 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative h-40 w-full cursor-grab active:cursor-grabbing"
      >
        {order.map((projIdx, pos) => {
          const project = FEATURED_PROJECTS[projIdx];
          const isFront = pos === 0;
          const isMiddle = pos === 1;

          const zIndex = isFront ? 30 : isMiddle ? 20 : 10;
          const rotate = isFront
            ? 0
            : isMiddle
              ? isHovered
                ? 5
                : 2.5
              : isHovered
                ? -6
                : -3;
          const yOffset = isFront
            ? 0
            : isMiddle
              ? isHovered
                ? -6
                : -3.5
              : isHovered
                ? -11
                : -6.5;
          const scale = isFront ? 1 : isMiddle ? 0.95 : 0.9;
          const opacity = isFront ? 1 : isMiddle ? 0.8 : 0.55;

          return (
            <motion.div
              key={project.id}
              layout
              style={{ zIndex }}
              animate={{
                rotate,
                y: yOffset,
                scale,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                mass: 0.8,
              }}
              drag={isFront ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 35 || Math.abs(info.velocity.x) > 300) {
                  handleSwap();
                }
              }}
              className="glass absolute inset-0 rounded-[24px] border border-white/30 p-3.5 shadow-[0_14px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl flex flex-col justify-between overflow-hidden"
            >
              {/* Latar gradasi halus */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-15`}
              />

              {/* Header Kartu */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    Featured Project
                  </span>

                  {/* Tombol Swap Interaktif */}
                  {isFront && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSwap();
                      }}
                      title="Klik untuk swap proyek"
                      className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-medium text-white/80 transition-colors hover:bg-white/30 hover:text-white"
                    >
                      <Repeat2 size={11} className="transition-transform hover:rotate-180" />
                      <span>Swap</span>
                    </button>
                  )}
                </div>

                <h3 className="mt-1.5 text-sm font-bold text-white">{project.title}</h3>
                <p className="mt-0.5 text-[11px] text-white/75">{project.tag}</p>
              </div>

              {/* Footer Kartu */}
              <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-2">
                <span className="text-[10px] font-semibold text-emerald-300">{project.stats}</span>

                <Link
                  href="/projects"
                  onClick={(e) => e.stopPropagation()}
                  className="group/link flex items-center gap-1 text-[11px] font-semibold text-white transition-colors hover:text-cyan-300"
                >
                  Lihat
                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export { FeaturedProject };

export default function Widgets() {
  const pathname = usePathname();
  // Widgets hanya tampil di halaman utama, bukan di halaman detail project.
  if (pathname === "/projects" || pathname?.startsWith("/projects/")) return null;

  return (
    <>
      <div className="absolute top-12 left-5 hidden w-52 flex-col gap-3 lg:flex">
        <ProfileCard />
        <ClockWidget />
      </div>
      <div className="absolute top-12 right-5 hidden w-52 flex-col gap-3 lg:flex">
        <CalendarWidget />
      </div>
    </>
  );
}