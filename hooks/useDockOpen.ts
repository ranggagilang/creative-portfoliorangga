"use client";
import { useSyncExternalStore } from "react";

// State kecil yang dibagi antara Dock dan halaman lain (misalnya About),
// supaya halaman bisa menyesuaikan ukuran saat dock dibuka atau ditutup.
let open = true;
const listeners = new Set<() => void>();

export const dockStore = {
    get: () => open,
    set: (value: boolean) => {
        open = value;
        listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
        listeners.add(l);
        return () => {
            listeners.delete(l);
        };
    },
};

export function useDockOpen() {
    return useSyncExternalStore(dockStore.subscribe, dockStore.get, () => true);
}