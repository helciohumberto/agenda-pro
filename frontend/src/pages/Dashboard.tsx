import { useEffect, useState } from "react";
import { apiRequest, getTokenPayload } from "../api/client";

interface Service {
  id: string;
  name: string;
  price: string;
  durationMinutes: number;
}

export function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);
  const tokenPayload = getTokenPayload();
  const bookingLink = tokenPayload
    ? `${window.location.origin}/book/${tokenPayload.tenantId}`
    : "";

  async function loadServices() {
    try {
      const data = await apiRequest("/services");
      setServices(data);
    } catch {
      // lista fica vazia se der erro, tratamos abaixo se precisar
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await apiRequest("/services", {
        method: "POST",
        body: JSON.stringify({
          name,
          price: Number(price),
          durationMinutes: Number(duration),
        }),
      });
      setName("");
      setPrice("");
      setDuration("");
      loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar serviço");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Meus serviços</h1>

        <a href="/appointments" className="text-sm text-blue-600 underline">
          Ver agendamentos
        </a>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 underline"
        >
          Sair
        </button>
      </div>

            <div className="border rounded px-4 py-3 mb-6 bg-gray-50 flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500">
              Link para seus clientes agendarem:
            </span>
            <br />
            <span className="font-mono text-xs">{bookingLink}</span>
          </div>
          <button
            onClick={handleCopyLink}
            className="bg-black text-white rounded px-3 py-1.5 text-sm whitespace-nowrap"
          >
            {copied ? "Copiado!" : "Copiar link"}
          </button>
        </div>

      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          placeholder="Nome do serviço"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <input
          placeholder="Preço"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded px-3 py-2 w-24"
        />
        <input
          placeholder="Minutos"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border rounded px-3 py-2 w-24"
        />
        <button type="submit" className="bg-black text-white rounded px-4 py-2">
          Adicionar
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <ul className="flex flex-col gap-2">
        {services.map((service) => (
          <li
            key={service.id}
            className="border rounded px-4 py-3 flex justify-between"
          >
            <span>{service.name}</span>
            <span className="text-gray-500">
              R$ {service.price} · {service.durationMinutes}min
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
