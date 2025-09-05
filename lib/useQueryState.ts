"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useQueryState<T extends Record<string, string>>(defaults: T) {
  const router = useRouter();
  const sp = useSearchParams();

  const state = useMemo(() => {
    const o: any = { ...defaults };
    sp.forEach((v, k) => { if (v) o[k] = v; });
    return o as T;
  }, [sp, defaults]);

  const set = useCallback((updates: Partial<T>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    router.push(`?${next.toString()}`, { scroll: false });
  }, [router, sp]);

  return [state, set] as const;
}
