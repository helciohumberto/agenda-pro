import { useState } from "react";
import { apiRequest } from "../api/client";

export function Register() {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ businessName, ownerName, email, password }),
      });
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-16 flex flex-col gap-3"
    >
      <h1 className="text-xl font-semibold mb-2">Criar seu negócio</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        placeholder="Nome do negócio"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        placeholder="Seu nome"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-black text-white rounded px-3 py-2 mt-2"
      >
        Criar negócio
      </button>
      <a href="/login" className="text-sm text-center text-gray-500 mt-2">
        Já tem conta? Entrar
      </a>
    </form>
  );
}
