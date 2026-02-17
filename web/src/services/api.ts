import { supabase } from "../config/supabase";

const API_URL = (import.meta.env.VITE_API_URL as string).replace(/\/+$/, "");

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session && { Authorization: `Bearer ${session.access_token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json();
  return json.data as T;
}
