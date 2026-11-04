"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Image as ImageIcon } from "lucide-react";

type StudioDeviceProps = {
  image: string;
  alt: string;
  width?: number;
  secondary?: boolean;
};

/**
 * Interactive studio-style phone.
 * Drag horizontally with a mouse or finger to turn the FRONT of the phone
 * left/right only. The angle is limited to -24..24 degrees, so the rear
 * can never face the viewer. No animation loop or automatic spinning.
 */
export default function StudioDevice({ image, alt, width = 215, secondary = false }: StudioDeviceProps) {
  const reduceMotion = useReducedMotion();
  const [angle, setAngle] = useState(-10);
  const gesture = useRef<{ startX: number; startAngle: number } | null>(null);
  const clamp = (n: number) => Math.max(-24, Math.min(24, n));

  const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (secondary || event.button !== 0) return;
    gesture.current = { startX: event.clientX, startAngle: angle };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!gesture.current || secondary) return;
    const difference = event.clientX - gesture.current.startX;
    setAngle(clamp(gesture.current.startAngle + difference * 0.24));
  };
  const pointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <motion.div
      className={`ux-studio-device${secondary ? " ux-studio-device--secondary" : " ux-studio-device--interactive"}`}
      style={{ "--studio-w": `${width}px` } as React.CSSProperties}
      initial={false}
      animate={{ rotateY: secondary ? 8 : angle, rotateX: 3, rotateZ: secondary ? 2 : -3 }}
      transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerEnd}
      onPointerCancel={pointerEnd}
      onLostPointerCapture={() => { gesture.current = null; }}
      role={secondary ? undefined : "group"}
      tabIndex={secondary ? undefined : 0}
      aria-label={secondary ? undefined : `${alt}. Geser kiri atau kanan untuk memiringkan HP.`}
      onKeyDown={(event) => {
        if (secondary) return;
        if (event.key === "ArrowLeft") { event.preventDefault(); setAngle((a) => clamp(a - 6)); }
        if (event.key === "ArrowRight") { event.preventDefault(); setAngle((a) => clamp(a + 6)); }
      }}
    >
      <div className="ux-studio-device__screen">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={alt} draggable={false} />
        ) : (
          <div className="ux-studio-device__empty" role="img" aria-label={`${alt}: belum ada gambar`}>
            <ImageIcon size={25} strokeWidth={1.5} aria-hidden="true" />
            <span>Tambahkan gambar project</span>
          </div>
        )}
      </div>
      <div className="ux-studio-device__island" aria-hidden="true" />
      <div className="ux-studio-device__glare" aria-hidden="true" />
    </motion.div>
  );
}
