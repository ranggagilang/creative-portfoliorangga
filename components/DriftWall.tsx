"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "./DriftWall.css";

// useLayoutEffect aman untuk SSR
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type DriftWallItem = {
  image?: string;
  title?: string;
  /** Rasio natural gambar (naturalWidth / naturalHeight). Jika tidak tersedia, gunakan ukuran default. */
  cardAspectRatio?: number;
  href?: string;
  /** Dipanggil saat tile diklik atau ditekan Enter/Spasi (dipakai untuk membuka preview) */
  onClick?: () => void;
};

export type DriftWallProps = {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: "up" | "down";
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  /** cover = memenuhi tile (terpotong), contain = gambar utuh (cocok untuk sertifikat) */
  fit?: "cover" | "contain";
  /** Warna dasar tile (terlihat di sisi gambar saat fit="contain") */
  tileBackground?: string;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_ITEMS: DriftWallItem[] = Array.from({ length: 15 }, (_, i) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return { image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`, title: `Tile ${i + 1}` };
});

// Tinggi setiap card dapat mengikuti rasio aslinya tanpa mengubah lebar kolom.
// Ketinggian harus sama saat menghitung lintasan dan saat merender card,
// supaya pengulangan tidak meninggalkan ruang kosong atau melompat.
const tileBodyHeight = (item: DriftWallItem, width: number, defaultHeight: number) =>
  item.cardAspectRatio && item.cardAspectRatio > 0
    ? Math.round(width / item.cardAspectRatio)
    : defaultHeight;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const columnFactor = (index: number, variance: number) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

function TileImage({ item }: { item: DriftWallItem }) {
  const [failed, setFailed] = useState(false);
  if (!item.image || failed) {
    return (
      <span className="drift-wall__ph">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="1.6" />
          <path d="m21 15-4.5-4.5L6 21" />
        </svg>
        <span>{item.title ?? ""}</span>
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.image}
      alt={item.title ?? ""}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = "#060010",
  fit = "cover",
  tileBackground = "#0b0b12",
  className = "",
  style,
}: DriftWallProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const columnItems = useMemo(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map((col) => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    return columnItems.map((col) => {
      // Satu putaran = jumlah seluruh tinggi card di kolom ini + gap-nya.
      // Tinggi masing-masing item mengikuti rasio foto asli (portrait/landscape/persegi).
      const copyHeight = Math.max(
        tileHeight + gap,
        col.reduce((total, item) => total + tileBodyHeight(item, tileWidth, tileHeight) + gap, 0)
      );
      const pad = containerHeight / 2 + Math.max(tileHeight, tileWidth) * 3;
      const before = Math.ceil(pad / copyHeight) + 2;
      const after = Math.ceil(pad / copyHeight) + 3;
      const copies = before + after + 2;
      const anchor = before * copyHeight;
      return { copyHeight, copies, anchor };
    });
  }, [columnItems, tileWidth, tileHeight, gap, containerHeight]);

  useIsoLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === "up" ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth],
  );

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = (baseVelocities[c] ?? 0) * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-(meta.anchor + next)}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(meta.anchor + (offsetsRef.current[c] ?? 0))}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id: string, index: number) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);
  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = (hit && hit.closest ? hit.closest("[data-tile-id]") : null) as HTMLElement | null;
      if (!tile) return;
      const id = tile.dataset.tileId ?? null;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced],
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const cssVars = useMemo(
    () =>
      ({
        "--dw-tile-w": `${tileWidth}px`,
        "--dw-tile-h": `${tileHeight}px`,
        "--dw-gap": `${gap}px`,
        "--dw-radius": `${radius}px`,
        "--dw-perspective": `${perspective}px`,
        "--dw-lift": `${lift}px`,
        "--dw-dim": dim,
        "--dw-gray": grayscale ? 1 : 0,
        "--dw-overlay": overlayColor,
        "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%`,
        "--dw-fit": fit,
        "--dw-tile-bg": tileBackground,
        ...style,
      }) as CSSProperties,
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, fit, tileBackground, style],
  );

  const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
    const inner = (
      <span className="drift-wall__inner">
        <TileImage item={item} />
        <span className="drift-wall__overlay" aria-hidden="true" />
      </span>
    );
    const className = `drift-wall__tile${activeId === id ? " is-active" : ""}`;
    const common = {
      className,
      style: { height: `${tileBodyHeight(item, tileWidth, tileHeight) + gap}px` },
      "data-tile-id": id,
      "data-col": colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release,
    };
    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" onClick={item.onClick} {...common}>
          {inner}
        </a>
      );
    }
    const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (item.onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        item.onClick();
      }
    };
    return (
      <div
        key={id}
        tabIndex={0}
        role="button"
        aria-label={item.title ?? "tile"}
        onClick={item.onClick}
        onKeyDown={onKeyDown}
        {...common}
      >
        {inner}
      </div>
    );
  };

  const rootClass = ["drift-wall", reduced ? "drift-wall--reduced" : "", className].filter(Boolean).join(" ");

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Dinding sertifikat yang bergerak"
    >
      <div ref={planeRef} className="drift-wall__plane" style={{ height: 0 }}>
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="drift-wall__col" key={`col-${c}`} style={{ height: 0 }}>
              <div
                className="drift-wall__track"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translate3d(0, ${-(meta.anchor + meta.copyHeight * ((c * 0.37) % 1))}px, 0)` }}
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c)),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
