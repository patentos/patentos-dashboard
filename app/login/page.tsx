"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="px-6 py-8">
      
      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[rgba(20,87,184,0.10)] bg-white shadow-[0_20px_80px_rgba(20,87,184,0.08)] lg:grid-cols-2">
          <div className="bg-[linear-gradient(135deg,#0b2f6b_0%,#1457b8_55%,#ff8a00_140%)] p-10 text-white">
            <p className="text-sm font-semibold tracking-[0.12em] text-[#ffd2a1]">
              PatentOS Dashboard
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Access your innovation workspace
            </h1>
            <p className="mt-6 text-base leading-8 text-white/85">
              Sign in to access your PatentOS dashboard, manage workflows, and move from invention capture to patent readiness.
            </p>
          </div>

          <div className="p-10">
            <h2 className="text-3xl font-semibold text-[#122033]">Login</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Enter your email and password to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-[rgba(20,87,184,0.12)] bg-white px-4 py-3 text-[#122033] outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[rgba(20,87,184,0.12)] bg-white px-4 py-3 text-[#122033] outline-none"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#1457b8] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0b2f6b] disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}