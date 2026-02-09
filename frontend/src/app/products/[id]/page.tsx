"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import SessionBadge from "@/components/session-badge";

type Product = {
    id: string;
    name: string;
    description: string;
    minInitialAmount: number;
    currency: "COP";
};

const DEFAULT_EXTRAS = {
    benefits: [
        "Apertura 100% digital",
        "Consulta de movimientos en línea",
        "Soporte por canales digitales",
    ],
    requirements: ["Documento de identidad", "Correo válido", "Monto inicial según el mínimo"],
};

const PRODUCT_EXTRAS: Record<
    string,
    { benefits: string[]; requirements: string[]; idealFor: string }
> = {
    "cta-digital-001": {
        idealFor: "Personas que quieren una cuenta simple y rápida para el día a día.",
        benefits: [
            "Apertura digital en minutos",
            "Costos mínimos para uso básico",
            "Ideal para manejar pagos y transferencias",
        ],
        requirements: ["Cédula", "Correo válido", "Monto inicial ≥ mínimo del producto"],
    },
    "cta-digital-002": {
        idealFor: "Personas con ingresos recurrentes (nómina) que buscan beneficios.",
        benefits: [
            "Pensada para recibir nómina",
            "Facilita control de ingresos y gastos",
            "Beneficios por uso frecuente (según condiciones del banco)",
        ],
        requirements: ["Cédula", "Correo válido", "Monto inicial ≥ mínimo del producto"],
    },
    "ahorro-001": {
        idealFor: "Quienes quieren ahorrar con disciplina y metas mensuales.",
        benefits: [
            "Ahorro con metas",
            "Recordatorios y hábito de ahorro",
            "Aportes periódicos (según tu plan)",
        ],
        requirements: ["Cédula", "Correo válido", "Monto inicial ≥ mínimo del producto"],
    },
};

function formatCOP(value: number) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
}

type PageProps = {
    params: Promise<{ id: string }>;
};


export default function ProductDetail({ params }: PageProps) {
    const { id } = React.use(params);
    const router = useRouter();
    const [item, setItem] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError(null);

        apiFetch<Product>(`/products/${id}`)
            .then((data) => {
                if (alive) setItem(data);
            })
            .catch((err) => {
                if (alive) setError(err.message);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });

        return () => {
            alive = false;
        };
    }, [id]);

    const extras = useMemo(() => {
        if (!item) return DEFAULT_EXTRAS;
        return PRODUCT_EXTRAS[item.id] ?? { ...DEFAULT_EXTRAS, idealFor: "Una opción digital para ti." };
    }, [item]);

    const goOnboarding = () => {
        router.push(`/onboarding?productId=${encodeURIComponent(id)}`);
    };

    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <header className="flex items-center justify-between gap-3">
                    <Link className="ui-btn ui-btn-outline" href="/products">
                        ← volver
                    </Link>
                    <SessionBadge />
                </header>

                {error && <div className="ui-alert-error">{error}</div>}

                {loading && (
                    <div className="ui-card p-6">
                        <div className="text-sm" style={{ color: "var(--muted)" }}>
                            Cargando producto…
                        </div>
                    </div>
                )}

                {item && (
                    <>
                        <section className="ui-card p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <h1 className="text-3xl font-semibold">{item.name}</h1>
                                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                                        {item.description}
                                    </p>
                                    {"idealFor" in extras && (
                                        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                                            <b>Ideal para:</b> {extras.idealFor}
                                        </p>
                                    )}
                                </div>

                                <button className="ui-btn ui-btn-primary" onClick={goOnboarding}>
                                    Abrir esta cuenta
                                </button>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                                        ID
                                    </div>
                                    <div className="mt-1 font-mono text-sm">{item.id}</div>
                                </div>

                                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                                        Monto mínimo
                                    </div>
                                    <div className="mt-1 font-semibold">{formatCOP(item.minInitialAmount)}</div>
                                </div>

                                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)" }}>
                                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                                        Moneda
                                    </div>
                                    <div className="mt-1 font-semibold">{item.currency}</div>
                                </div>
                            </div>
                        </section>

                        <section className="grid gap-6 sm:grid-cols-2">
                            <div className="ui-card p-6">
                                <h2 className="text-lg font-semibold">Beneficios</h2>
                                <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--text)" }}>
                                    {extras.benefits.map((b) => (
                                        <li key={b} className="flex gap-2">
                                            <span aria-hidden>✅</span>
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="ui-card p-6">
                                <h2 className="text-lg font-semibold">Requisitos</h2>
                                <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--text)" }}>
                                    {extras.requirements.map((r) => (
                                        <li key={r} className="flex gap-2">
                                            <span aria-hidden>📌</span>
                                            <span>{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="ui-card p-6">
                            <h2 className="text-lg font-semibold">¿Qué pasa cuando creas un onboarding?</h2>
                            <ol className="mt-3 list-decimal pl-5 text-sm" style={{ color: "var(--muted)" }}>
                                <li>Te pedimos tus datos (nombre, documento, email y monto inicial).</li>
                                <li>Se envían al backend con tu token (Authorization Bearer).</li>
                                <li>El backend valida (email, monto ≥ 0 y reglas del negocio).</li>
                                <li>Si todo está bien, te devuelve un <b>onboardingId</b> y estado <b>REQUESTED</b>.</li>
                            </ol>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}

