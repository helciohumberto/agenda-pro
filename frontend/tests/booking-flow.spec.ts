import { test, expect } from '@playwright/test';

const TENANT_ID = 'd1bb86e5-a8a0-43af-8883-c0020209a4cf'; // tenant da Ana

test('cliente consegue marcar horário sem criar conta', async ({ page }) => {
  await page.goto(`http://localhost:5173/book/${TENANT_ID}`);

  await page.getByPlaceholder('Seu nome').fill('Cliente Playwright');
  await page.getByPlaceholder('Telefone ou email').fill(`playwright-${Date.now()}@teste.com`);

  await page.getByRole('combobox').first().selectOption({ label: 'Corte de cabelo — R$ 30' });
  await page.getByRole('combobox').nth(1).selectOption({ label: 'Ana' });
  await page.locator('input[type="datetime-local"]').fill('2026-11-15T10:00');

  await page.getByRole('button', { name: 'Confirmar' }).click();

  await expect(page.getByText('Agendamento confirmado!')).toBeVisible();
});