"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Product = {
    id: string;
    name: string;
    description: string;
    minInitialAmount: number;
    currency: "COP";
};

export default function ProductDetail({ params }) {
    const [item, setItem] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { id } = React.use(params)

    useEffect(() => {
        apiFetch<Product>(`/products/${id}`)
            .then(setItem)
            .catch((err) => setError(err.message));
    }, [params.id]);

    return (
        <main className="min-h-screen p-6 max-w-2xl mx-auto">
            <Link href="/products" className="text-sm underline">
                ← volver
            </Link>

            {error && (
                <div className="mt-4 rounded-xl bg-red-50 text-red-700 p-3 text-sm">
                    {error}
                </div>
            )}

            {item && (
                <div className="mt-6 rounded-2xl border p-5">
                    <h1 className="text-2xl font-semibold">{item.name}</h1>
                    <p className="text-gray-600 mt-1">{item.description}</p>

                    <div className="mt-4 text-sm">
                        ID: <span className="font-mono">{item.id}</span>
                    </div>

                    <div className="mt-2 text-sm">
                        Mínimo: <b>{item.minInitialAmount}</b> {item.currency}
                    </div>
                </div>
            )}
        </main>
    );
}
