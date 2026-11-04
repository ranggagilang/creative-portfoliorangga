"use client";

import { useReducedMotion } from "motion/react";
// Adjust path/export here if shadcn installed the Pro component elsewhere.
// This path assumes the CLI installs components/ui/device.tsx.
import Device from "./ui/device";

/** Replace StudioDevice.tsx with this file AFTER installing the licensed React Bits component. */
export default function StudioDevice({ image, alt, width = 215, secondary = false }: {
  image: string; alt: string; width?: number; secondary?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <Device
      width={width}
      finish="black"
      frameColor="#243d2b"
      screenColor="#e4f8dc"
      shadowColor="#214b27"
      orientation="portrait"
      rotateX={3}
      rotateY={secondary ? 9 : -12}
      rotateZ={secondary ? 5 : -4}
      tilt={reduce ? 0 : 5}
      float={reduce ? 0 : 0.35}
      lift={0.5}
      reflection={0.55}
      shadow={0.8}
      drag={false}
      interactive={!reduce}
      intro={!reduce}
      paused={!!reduce}
      alt={alt}
      image={image || undefined}
    >
      {!image ? (
        <div style={{ width:"100%",height:"100%",display:"grid",placeItems:"center",background:"linear-gradient(155deg,#eafdd8,#a5eea7)",color:"#315e3c",fontSize:12,fontWeight:650,padding:18,textAlign:"center" }}>
          Tambahkan screenshot aplikasi di FEATURED_PROJECT.image
        </div>
      ) : undefined}
    </Device>
  );
}
