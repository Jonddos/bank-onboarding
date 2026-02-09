"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { clearSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import SessionBadge from "@/components/session-badge";

type Product = {
    id: string;
    name: string;
    description: string;
    minInitialAmount: number;
    currency: "COP";
};

export default function ProductsPage() {
    const router = useRouter();
    const [items, setItems] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiFetch<Product[]>("/products")
            .then(setItems)
            .catch((err) => setError(err.message));
    }, []);

    const logout = () => {
        clearSession();
        router.push("/");
    };

    return (
        <main className="min-h-screen p-6 max-w-3xl mx-auto">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Productos</h1>

                <div className="flex items-center gap-3">
                    <SessionBadge />
                    <div className="flex gap-2">
                        <Link className="ui-btn ui-btn-outline" href="/onboarding">
                            Crear onboarding
                        </Link>
                        <button className="ui-btn ui-btn-primary" onClick={logout}>
                            Salir
                        </button>
                    </div>
                </div>
            </header>


            {error && (
                <div className="mt-4 rounded-xl bg-red-50 text-red-700 p-3 text-sm">
                    {error}
                </div>
            )}

            <ul className="mt-6 space-y-3">
                {items.map((p) => {
                    console.log({p})
                    return (
                        <li key={p.id} className="ui-card p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-semibold">{p.name}</div>
                                    <div className="text-sm text-gray-600">{p.description}</div>
                                    <div className="text-sm mt-2">
                                        <span className="font-mono">{p.id}</span> · mínimo:{" "}
                                        <b>{p.minInitialAmount}</b> {p.currency}
                                    </div>
                                </div>
                                <Link
                                    href={`/products/${p.id}`}
                                    className="ui-btn ui-btn-outline"
                                >
                                    Ver
                                </Link>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </main>
    );
}
