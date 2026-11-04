"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Folder } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/project-data";
import ContentShowcase from "./ContentShowcase";
import UiuxShowcase from "./UiuxShowcase";
import WebAppShowcase from "./WebAppShowcase";

export default function ProjectCollection({ category }: { category: Category }) {
  const reduce = useReducedMotion();

  if (category.id === "design" || category.id === "uiux" || category.id === "uiux-design") {
    return (
      <div className="project-design-overlay relative min-h-svh bg-[#f4fffc]">
        <nav
          aria-label="Navigasi project"
          className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-center gap-3 bg-transparent px-4 py-2.5 text-[#1f4b2c] sm:px-8 lg:px-[4vw]"
        >
          <Link
            href="/#projects"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#91eaaf] bg-white/70 px-4 text-xs font-semibold transition-colors hover:bg-[#c3e956]"
          >
            <ArrowLeft size={16} /> Kembali ke project
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors hover:bg-[#c3e956]"
          >
            Ke beranda <ArrowUpRight size={16} />
          </Link>
        </nav>
        <UiuxShowcase />
        <style>{`
          .project-design-overlay .ux-showcase__stage {
            padding-top: clamp(76px, 8vh, 96px);
          }
          @media (max-width: 520px) {
            .project-design-overlay .ux-showcase__stage {
              padding-top: 92px;
            }
          }
        `}</style>
      </div>
    );
  }

  if (category.id === "web" || category.id === "web-application" || category.id === "webapp") {
    return (
      <div className="project-web-overlay relative min-h-svh">
        <nav aria-label="Navigasi project" className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-center gap-3 bg-transparent px-4 py-3 text-white sm:px-8 lg:px-[4vw]">
          <Link href="/#projects" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#56e1e9]/45 bg-[#112c70]/25 px-4 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-[#56e1e9]/20">
            <ArrowLeft size={16} /> Kembali ke project
          </Link>
          <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-[#d5e5ff] transition hover:bg-white/10">
            Ke beranda <ArrowUpRight size={16} />
          </Link>
        </nav>
        <WebAppShowcase />
      </div>
    );
  }

  if (category.id === "content") {
    return (
      <div className="project-content-overlay relative min-h-svh overflow-hidden">
        <nav
          aria-label="Navigasi project"
          className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-center gap-3 bg-transparent px-4 py-3 text-[#fff4ea] sm:px-8 lg:px-[4vw]"
        >
          <Link
            href="/#projects"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#ff9f6b]/60 bg-[#2b1711]/20 px-4 text-xs font-semibold text-[#fff2e7] backdrop-blur-md transition-all hover:border-[#ffb27b] hover:bg-[#ff8a58]/18"
          >
            <ArrowLeft size={16} /> Kembali ke folder project
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-[#ffe0cb] transition-all hover:bg-[#ff8a58]/12 hover:text-white"
          >
            Ke beranda <ArrowUpRight size={16} />
          </Link>
        </nav>
        <ContentShowcase />
        <style>{`
          .project-content-overlay .content-showcase__wrap {
            padding-top: clamp(82px, 10vh, 108px);
          }
          @media (max-width: 640px) {
            .project-content-overlay .content-showcase__wrap {
              padding-top: 102px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <section className="min-h-svh bg-[linear-gradient(180deg,#03045e,#082b51)] px-6 pt-20 pb-36 text-[#f5fafb] sm:px-10 lg:px-[7vw]">
      <motion.div
        key={category.id}
        className="mx-auto max-w-6xl"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav aria-label="Kembali" className="mb-10 flex flex-wrap items-center gap-6">
          <Link
            href="/#projects"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-[#90e0ef] hover:text-white focus-visible:outline-2"
          >
            <ArrowLeft size={17} />Kembali ke folder project
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-sm text-[#bed5e6] hover:text-white focus-visible:outline-2"
          >
            Ke beranda
          </Link>
        </nav>
        <header className="mb-12">
          <p className="mb-4 text-xs tracking-widest uppercase" style={{ color: category.color }}>
            Project collection
          </p>
          <h1 className="text-[clamp(38px,7vw,86px)] leading-none font-bold tracking-[-0.06em]">
            {category.title}
            <span style={{ color: category.color }}>.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#bed5e6]">{category.description}</p>
        </header>
        <nav aria-label="Kategori project" className="mb-10 flex flex-wrap gap-3">
          {CATEGORIES.map((item) => (
            <Link
              key={item.id}
              href={`/projects/${item.id}`}
              aria-current={item.id === category.id ? "page" : undefined}
              className="rounded-full border border-white/25 px-5 py-3 text-xs transition-colors hover:bg-white/10 focus-visible:outline-2"
              style={item.id === category.id ? { background: category.color, color: category.ink, borderColor: category.color } : undefined}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {category.projects.length ? (
          <div className="grid gap-x-7 gap-y-12 md:grid-cols-2">
            {category.projects.map((project, index) => (
              <motion.article
                key={`${project.title}-${index}`}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: reduce ? 0 : 0.5, delay: (index % 2) * 0.08 }}
              >
                {project.image && <img src={project.image} alt={project.title} loading="lazy" className="mb-5 h-auto w-full rounded-xl" />}
                <h2 className="text-2xl font-semibold tracking-tight">{project.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#bed5e6]">{project.description}</p>
                {project.href && /^(https?:\/\/|\/(?!\/))/.test(project.href) && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm underline-offset-4 hover:underline"
                    style={{ color: category.color }}
                  >
                    Lihat project
                    <ArrowUpRight size={17} />
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Folder className="mx-auto mb-5" size={44} strokeWidth={1.3} style={{ color: category.color }} />
            <h2 className="text-xl font-semibold">Koleksi sedang disiapkan.</h2>
            <p className="mt-3 text-sm text-[#bed5e6]">Project kategori ini akan ditampilkan di sini.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
