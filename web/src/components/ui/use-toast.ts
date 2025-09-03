"use client";
import { useEffect, useState } from "react";

export type ToastVariant = "default" | "destructive";
export type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms
};

type ToastListener = (t: ToastOptions & { id: string }) => void;
type DismissListener = (id?: string) => void;

let uid = 0;
const toastListeners = new Set<ToastListener>();
const dismissListeners = new Set<DismissListener>();

export function toast(opts: ToastOptions) {
  const id = opts.id || `t_${Date.now()}_${++uid}`;
  const payload = { ...opts, id };
  toastListeners.forEach((l) => l(payload));
  return { id };
}

export function dismiss(id?: string) {
  dismissListeners.forEach((l) => l(id));
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastOptions & { id: string })[]>([]);

  useEffect(() => {
    const onToast: ToastListener = (t) => setToasts((prev) => [...prev, t]);
    const onDismiss: DismissListener = (id) =>
      setToasts((prev) => (id ? prev.filter((p) => p.id !== id) : []));
    toastListeners.add(onToast);
    dismissListeners.add(onDismiss);
    return () => {
      toastListeners.delete(onToast);
      dismissListeners.delete(onDismiss);
    };
  }, []);

  return { toast, dismiss, toasts, setToasts } as const;
}

