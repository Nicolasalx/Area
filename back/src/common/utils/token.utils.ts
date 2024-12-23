import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getToken(
  userId: string,
  service: string,
): Promise<string | null> {
  const serviceId = await getServiceId(service);

  try {
    const serviceToken = await prisma.serviceTokens.findUnique({
      where: {
        userId_serviceId: {
          userId: userId,
          serviceId: serviceId,
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

export async function getUserId(workflowId: string): Promise<string> {
  try {
    const workflow = await prisma.workflows.findUnique({
      where: {
        id: workflowId,
      },
      select: {
        userId: true,
      },
    });

    if (!workflow) {
      console.error(`Workflow with ID ${workflowId} not found.`);
      return;
    }
    return workflow.userId;
  } catch (error) {
    console.error('Error retrieving user ID:', error);
  }
}
