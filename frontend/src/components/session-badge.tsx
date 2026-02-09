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
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const tick = () => setRemaining(getRemainingSeconds());
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const active = isSessionActive();

    const goLogin = () => {
        clearSession();
        router.push("/");
    };

    return (
        <div className="flex items-center gap-3 text-sm">
            {active ? (
                <>
          <span className="px-3 py-1 rounded-full border">
            Sesión activa
          </span>
                    <span className="px-3 py-1 rounded-full border">
            Expira en {formatMMSS(remaining)}
          </span>
                </>
            ) : (
                <>
          <span className="px-3 py-1 rounded-full border">
            Sesión expirada
          </span>
                    <button
                        onClick={goLogin}
                        className="px-3 py-1 rounded-full bg-black text-white"
                    >
                        Ir a login
                    </button>
                </>
            )}
        </div>
    );
}
