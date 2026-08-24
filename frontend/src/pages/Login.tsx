import { useState } from 'react';
import { apiRequest } from '../api/client';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 flex flex-col gap-3">
      <h1 className="text-xl font-semibold mb-2">Entrar</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
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
      <button type="submit" className="bg-black text-white rounded px-3 py-2 mt-2">
        Entrar
      </button>
      <a href="/register" className="text-sm text-center text-gray-500 mt-2">
        Ainda não tem negócio? Criar conta
      </a>
    </form>
  );
}