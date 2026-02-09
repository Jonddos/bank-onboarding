import { getToken } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
    auth = false
): Promise<T> {
    if (!BASE) throw new Error("Falta NEXT_PUBLIC_API_BASE_URL en .env.local");

    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type") && options.body) {
        headers.set("Content-Type", "application/json");
    }

    if (auth) {
        const token = getToken();
        if (!token) throw new Error("No hay token. Inicia sesión.");
        headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${BASE}${path}`, { ...options, headers });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
        const msg =
            (data && (data.message || data.error)) ||
            `Error HTTP ${res.status}`;
        throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
    }

    return data as T;
}
