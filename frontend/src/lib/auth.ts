const TOKEN_KEY = "bo_token";
const EXPIRES_AT_KEY = "bo_expires_at";

export function setSession(token: string, expiresInSeconds: number) {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));

    window.dispatchEvent(new Event("session-changed"));
}

export function getExpiresAt(): number | null {
    const raw = localStorage.getItem(EXPIRES_AT_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

export function isExpired() {
    const expiresAt = getExpiresAt();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
}

function storage() {
    if (typeof window === "undefined") return null;
    return window.localStorage;
}

export function getToken() {
    return storage()?.getItem(TOKEN_KEY) ?? null;
}

export function clearSession() {
    const s = storage();
    if (!s) return;
    s.removeItem(TOKEN_KEY);
    s.removeItem(EXPIRES_AT_KEY);
}

export function isSessionActive() {
    const s = storage();
    if (!s) return false;

    const token = s.getItem(TOKEN_KEY);
    const expiresAtRaw = s.getItem(EXPIRES_AT_KEY);
    if (!token || !expiresAtRaw) return false;

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt)) return false;

    return Date.now() < expiresAt;
}

export function getRemainingSeconds() {
    const s = storage();
    if (!s) return 0;

    const expiresAtRaw = s.getItem(EXPIRES_AT_KEY);
    if (!expiresAtRaw) return 0;

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt)) return 0;

    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}
