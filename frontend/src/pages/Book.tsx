import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

interface Service { id: string; name: string; price: string; durationMinutes: number; }
interface Staff { id: string; name: string; role: string; }

export function Book() {
  const { tenantId } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/public/${tenantId}/services`).then(r => r.json()).then(setServices);
    fetch(`${API_URL}/public/${tenantId}/staff`).then(r => r.json()).then(setStaffList);
  }, [tenantId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    const res = await fetch(`${API_URL}/public/${tenantId}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName, clientContact, serviceId, staffId,
        scheduledAt: new Date(scheduledAt).toISOString(),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || 'Erro ao agendar');
      return;
    }
    setMessage('Agendamento confirmado!');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 flex flex-col gap-3">
      <h1 className="text-xl font-semibold mb-2">Marcar horário</h1>
      {message && <p className="text-sm">{message}</p>}

      <input placeholder="Seu nome" value={clientName} onChange={e => setClientName(e.target.value)} className="border rounded px-3 py-2" />
      <input placeholder="Telefone ou email" value={clientContact} onChange={e => setClientContact(e.target.value)} className="border rounded px-3 py-2" />

      <select value={serviceId} onChange={e => setServiceId(e.target.value)} className="border rounded px-3 py-2">
        <option value="">Escolha o serviço</option>
        {services.map(s => <option key={s.id} value={s.id}>{s.name} — R$ {s.price}</option>)}
      </select>

      <select value={staffId} onChange={e => setStaffId(e.target.value)} className="border rounded px-3 py-2">
        <option value="">Escolha o profissional</option>
        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className="border rounded px-3 py-2" />

      <button type="submit" className="bg-black text-white rounded px-3 py-2 mt-2">Confirmar</button>
    </form>
  );
}