"use client";
import * as React from "react";
import { X } from "lucide-react";
import { dismiss, useToast } from "./use-toast";

function cn(...cls: (string | false | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

export function Toaster() {
  const { toasts, setToasts } = useToast();

  React.useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => {
        setToasts((prev) => prev.filter((p) => p.id !== t.id));
      }, t.duration ?? 3500)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, setToasts]);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[100]
    flex flex-col gap-2 w-[90vw] sm:w-[380px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-md border shadow bg-white p-3",
            t.variant === "destructive" && "border-red-300 bg-red-50"
          )}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              {t.title && (
                <div className={cn(
                  "text-sm font-semibold",
                  t.variant === "destructive" && "text-red-700"
                )}>{t.title}</div>
              )}
              {t.description && (
                <div className="text-sm text-gray-600 mt-0.5 break-words">
                  {t.description}
                </div>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="p-1 text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

