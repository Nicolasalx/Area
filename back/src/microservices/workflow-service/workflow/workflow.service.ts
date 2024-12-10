import { WorkflowDto } from '@common/dto/workflow.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prismaService/prisma/prisma.service';

@Injectable()
export class WorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all workflows for a user by their ID
   * @param id User's ID
   */
  async getWorkflowsByUserId(id: string) {
    console.log('Getting workflows for user:', id);

    const workflows = await this.prisma.workflows.findMany({
      where: {
        OR: [{ userId: id }, { usersId: id }],
      },
      include: {
        activeActions: {
          include: {
            service: { select: { id: true, name: true, description: true } },
          },
        },
        activeReactions: {
          include: {
            service: { select: { id: true, name: true, description: true } },
          },
        },
        Users: true,
      },
    });

    console.log('Found workflows:', workflows);
    return workflows;
  }

  /**
   * Creates a workflow and assigns it to a user
   * @param workflowDto Workflow data
   */
  async createWorkflow(workflowDto: WorkflowDto) {
    const { name, sessionId, actions, reactions } = workflowDto;

    console.log('Creating workflow with data:', {
      name,
      sessionId,
      actions,
      reactions,
    });

    const user = await this.prisma.users.findUnique({
      where: { id: sessionId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${sessionId} untraceable.`);
    }

    await this.verifyServicesExist(actions, reactions);

    const workflow = await this.prisma.workflows.create({
      data: {
        name,
        userId: sessionId,
        usersId: sessionId,
        isActive: true,
        activeActions: {
          create: actions.map((action) => ({
            name: action.name,
            description: `Action for service: ${action.serviceId}`,
            data: action.data,
            serviceId: action.serviceId,
            isActive: true,
          })),
        },
        activeReactions: {
          create: reactions.map((reaction) => ({
            name: reaction.name,
            description: `Reaction for service: ${reaction.serviceId}`,
            trigger: reaction.trigger,
            data: reaction.data,
            serviceId: reaction.serviceId,
            isActive: true,
          })),
        },
      },
      include: {
        activeActions: {
          include: {
            service: true,
          },
        },
        activeReactions: {
          include: {
            service: true,
          },
        },
        Users: true,
      },
    });

    console.log('Created workflow:', workflow);
    return workflow;
  }

  private async verifyServicesExist(actions: any[], reactions: any[]) {
    for (const action of actions) {
      if (!action.serviceId) {
        throw new NotFoundException('Service ID is required for actions');
      }
      const service = await this.prisma.services.findUnique({
        where: { id: action.serviceId },
      });
      if (!service) {
        throw new NotFoundException(
          `Service with ID "${action.serviceId}" not found.`,
        );
      }
      if (!action.data || Object.keys(action.data).length === 0) {
        throw new NotFoundException(
          `Data for action ${action.name} is required.`,
        );
      }
    }

    for (const reaction of reactions) {
      if (!reaction.serviceId) {
        throw new NotFoundException('Service ID is required for reactions');
      }
      const service = await this.prisma.services.findUnique({
        where: { id: reaction.serviceId },
      });
      if (!service) {
        throw new NotFoundException(
          `Service with ID "${reaction.serviceId}" not found.`,
        );
      }
      if (!reaction.data || Object.keys(reaction.data).length === 0) {
        throw new NotFoundException(
          `Data for action ${reaction.name} is required.`,
        );
      }
    }
  }

  private async findExistingActions(actions: any[]) {
    return Promise.all(
      actions.map(async (action) => {
        const existingAction = await this.prisma.actions.findFirst({
          where: {
            AND: [{ name: action.name }, { serviceId: action.serviceId }],
          },
        });
        if (!existingAction) {
          throw new NotFoundException(
            `Action "${action.name}" not found for the specified service.`,
          );
        }
        return { id: existingAction.id };
      }),
    );
  }

  private async findExistingReactions(reactions: any[]) {
    return Promise.all(
      reactions.map(async (reaction) => {
        const existingReaction = await this.prisma.reactions.findFirst({
          where: {
            AND: [{ name: reaction.name }, { serviceId: reaction.serviceId }],
          },
        });
        if (!existingReaction) {
          throw new NotFoundException(
            `Reaction "${reaction.name}" not found for the specified service.`,
          );
        }
        return { id: existingReaction.id };
      }),
    );
  }

  /**
   * Deletes a workflow by its ID
   * @param id Workflow ID
   */
  async deleteWorkflow(id: string) {
    const workflow = await this.prisma.workflows.findUnique({
      where: { id },
      include: {
        activeActions: true,
        activeReactions: true,
      },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    console.log('Deleting workflow:', {
      id,
      activeActions: workflow.activeActions,
      activeReactions: workflow.activeReactions,
    });

    // Delete in a transaction to ensure all related records are deleted
    await this.prisma.$transaction(async (prisma) => {
      // Delete related active actions
      await prisma.activeAction.deleteMany({
        where: {
          workflowId: id,
        },
      });

      // Delete related active reactions
      await prisma.activeReaction.deleteMany({
        where: {
          workflowId: id,
        },
      });

      // Finally, delete the workflow itself
      await prisma.workflows.delete({
        where: { id },
      });
    });
  }

  /**
   * Toggles a workflow's active status
   * @param id Workflow ID
   * @param isActive New active status
   */
  async toggleWorkflow(id: string, isActive: boolean) {
    const workflow = await this.prisma.workflows.findUnique({
      where: { id },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    return this.prisma.workflows.update({
      where: { id },
      data: { isActive },
      include: {
        activeActions: {
          include: {
            service: { select: { id: true, name: true, description: true } },
          },
        },
        activeReactions: {
          include: {
            service: { select: { id: true, name: true, description: true } },
          },
        },
      },
    });
  }
}
