"use client";
import {
    createContext,
    useContext,
    useId,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
    type CSSProperties,
    type ReactNode,
} from "react";
import { Caveat } from "next/font/google";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
} from "motion/react";
import { ImageIcon, PlusIcon, TrophyIcon } from "@phosphor-icons/react";
import { useDockOpen } from "@/hooks/useDockOpen";

const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"] });

/* ==========================================================================
   CARA PAKAI (ringkas)
   - Section ini dipasang di AboutSection. Jangan render lagi di page.tsx.
   - Desktop: 2 "halaman" bersebelahan. Saat di-scroll, halaman TIDAK turun ke bawah,
     tapi bergeser ke samping: halaman 1 = Study (kiri) + Experience (kanan), halaman 2 = Internship.
   - HP / reduce motion: disusun ke bawah.
   - Foto, poster, dan stiker diisi lewat path file di folder public/.
     Kalau file belum ada, tampil kotak placeholder bertuliskan nama slotnya.
   - Semua posisi memakai koordinat kanvas 1440 x 900 (x, y = pojok kiri atas, w, h = ukuran,
     rot = kemiringan dalam derajat). Ubah angkanya untuk menggeser apa pun.
   - Setelah semua slot terisi, ubah SHOW_EMPTY_SLOTS jadi false supaya slot kosong tidak tampil.
   ========================================================================== */

const SHOW_EMPTY_SLOTS = true;
// Penanda stiker tetap terlihat sampai file public/stickers/01.png ... 17.png diisi.
const SHOW_STICKER_SLOTS = true;

// Panjang scroll untuk pergeseran ke samping (satuan svh). Besarkan kalau mau lebih lambat.
const TRACK = 380;

const W = 1440;
const H = 900;
const pct = (v: number, base: number) => `${(v / base) * 100}%`;
const rect = (x: number, y: number, w: number, h?: number): CSSProperties => ({
    position: "absolute",
    left: pct(x, W),
    top: pct(y, H),
    width: pct(w, W),
    ...(h !== undefined ? { height: pct(h, H) } : {}),
});
// ukuran huruf mengikuti lebar kanvas (cqw), dengan batas minimum
const fs = (n: number, min = 9) => `max(${min}px, ${n}cqw)`;

/* ==========================================================================
   ISI
   ========================================================================== */
const INK = "#0e2f33";
const CREAM = "#fff7e2";
const YELLOW = "#ffd84d";
const MINT = "#bff0df";

const STUDY = {
    kicker: "01 / THE LEARNING YEARS",
    note: "where it all started",
    entries: [
        {
            date: "2021 — 2024",
            title: "Universitas Brawijaya",
            role: "Diploma III · Program Vokasi · Malang",
            text: "Belajar membangun pengalaman digital lewat web, mobile, dan UI/UX, dengan praktik langsung di laboratorium.",
            tag: "Top 3 Yudisium · Periode 55",
        },
        {
            date: "2020 — 2023",
            title: "SMA NEGERI 1 TIRTAYASA",
            role: "MIPA (Matematika dan Ilmu Pengetahuan Alam)",
            text: "Awal eksplorasi desain grafis, foto, dan video.",
            tag: "",
        },
    ],
};

const EXPERIENCE = {
    kicker: "02 / OUT IN THE REAL WORLD",
    note: "learning by doing",
    entries: [
        {
            date: "2023",
            title: "Google Developer Student Club UB",
            role: "Anggota · Malang",
            text: "mengikuti kegiatan komunitas, belajar membuat aplikasi web dan mobile, serta mengerjakan proyek bersama anggota lain.",
            tag: "",
        },
        {
            date: "2024",
            title: "HMI Vokasi UB",
            role: "PDD · LK1 · Malang",
            text: "Membuat konten visual untuk media sosial, poster, dan dokumentasi kegiatan organisasi.",
            tag: "",
        },
    ],
};

// EDIT: ganti dengan cerita magangmu
type ToolChip = { name: string; svg?: string; abbr?: string; bg?: string; fg?: string };
const INTERNSHIP = {
    heading: "INTERNSHIP",
    kicker: "CMLABS SEO OPTIMIZATION & DIGITAL MARKETING",
    note: "a few things i've made",
    entries: [
        {
            company: "Cmlabs",
            role: "Frontend Developer",
            date: "Agustus 2025 – Januari 2026",
            location: "Malang",
            text: "Merancang alur HRIS dan mengembangkan sekitar 90% antarmuka responsif untuk tiga peran pengguna menggunakan Next.js. Turut mengintegrasikan Xendit dan kontrol akses langganan dengan Express.js.",
        },
        {
            company: "Prodi Teknik Elektro UNTIRTA",
            role: "IT Developer",
            date: "Agustus 2025 – Januari 2026",
            location: "Cilegon",
            text: "Mengembangkan sistem informasi manajemen akademik berbasis Laravel serta membangun dan melakukan deployment website konferensi ICIEE 2026 menggunakan Next.js.",
        },
    ],
    // Deretan tools ala Dock macOS. svg = file di public/, abbr = singkatan kalau tidak ada logo.
    tools: [
        { name: "Figma", svg: "/tools/figma.svg", abbr: "Fi", bg: "#fff", fg: "#111" },
        { name: "Next.js", svg: "/tools/nextjs.svg", abbr: "Nx", bg: "#fff", fg: "#111" },
        { name: "JavaScript", svg: "/tools/javascript.svg", abbr: "JS", bg: "#f7df1e", fg: "#171717" },
        { name: "Express.js", svg: "/tools/express.svg", abbr: "Ex", bg: "#202020", fg: "#fff" },
        { name: "Xendit", svg: "/tools/xendit.svg", abbr: "Xd", bg: "#fff", fg: "#111" },
    ] as ToolChip[],
    // Tools untuk Prodi Teknik Elektro UNTIRTA, terpisah dari tools Cmlabs.
    toolsUntirta: [
        { name: "Laravel", svg: "/tools/laravel.svg", abbr: "Lv", bg: "#fff", fg: "#ff2d20" },
        { name: "Next.js", svg: "/tools/nextjs.svg", abbr: "Nx", bg: "#fff", fg: "#111" },
        { name: "VS Code", svg: "/tools/vscode.svg", abbr: "VS", bg: "#fff", fg: "#007acc" },
        { name: "GitHub", svg: "/tools/github.svg", abbr: "GH", bg: "#fff", fg: "#111" },
    ] as ToolChip[],
};

type Media = { src: string; alt: string };
type PhotoSlot = Media & {
    caption: string;
    variant?: "plain"; // semua foto polos (caption disimpan untuk keperluan lain, tidak ditampilkan)
    tape?: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    rot: number;
    z: number;
};

// STUDY: 2 foto di atas = momen mahasiswa terbaik, 3 foto di bawah = masa kuliah. Tidak saling menumpuk.
const STUDY_PHOTOS: PhotoSlot[] = [
    { src: "photos/doc-yudisium.jpeg", alt: "Penganugerahan yudisium", caption: "a little proud moment", variant: "plain", x: 68, y: 70, w: 216, h: 162, rot: -3, z: 12 },
    { src: "photos/doc-karya.jpeg", alt: "Pameran karya", caption: "made with curiosity", variant: "plain", x: 312, y: 58, w: 216, h: 162, rot: 3, z: 12 },
    { src: "photos/doc-sma1.jpeg", alt: "Praktikum di laboratorium", caption: "build. break. learn.", variant: "plain", x: 40, y: 660, w: 170, h: 206, rot: -3, z: 12 },
    { src: "photos/doc-sma2.jpeg", alt: "Kegiatan kampus", caption: "the campus days", variant: "plain", x: 228, y: 666, w: 170, h: 206, rot: 2.5, z: 12 },
    { src: "photos/doc-sma3.jpeg", alt: "Teman kampus", caption: "good company", variant: "plain", x: 416, y: 660, w: 170, h: 206, rot: -2, z: 12 },
];

const EXP_PHOTOS: PhotoSlot[] = [
    { src: "photos/hmi1.jpeg", alt: "Retouching di Bless Friday", caption: "behind the lens", variant: "plain", x: 1000, y: 48, w: 236, h: 186, rot: -4, z: 12 },
    { src: "photos/hmi2.jpeg", alt: "Penataan lighting studio", caption: "chasing good light", variant: "plain", tape: true, x: 1230, y: 100, w: 176, h: 226, rot: 5, z: 11 },
    { src: "photos/org1.jpeg", alt: "Studio self photo Momenku", caption: "studio diaries", variant: "plain", x: 986, y: 262, w: 200, h: 160, rot: 3, z: 13 },
    { src: "photos/org2.jpeg", alt: "Sesi foto pengunjung", caption: "one more shot!", variant: "plain", tape: true, x: 1190, y: 326, w: 216, h: 150, rot: -3, z: 14 },
];

// Foto internship: 4 foto besar. File: public/intern/feed-01.jpg sampai feed-04.jpg
const INTERN_PHOTOS: PhotoSlot[] = [
    { src: "photos/mgn.jpeg", alt: "Desain feed 1", caption: "feed_01.png", variant: "plain", x: 602, y: 54, w: 424, h: 318, rot: -2.5, z: 12 },
    { src: "photos/mgn1.jpeg", alt: "Desain feed 2", caption: "feed_02.png", variant: "plain", x: 1062, y: 98, w: 424, h: 318, rot: 2.5, z: 13 },
    { src: "photos/mgn2.jpeg", alt: "Desain feed 3", caption: "feed_03.png", variant: "plain", x: 630, y: 400, w: 424, h: 318, rot: 2, z: 14 },
    { src: "photos/mgn3.jpeg", alt: "Desain feed 4", caption: "feed_04.png", variant: "plain", x: 1088, y: 440, w: 424, h: 318, rot: -2, z: 15 },
];

// Stiker acak. Taruh PNG transparan di public/stickers/ (01.png, 02.png, dst).
// x, y = pojok kiri atas, w = lebar (stiker dibuat persegi), rot = kemiringan.
type StickerSlot = { src: string; label: string; x: number; y: number; w: number; rot: number };
// UBAH NAMA FILE STIKER DI SINI SAJA (lokasi file: public/stickers/).
// Setiap nomor adalah stiker yang berbeda. Bisa .png, .jpg, .jpeg, atau .webp.
const STICKER_FILES = [
    "brone.png", // Stiker 01
    "logoub.png",    // Stiker 02
    "vokasiub.png",    // Stiker 03
    "gdsc.png",    // Stiker 04
    "hmi.png",    // Stiker 05
    "kemnaker.png",    // Stiker 06
    "exp1.png",    // Stiker 07
    "exp2.png",    // Stiker 08
    "smantir.png",    // Stiker 09
    "cmlabs.png",    // Stiker 10
    "untirta.png",    // Stiker 11
    "int1.png",    // Stiker 12
    "int2.png",    // Stiker 13
    "int3.png",    // Stiker 14
    "int4.png",    // Stiker 15
    "int5.png",    // Stiker 16
    "int6.png",    // Stiker 17
];
const stk = (n: number, x: number, y: number, w: number, rot: number): StickerSlot => ({
    src: `/stickers/${STICKER_FILES[n - 1]}`,
    label: `STIKER ${String(n).padStart(2, "0")}`,
    x, y, w, rot,
});
const STICKERS_1: StickerSlot[] = [
    stk(1, 480, 22, 100, -12),
    stk(2, 356, 150, 84, 10),
    stk(3, 400, 628, 92, -6),
    stk(4, 896, 640, 100, -10),
    stk(5, 1352, 380, 80, 12),
    stk(6, 1348, 12, 80, -8),
    stk(7, 752, 30, 108, 6),
    stk(8, 706, 770, 100, -6),
    stk(9, 6, 214, 74, 8),
];
const STICKERS_2: StickerSlot[] = [
    stk(10, 519, 20, 96, 10),
    stk(11, 965, 372, 84, -8),
    stk(12, 515, 770, 90, -5),
    stk(13, 1193, 22, 92, 8),
    stk(14, 980, 780, 100, 8),
    stk(15, 1271, 430, 76, -12),
    stk(16, 140, 780, 96, 6),
    stk(17, 1245, 806, 88, -8),
];

/* ==========================================================================
   UTIL
   ========================================================================== */
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

type StageCtx = { slide: MotionValue<number>; reveal: MotionValue<number>; mx: MotionValue<number>; my: MotionValue<number> };
const StageContext = createContext<StageCtx | null>(null);

// Lapisan parallax: ikut bergeser lebih cepat atau lambat dari halaman saat scroll,
// dan sedikit mengikuti gerak kursor. depth besar = terasa lebih dekat.
function Layer({
    panel,
    depth = 1,
    lift,
    revealAt,
    style,
    className = "",
    children,
}: {
    panel: 1 | 2;
    depth?: number;
    lift?: boolean;
    // Hanya halaman 2: elemen baru muncul (naik + membesar) saat progres reveal melewati angka ini (0 - 0.7)
    revealAt?: number;
    style?: CSSProperties;
    className?: string;
    children: ReactNode;
}) {
    const ctx = useContext(StageContext);
    const zero = useMotionValue(0);
    const slide = ctx?.slide ?? zero;
    const reveal = ctx?.reveal ?? zero;
    const mx = ctx?.mx ?? zero;
    const my = ctx?.my ?? zero;
    const x = useTransform(
        slide,
        [0, 1],
        panel === 1 ? ["0vw", `${-depth * 9}vw`] : [`${depth * 9}vw`, "0vw"],
    );
    const px = useTransform(mx, (v) => v * depth * 16);
    const py = useTransform(my, (v) => v * depth * 12);
    const a = revealAt ?? -1;
    const rv = useTransform(reveal, [a, a + (revealAt === undefined ? 1 : 0.3)], [0, 1]);
    const rvScale = useTransform(rv, [0, 1], [0.86, 1]);
    const rvY = useTransform(rv, [0, 1], [46, 0]);
    const revealStyle = revealAt === undefined ? {} : { opacity: rv, scale: rvScale, y: rvY };
    return (
        <motion.div className={className} style={{ ...style, x, ...revealStyle }} whileHover={lift ? { zIndex: 60 } : undefined}>
            <motion.div className="h-full w-full" style={{ x: px, y: py }}>
                {children}
            </motion.div>
        </motion.div>
    );
}

// Gambar dengan cadangan (aman juga untuk gambar yang gagal dimuat sebelum halaman siap)
function SlotImage({
    src,
    alt,
    fallback,
    className = "h-full w-full object-cover",
}: {
    src: string;
    alt: string;
    fallback: ReactNode;
    className?: string;
}) {
    const [failed, setFailed] = useState(false);
    if (!src || failed) return <>{fallback}</>;
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            ref={(el) => {
                if (el && el.complete && el.naturalWidth === 0) setFailed(true);
            }}
            src={src}
            alt={alt}
            draggable={false}
            loading="lazy"
            className={className}
            onError={() => setFailed(true)}
        />
    );
}

function Placeholder({ label, dark }: { label: string; dark?: boolean }) {
    if (!SHOW_EMPTY_SLOTS) return <div className="h-full w-full" style={{ background: dark ? "#16363a" : "#dfe8f5" }} />;
    return (
        <div
            className="flex h-full w-full flex-col items-center justify-center gap-[0.4em]"
            style={{
                background: dark
                    ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 0.6em, transparent 0.6em 1.2em), #16363a"
                    : "repeating-linear-gradient(135deg, rgba(37,99,235,0.07) 0 0.6em, transparent 0.6em 1.2em), linear-gradient(160deg,#eaf3ff,#cfe2fb)",
                color: dark ? "rgba(255,255,255,0.55)" : "rgba(30,64,120,0.55)",
            }}
        >
            <ImageIcon weight="fill" className="h-[2.4em] w-[2.4em]" aria-hidden />
            <span className="study-entry-meta font-bold tracking-wider uppercase" style={{ fontSize: "0.85em" }}>
                {label}
            </span>
        </div>
    );
}

/* ==========================================================================
   KOMPONEN VISUAL
   ========================================================================== */

// Foto biasa: polos, sudut sedikit membulat, bayangan lembut.
function Tile({ media, rot, delay = 0, fontSize, className = "", style, label }: {
    media: Media;
    variant?: "plain";
    caption?: string;
    tape?: boolean;
    rot: number;
    delay?: number;
    fontSize: string;
    className?: string;
    style?: CSSProperties;
    label: string;
}) {
    const reduce = useReducedMotion();
    return (
        <motion.figure
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.94, rotate: rot + 5 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: rot }}
            whileHover={reduce ? undefined : { scale: 1.04, rotate: 0, y: -5 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ type: "spring", stiffness: 130, damping: 19, delay }}
            className={`relative m-0 overflow-hidden ${className}`}
            style={{
                ...style,
                fontSize,
                margin: 0,
                padding: 0,
                border: 0,
                borderRadius: "0.45em",
                background: "transparent",
                boxShadow: "0 16px 32px rgba(5,25,70,.34), 0 4px 10px rgba(5,25,70,.22)",
            }}
        >
            <SlotImage src={media.src} alt={media.alt} fallback={<Placeholder label={label} />} />
        </motion.figure>
    );
}

// Deretan tools ala Dock macOS: ikon squircle yang membesar saat disentuh
function ToolDock({ tools }: { tools: ToolChip[] }) {
    return (
        <div
            className="flex w-fit items-end gap-[0.6em]"
            style={{
                padding: "0.55em 0.75em",
                borderRadius: "1.1em",
                background: "rgba(15,23,42,0.07)",
                boxShadow: "inset 0 0 0 0.5px rgba(15,23,42,0.14)",
            }}
        >
            {tools.map((t) => (
                <motion.div
                    key={t.name}
                    title={t.name}
                    whileHover={{ y: -7, scale: 1.22 }}
                    transition={{ type: "spring", stiffness: 320, damping: 16 }}
                    className="flex items-center justify-center"
                    style={{
                        width: "2.6em",
                        height: "2.6em",
                        borderRadius: "23%",
                        background: t.bg ?? "#fff",
                        boxShadow: "0 4px 9px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.55)",
                    }}
                >
                    {t.svg ? (
                        <SlotImage
                            src={t.svg}
                            alt={t.name}
                            className="h-[62%] w-[62%] object-contain"
                            fallback={<span className="font-extrabold" style={{ color: t.fg, fontSize: "0.95em" }}>{t.abbr}</span>}
                        />
                    ) : (
                        <span className="font-extrabold" style={{ color: t.fg, fontSize: "0.95em" }}>{t.abbr}</span>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

// Ilustrasi SVG khusus: bidang berwarna penuh, highlight, dan sisi gelap.
// Tidak membutuhkan file gambar atau paket ikon tambahan.
function FeatureArtwork({ kind }: { kind: "study" | "experience" | "internship" }) {
    const uid = useId().replace(/:/g, "");
    const fill = (name: string) => `url(#${uid}-${name})`;
    return <svg viewBox="0 0 320 320" className="h-full w-full" fill="none" aria-hidden="true">
        <defs>
            <linearGradient id={`${uid}-navy`} x1="35" y1="55" x2="250" y2="260" gradientUnits="userSpaceOnUse"><stop stopColor="#528fdd" /><stop offset=".5" stopColor="#174a8d" /><stop offset="1" stopColor="#08294f" /></linearGradient>
            <linearGradient id={`${uid}-gold`} x1="100" y1="70" x2="250" y2="260" gradientUnits="userSpaceOnUse"><stop stopColor="#fff3a5" /><stop offset=".5" stopColor="#ffd15a" /><stop offset="1" stopColor="#e89324" /></linearGradient>
            <linearGradient id={`${uid}-glass`} x1="65" y1="42" x2="211" y2="203" gradientUnits="userSpaceOnUse"><stop stopColor="#e4fcff" /><stop offset=".45" stopColor="#91deed" /><stop offset="1" stopColor="#3d9bc8" /></linearGradient>
            <linearGradient id={`${uid}-coral`} x1="190" y1="180" x2="290" y2="295" gradientUnits="userSpaceOnUse"><stop stopColor="#ffc6a1" /><stop offset=".5" stopColor="#ef8c67" /><stop offset="1" stopColor="#bd534d" /></linearGradient>
            <linearGradient id={`${uid}-wall`} x1="80" y1="80" x2="225" y2="280" gradientUnits="userSpaceOnUse"><stop stopColor="#eff8ff" /><stop offset="1" stopColor="#7ab4e7" /></linearGradient>
        </defs>
        {kind === "study" ? <g>
            <path d="M76 133h166v72c-6 25-147 36-166-1z" fill="#092e59" />
            <path d="M76 130l83 28 83-28v58c-25 28-126 37-166 0z" fill={fill("navy")} />
            <path d="M25 111l131-63 140 63v15l-140 62L25 126z" fill="#08284e" />
            <path d="M25 109l131-64 140 64-140 63z" fill={fill("navy")} />
            <path d="M40 108l116-55 119 55-119-39z" fill="#8ec5fa" opacity=".32" />
            <path d="M155 108l93 32v78" stroke="#ba781f" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M155 103l93 32v77" stroke="#ffdc73" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="156" cy="105" rx="13" ry="7" fill={fill("gold")} />
            <circle cx="248" cy="218" r="12" fill={fill("gold")} />
            <path d="M239 228h18l13 42q-22 12-43 0z" fill={fill("gold")} />
            <path d="M244 236l-5 31m13-31 5 31" stroke="#fff4b0" strokeWidth="3" strokeLinecap="round" />
        </g> : kind === "experience" ? <g>
            <path d="M191 183l45 42-17 19-44-42z" fill="#153c67" />
            <path d="M220 210q12-12 24 0l51 51q13 13 0 27l-6 6q-13 13-26 0l-52-51q-11-12 0-24z" fill={fill("coral")} />
            <path d="M234 220l49 49" stroke="#ffe2bb" strokeWidth="7" strokeLinecap="round" opacity=".7" />
            <circle cx="133" cy="130" r="103" fill="#0c2e56" />
            <circle cx="133" cy="121" r="103" fill={fill("navy")} />
            <circle cx="133" cy="121" r="85" fill="#0b345d" />
            <circle cx="133" cy="121" r="78" fill={fill("glass")} />
            <path d="M69 123a66 66 0 0 1 71-68" stroke="white" strokeWidth="9" strokeLinecap="round" opacity=".75" />
            <path d="M85 156l70-70" stroke="white" strokeWidth="17" strokeLinecap="round" opacity=".22" />
            <path d="M129 173l48-48" stroke="white" strokeWidth="8" strokeLinecap="round" opacity=".25" />
        </g> : <g>
            <path d="M34 260l151-44 108 43-151 48z" fill="#123861" />
            <path d="M37 252l149-43 105 41-149 46z" fill="#a7cce8" />
            <path d="M91 85l89-27 70 29-90 29z" fill="#e8f6ff" />
            <path d="M160 115l90-28v160l-90 29z" fill={fill("navy")} />
            <path d="M91 85l69 30v161l-69-30z" fill={fill("wall")} />
            <path d="M160 71l39-12 33 14-39 12z" fill="#fce4a0" />
            <path d="M160 71l33 14v24l-33-14z" fill="#f6c963" />
            <path d="M193 85l39-12v24l-39 12z" fill="#d89a38" />
            {[0, 1, 2, 3].map(row => <g key={row}>
                <path d={`M105 ${111 + row * 28}l14 6v16l-14-6z`} fill="#427fad" />
                <path d={`M132 ${123 + row * 28}l14 6v16l-14-6z`} fill="#28598a" />
                <path d={`M176 ${126 + row * 28}l18-6v16l-18 6z`} fill={row === 2 ? "#ffdc7a" : "#a5ddf2"} />
                <path d={`M211 ${115 + row * 28}l18-6v16l-18 6z`} fill={row === 1 ? "#ffdc7a" : "#74b9dd"} />
            </g>)}
            <path d="M173 242l25-8v30l-25 8z" fill="#082d50" />
            <path d="M56 199l36-11v57l-36 11z" fill="#e4b457" />
            <path d="M56 199l-17-8v57l17 8z" fill="#ffdd86" />
            <path d="M39 191l36-11 17 8-36 11z" fill="#fff0c1" />
        </g>}
    </svg>;
}

// Ikon utama menggantikan semua mockup HP. SVG mengikuti ukuran kanvas.
function FeatureSymbol({ kind, rot = 0, delay = 0, className = "", style }: {
    kind: "study" | "experience" | "internship";
    rot?: number;
    delay?: number;
    className?: string;
    style?: CSSProperties;
}) {
    const reduce = useReducedMotion();
    const color = kind === "study" ? YELLOW : kind === "experience" ? "#d6edff" : "#f8df9b";
    return (
        <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, y: 45, scale: 0.75, rotate: rot - 12 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: rot }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ type: "spring", stiffness: 100, damping: 17, delay }}
            whileHover={reduce ? undefined : { scale: 1.06, rotate: 0 }}
            className={className}
            style={style}
        >
            <motion.div className="h-full w-full"
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ color, filter: "drop-shadow(0 7px 0 rgba(10,39,73,.40)) drop-shadow(0 18px 18px rgba(5,24,52,.26))" }}>
                <FeatureArtwork kind={kind} />
            </motion.div>
        </motion.div>
    );
}

// Stiker: slot kosong tampil sebagai lingkaran putus-putus. Stiker berisi diberi garis tepi putih (die-cut).
const DIECUT = [
    "drop-shadow(0.18em 0 0 #fff)",
    "drop-shadow(-0.18em 0 0 #fff)",
    "drop-shadow(0 0.18em 0 #fff)",
    "drop-shadow(0 -0.18em 0 #fff)",
    "drop-shadow(0 0.55em 0.5em rgba(3,30,34,0.4))",
].join(" ");

function Sticker({ s, delay = 0, fontSize }: { s: StickerSlot; delay?: number; fontSize: string }) {
    const [failed, setFailed] = useState(false);
    const empty = !s.src || failed;
    if (empty && !SHOW_STICKER_SLOTS) return null;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0, rotate: s.rot - 60 }}
            whileInView={{ opacity: 1, scale: 1, rotate: s.rot }}
            whileHover={{ scale: 1.18, rotate: s.rot + 10 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 180, damping: 11, delay }}
            className="h-full w-full"
            style={{ fontSize }}
        >
            <motion.div
                animate={{ y: ["0%", "-6%", "0%"], rotate: [-2, 2, -2] }}
                transition={{ duration: 3.2 + ((delay * 7) % 2), repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full"
            >
                {empty ? (
                    <div
                        className="flex h-full w-full flex-col items-center justify-center gap-[0.2em] rounded-xl text-white/85"
                        style={{ border: "0.22em dashed rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.1)" }}
                        title={s.label}
                    >
                        <PlusIcon weight="bold" className="h-[22%] w-[22%]" aria-hidden />
                        <span className="study-entry-meta font-bold tracking-wider" style={{ fontSize: "0.8em" }}>
                            {s.label}
                        </span>
                    </div>
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        ref={(el) => {
                            if (el && el.complete && el.naturalWidth === 0) setFailed(true);
                        }}
                        src={s.src}
                        alt=""
                        draggable={false}
                        loading="lazy"
                        className="h-full w-full object-contain p-[6%]"
                        style={{ filter: DIECUT }}
                        onError={() => setFailed(true)}
                    />
                )}
            </motion.div>
        </motion.div>
    );
}

// Lencana melingkar yang berputar
function Badge({ text }: { text: string }) {
    const id = useId();
    return (
        <div className="relative h-full w-full">
            <motion.svg
                viewBox="0 0 200 200"
                className="h-full w-full [filter:drop-shadow(0_6px_8px_rgba(3,30,34,0.4))]"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                aria-hidden
            >
                <defs>
                    <path id={id} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
                </defs>
                <circle cx="100" cy="100" r="98" fill={YELLOW} />
                <circle cx="100" cy="100" r="92" fill="none" stroke={INK} strokeWidth="1.4" strokeDasharray="3 4" />
                <text fontSize="17" fontWeight="800" fill={INK} textLength="458" lengthAdjust="spacing" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    <textPath href={`#${id}`}>{text}</textPath>
                </text>
            </motion.svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <TrophyIcon weight="fill" className="h-[34%] w-[34%]" style={{ color: INK }} aria-hidden />
            </div>
        </div>
    );
}

function HandArrow({ color = "#fff1b8", className = "", flip }: { color?: string; className?: string; flip?: boolean }) {
    return (
        <svg
            viewBox="0 0 80 60"
            fill="none"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={flip ? { transform: "scaleX(-1)" } : undefined}
            aria-hidden
        >
            <motion.path
                d="M4 10 C 30 2, 62 14, 66 44"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.path
                d="M54 36 L66 46 L74 32"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 1.2 }}
            />
        </svg>
    );
}

// Side headings reserve their own rail; they never overlay the collage.
function EdgeTitle({ text, side, mobile = false }: { text: string; side: "left" | "right"; mobile?: boolean }) {
    const reduce = useReducedMotion();
    return (
        <div className={`study-edge-title ${mobile ? "study-edge-mobile" : ""}`} data-side={side}>
            <motion.h2
                className="m-0 whitespace-nowrap font-extrabold uppercase tracking-[-0.045em]"
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                style={{
                    color: "#ffffff",
                    lineHeight: 1,
                    textShadow:
                        "0 0.03em 0 rgba(255,255,255,0.6), 0 0.07em 0 rgba(30,100,210,0.6), 0 0.12em 0 rgba(15,60,150,0.45), 0 0.3em 0.42em rgba(4,24,76,0.55)",
                }}
            >{text}</motion.h2>
        </div>
    );
}

function Note({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
    return (
        <span
            className={`${hand.className} block leading-none font-bold ${className}`}
            style={{
                color: "#fff6c9",
                textShadow: "0 0.05em 0 rgba(20,70,160,.55), 0 0.16em 0.32em rgba(5,25,80,.5)",
                ...style,
            }}
        >
            {children}
        </span>
    );
}

// Kartu kertas bergaris halus (sama seperti kartu di AboutSection). Hanya membungkus tulisan;
// foto, stiker, dan ikon tetap sibling di luar.
function PaperCard({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
    return (
        <div
            className={className}
            style={{
                padding: "1.1em 1.2em 1.2em",
                borderRadius: "0.8em",
                backgroundColor: "#faf8f3",
                backgroundImage:
                    "linear-gradient(rgba(37,99,235,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.07) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                boxShadow: "0 14px 30px rgba(9,30,70,.24)",
                color: "#1e293b",
            }}
        >
            {title && (
                <p
                    className="study-entry-meta font-bold tracking-widest"
                    style={{
                        color: "#64748b",
                        fontSize: "0.68em",
                        marginBottom: "0.8em",
                        paddingBottom: "0.55em",
                        borderBottom: "1px dashed rgba(37,99,235,.3)",
                    }}
                >
                    {title}
                </p>
            )}
            {children}
        </div>
    );
}

type EntryData = { date: string; title: string; role: string; text: string; tag: string };
function Entry({ e, small, delay = 0 }: { e: EntryData; small?: boolean; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 100, damping: 18, delay }}
        >
            <span className="study-entry-meta font-bold tracking-wider" style={{ color: "#0a68e0", fontSize: "0.8em" }}>
                {e.date}
            </span>
            <h3 className="mt-[0.3em] leading-[1.02] font-extrabold tracking-tight" style={{ color: "#0b1b33", fontSize: small ? "1.3em" : "1.6em" }}>
                {e.title}
            </h3>
            <p className="mt-[0.35em] font-bold" style={{ color: "#1d5fb4", fontSize: "0.92em" }}>
                {e.role}
            </p>
            <p className="mt-[0.55em] leading-[1.55]" style={{ color: "#475569", fontSize: "0.92em" }}>
                {e.text}
            </p>
            {e.tag && (
                <span
                    className="mt-[0.9em] inline-block -rotate-2 rounded-full px-[0.8em] py-[0.3em] font-extrabold"
                    style={{ background: YELLOW, color: INK, fontSize: "0.8em", boxShadow: "0 3px 8px rgba(120,80,0,.28), inset 0 1px 0 rgba(255,255,255,.6)" }}
                >
                    {e.tag}
                </span>
            )}
        </motion.div>
    );
}

/* ==========================================================================
   LATAR, INDIKATOR
   ========================================================================== */
// Judul INTERNSHIP: muncul besar di tengah lebih dulu. Saat kartu, foto, dan stiker mulai muncul,
// judul turun ke bawah dan berada DI BELAKANG mereka sampai scroll mentok.
function InternshipTitle() {
    const ctx = useContext(StageContext);
    const zero = useMotionValue(0);
    const slide = ctx?.slide ?? zero;
    const reveal = ctx?.reveal ?? zero;
    const y = useTransform(reveal, [0, 0.55], ["0svh", "33svh"]);
    const scale = useTransform(slide, [0.5, 1], [0.82, 1]);
    const appear = useTransform(slide, [0.4, 0.85], [0, 1]);
    const dim = useTransform(reveal, [0.3, 0.9], [1, 0.9]);
    const opacity = useTransform([appear, dim], ([a, d]) => (a as number) * (d as number));
    return (
        <motion.div
            aria-hidden="true"
            style={{
                y,
                scale,
                opacity,
                fontSize: "min(15vw, 27svh)",
                marginTop: "-0.5em",
                lineHeight: 1,
                color: "#ffffff",
                textShadow:
                    "0 0.03em 0 rgba(255,255,255,0.6), 0 0.07em 0 rgba(30,100,210,0.6), 0 0.12em 0 rgba(15,60,150,0.45), 0 0.3em 0.42em rgba(4,24,76,0.55)",
            }}
            className="pointer-events-none absolute inset-x-0 top-1/2 z-0 text-center font-extrabold tracking-[-0.045em] whitespace-nowrap uppercase"
        >
            {INTERNSHIP.heading}
        </motion.div>
    );
}

/* ==========================================================================
   HALAMAN DESKTOP (kanvas 1440 x 900)
   ========================================================================== */
function Artboard({ children, dockOpen, internship = false }: { children: ReactNode; dockOpen: boolean; internship?: boolean }) {
    return (
        <div
            className="relative flex h-full w-1/2 shrink-0 items-center justify-center pt-2"
            style={{ paddingBottom: dockOpen ? "5.75rem" : "1rem", transition: "padding-bottom 500ms ease" }}
        >
            {internship ? (
                <InternshipTitle />
            ) : (
                <>
                    <EdgeTitle text="Study" side="left" />
                    <EdgeTitle text="Experience" side="right" />
                </>
            )}
            <div
                className="relative [container-type:inline-size]"
                style={{
                    width: `min(76%, calc((100svh - ${dockOpen ? "7.25rem" : "2.5rem"}) * 1.6))`,
                    aspectRatio: `${W} / ${H}`,
                    transition: "width 500ms ease",
                }}
            >
                {children}
            </div>
        </div>
    );
}

function Panel1() {
    const body = fs(1.03, 10);
    return (
        <>
            {/* ---- STUDY (kiri): 2 foto atas = mahasiswa terbaik, kartu, 3 foto bawah = masa kuliah ---- */}
            <Layer panel={1} depth={1.1} style={{ ...rect(70, 8, 330, 50), zIndex: 16 }}>
                <Note style={{ fontSize: fs(2.1, 16), transform: "rotate(-3deg)", whiteSpace: "nowrap" }}>best student moments ★</Note>
            </Layer>

            <Layer panel={1} depth={0.8} style={{ ...rect(62, 258, 340), zIndex: 15, fontSize: body }}>
                <PaperCard title={STUDY.kicker}>
                    <Entry e={STUDY.entries[0]} delay={0.1} />
                    <div className="mt-[0.9em] border-t pt-[0.8em]" style={{ borderColor: "rgba(100,116,139,.25)" }}>
                        <Entry e={STUDY.entries[1]} small delay={0.2} />
                    </div>
                </PaperCard>
            </Layer>

            {STUDY_PHOTOS.map((p, i) => (
                <Layer key={p.src} panel={1} depth={1.15 + i * 0.08} lift style={{ ...rect(p.x, p.y, p.w, p.h), zIndex: p.z }}>
                    <Tile media={p} caption={p.caption} rot={p.rot} delay={0.1 + i * 0.08} fontSize={fs(1, 8)} className="h-full w-full" label={i < 2 ? `FOTO TERBAIK ${i + 1}` : `FOTO KULIAH ${i - 1}`} />
                </Layer>
            ))}

            <Layer panel={1} depth={1.4} style={{ ...rect(444, 268, 128, 128), zIndex: 25 }}>
                <Badge text="TOP 3 YUDISIUM · PERIODE 55 · " />
            </Layer>
            <Layer panel={1} depth={1.1} style={{ ...rect(432, 420, 170), zIndex: 16 }}>
                <HandArrow className="mb-[0.2em] ml-[1em] w-[3.2em]" />
                <Note style={{ fontSize: fs(2.1, 16), transform: "rotate(-5deg)" }}>{STUDY.note}</Note>
            </Layer>

            {/* Toga dekat Study, kaca pembesar dekat Experience. */}
            <Layer panel={1} depth={1.0} style={{ ...rect(615, 200, 300, 252), zIndex: 20 }}>
                <FeatureSymbol kind="study" rot={-12} delay={0.2} className="h-full w-full" />
            </Layer>
            <Layer panel={1} depth={1.0} style={{ ...rect(700, 625, 245, 245), zIndex: 21 }}>
                <FeatureSymbol kind="experience" rot={12} delay={0.35} className="h-full w-full" />
            </Layer>

            {/* ---- EXPERIENCE (kanan) ---- */}
            <Layer panel={1} depth={0.8} style={{ ...rect(970, 612, 444), zIndex: 15, fontSize: body }}>
                <PaperCard title={EXPERIENCE.kicker}>
                    <div className="grid grid-cols-2 gap-[1.2em]">
                        <Entry e={EXPERIENCE.entries[0]} small delay={0.1} />
                        <Entry e={EXPERIENCE.entries[1]} small delay={0.2} />
                    </div>
                </PaperCard>
            </Layer>
            <Layer panel={1} depth={1.1} style={{ ...rect(1040, 545, 350, 44), zIndex: 16 }}>
                <Note style={{ fontSize: fs(2.1, 16), transform: "rotate(-3deg)", whiteSpace: "nowrap" }}>{EXPERIENCE.note} ↑</Note>
            </Layer>

            {EXP_PHOTOS.map((p, i) => (
                <Layer key={p.src} panel={1} depth={1.2 + i * 0.1} lift style={{ ...rect(p.x, p.y, p.w, p.h), zIndex: p.z }}>
                    <Tile media={p} caption={p.caption} rot={p.rot} delay={0.15 + i * 0.08} fontSize={fs(1, 8)} className="h-full w-full" label={`FOTO EXP ${i + 1}`} />
                </Layer>
            ))}

            {/* ---- stiker acak ---- */}
            {STICKERS_1.map((s, i) => (
                <Layer key={s.label} panel={1} depth={1.7 + (i % 3) * 0.3} lift style={{ ...rect(s.x, s.y, s.w), aspectRatio: "1 / 1", zIndex: 30 + i }}>
                    <Sticker s={s} delay={0.2 + i * 0.07} fontSize={fs(1, 8)} />
                </Layer>
            ))}
        </>
    );
}

// Halaman Internship: judul besar di tengah (InternshipTitle) lalu turun ke bawah,
// tertimpa kartu, foto, dan stiker yang muncul bertahap mengikuti scroll (revealAt).
function Panel2() {
    const body = fs(1.05, 10);
    return (
        <>
            <Layer panel={2} depth={1.0} revealAt={0.1} style={{ ...rect(180, 26, 250, 250), zIndex: 20 }}>
                <FeatureSymbol kind="internship" rot={-7} delay={0.2} className="h-full w-full" />
            </Layer>

            {/* Card Cmlabs: tetap pada posisi sebelumnya. */}
            <Layer panel={2} depth={0.8} revealAt={0} style={{ ...rect(-130, 290, 370), zIndex: 15, fontSize: body }}>
                <PaperCard title={INTERNSHIP.kicker}>
                    {INTERNSHIP.entries.slice(0, 1).map((item) => (
                        <div key={item.company}>
                            <p className="study-entry-meta font-bold tracking-wider" style={{ color: "#0a68e0", fontSize: "0.78em" }}>
                                {item.date} · {item.location}
                            </p>
                            <h3 className="mt-[0.3em] font-extrabold leading-[1.1]" style={{ color: "#0b1b33", fontSize: "1.35em" }}>
                                {item.company}
                            </h3>
                            <p className="mt-[0.25em] font-bold" style={{ color: "#1d5fb4", fontSize: "0.95em" }}>
                                {item.role}
                            </p>
                            <p className="mt-[0.45em] leading-[1.45]" style={{ color: "#475569", fontSize: "0.9em" }}>
                                {item.text}
                            </p>
                        </div>
                    ))}
                    <div className="mt-[1em]">
                        <ToolDock tools={INTERNSHIP.tools} />
                    </div>
                </PaperCard>
            </Layer>

            {/* Card baru: Prodi Teknik Elektro UNTIRTA, tepat di samping card Cmlabs. */}
            <Layer panel={2} depth={0.8} revealAt={0} style={{ ...rect(250, 290, 370), zIndex: 19, fontSize: body }}>
                <PaperCard title="PRODI TEKNIK ELEKTRO · UNTIRTA">
                    {INTERNSHIP.entries.slice(1, 2).map((item) => (
                        <div key={item.company}>
                            <p className="study-entry-meta font-bold tracking-wider" style={{ color: "#0a68e0", fontSize: "0.78em" }}>
                                {item.date} · {item.location}
                            </p>
                            <h3 className="mt-[0.3em] font-extrabold leading-[1.1]" style={{ color: "#0b1b33", fontSize: "1.35em" }}>
                                {item.company}
                            </h3>
                            <p className="mt-[0.25em] font-bold" style={{ color: "#1d5fb4", fontSize: "0.95em" }}>
                                {item.role}
                            </p>
                            <p className="mt-[0.45em] leading-[1.45]" style={{ color: "#475569", fontSize: "0.9em" }}>
                                {item.text}
                            </p>
                        </div>
                    ))}
                    <div className="mt-[1em]">
                        <ToolDock tools={INTERNSHIP.toolsUntirta} />
                    </div>
                </PaperCard>
            </Layer>
            <Layer panel={2} depth={1.1} revealAt={0.3} style={{ ...rect(410, 140, 190), zIndex: 16 }}>
                <Note style={{ fontSize: fs(2.2, 16), transform: "rotate(-4deg)" }}>{INTERNSHIP.note}</Note>
                <HandArrow className="mt-[0.2em] ml-[3em] w-[3.2em]" />
            </Layer>

            {INTERN_PHOTOS.map((p, i) => (
                <Layer key={p.src} panel={2} depth={1.1 + i * 0.1} lift revealAt={0.06 + i * 0.13} style={{ ...rect(p.x, p.y, p.w, p.h), zIndex: p.z }}>
                    <Tile media={p} caption={p.caption} rot={p.rot} delay={0.08 + i * 0.09} fontSize={fs(1.1, 9)} className="h-full w-full" label={`FOTO INTERNSHIP ${i + 1}`} />
                </Layer>
            ))}

            {STICKERS_2.map((s, i) => (
                <Layer key={s.label} panel={2} depth={1.7 + (i % 3) * 0.3} lift revealAt={0.3 + i * 0.05} style={{ ...rect(s.x, s.y, s.w), aspectRatio: "1 / 1", zIndex: 30 + i }}>
                    <Sticker s={s} delay={0.2 + i * 0.07} fontSize={fs(1, 8)} />
                </Layer>
            ))}
        </>
    );
}

/* ==========================================================================
   SUSUNAN KE BAWAH (HP / TABLET / reduce motion)
   ========================================================================== */
// Stiker HP ditempel di koordinat berbeda di sekitar galeri, bukan baris flex.
const MOBILE_STICKER_POSITIONS: CSSProperties[] = [
    { top: "-2%", left: "-3%" }, { top: "18%", right: "-4%" },
    { top: "39%", left: "-4%" }, { top: "62%", right: "-3%" },
    { bottom: "-3%", left: "26%" }, { top: "3%", right: "25%" },
    { top: "77%", left: "-3%" }, { bottom: "-2%", right: "-2%" },
];
function FlowStickers({ items }: { items: StickerSlot[] }) {
    return <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
        {items.map((s, i) => <div key={s.label} style={{
            position: "absolute", ...MOBILE_STICKER_POSITIONS[i % MOBILE_STICKER_POSITIONS.length],
            width: `clamp(46px, ${i % 2 ? 14 : 17}vw, ${i % 2 ? 72 : 86}px)`, aspectRatio: "1 / 1",
        }}><Sticker s={s} delay={i * 0.06} fontSize="8px" /></div>)}
    </div>;
}

function FlowPhotos({ items, stickers }: { items: PhotoSlot[]; stickers: StickerSlot[] }) {
    return (
        <div className="relative mt-12 mb-10 grid grid-cols-2 gap-x-5 gap-y-9">
            {items.map((p, i) => (
                <Tile
                    key={p.src}
                    media={p}
                    variant={p.variant}
                    caption={p.caption}
                    tape={p.tape}
                    rot={i % 2 ? 2.5 : -2.5}
                    delay={i * 0.06}
                    fontSize="11px"
                    label={`FOTO ${i + 1}`}
                    className={i === 0 ? "col-span-2" : ""}
                    style={{ aspectRatio: i === 0 ? "16 / 10" : "1 / 1.1" }}
                />
            ))}
            <FlowStickers items={stickers} />
        </div>
    );
}

function FlowLayout() {
    return (
        <div className="mx-auto max-w-2xl space-y-24 px-4 sm:px-6 pt-12 pb-40" style={{ fontSize: "15px" }}>
            <div className="study-flow-group study-flow-left">
                <EdgeTitle text="Study" side="left" mobile />
                <FeatureSymbol kind="study" rot={-12} className="mx-auto mb-7 h-auto w-full max-w-64 aspect-[16/13]" />
                <PaperCard title={STUDY.kicker} className="mt-6">
                    <Entry e={STUDY.entries[0]} />
                    <div className="mt-6 border-t pt-5" style={{ borderColor: "rgba(100,116,139,.25)" }}>
                        <Entry e={STUDY.entries[1]} small />
                    </div>
                </PaperCard>
                <FlowPhotos items={STUDY_PHOTOS} stickers={STICKERS_1.slice(0, 5)} />
                <div className="mx-auto mt-10 h-28 w-28">
                    <Badge text="TOP 3 YUDISIUM · PERIODE 55 · " />
                </div>
            </div>

            <div className="study-flow-group study-flow-right">
                <EdgeTitle text="Experience" side="right" mobile />
                <FeatureSymbol kind="experience" rot={12} className="mx-auto mb-7 h-auto w-full max-w-52 aspect-square" />
                <PaperCard title={EXPERIENCE.kicker} className="mt-6">
                    <div className="space-y-6">
                        {EXPERIENCE.entries.map((e, i) => (
                            <div key={e.title} className={i ? "border-t pt-5" : ""} style={i ? { borderColor: "rgba(100,116,139,.25)" } : undefined}>
                                <Entry e={e} small />
                            </div>
                        ))}
                    </div>
                </PaperCard>
                <FlowPhotos items={EXP_PHOTOS} stickers={STICKERS_1.slice(5)} />
            </div>

            <div className="study-flow-group study-flow-right">
                <EdgeTitle text="Internship" side="right" mobile />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
                    <PaperCard title={INTERNSHIP.kicker}>
                        {INTERNSHIP.entries.slice(0, 1).map((item) => (
                            <div key={item.company}>
                                <p className="study-entry-meta text-[11px] font-bold tracking-wider" style={{ color: "#0a68e0" }}>
                                    {item.date} · {item.location}
                                </p>
                                <h3 className="mt-2 text-xl leading-tight font-extrabold" style={{ color: "#0b1b33" }}>
                                    {item.company}
                                </h3>
                                <p className="mt-1 text-sm font-bold" style={{ color: "#1d5fb4" }}>{item.role}</p>
                                <p className="mt-2 leading-relaxed" style={{ color: "#475569" }}>{item.text}</p>
                            </div>
                        ))}
                        <div className="mt-4"><ToolDock tools={INTERNSHIP.tools} /></div>
                    </PaperCard>
                    <PaperCard title="PRODI TEKNIK ELEKTRO · UNTIRTA">
                        {INTERNSHIP.entries.slice(1, 2).map((item) => (
                            <div key={item.company}>
                                <p className="study-entry-meta text-[11px] font-bold tracking-wider" style={{ color: "#0a68e0" }}>
                                    {item.date} · {item.location}
                                </p>
                                <h3 className="mt-2 text-xl leading-tight font-extrabold" style={{ color: "#0b1b33" }}>
                                    {item.company}
                                </h3>
                                <p className="mt-1 text-sm font-bold" style={{ color: "#1d5fb4" }}>{item.role}</p>
                                <p className="mt-2 leading-relaxed" style={{ color: "#475569" }}>{item.text}</p>
                            </div>
                        ))}
                        <div className="mt-4"><ToolDock tools={INTERNSHIP.toolsUntirta} /></div>
                    </PaperCard>
                </div>
                <FeatureSymbol kind="internship" rot={-7} className="mx-auto mt-8 h-auto w-full max-w-60 aspect-square" />
                <FlowPhotos items={INTERN_PHOTOS} stickers={STICKERS_2} />
            </div>
        </div>
    );
}

/* ==========================================================================
   KOMPONEN UTAMA
   ========================================================================== */
export default function StudyExpSection() {
    const reduce = useReducedMotion();
    const isDesktop = useIsDesktop();
    const dockOpen = useDockOpen();
    const pin = isDesktop && !reduce;

    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
    // Ada jeda diam di awal dan akhir; pergeseran terjadi di tengah. Dihaluskan dengan spring tipis.
    //  0.00 - 0.10 : diam (Study + Experience)
    //  0.10 - 0.50 : halaman bergeser ke samping, judul INTERNSHIP muncul besar di tengah
    //  0.50 - 0.64 : jeda, judul terlihat penuh
    //  0.64 - 0.94 : kartu, foto, stiker muncul; judul turun ke bawah
    //  0.94 - 1.00 : jeda akhir
    const mapped = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
    const slide = useSpring(mapped, { stiffness: 110, damping: 26, mass: 0.7, restDelta: 0.0005 });
    const revealMapped = useTransform(scrollYProgress, [0.64, 0.94], [0, 1]);
    const reveal = useSpring(revealMapped, { stiffness: 110, damping: 26, mass: 0.7, restDelta: 0.0005 });
    const stripX = useTransform(slide, [0, 1], ["0%", "-50%"]);

    const mxRaw = useMotionValue(0);
    const myRaw = useMotionValue(0);
    const mx = useSpring(mxRaw, { stiffness: 70, damping: 18 });
    const my = useSpring(myRaw, { stiffness: 70, damping: 18 });
    const ctx = useMemo<StageCtx>(() => ({ slide, reveal, mx, my }), [slide, reveal, mx, my]);

    return (
        <section
            ref={sectionRef}
            id="study-details"
            aria-label="Study, Experience, dan Internship"
            className="relative z-10"
            style={pin ? { height: `${TRACK}svh` } : undefined}
        >
            <style>{`

                .study-edge-title { position: absolute; top: 50%; z-index: 35; pointer-events: none; width: max-content; font-size: min(11vw, 13.5svh); }
                .study-edge-title[data-side="left"] { left: 5%; transform: translate(-50%, -50%) rotate(-90deg); }
                .study-edge-title[data-side="right"] { right: 5%; transform: translate(50%, -50%) rotate(-90deg); }
                .study-flow-group { position: relative; min-width: 0; }
                .study-flow-left { padding-left: clamp(52px, 13vw, 80px); }
                .study-flow-right { padding-right: clamp(52px, 13vw, 80px); }
                .study-edge-title.study-edge-mobile { top: 240px; font-size: clamp(36px, 10vw, 60px); }
                .study-edge-mobile[data-side="left"] { left: 14px; }
                .study-edge-mobile[data-side="right"] { right: 14px; }
            `}</style>
            {pin ? (
                <div
                    className="sticky top-0 h-svh overflow-hidden"
                    onPointerLeave={() => { mxRaw.set(0); myRaw.set(0); }}
                    onPointerMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        mxRaw.set((e.clientX - r.left) / r.width - 0.5);
                        myRaw.set((e.clientY - r.top) / r.height - 0.5);
                    }}
                >
                    <StageContext.Provider value={ctx}>
                        <motion.div style={{ x: stripX }} className="relative flex h-full w-[200%]">
                            <Artboard dockOpen={dockOpen}>
                                <Panel1 />
                            </Artboard>
                            <Artboard dockOpen={dockOpen} internship>
                                <Panel2 />
                            </Artboard>
                        </motion.div>
                    </StageContext.Provider>
                </div>
            ) : (
                <FlowLayout />
            )}
        </section>
    );
}