import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/project-data";
import ProjectCollection from "@/components/ProjectCollection";

export function generateStaticParams() {
  return CATEGORIES.map(category => ({ category: category.id }));
}

type CategoryPageProps = { params: Promise<{ category: string }> };

async function CategoryContent({ params }: CategoryPageProps) {
  const { category: id } = await params;
  const category = CATEGORIES.find(item => item.id === id);
  if (!category) notFound();
  return <ProjectCollection category={category} />;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={
      <section aria-busy="true" aria-label="Memuat kategori project" className="min-h-svh bg-[linear-gradient(180deg,#03045e,#082b51)] px-6 pt-24 pb-36 text-[#90e0ef] sm:px-10 lg:px-[7vw]">
        <div className="mx-auto max-w-6xl">
          <p role="status" className="text-sm">Memuat koleksi project…</p>
          <div aria-hidden="true" className="mt-8 h-16 w-3/4 max-w-xl rounded-xl bg-white/10" />
          <div aria-hidden="true" className="mt-6 h-5 w-1/2 rounded bg-white/5" />
        </div>
      </section>
    }>
      <CategoryContent params={params} />
    </Suspense>
  );
}
