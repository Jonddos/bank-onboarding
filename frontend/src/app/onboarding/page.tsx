"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import SessionBadge from "@/components/session-badge";

type Product = {
    id: string;
    name: string;
    description: string;
    minInitialAmount: number;
    currency: "COP";
};

type OnboardingResponse = {
    onboardingId: string;
    status: "REQUESTED";
};

function isEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function onlyDigits(v: string) {
    return v.replace(/\D+/g, "");
}

export default function OnboardingPage() {
    const router = useRouter();
    const search = useSearchParams();
    const productIdFromUrl = search.get("productId");

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>("");

    const selectedProduct = useMemo(
        () => products.find((p) => p.id === selectedProductId) || null,
        [products, selectedProductId]
    );

    // Form (sin valores quemados)
    const [fullName, setFullName] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [email, setEmail] = useState("");
    const [initialAmount, setInitialAmount] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<OnboardingResponse | null>(null);

    // Cargar productos y setear selección
    useEffect(() => {
        apiFetch<Product[]>("/products")
            .then((list) => {
                setProducts(list);

                const initialId =
                    (productIdFromUrl && list.some((p) => p.id === productIdFromUrl) && productIdFromUrl) ||
                    (list[0]?.id ?? "");

                setSelectedProductId(initialId);

                const p = list.find((x) => x.id === initialId);
                if (p) setInitialAmount(String(p.minInitialAmount));
            })
            .catch((err) => setError(err.message));
    }, [productIdFromUrl]);

    // Si cambia producto, sugiere mínimo
    useEffect(() => {
        if (!selectedProduct) return;
        // Solo autollenar si está vacío o si coincide con el mínimo anterior
        if (!initialAmount) {
            setInitialAmount(String(selectedProduct.minInitialAmount));
            return;
        }
    }, [selectedProduct]); // eslint-disable-line react-hooks/exhaustive-deps

    const fieldErrors = useMemo(() => {
        const errs: Record<string, string> = {};
        const doc = onlyDigits(documentNumber);

        if (!fullName.trim()) errs.fullName = "El nombre es obligatorio.";
        if (!doc || doc.length < 6 || doc.length > 12)
            errs.documentNumber = "Documento: 6 a 12 dígitos numéricos.";
        if (!email.trim() || !isEmail(email)) errs.email = "Email inválido.";
        const amt = Number(initialAmount);
        if (!Number.isFinite(amt) || amt < 0) errs.initialAmount = "Monto inválido (≥ 0).";

        if (selectedProduct && Number.isFinite(amt) && amt < selectedProduct.minInitialAmount) {
            errs.initialAmount = `El mínimo para ${selectedProduct.name} es ${selectedProduct.minInitialAmount} COP.`;
        }

        return errs;
    }, [fullName, documentNumber, email, initialAmount, selectedProduct]);

    const isValid = Object.keys(fieldErrors).length === 0;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = {
                fullName: fullName.trim(),
                documentNumber: onlyDigits(documentNumber),
                email: email.trim(),
                initialAmount: Number(initialAmount),
            };

            const data = await apiFetch<OnboardingResponse>(
                "/onboarding",
                { method: "POST", body: JSON.stringify(payload) },
                true
            );

            setResult(data);
        } catch (err: any) {
            setError(err.message || "Error creando onboarding");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFullName("");
        setDocumentNumber("");
        setEmail("");
        setInitialAmount(selectedProduct ? String(selectedProduct.minInitialAmount) : "");
        setResult(null);
        setError(null);
    };

    return (
        <main className="min-h-screen p-6 max-w-5xl mx-auto">
            <header className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Onboarding</h1>
                    <p className="text-sm text-[var(--muted)]">
                        Crea una solicitud de vinculación para un cliente.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <SessionBadge />
                    <Link className="ui-btn ui-btn-secondary" href="/products">
                        Volver a productos
                    </Link>
                </div>
            </header>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.2fr]">
                {/* Panel producto */}
                <section className="ui-card p-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">Producto</h2>
                        <Link className="text-sm underline" href="/products">
                            Ver catálogo
                        </Link>
                    </div>

                    <label className="ui-label mt-4 block">Selecciona</label>
                    <select
                        className="ui-input mt-1"
                        value={selectedProductId}
                        onChange={(e) => {
                            const id = e.target.value;
                            setSelectedProductId(id);
                            const p = products.find((x) => x.id === id);
                            if (p) setInitialAmount(String(p.minInitialAmount));
                        }}
                    >
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    {selectedProduct && (
                        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[rgba(0,102,179,0.05)] p-4">
                            <div className="font-semibold">{selectedProduct.name}</div>
                            <div className="text-sm text-[var(--muted)] mt-1">{selectedProduct.description}</div>
                            <div className="text-sm mt-3">
                                <span className="font-mono">{selectedProduct.id}</span> · mínimo{" "}
                                <b>{selectedProduct.minInitialAmount}</b> {selectedProduct.currency}
                            </div>
                        </div>
                    )}

                    <p className="mt-4 text-xs text-[var(--muted)]">
                        Tip: el monto se autocompleta con el mínimo del producto.
                    </p>
                </section>

                {/* Formulario */}
                <section className="ui-card p-5">
                    <form onSubmit={onSubmit} className="space-y-3">
                        <div>
                            <label className="ui-label">Nombre completo</label>
                            <input
                                className="ui-input mt-1"
                                placeholder="Ej: Juan Pérez"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            {fieldErrors.fullName && (
                                <p className="text-xs text-red-700 mt-1">{fieldErrors.fullName}</p>
                            )}
                        </div>

                        <div>
                            <label className="ui-label">Documento</label>
                            <input
                                className="ui-input mt-1"
                                inputMode="numeric"
                                placeholder="6 a 12 dígitos"
                                value={documentNumber}
                                onChange={(e) => setDocumentNumber(onlyDigits(e.target.value))}
                            />
                            {fieldErrors.documentNumber && (
                                <p className="text-xs text-red-700 mt-1">{fieldErrors.documentNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="ui-label">Email</label>
                            <input
                                className="ui-input mt-1"
                                type="email"
                                placeholder="cliente@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {fieldErrors.email && <p className="text-xs text-red-700 mt-1">{fieldErrors.email}</p>}
                        </div>

                        <div>
                            <label className="ui-label">Monto inicial (COP)</label>
                            <input
                                className="ui-input mt-1"
                                type="number"
                                min={0}
                                placeholder="0"
                                value={initialAmount}
                                onChange={(e) => setInitialAmount(e.target.value)}
                            />
                            {fieldErrors.initialAmount && (
                                <p className="text-xs text-red-700 mt-1">{fieldErrors.initialAmount}</p>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        {result && (
                            <div className="rounded-xl bg-green-50 text-green-800 p-3 text-sm border border-green-100">
                                <div>
                                    <b>onboardingId:</b> {result.onboardingId}
                                </div>
                                <div>
                                    <b>status:</b> {result.status}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                            <button disabled={loading || !isValid} className="ui-btn ui-btn-primary">
                                {loading ? "Enviando..." : "Crear onboarding"}
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                className="ui-btn ui-btn-secondary"
                                onClick={reset}
                            >
                                Limpiar
                            </button>

                            {result && (
                                <button
                                    type="button"
                                    className="ui-btn ui-btn-secondary ml-auto"
                                    onClick={() => router.push("/products")}
                                >
                                    Volver
                                </button>
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}
