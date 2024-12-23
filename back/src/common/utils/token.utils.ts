import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getToken(
  userId: string,
  service: string,
): Promise<string | null> {
  try {
    const serviceToken = await prisma.serviceTokens.findUnique({
      where: {
        userId_serviceId: {
          userId: userId,
          serviceId: await getServiceId(service),
        },
      },
    });

    return serviceToken ? serviceToken.token : null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

async function getServiceId(serviceName: string): Promise<number | null> {
  const service = await prisma.services.findUnique({
    where: {
      name: serviceName,
    },
  });

  return service ? service.id : null;
}
