"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Email ou senha inválidos.");
        setLoading(false);
        return;
      }

      router.push("/dashboard"); 
      router.refresh();
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Bem-vindo de volta
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
          Entre para gerenciar seus estudos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-500">
        Não tem uma conta?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          Cadastre-se
        </Link>
      </div>
    </div>
  );
}