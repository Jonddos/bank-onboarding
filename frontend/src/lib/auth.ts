export const TOKEN_KEY = "guardian_token";
export const EXP_KEY = "guardian_exp"; // timestamp ms

export function setSession(token: string, expiresInSeconds: number) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    const exp = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(EXP_KEY, String(exp));
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getExp(): number | null {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(EXP_KEY);
    return v ? Number(v) : null;
}

export function clearSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXP_KEY);
}

export function getRemainingSeconds(): number {
    const exp = getExp();
    if (!exp) return 0;
    const diff = Math.floor((exp - Date.now()) / 1000);
    return Math.max(0, diff);
}

export function isSessionActive(): boolean {
    return !!getToken() && getRemainingSeconds() > 0;
}
