"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ImageIcon, X } from "lucide-react";
import DriftWall from "./DriftWall";
import { useDockOpen } from "@/hooks/useDockOpen";

type Certificate = {
  id: string; title: string; issuer: string; year: string; image: string;
  credentialUrl?: string;
  width?: number; height?: number;
};

// =====================================================================
// ISI FOTO SERTIFIKAT DI SINI SAJA
// 1. Buat folder: public/certificates/
// 2. Masukkan foto-foto sertifikat ke folder tersebut.
// 3. Isi nama file pada `file`, contoh: "bnsp.jpg" atau "sertifikat-01.png".
// 4. Kosongkan `file: ""` untuk sertifikat yang belum diisi.
// 5. BENTUK CARD OTOMATIS mengikuti ukuran asli file gambar,
//    portrait / landscape / persegi, tanpa perlu mengisi rasio manual.
// 6. width / height di bawah hanya cadangan metadata untuk preview.
// 7. Tambah sertifikat baru dengan menyalin satu baris data di bawah.
// =====================================================================
const CERTIFICATE_FILES = [
  { file: "uix1.png", title: "Sertifikat 01", issuer: "", year: "", width: 1200, height: 1700 },
  { file: "bbpvp1.png", title: "Sertifikat 02", issuer: "", year: "", width: 1600, height: 1100 },
  { file: "bnsp1.png", title: "Sertifikat BNSP 1", issuer: "BNSP", year: "", width: 900, height: 2000 },
  { file: "poster1.png", title: "Sertifikat BNSP 2", issuer: "BNSP", year: "", width: 900, height: 2000 }, // isi file: "bnsp2.png" setelah fotonya ada
  { file: "rbw1.png", title: "Sertifikat 05", issuer: "", year: "", width: 1200, height: 1700 },
  { file: "film1.png", title: "Sertifikat 06", issuer: "", year: "", width: 1600, height: 1100 },
  { file: "plth1.png", title: "Sertifikat 07", issuer: "", year: "", width: 900, height: 2000 },
  { file: "poster2.png", title: "Sertifikat 08", issuer: "", year: "", width: 1600, height: 1100 },
  { file: "bnsp2.png", title: "Sertifikat 09", issuer: "", year: "", width: 900, height: 2000 },
  { file: "jmstr.png", title: "Sertifikat 10", issuer: "", year: "", width: 1600, height: 1100 },
  { file: "web1.png", title: "Sertifikat 11", issuer: "", year: "", width: 1200, height: 1200 },
  { file: "smnr.png", title: "Sertifikat 12", issuer: "", year: "", width: 1600, height: 1100 },
];

const CERTIFICATES: Certificate[] = CERTIFICATE_FILES.map((item, index) => ({
  id: `certificate-${String(index + 1).padStart(2, "0")}`,
  title: item.title,
  issuer: item.issuer,
  year: item.year,
  image: item.file.trim() ? `/certificates/${item.file.trim()}` : "",
  width: item.width,
  height: item.height,
}));

function CertificateImage({ item, large = false, onFailure }: { item: Certificate; large?: boolean; onFailure?: () => void }) {
  const [failed, setFailed] = useState(false);
  const ratio = item.width && item.height ? `${item.width} / ${item.height}` : "1.414 / 1";
  if (!item.image || failed) return <div style={{ aspectRatio: ratio }} className="flex w-full flex-col items-center justify-center gap-3 bg-[#b9d9de]/[0.06] px-6 text-center text-[#b9d9de]/60">
    <ImageIcon size={28} strokeWidth={1.2} aria-hidden />
    <span className="text-xs">{failed ? "Gambar tidak dapat dimuat" : "Preview sertifikat"}</span>
  </div>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.image} alt={item.title} width={item.width} height={item.height}
      loading={large ? "eager" : "lazy"} decoding="async"
      onError={() => { setFailed(true); onFailure?.(); }}
      className={large ? "mx-auto block max-h-[74svh] max-w-full object-contain" : "block h-auto w-full"} />
  );
}

// Ukuran dinding mengikuti lebar layar: HP 2 kolom, tablet 3 kolom, desktop 5 kolom
function useWallConfig() {
  const [w, setW] = useState(1280);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  if (w < 640) return { columns: 2, tileWidth: 150, tileHeight: 112, gap: 12 };
  if (w < 1024) return { columns: 3, tileWidth: 200, tileHeight: 148, gap: 14 };
  return { columns: 5, tileWidth: 240, tileHeight: 176, gap: 18 };
}

// ----------------------------------------------------------------------
// Main Certificates Section
// ----------------------------------------------------------------------
export default function CertificatesSection() {
  const dockOpen = useDockOpen();
  const reduce = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Certificate | null>(null);

  useEffect(() => {
    if (!selected) return;
    const modal = dialog.current;
    const previous = document.body.style.overflow;
    modal?.showModal();
    document.body.style.overflow = "hidden";
    return () => { modal?.close(); document.body.style.overflow = previous; };
  }, [selected]);

  const wall = useWallConfig();

  // Ambil rasio langsung dari file gambar asli (naturalWidth / naturalHeight).
  // Jadi BNSP yang sangat panjang, sertifikat landscape, dan square otomatis
  // mendapat bentuk card yang PAS tanpa menghitung ukuran secara manual.
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];

    CERTIFICATES.filter(item => item.image).forEach(item => {
      const img = new window.Image();
      images.push(img);
      img.onload = () => {
        if (cancelled || !img.naturalWidth || !img.naturalHeight) return;
        const ratio = img.naturalWidth / img.naturalHeight;
        setImageRatios(prev => prev[item.image] === ratio
          ? prev
          : { ...prev, [item.image]: ratio });
      };
      img.src = item.image;
    });

    return () => {
      cancelled = true;
      images.forEach(img => { img.onload = null; });
    };
  }, []);

  const driftItems = CERTIFICATES.map(item => ({
    image: item.image,
    title: item.title,
    // Jika belum termuat / file kosong, tampilkan ukuran default sementara.
    cardAspectRatio: imageRatios[item.image] || undefined,
    onClick: () => setSelected(item)
  }));

  return (
    <section id="certificates" aria-labelledby="certificates-heading"
      className="relative min-h-svh scroll-mt-0 bg-[linear-gradient(180deg,#082b51_0%,#073b55_55%,#064657_100%)] px-6 pt-16 text-[#f6f8ee] sm:px-10 lg:px-[5vw]"
      style={{ paddingBottom: dockOpen ? 116 : 40, transition: reduce ? "none" : "padding-bottom 500ms ease" }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: dockOpen ? 1120 : 1200, transition: reduce ? "none" : "max-width 500ms ease" }}>
        <motion.header initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 0.5 }}
          className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end lg:mb-14">
          <h2 id="certificates-heading" className="text-[clamp(38px,6.5vw,78px)] leading-[.98] font-bold tracking-[-.06em]">Certificates<span className="text-[#90e0ef]">.</span></h2>
          <p className="max-w-64 text-sm leading-6 text-[#b9d9de]">Hal-hal yang kupelajari,<br />dan pencapaian di sepanjang jalan.</p>
        </motion.header>

        {/* Dinding sertifikat yang melayang (DriftWall). Tinggi wajib ditentukan di pembungkusnya. */}
        <div className="relative h-[min(70svh,720px)] min-h-[420px] w-full">
          <DriftWall
            items={driftItems}
            columns={wall.columns}
            tileWidth={wall.tileWidth}
            tileHeight={wall.tileHeight}
            gap={wall.gap}
            radius={14}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={34}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.55}
            dim={0.78}
            overlayColor="#082b51"
            fit="contain"
            tileBackground="#0a3a5c"
          />
        </div>
        <p className="mt-3 text-center text-xs text-[#b9d9de]/70">Arahkan kursor untuk menghentikan kolom, klik sertifikat untuk memperbesar.</p>
      </div>

      <dialog ref={dialog} onClose={() => setSelected(null)} aria-labelledby="certificate-preview-title"
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        className="m-auto max-h-[92svh] w-[min(1100px,94vw)] overflow-auto rounded-xl border border-white/15 bg-[#092849] p-4 text-white shadow-2xl backdrop:bg-[#020d29]/90 backdrop:backdrop-blur-sm sm:p-6"
      >
        {selected && <>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 id="certificate-preview-title" className="text-sm font-medium">{selected.title}</h3>
            <button autoFocus type="button" onClick={() => dialog.current?.close()} aria-label="Tutup preview" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#90e0ef]">
              <X size={20} />
            </button>
          </div>
          <CertificateImage key={selected.id} item={selected} large />
        </>}
      </dialog>
    </section>
  );
}
