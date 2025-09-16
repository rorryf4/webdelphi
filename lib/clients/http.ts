export async function httpJson<T>(url: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  const c = new AbortController(), id = setTimeout(() => c.abort(), init.timeoutMs ?? 12000);
  try {
    const res = await fetch(url, { ...init, signal: c.signal, headers: { "content-type": "application/json", ...(init.headers||{}) }});
    const text = await res.text(); const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status} ${res.statusText}`);
    return data as T;
  } finally { clearTimeout(id); }
}
