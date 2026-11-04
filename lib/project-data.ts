export type Project = { title: string; description: string; image?: string; href?: string };
export type Category = {
  id: string; title: string; subtitle: string; description: string;
  color: string; ink: string; tags: string[]; projects: Project[];
};

// Isi karya asli di projects. image: path di public, href: tautan demo/studi kasus.
// Contoh struktur: { title: "Nama karya", description: "Tentang karya", image: "/projects/karya.jpg", href: "https://..." }
export const CATEGORIES: Category[] = [
  { id: "web", title: "Web Application", subtitle: "From idea to interaction.",
    description: "Kumpulan website dan aplikasi web, dari tampilan antarmuka hingga pengalaman pengguna yang bisa dicoba langsung.",
    color: "#64d6f3", ink: "#073e60", tags: ["Website", "Application", "Development"], projects: [] },
  { id: "design", title: "UI/UX & Design", subtitle: "A little thought. A lot of detail.",
    description: "Eksplorasi antarmuka, alur pengguna, dan desain visual. Tempat ide dirapikan menjadi pengalaman yang mudah dipahami.",
    color: "#d5ee87", ink: "#344723", tags: ["UI/UX", "Visual Design", "Prototype"], projects: [] },
  { id: "content", title: "Content", subtitle: "Stories, frame by frame.",
    description: "Koleksi fotografi, video, dan konten visual. Berbagai cara untuk menyampaikan cerita lewat gambar dan gerak.",
    color: "#ffa58b", ink: "#713825", tags: ["Photography", "Video", "Social Content"], projects: [] },
];

