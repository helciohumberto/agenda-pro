import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  client: { name: string; contact: string };
  service: { name: string; price: string };
  staff: { name: string };
}

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    apiRequest(`/appointments?page=${page}&limit=${limit}`).then((data) => {
      setAppointments(data.data);
      setTotal(data.total);
    });
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-xl font-semibold mb-6">Agendamentos</h1>

      <ul className="flex flex-col gap-2">
        {appointments.map((appt) => (
          <li key={appt.id} className="border rounded px-4 py-3">
            <div className="flex justify-between">
              <span className="font-medium">{appt.client.name}</span>
              <span className={appt.status === 'confirmed' ? 'text-green-600' : 'text-gray-400'}>
                {appt.status}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {appt.service.name} com {appt.staff.name} —{' '}
              {new Date(appt.scheduledAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm disabled:opacity-30"
          >
            Anterior
          </button>
          <span className="text-sm">Página {page} de {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm disabled:opacity-30"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}