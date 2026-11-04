"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Wifi, Search, SlidersHorizontal } from "lucide-react";
import { useNow } from "@/hooks/useNow";

type NavWithBattery = Navigator & {
  getBattery?: () => Promise<{ level: number }>;
};

function Battery({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs tabular-nums">{level}%</span>
      <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden>
        <rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".55" />
        <rect x="2" y="2" width={Math.max(2, (19 * level) / 100)} height="8" rx="1.5" fill="currentColor" />
        <rect x="24" y="4" width="1.5" height="4" rx=".7" fill="currentColor" opacity=".55" />
      </svg>
    </div>
  );
}

export default function MenuBar() {
  const pathname = usePathname();
  const now = useNow(1000);
  const [battery, setBattery] = useState(87);
  const [hidden, setHidden] = useState(false);

  const isProjectPage = pathname === "/projects" || pathname?.startsWith("/projects/");

  // Animasi poni masuk ke atas saat di-scroll menuju halaman berikutnya.
  useEffect(() => {
    const handleScroll = () => {
      setHidden(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pakai level baterai asli kalau browser mendukung (Chrome/Edge).
  useEffect(() => {
    const nav = navigator as NavWithBattery;
    nav.getBattery?.().then((b) => setBattery(Math.round(b.level * 100))).catch(() => {});
  }, []);

  const date = now?.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" }) ?? "";
  const time = now?.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":") ?? "";

  // Letakkan setelah seluruh hooks agar urutannya selalu konsisten.
  if (isProjectPage) return null;

  return (
    <motion.header
      animate={{ y: hidden ? -45 : 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className="glass-bar fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-between px-4 text-[13px] font-medium text-white shadow-sm"
    >
      <nav className="flex items-center gap-5">
        <span className="flex shrink-0 items-center gap-2 font-bold">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
            <circle cx="12" cy="7.5" r="4" />
            <path d="M4 21v-2a8 8 0 0 1 16 0v2H4Z" />
          </svg>
          Portfolio
        </span>
        <span className="hidden gap-5 font-normal md:flex">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
          <span>Help</span>
        </span>
      </nav>

      <div className="flex items-center gap-4">
        <Battery level={battery} />
        <Wifi size={16} strokeWidth={2.2} aria-hidden />
        <Search size={15} strokeWidth={2.2} className="hidden sm:block" aria-hidden />
        <SlidersHorizontal size={15} strokeWidth={2.2} className="hidden sm:block" aria-hidden />
        <span className="tabular-nums" suppressHydrationWarning>
          {date} {time}
        </span>
      </div>
    </motion.header>
  );
}
