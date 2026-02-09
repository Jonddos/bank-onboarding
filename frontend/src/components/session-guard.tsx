"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getExpiresAt } from "@/lib/auth";

export default function SessionGuard() {
    const router = useRouter();

    useEffect(() => {
        let t: ReturnType<typeof setTimeout> | null = null;

        const schedule = () => {
            if (t) clearTimeout(t);

            const expiresAt = getExpiresAt();
            if (!expiresAt) return;

            const ms = expiresAt - Date.now();
            if (ms <= 0) {
                clearSession();
                router.replace("/");
                return;
            }

            t = setTimeout(() => {
                clearSession();
                router.replace("/");
            }, ms);
        };

        schedule();

        const onChange = () => schedule();
        window.addEventListener("session-changed", onChange);

        return () => {
            if (t) clearTimeout(t);
            window.removeEventListener("session-changed", onChange);
        };
    }, [router]);

    return null;
}
