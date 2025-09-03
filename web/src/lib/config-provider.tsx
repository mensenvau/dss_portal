"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { AppConfig } from "./config";
import { loadConfig } from "./config";

type ConfigContextValue = { config: AppConfig | null; loading: boolean };
const ConfigContext = createContext<ConfigContextValue>({ config: null, loading: true });

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, set_config] = useState<AppConfig | null>(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    loadConfig().then((cfg) => {
      set_config(cfg);
      set_loading(false);
    });
  }, []);

  return <ConfigContext.Provider value={{ config, loading }}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return useContext(ConfigContext);
}
