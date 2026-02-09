"use client";

import { useEffect, useState } from "react";
import { clearSession, getRemainingSeconds, isSessionActive } from "@/lib/auth";
import { useRouter } from "next/navigation";

function formatMMSS(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SessionBadge() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;

        const tick = () => {
            const secs = getRemainingSeconds();
            setRemaining(secs);

            if (!isSessionActive() || secs <= 0) {
                clearSession();
                router.replace("/");
            }
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [mounted, router]);

    if (!mounted) return null;

    return (
        <div className="text-sm">
            Sesión activa · expira en <b>{formatMMSS(remaining)}</b>
        </div>
    );
}
