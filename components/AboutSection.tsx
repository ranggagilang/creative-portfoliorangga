"use client";
import StudyExpSection from "./StudyExpSection";
import TextLoop from "./TextLoop";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Caveat } from "next/font/google";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Image as ImageIcon,
  MapPin,
  X,
} from "lucide-react";
import {
  TrophyIcon,
} from "@phosphor-icons/react";
import { useDockOpen } from "@/hooks/useDockOpen";

// Font tulisan tangan untuk caption polaroid dan catatan kecil
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"] });

// true di layar lebar (lg ke atas), tempat animasi kotak dipakai
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(min-width: 1024px)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}

// ==========================================
// DATA: EDIT DI SINI
// ==========================================

const PROFILE = {
  fullName: "TB Rangga Gilang Yanuari",
  nickname: "Rangga",
  tagline: "IT Developer & Visual Creator",
  location: "Serang, Banten, Indonesia",
  cutout: "/profile-cutout.png", // foto tanpa latar belakang di public/
};

const INTEREST_TAGS = [
  { label: "IT Enthusiast", icon: "⚙️" },
  { label: "Web Developer", icon: "💻" },
  { label: "UI/UX & Visual Designer", icon: "🎨" },
  { label: "Creative Video Editor", icon: "🎬" },
];

// svg = logo dari public/tools, abbr = huruf singkat bergaya ikon aplikasi
const TOOLS: { name: string; svg?: string; abbr?: string; tile?: string; fg?: string }[] = [
  { name: "Figma", svg: "/tools/figma.svg" },
  { name: "VS Code", svg: "/tools/vscode.svg" },
  { name: "Next.js", svg: "/tools/nextjs.svg" },
  { name: "Flutter", svg: "/tools/flutter.svg" },
  { name: "Canva", svg: "/tools/canva.svg" },
  { name: "CapCut", svg: "/tools/capcut.svg" },
  { name: "Antigravity", svg: "/tools/antigravity.svg" },
  { name: "Github", svg: "/tools/github.svg" },
];

const DOCUMENTATION_ITEMS = [
  {
    id: "doc-1",
    short: "Top 3 Yudisium 55",
    title: "Penganugerahan Top 3 Yudisium Periode 55",
    category: "Prestasi Akademik",
    badge: "🏆 Nilai Tertinggi",
    date: "Periode 55",
    desc: "Momen penganugerahan predikat Top 3 Yudisium dengan nilai tertinggi, medali kehormatan, serta apresiasi tugas akhir di bidang rekayasa teknologi digital.",
    gradient: "from-blue-600 to-indigo-700",
    image: "/doc-yudisium.jpg",
  },
  {
    id: "doc-2",
    short: "Praktikum Coding Lab",
    title: "Praktikum Laboratorium IT & Coding Lab",
    category: "Riset & Pengembangan",
    badge: "💻 Software Lab",
    date: "2023 - 2024",
    desc: "Sesi intensif pengembangan perangkat lunak, perancangan antarmuka pengguna, eksplorasi framework modern, dan deployment aplikasi web/mobile.",
    gradient: "from-blue-500 to-cyan-600",
    image: "/doc-lab.jpg",
  },
  {
    id: "doc-3",
    short: "Seminar & Kepanitiaan",
    title: "Dokumentasi Seminar & Kepanitiaan Kampus",
    category: "Organisasi & Event",
    badge: "🤝 Event & Media",
    date: "2023 - 2025",
    desc: "Terlibat aktif sebagai tim media publikasi dan dokumentasi visual untuk seminar teknologi berskala nasional serta workshop kreatif kampus.",
    gradient: "from-indigo-600 to-purple-600",
    image: "/doc-seminar.jpg",
  },
  {
    id: "doc-4",
    short: "Pameran Desain",
    title: "Pameran Desain & Karya Multimedia Digital",
    category: "Karya Kreatif",
    badge: "🎨 Showcase Desain",
    date: "2024",
    desc: "Eksplorasi pembuatan branding kit komprehensif, aset UI interaktif, color grading sinematik, serta presentasi portofolio di hadapan penguji dan audiens.",
    gradient: "from-sky-600 to-blue-700",
    image: "/doc-karya.jpg",
  },
];

// Pengalaman kerja (2 pengalaman). Foto: taruh file di public/ sesuai path "image"; kalau belum ada, tampil placeholder gradasi.
const EXPERIENCES = [
  {
    period: "Agustus 2025 – Januari 2026",
    role: "Frontend Developer",
    company: "Cmlabs",
    place: "Malang, Indonesia",
    desc: "Mengembangkan platform HRIS dengan fokus pada frontend, mulai dari perancangan alur aplikasi hingga implementasi antarmuka responsif untuk tiga peran pengguna.",
    tag: "HRIS Development",
    points: [
      "Berperan aktif dalam brainstorming dan perancangan alur aplikasi, termasuk penyusunan flowchart, user persona, dan design system.",
      "Membangun sekitar 90% tampilan antarmuka platform HRIS menggunakan Next.js dan JavaScript untuk tiga peran pengguna berbeda.",
      "Berkontribusi dalam pengembangan backend menggunakan Express.js, termasuk integrasi payment gateway Xendit dan penerapan kontrol akses berdasarkan status langganan pengguna.",
    ],
    skills: [
      "Next.js",
      "JavaScript",
      "Express.js",
      "UI/UX",
      "Design System",
      "Xendit",
    ],
    photos: [],
  },
  {
    period: "Agustus 2025 – Januari 2026",
    role: "IT Developer",
    company: "Program Studi Teknik Elektro, UNTIRTA",
    place: "Cilegon, Indonesia",
    desc: "Mengembangkan sistem informasi manajemen dan website konferensi untuk mendukung kegiatan akademik, administrasi, serta penyelenggaraan konferensi internasional.",
    tag: "Web Development",
    points: [
      "Mengembangkan Sistem Informasi Manajemen (SIM) berbasis web menggunakan Laravel untuk mendigitalisasi alur kerja akademik dan administrasi bagi mahasiswa dan staf.",
      "Membangun dan men-deploy website konferensi ICIEE 2026 menggunakan Next.js untuk mendukung kerja sama internasional dengan Telkom University dan IEEE.",
    ],
    skills: [
      "Laravel",
      "Next.js",
      "Web Development",
      "Deployment",
    ],
    photos: [],
  },
];

const EDUCATIONS = [
  {
    period: "2021 - 2024",
    degree: "Diploma III (D3)",
    school: "Universitas Brawijaya · Vokasi",
    highlight: "Menjadi Top 3 Yudisium Periode 55",
    desc: "Menempuh pendidikan Diploma III di Program Vokasi Universitas Brawijaya, Malang. Fokus pada rekayasa perangkat lunak, pemrograman web & mobile, UI/UX, serta praktik langsung di laboratorium. Lulus dengan IPK 3,96 dan Menjadi Top 3 pada Yudisium Periode 55.",
  },
  {
    period: "2020 - 2023",
    degree: "SMA · MIPA",
    school: "SMA NEGERI 1 TIRTAYASA",
    highlight: "Juara Harapan I FLS2N Film Pendek",
    desc: "Menempuh pendidikan jurusan MIPA dengan mempelajari pelajaran umum seperti matematika, fisika, kimia, biologi dan Lainnya. Di luar pembelajaran akademik, saya mengembangkan minat dalam pembuatan poster, desain grafis, dan editing video. Meraih Juara Harapan I FLS2N melalui film pendek berjudul “Mimpi yang Tak Pernah Abu-Abu”.",
  },
];

type Doc = (typeof DOCUMENTATION_ITEMS)[number];

// Kertas bergaris halus ala buku catatan
const PAPER: React.CSSProperties = {
  backgroundColor: "#faf8f3",
  backgroundImage:
    "linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

// Langit biru bergradasi (awan berupa gradasi statis, lebih ringan daripada blur yang beranimasi)
// Palet referensi: navy, ocean blue, cyan, ice blue, pale cyan.
// Satu latar untuk About + Study agar sambungan antarseksi tetap menyatu.
const SKY = [
  "radial-gradient(ellipse at 15% 3%, rgba(202,240,248,0.30), transparent 42%)",
  "radial-gradient(ellipse at 85% 18%, rgba(144,224,239,0.26), transparent 44%)",
  "linear-gradient(180deg, #0077B6 0%, #00B4D8 30%, #0077B6 65%, #03045E 100%)",
].join(", ");

// Panggung About dibuat panjang dan layarnya "menempel" (sticky) selama user scroll.
// Progres animasi mengikuti posisi scroll langsung: berhenti scroll = animasi berhenti,
// scroll balik = animasi mundur. Tidak ada kunci scroll dan tidak ada animasi otomatis.
//
// Jarak scroll panggung terdiri dari 3 fase (satuan svh = tinggi layar):
//  1. HOLD_IN : judul "ABOUT ME" diam di layar (jeda sebelum animasi mulai / setelah mundur dari animasi)
//  2. ANIM    : tulisan bergeser dan kotak terbuka
//  3. HOLD_OUT: kotak terbuka penuh diam di layar (jeda sebelum lanjut ke halaman berikutnya)
// Jeda ini yang menahan scroll cepat supaya tidak langsung "dredet" melewati halaman.
// Perbesar HOLD_IN / HOLD_OUT kalau mau jeda lebih lama.
const HOLD_IN = 80;
const ANIM = 150;
const HOLD_OUT = 150;
const RANGE = HOLD_IN + ANIM + HOLD_OUT;

const TRACK_HEIGHT = 100 + RANGE; // tinggi lintasan dalam svh
const START_FRAC = HOLD_IN / RANGE; // progres scroll saat animasi mulai
const OPEN_FRAC = (HOLD_IN + ANIM) / RANGE; // progres scroll saat kotak terbuka penuh

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
// Ubah progres scroll lintasan (0..1) menjadi progres animasi (0..1), dengan jeda di awal dan akhir
const toP = (v: number) => {
  const t = clamp01((v - START_FRAC) / (OPEN_FRAC - START_FRAC));
  return t * t * (3 - 2 * t);
};

// ==========================================
// POTONGAN KOMPONEN (dipakai di desktop & HP)
// ==========================================

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.14em] text-zinc-900 uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
      {children}
    </h3>
  );
}

// Foto tanpa bingkai: orangnya saja, dengan blob biru di belakang
// Tanpa garis tepi: hanya bayangan lembut supaya foto terlepas dari kertas
const SHADOW = "drop-shadow(0 12px 16px rgba(10,30,90,0.28))";

// Di desktop foto menembus tepi bawah kartu, lalu memudar di area biru di luar kartu
const FADE_DESKTOP = "linear-gradient(to bottom, #000 calc(100% - 3rem), transparent 100%)";
const FADE_SOFT = "linear-gradient(to bottom, #000 70%, transparent 100%)";

function Cutout({ className = "", fade = FADE_DESKTOP }: { className?: string; fade?: string }) {
  return (
    <div className={`relative w-fit ${className}`}>
      <div className="absolute bottom-[8%] left-[4%] h-[62%] w-[92%] rounded-[48%_52%_46%_54%/56%_46%_54%_44%] bg-gradient-to-br from-sky-300 via-sky-400 to-blue-600 shadow-[inset_0_-12px_30px_rgba(30,64,175,0.35)]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PROFILE.cutout}
        alt={PROFILE.fullName}
        draggable={false}
        className="relative h-full w-auto max-w-none select-none"
        style={{ filter: SHADOW, WebkitMaskImage: fade, maskImage: fade }}
      />
      <div className="absolute -right-6 bottom-[20%] flex rotate-6 items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-blue-700 shadow-lg ring-2 ring-blue-600 sm:-right-8">
        <TrophyIcon weight="fill" className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
        <span className="text-[11px] leading-tight font-extrabold">
          Top 3 Yudisium
          <br />
          Periode 55
        </span>
      </div>
    </div>
  );
}

function Intro() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-extrabold tracking-wider text-white uppercase">
          About me
        </span>
        <span className="-rotate-2 border border-zinc-400 bg-white/80 px-2 py-0.5 text-[10px] tracking-[0.2em] text-zinc-600 uppercase">
          Banten
        </span>
        <span className="rotate-2 border border-zinc-400 bg-white/80 px-2 py-0.5 text-[10px] tracking-[0.2em] text-zinc-600 uppercase">
          Indonesia
        </span>
      </div>

      <h2 className="mt-3 flex flex-wrap items-center gap-x-2 text-3xl leading-[1.05] font-extrabold tracking-tight text-zinc-900 xl:text-4xl">
        <span>Halo! Saya</span>
        <span className="relative text-blue-600">
          {PROFILE.nickname}
          <svg
            className="absolute -bottom-1.5 left-0 h-2 w-full text-blue-300"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d="M1 5 Q 25 1 50 4 T 99 3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
        <motion.span
          animate={{ rotate: [0, 14, -8, 14, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
          className="inline-block origin-[70%_70%]"
          aria-hidden
        >
          👋
        </motion.span>
      </h2>
      <p className="mt-1 text-[13px] font-semibold text-zinc-500">
        {PROFILE.fullName} · {PROFILE.tagline}
      </p>

      <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-zinc-700 lg:[@media(max-height:700px)]:hidden">
        Saya pengembang perangkat lunak dan kreator visual asal Bandung. Saya menggabungkan{" "}
        <b className="text-zinc-900">logika rekayasa IT</b> (web &amp; mobile) dengan{" "}
        <b className="text-zinc-900">sentuhan estetika desain</b>: fotografi studio, retouching, dan UI/UX.
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {INTEREST_TAGS.map((tag, i) => (
          <span
            key={tag.label}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${i === 0 ? "border-blue-600 bg-blue-600 text-white" : "border-blue-200 bg-blue-50 text-blue-800"
              } ${i >= 4 ? "[@media(max-height:720px)]:hidden" : ""}`}
          >
            <span aria-hidden>{tag.icon}</span>
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExperienceList() {
  return (
    <ol className="ml-1.5 space-y-2.5 border-l-2 border-blue-200 pl-3.5">
      {EXPERIENCES.map((e) => (
        <li key={e.period + e.role} className="relative">
          <span className="absolute top-1 -left-[19px] h-2 w-2 rounded-full bg-blue-600 ring-4 ring-[#faf8f3]" />
          <p className="text-[10px] font-extrabold text-blue-600">{e.period}</p>
          <p className="text-xs leading-snug font-bold text-zinc-900">{e.role}</p>
          <p className="text-[11px] text-zinc-500">{e.company}</p>
        </li>
      ))}
    </ol>
  );
}

function EducationList() {
  const [selected, setSelected] = useState<(typeof EDUCATIONS)[number] | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Native dialog tampil di atas layer animasi, pita, dan Dock.
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [selected]);

  return (
    <>
      <ol className="ml-1.5 space-y-2.5 border-l-2 border-blue-200 pl-3.5">
        {EDUCATIONS.map((e) => (
          <li key={e.period} className="relative">
            <span className="absolute top-1 -left-[19px] h-2 w-2 rounded-full bg-blue-600 ring-4 ring-[#faf8f3]" />
            <p className="text-[10px] font-extrabold text-blue-600">{e.period}</p>
            <p className="text-xs leading-snug font-bold text-zinc-900">{e.degree}</p>
            <p className="text-[11px] text-zinc-500">{e.school}</p>
            <button
              type="button"
              onClick={() => setSelected(e)}
              aria-haspopup="dialog"
              aria-label={`Lihat detail pendidikan ${e.school}`}
              className="mt-1 inline-flex min-h-6 items-center gap-1 rounded text-[11px] font-semibold text-blue-600 underline decoration-blue-300 underline-offset-4 transition-colors hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Lihat detail <span aria-hidden="true">↗</span>
            </button>
          </li>
        ))}
      </ol>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
            setSelected(null);
          }
        }}
        style={PAPER}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-blue-100 p-0 text-zinc-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
      >
        {selected && (
          <motion.div
            key={selected.period}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.24, ease: "easeOut" }}
            className="relative p-6 sm:p-8"
          >
            <button
              type="button"
              autoFocus
              onClick={() => setSelected(null)}
              aria-label="Tutup detail pendidikan"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <p className="pr-12 text-[11px] font-bold uppercase tracking-widest text-blue-600">Pendidikan · {selected.period}</p>
            <h3 id={titleId} className="mt-4 pr-8 text-2xl font-extrabold tracking-tight sm:text-3xl">{selected.degree}</h3>
            <p className="mt-2 text-sm font-medium text-zinc-600">{selected.school}</p>
            <p className="mt-5 inline-flex rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{selected.highlight}</p>
            <p id={descriptionId} className="mt-5 text-sm leading-7 text-zinc-700">{selected.desc}</p>
          </motion.div>
        )}
      </dialog>
    </>
  );
}

function ToolsGrid() {
  return (
    // 8 tools = 4 kolom x 2 baris, ringkas dan tanpa slot kosong.
    <div className="grid w-full grid-cols-4 gap-2">
      {TOOLS.map((tool, index) => (
        <div
          key={tool.name}
          title={tool.name}
          className={`group relative flex min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border px-1 py-2 text-center shadow-[0_3px_10px_rgba(30,64,175,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_9px_20px_rgba(30,64,175,0.15)] ${
            index % 4 === 0
              ? "border-sky-200/80 bg-gradient-to-br from-sky-50 to-blue-100/80"
              : index % 4 === 1
                ? "border-indigo-200/70 bg-gradient-to-br from-indigo-50 to-sky-100/80"
                : index % 4 === 2
                  ? "border-cyan-200/80 bg-gradient-to-br from-cyan-50 to-slate-100"
                  : "border-blue-200/70 bg-gradient-to-br from-blue-50 to-violet-100/70"
          }`}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/90 bg-white/90 p-1.5 shadow-sm transition-transform duration-300 group-hover:scale-110">
            {tool.svg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tool.svg} alt="" draggable={false} className="h-full w-full object-contain" />
            ) : (
              <span className={`text-xs font-extrabold ${tool.fg ?? "text-blue-700"}`}>{tool.abbr}</span>
            )}
          </div>
          <span className="w-full min-h-[20px] whitespace-nowrap text-[8px] leading-[10px] font-bold text-slate-700" >
            {tool.name}
          </span>
        </div>
      ))}
    </div>
  );
}

function DocImage({ doc, className = "" }: { doc: Doc; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${doc.gradient} ${className}`}>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={doc.image}
          alt={doc.title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white/90">
          <ImageIcon size={26} />
          <span className="text-[11px] font-bold">{doc.badge}</span>
        </div>
      )}
    </div>
  );
}

function scrollToDetails() {
  document.getElementById("study-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Ikon tools yang melayang di kiri dan kanan judul (file ada di public/tools).
// top = posisi dari atas panggung (%), x = jarak dari tepi kiri/kanan (%), size = ukuran tile (px), rot = kemiringan (derajat)
const FLOAT_TOOLS = {
  left: [
    { name: "Figma", src: "/tools/figma.svg", top: 8, x: 5, size: 68, rot: -8 },
    { name: "React", src: "/tools/react.svg", top: 24, x: 17, size: 58, rot: 6 },
    { name: "Next.js", src: "/tools/nextjs.svg", top: 40, x: 4, size: 74, rot: -4 },
    { name: "Git", src: "/tools/git.svg", top: 55, x: 16, size: 60, rot: 8 },
    { name: "TypeScript", src: "/tools/typescript.svg", top: 69, x: 6, size: 64, rot: -6 },
  ],
  right: [
    { name: "VS Code", src: "/tools/vscode.svg", top: 10, x: 6, size: 66, rot: 7 },
    { name: "Tailwind CSS", src: "/tools/tailwind.svg", top: 26, x: 18, size: 60, rot: -6 },
    { name: "Node.js", src: "/tools/nodejs.svg", top: 42, x: 5, size: 72, rot: 5 },
    { name: "Laravel", src: "/tools/laravel.svg", top: 57, x: 17, size: 58, rot: -8 },
    { name: "Flutter", src: "/tools/flutter.svg", top: 70, x: 7, size: 64, rot: 6 },
  ],
};

// Ikon tools terbang masuk dari kiri dan kanan saat panggung About muncul, lalu melayang pelan.
// Saat di-scroll, ikon bergeser keluar ke sisi masing-masing mengikuti gerak tulisan ABOUT ME
// (dan masuk lagi kalau scroll balik ke atas).
function FloatingTools({ p, show }: { p: MotionValue<number>; show: boolean }) {
  const leftX = useTransform(p, [0, 0.4], ["0vw", "-45vw"]);
  const rightX = useTransform(p, [0, 0.4], ["0vw", "45vw"]);
  const fade = useTransform(p, [0, 0.3], [1, 0]);
  const sides = [
    { key: "left", isLeft: true, items: FLOAT_TOOLS.left, x: leftX },
    { key: "right", isLeft: false, items: FLOAT_TOOLS.right, x: rightX },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden lg:block">
      {sides.map((side) => {
        const fromX = side.isLeft ? "-45vw" : "45vw";
        return (
          <motion.div key={side.key} style={{ x: side.x, opacity: fade }} className="absolute inset-0">
            {side.items.map((t, i) => (
              <motion.div
                key={t.name}
                className="absolute"
                style={side.isLeft ? { top: `${t.top}%`, left: `${t.x}%` } : { top: `${t.top}%`, right: `${t.x}%` }}
                initial={{ x: fromX, opacity: 0, scale: 0.5, rotate: t.rot * 3 }}
                animate={
                  show
                    ? { x: 0, opacity: 1, scale: 1, rotate: t.rot }
                    : { x: fromX, opacity: 0, scale: 0.5, rotate: t.rot * 3 }
                }
                transition={{ type: "spring", stiffness: 140, damping: 15, delay: show ? 0.02 + i * 0.05 : 0 }}
              >
                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  className="flex items-center justify-center rounded-2xl bg-white/95 p-3 shadow-[0_14px_30px_rgba(5,20,70,0.35)] ring-1 ring-white/60"
                  style={{ width: t.size, height: t.size }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.src} alt="" draggable={false} className="h-full w-full object-contain" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        );
      })}
    </div>
  );
}

// ==========================================
// KOMPONEN UTAMA
// ==========================================

export default function AboutSection() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileCardRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const dockOpen = useDockOpen();

  const isDesktop = useIsDesktop();
  const scrub = isDesktop && !reduce;
  const [iconsOn, setIconsOn] = useState(false); // ikon tools terbang masuk saat tiba di panggung About

  // Progres scroll panggung: 0 saat panggung baru menempel, 1 saat akan dilepas.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  // p: 0 = tertutup, 1 = terbuka. Mengikuti scroll lewat spring tipis supaya terasa halus,
  // tapi tetap berhenti begitu scroll berhenti dan mundur saat scroll ke atas.
  const p = useSpring(0, { stiffness: 160, damping: 30, mass: 0.8, restDelta: 0.0001 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (scrub) p.set(toP(v));
  });
  useMotionValueEvent(p, "change", (v) => setOpen(v > 0.6));

  // Sinkron saat pertama tampil / ganti ukuran layar / reduce motion
  // (misalnya setelah reload di tengah halaman, animasi langsung ada di posisi yang benar)
  useEffect(() => {
    if (!isDesktop) p.jump(0);
    else if (reduce) p.jump(1);
    else p.jump(toP(scrollYProgress.get()));
  }, [isDesktop, reduce, p, scrollYProgress]);

  const isOpen = !!reduce || open;

  // Hanya mengamati posisi: tidak mengunci wheel/touch/keyboard atau memindahkan scroll.
  // Batas keluar berbeda dari batas masuk agar ikon tidak berkedip di tepi section.
  useEffect(() => {
    if (!scrub) {
      setIconsOn(false);
      return;
    }
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Ikon langsung terbang masuk begitu panggung About mulai terlihat saat scroll dari Hero.
      // Batas keluar sedikit lebih jauh dari batas masuk supaya tidak berkedip di tepi section.
      const next = visible
        ? rect.top < vh * 1.02 && rect.bottom > 0
        : rect.top < vh * 0.97 && rect.bottom > vh * 0.1;
      if (next !== visible) {
        visible = next;
        setIconsOn(next);
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [scrub]);

  // 1. "ABOUT" ke kanan, "ME" ke kiri, lalu memudar
  const aboutX = useTransform(p, [0, 0.4], ["0vw", "58vw"]);
  const meX = useTransform(p, [0, 0.4], ["0vw", "-58vw"]);
  const titleOpacity = useTransform(p, [0, 0.36], [1, 0]);
  const hintOpacity = useTransform(p, [0, 0.1], [1, 0]);
  const hintEvents = useTransform(p, (v) => (v < 0.05 ? "auto" : "none"));

  // 2. Kotak muncul dari belakang (zoom in, mulai persegi), lalu melebar ke kiri dan kanan
  const boxScale = useTransform(p, [0.12, 0.5], [0.6, 1]);
  const boxOpacity = useTransform(p, [0.1, 0.35], [0, 1]);
  const paperClip = useTransform(p, [0.3, 0.7], [
    "inset(22% 35% 22% 35% round 36px)",
    "inset(0% 0% 0% 0% round 36px)",
  ]);

  // 3. Isi kotak muncul setelah kotak melebar
  const contentOpacity = useTransform(p, [0.62, 0.9], [0, 1]);
  const contentY = useTransform(p, [0.62, 0.9], [24, 0]);

  // 4. Pita "OPEN TO WORK" di belakang kotak putih: muncul setelah kotak terbuka (mundur kalau scroll balik)
  const loopOpacity = useTransform(p, [0.72, 0.98], [0, 1]);
  const loopScale = useTransform(p, [0.7, 1], [0.92, 1]);

  // Tombol buka/tutup: cukup menggulir halaman ke titik terbuka atau ke awal panggung.
  // Animasinya ikut berjalan (maju atau mundur) karena terikat pada posisi scroll.
  const scrollToProgress = (frac: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + range * frac, behavior: reduce ? "auto" : "smooth" });
  };

  const toggle = () => {
    if (!isDesktop) {
      mobileCardRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      return;
    }
    scrollToProgress(isOpen ? 0 : OPEN_FRAC);
  };

  // Tutup lightbox dengan tombol Esc
  useEffect(() => {
    if (!selectedDoc) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedDoc(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedDoc]);

  return (
    <div className="relative isolate w-full text-white" style={{ overflowX: "clip", background: SKY, "--font-sx-hand": hand.style.fontFamily } as React.CSSProperties}>
      {/* ============ LINTASAN SCROLL (desktop): tinggi ekstra = jarak scroll untuk animasi ============ */}
      <div
        ref={trackRef}
        className="relative"
        style={isDesktop && !reduce ? { height: `${TRACK_HEIGHT}svh` } : undefined}
      >
        {/* Penanda posisi "terbuka penuh", dipakai Dock saat klik About */}
        {scrub && (
          <div
            id="about-open"
            aria-hidden
            className="pointer-events-none absolute left-0 w-full"
            style={{ top: `${HOLD_IN + ANIM}svh`, height: 1 }}
          />
        )}

        {/* ============ PANGGUNG (menempel di layar selama scroll di lintasan) ============ */}
        <div className="relative h-[62svh] w-full overflow-visible lg:sticky lg:top-0 lg:h-svh">
          <div className="absolute inset-0">
            {/* Gradasi memakai wrapper bersama agar batas About/Study tidak terpotong. */}

            {/* Ikon tools melayang dari kiri dan kanan */}
            {scrub && <FloatingTools p={p} show={iconsOn} />}

            {/* Dua pita tipis di belakang kartu putih, dengan overflow SVG tetap terlihat. */}
            {scrub && (
              <motion.div
                aria-hidden
                style={{ opacity: loopOpacity, scale: loopScale }}
                className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-[15] hidden flex-col justify-between pt-1 pb-[94px] lg:flex"
              >
                {[false, true].map((bottom) => (
                  <div key={String(bottom)} className="w-full shrink-0">
                    <TextLoop
                      text="Open to work"
                      className="text-loop--contained"
                      viewBox="0 208 1200 104"
                      shape="wave"
                      path={bottom
                        ? "M -1200 250 Q -900 294 -600 250 T 0 250 T 600 250 T 1200 250 T 1800 250 T 2400 250"
                        : "M -1200 270 Q -900 226 -600 270 T 0 270 T 600 270 T 1200 270 T 1800 270 T 2400 270"}
                      speed={45}
                      direction={bottom ? "reverse" : "forward"}
                      separator="✦"
                      tilt={0}
                      fontSize={22}
                      fontWeight={700}
                      letterSpacing={1}
                      ribbon
                      ribbonColor={bottom ? "#03045E" : "#023E8A"}
                      color="#CAF0F8"
                      ribbonWidth={36}
                      cross={false}
                      pauseOnHover={false}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tulisan ABOUT ME */}
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden pb-16">
              <motion.div
                style={{ x: aboutX, opacity: titleOpacity }}
                className="title-shadow text-[clamp(4.5rem,15vw,11.5rem)] leading-[0.85] font-extrabold tracking-[-0.045em] uppercase"
              >
                About
              </motion.div>
              <motion.div
                style={{ x: meX, opacity: titleOpacity }}
                className="title-shadow text-[clamp(4.5rem,15vw,11.5rem)] leading-[0.85] font-extrabold tracking-[-0.045em] uppercase"
              >
                Me
              </motion.div>

              {!reduce && !isOpen && (
                <motion.button
                  type="button"
                  onClick={toggle}
                  style={{ opacity: hintOpacity, pointerEvents: hintEvents }}
                  className="glass mt-8 flex items-center gap-2.5 rounded-full px-5 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-white"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <ArrowDown size={15} className="animate-bounce" aria-hidden />
                  Scroll atau klik untuk membuka About
                </motion.button>
              )}
            </div>

            {/* Kotak kertas (desktop): tingginya ikut membesar saat dock ditutup */}
            <div
              className="pointer-events-none absolute inset-x-0 top-12 z-20 hidden items-center justify-center px-4 transition-[bottom] duration-500 ease-out lg:flex"
              style={{ bottom: dockOpen ? "7.75rem" : "3.25rem" }}
            >
              <motion.div
                style={{ scale: boxScale, opacity: boxOpacity, pointerEvents: isOpen ? "auto" : "none" }}
                className="about-card-surface relative h-full max-h-[780px] w-[min(1120px,94vw)]"
              >
                <div className="absolute inset-0 [filter:drop-shadow(0_28px_45px_rgba(5,15,60,0.4))]">
                  <motion.div style={{ clipPath: paperClip, ...PAPER }} className="h-full w-full" />
                </div>

                <motion.div
                  aria-hidden={!isOpen}
                  style={{ opacity: contentOpacity, y: contentY, visibility: isOpen ? "visible" : "hidden" }}
                  className="absolute inset-0 z-10 text-zinc-900"
                >
                  {/* Foto tanpa bingkai, menembus tepi kiri dan atas kotak */}
                  <div className="pointer-events-none absolute bottom-[-3rem] left-0 z-10 flex h-[calc(100%_+_4.5rem)] max-h-[820px] w-[21.75rem] justify-center xl:w-[24.25rem]">
                    <Cutout className="h-full" />
                  </div>

                  {!reduce && (
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute top-5 right-7 z-30 flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.45)] ring-2 ring-white outline-none transition-colors hover:bg-blue-700 focus-visible:ring-blue-300"
                    >
                      <ArrowUp size={14} aria-hidden />
                      Tutup About
                    </button>
                  )}

                  <div className="grid h-full grid-cols-[20rem_1fr] gap-8 p-7 xl:grid-cols-[22rem_1fr] xl:gap-10 xl:p-9">
                    <div aria-hidden />
                    <div data-inner-scroll className="no-scrollbar flex min-w-0 flex-col justify-between gap-4 overflow-y-auto">
                      <Intro />
                      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(260px,1.65fr)] gap-3 border-t border-zinc-900/10 pt-4">
                        <div>
                          <SectionTitle>Pengalaman</SectionTitle>
                          <ExperienceList />
                        </div>
                        <div>
                          <SectionTitle>Pendidikan</SectionTitle>
                          <EducationList />
                        </div>
                        <div>
                          <SectionTitle>Tools</SectionTitle>
                          <ToolsGrid />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 font-medium text-zinc-500">
                          <MapPin size={13} className="text-blue-600" />
                          {PROFILE.location}, Indonesia
                        </span>
                        <button
                          type="button"
                          onClick={scrollToDetails}
                          className="flex items-center gap-1 font-bold text-blue-600 transition-colors hover:text-blue-800"
                        >
                          Lihat riwayat studi &amp; dokumentasi
                          <ChevronDown size={14} className="animate-bounce" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ KARTU VERSI HP / TABLET ============ */}
      <section ref={mobileCardRef} id="about-card" className="relative z-10 scroll-mt-12 px-4 pt-20 pb-10 lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          style={PAPER}
          className="about-mobile-surface mx-auto w-full max-w-xl rounded-[32px] p-5 pb-6 text-zinc-900 sm:p-7"
        >
          <Cutout fade={FADE_SOFT} className="mx-auto -mt-16 h-72 sm:h-80" />
          <div className="mt-5">
            <Intro />
          </div>
          <div className="mt-5 grid gap-6 border-t border-zinc-900/10 pt-5 sm:grid-cols-2">
            <div>
              <SectionTitle>Pengalaman</SectionTitle>
              <ExperienceList />
            </div>
            <div>
              <SectionTitle>Pendidikan</SectionTitle>
              <EducationList />
            </div>
            <div className="sm:col-span-2">
              <SectionTitle>Tools</SectionTitle>
              <div className="w-full">
                <ToolsGrid />
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="flex items-center gap-1 font-medium text-zinc-500">
              <MapPin size={13} className="text-blue-600" />
              {PROFILE.location}
            </span>
            <button
              type="button"
              onClick={scrollToDetails}
              className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800"
            >
              Lihat riwayat studi &amp; dokumentasi
              <ChevronDown size={14} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Hanya surface About: tidak mengubah backdrop modal, Dock, atau bayangan foto. */}
      <style>{`
        .about-card-surface {
          isolation: isolate;
          filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        /* Blur hanya pada lapisan dekorasi di belakang kertas dan konten. */
        .about-card-surface::before {
          content: "";
          position: absolute;
          inset: -18px -22px;
          z-index: -1;
          border-radius: 64px;
          pointer-events: none;
          background: radial-gradient(ellipse at 30% 35%, rgba(202,240,248,.40), transparent 65%),
                      radial-gradient(ellipse at 75% 70%, rgba(0,180,216,.32), transparent 70%);
          filter: blur(34px);
        }
        .about-mobile-surface {
          box-shadow: 0 0 48px 12px rgba(144,224,239,.24), 0 22px 48px rgba(3,4,94,.30);
        }
      `}</style>
      <StudyExpSection />

      {/* ============ LIGHTBOX ============ */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedDoc.title}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: -1.5 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-sm bg-white p-3 pb-5 text-zinc-900 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                aria-label="Tutup"
                className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition-transform hover:scale-110"
              >
                <X size={16} />
              </button>
              <DocImage doc={selectedDoc} className="aspect-[4/3] w-full" />
              <div className="px-1 pt-3">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                  {selectedDoc.badge}
                </span>
                <h3 className={`${hand.className} mt-2 text-3xl leading-none`}>{selectedDoc.title}</h3>
                <p className="mt-1 text-[11px] font-semibold text-zinc-500">
                  {selectedDoc.category} · {selectedDoc.date}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-700">{selectedDoc.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}