import { prisma } from '../prisma';
import { hashPassword } from '../auth/password';

interface InviteStaffInput {
  name: string;
  email: string;
  role: string;
}

export async function inviteStaff(tenantId: string, input: InviteStaffInput) {
  return prisma.staff.create({
    data: {
      tenant: { connect: { id: tenantId } },
      name: input.name,
      email: input.email,
      role: input.role,
      passwordHash: null,
    },
  });
}

export async function acceptInvite(staffId: string, password: string) {
  const passwordHash = await hashPassword(password);

  return prisma.staff.update({
    where: { id: staffId },
    data: { passwordHash },
  });
}