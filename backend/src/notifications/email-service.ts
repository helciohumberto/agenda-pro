import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface AppointmentConfirmationInput {
  clientContact: string;
  clientName: string;
  serviceName: string;
  scheduledAt: Date;
}

export async function sendAppointmentConfirmation(input: AppointmentConfirmationInput) {
  const formattedDate = input.scheduledAt.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  try {
    await resend.emails.send({
      from: 'AgendaPro <onboarding@resend.dev>',
      to: input.clientContact,
      subject: 'Agendamento confirmado',
      html: `
        <p>Olá, ${input.clientName}!</p>
        <p>Seu horário para <strong>${input.serviceName}</strong> foi confirmado para <strong>${formattedDate}</strong>.</p>
        <p>Até lá!</p>
      `,
    });
  } catch (error) {
    console.error('Falha ao enviar email de confirmação:', error);
    // não relança o erro -- falha de email nao deve derrubar o agendamento
  }
}