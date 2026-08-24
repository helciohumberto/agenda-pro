import { test, expect } from "@playwright/test";

const TENANT_ID = "d1bb86e5-a8a0-43af-8883-c0020209a4cf"; // tenant da Ana

test("cliente consegue marcar horário sem criar conta", async ({ page }) => {
  await page.goto(`http://localhost:5173/book/${TENANT_ID}`);

  await page.getByPlaceholder("Seu nome").fill("Cliente Playwright");
  await page
    .getByPlaceholder("Telefone ou email")
    .fill(`playwright-${Date.now()}@teste.com`);

  await page
    .getByRole("combobox")
    .first()
    .selectOption({ label: "Corte de cabelo — R$ 30" });
  await page.getByRole("combobox").nth(1).selectOption({ label: "Ana" });

  const scheduledAt = new Date(
    Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000,
  ); // horario aleatorio nos proximos 90 dias, evita colisao entre execucoes
  const formatted = scheduledAt.toISOString().slice(0, 16);
  await page.locator('input[type="datetime-local"]').fill(formatted);

  await page.getByRole("button", { name: "Confirmar" }).click();

  await expect(page.getByText("Agendamento confirmado!")).toBeVisible();
});