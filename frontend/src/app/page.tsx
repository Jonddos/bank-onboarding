"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { setSession } from "@/lib/auth";

type LoginResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setSession(data.access_token, data.expires_in);
      router.push("/products");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Guardian Onboarding</h1>
          <p className="text-sm text-gray-500 mt-1">
            Login demo (JWT dura 5 minutos)
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <label className="text-sm font-medium">Usuario</label>
              <input
                  className="mt-1 w-full rounded-xl border p-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input
                  className="mt-1 w-full rounded-xl border p-2"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
              />
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 text-red-700 p-2 text-sm">
                  {error}
                </div>
            )}

            <button
                disabled={loading}
                className="w-full rounded-xl bg-black text-white p-2 disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            Luego de login → <span className="font-mono">/products</span>
          </div>
        </div>
      </main>
  );
}
