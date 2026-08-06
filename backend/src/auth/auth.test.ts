import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from './password';

describe('password hashing', () => {
  it('gera um hash diferente da senha original', async () => {
    const hash = await hashPassword('minhaSenha123');
    expect(hash).not.toBe('minhaSenha123');
  });

  it('confirma senha correta', async () => {
    const hash = await hashPassword('minhaSenha123');
    const valido = await comparePassword('minhaSenha123', hash);
    expect(valido).toBe(true);
  });

  it('rejeita senha errada', async () => {
    const hash = await hashPassword('minhaSenha123');
    const valido = await comparePassword('senhaErrada', hash);
    expect(valido).toBe(false);
  });
});