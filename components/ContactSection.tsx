"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  EnvelopeSimpleIcon, PhoneIcon, WhatsappLogoIcon, InstagramLogoIcon,
  LinkedinLogoIcon, GithubLogoIcon, ArrowUpRightIcon, CopyIcon, CheckIcon,
} from "@phosphor-icons/react";
import { useDockOpen } from "@/hooks/useDockOpen";

// Isi data asli di sini. Nomor memakai kode negara, contoh: +6281234567890.
// URL sosial harus lengkap, contoh: https://www.instagram.com/username/
// Selama kosong, kontak tampil sebagai belum tersedia dan tidak menjadi link palsu.
const CONTACT = {
  email: "gilangyanuarirangga@gmail.com",
  phone: "+6287889413234",
  whatsapp: "+6287889413234",
  instagram: "https://www.instagram.com/ranggagilang05/",
  linkedin: "https://www.linkedin.com/in/tbranggagy/",
  github: "https://github.com/ranggagilang",
};

function socialLabel(value: string) {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || "Lihat profil";
  } catch {
    return "";
  }
}
const validUrl = (value: string) => /^https?:\/\/\S+$/.test(value);
const phoneNumber = (value: string) => value.replace(/[^\d+]/g, "");
const validPhone = (value: string) => /^\+?[1-9]\d{7,14}$/.test(phoneNumber(value));

export default function ContactSection() {
  const section = useRef<HTMLElement>(null);
  const visible = useInView(section, { amount: 0.15 });
  const reduced = useReducedMotion();
  const dockOpen = useDockOpen();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const email = CONTACT.email.trim();
  const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const contacts = [
    { label: "Email", value: email, href: emailReady ? `mailto:${email}` : "", Icon: EnvelopeSimpleIcon, color: "#90e0ef", hint: "Kirim pesan", external: false },
    { label: "WhatsApp", value: CONTACT.whatsapp, href: validPhone(CONTACT.whatsapp) ? `https://wa.me/${phoneNumber(CONTACT.whatsapp).replace(/^\+/, "")}` : "", Icon: WhatsappLogoIcon, color: "#bce6a1", hint: "Mulai chat", external: true },
    { label: "Telepon", value: CONTACT.phone, href: validPhone(CONTACT.phone) ? `tel:${phoneNumber(CONTACT.phone)}` : "", Icon: PhoneIcon, color: "#ffcf96", hint: "Hubungi aku", external: false },
    { label: "Instagram", value: socialLabel(CONTACT.instagram), href: validUrl(CONTACT.instagram) ? CONTACT.instagram : "", Icon: InstagramLogoIcon, color: "#ffb4ba", hint: "Lihat profil", external: true },
    { label: "LinkedIn", value: socialLabel(CONTACT.linkedin), href: validUrl(CONTACT.linkedin) ? CONTACT.linkedin : "", Icon: LinkedinLogoIcon, color: "#a9caff", hint: "Terhubung", external: true },
    { label: "GitHub", value: socialLabel(CONTACT.github), href: validUrl(CONTACT.github) ? CONTACT.github : "", Icon: GithubLogoIcon, color: "#d1c1ff", hint: "Lihat karya", external: true },
  ];

  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); setCopied(true); setStatus("Alamat email berhasil disalin."); }
    catch { setStatus("Pilih alamat email untuk menyalinnya secara manual."); }
  }

  return (
    <section ref={section} id="contact" aria-labelledby="contact-title"
      className="relative isolate flex min-h-svh scroll-mt-0 items-center bg-[linear-gradient(180deg,#064657_0%,#073b55_48%,#03045e_100%)] px-6 pt-16 text-[#caf0f8] sm:px-10 lg:px-[5vw]"
      style={{ paddingBottom: dockOpen ? 124 : 48, transition: reduced ? "none" : "padding-bottom 500ms ease" }}>
      <div className="mx-auto grid w-full items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"
        style={{ maxWidth: dockOpen ? 1120 : 1200, transition: reduced ? "none" : "max-width 500ms ease" }}>
        <motion.div initial={false} animate={{ opacity: visible ? 1 : 0, y: visible || reduced ? 0 : 24 }} transition={{ duration: reduced ? 0 : 0.5 }}>
          <p className="mb-5 text-sm font-medium text-[#90e0ef]">Let’s stay connected</p>
          <h2 id="contact-title" className="text-[clamp(54px,7.5vw,98px)] leading-[0.98] font-bold tracking-[-0.065em] text-[#f5fbfc]">Contact<br />me<span className="text-[#d7ef8b]">.</span></h2>
          <p className="mt-6 max-w-xs text-sm leading-7 text-[#caf0f8]/80">Ada project, kesempatan kerja, atau ingin kenalan? Kamu bisa menghubungiku lewat kontak di sini.</p>
          {emailReady && <div className="mt-7 flex max-w-sm items-center gap-3">
            <a href={`mailto:${email}`} className="min-w-0 break-all text-sm underline decoration-[#90e0ef]/40 underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-[#90e0ef]">{email}</a>
            <button type="button" onClick={copyEmail} aria-label="Salin alamat email" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#90e0ef]/30 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#90e0ef]">{copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}</button>
          </div>}
          <p role="status" className="mt-2 text-xs leading-5 text-[#90e0ef]">{status}</p>
        </motion.div>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {contacts.map(({ label, value, href, Icon, color, hint, external }, index) => {
            const content = <>
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[#102e42] transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transform-none" style={{ backgroundColor: color }}><Icon size={28} weight="fill" aria-hidden /></span>
                {href && <ArrowUpRightIcon size={20} aria-hidden className="text-[#caf0f8]/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />}
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#f5fbfc]">{label}</h3>
              <p className="mt-1 break-all text-xs leading-5 text-[#caf0f8]/70">{href ? value : "Belum tersedia"}</p>
              {href && <span className="mt-4 block text-xs font-medium" style={{ color }}>{hint} ↗</span>}
            </>;
            const cardClass = "group block h-full rounded-[22px] border border-[#90e0ef]/20 bg-[#caf0f8]/[0.04] p-5 transition-colors duration-300 sm:p-6";
            return <motion.div key={label} initial={false}
              animate={{ opacity: visible ? 1 : 0, y: visible || reduced ? 0 : 24 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 20, delay: index * 0.065 }}
              whileHover={href && !reduced ? { y: -4 } : undefined}>
              {href ? <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={`${label}: ${value}${external ? " (tab baru)" : ""}`} className={`${cardClass} hover:border-[#90e0ef]/50 hover:bg-[#caf0f8]/[0.09] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#90e0ef]`}>{content}</a>
                : <div className={cardClass}>{content}</div>}
            </motion.div>;
          })}
        </div>
      </div>
    </section>
  );
}
