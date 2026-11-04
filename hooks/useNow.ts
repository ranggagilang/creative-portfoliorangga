"use client";
import { useEffect, useState } from "react";

// Mengembalikan waktu sekarang (null saat render pertama supaya tidak hydration mismatch)
export function useNow(interval = 1000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, interval);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [interval]);

  return now;
}