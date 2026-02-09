"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import SessionBadge from "@/components/session-badge";

type OnboardingResponse = {
    onboardingId: string;
    status: "REQUESTED";
};

export default function OnboardingPage() {
    const [fullName, setFullName] = useState("Juan Perez");
    const [documentNumber, setDocumentNumber] = useState("10203040");
    const [email, setEmail] = useState("juan@mail.com");
    const [initialAmount, setInitialAmount] = useState<number>(50000);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<OnboardingResponse | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await apiFetch<OnboardingResponse>(
                "/onboarding",
                {
                    method: "POST",
                    body: JSON.stringify({
                        fullName,
                        documentNumber,
                        email,
                        initialAmount,
                    }),
                },
                true // auth
            );
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Error creando onboarding");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-6 max-w-2xl mx-auto">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Onboarding</h1>
                <div className="flex items-center gap-3">
                    <SessionBadge />
                    <Link className="rounded-xl border px-3 py-2" href="/products">
                        Volver a productos
                    </Link>
                </div>
            </header>

            <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-2xl border p-5">
                <div>
                    <label className="text-sm font-medium">Nombre completo</label>
                    <input
                        className="mt-1 w-full rounded-xl border p-2"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Documento</label>
                    <input
                        className="mt-1 w-full rounded-xl border p-2"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                        className="mt-1 w-full rounded-xl border p-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Monto inicial</label>
                    <input
                        className="mt-1 w-full rounded-xl border p-2"
                        type="number"
                        value={initialAmount}
                        onChange={(e) => setInitialAmount(Number(e.target.value))}
                    />
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="rounded-xl bg-green-50 text-green-800 p-3 text-sm">
                        <div><b>onboardingId:</b> {result.onboardingId}</div>
                        <div><b>status:</b> {result.status}</div>
                    </div>
                )}

                <button
                    disabled={loading}
                    className="w-full rounded-xl bg-black text-white p-2 disabled:opacity-60"
                >
                    {loading ? "Enviando..." : "Crear onboarding"}
                </button>

                <p className="text-xs text-gray-500">
                    Nota: si tu token expiró (5 min), vuelve a login.
                </p>
            </form>
        </main>
    );
}
