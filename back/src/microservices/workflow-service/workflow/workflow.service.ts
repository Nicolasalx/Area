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
    const workflows = await this.prisma.workflows.findMany({
      where: { userId: id },
      include: {
        actions: {
          include: { service: true },
        },
        reactions: {
          include: { service: true },
        },
      },
    });

    if (!workflows.length) {
      throw new NotFoundException(`No workflow found for user with ID ${id}`);
    }

    return workflows;
  }

  /**
   * Creates a workflow and assigns it to a user
   * @param workflowDto Workflow data
   */
  async createWorkflow(workflowDto: WorkflowDto) {
    const { name, sessionId, actions, reactions } = workflowDto;

    const user = await this.prisma.users.findUnique({
      where: { id: sessionId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${sessionId} untraceable.`);
    }

    await this.verifyServicesExist(actions, reactions);

    const actionsToConnect = await this.findExistingActions(actions);
    const reactionsToConnect = await this.findExistingReactions(reactions);

    const workflow = await this.prisma.workflows.create({
      data: {
        name,
        userId: sessionId,
        actions: {
          connect: actionsToConnect,
        },
        reactions: {
          connect: reactionsToConnect,
        },
      },
      include: {
        actions: { include: { service: true } },
        reactions: { include: { service: true } },
      },
    });

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
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    await this.prisma.workflows.delete({
      where: { id },
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
        actions: { include: { service: true } },
        reactions: { include: { service: true } },
      },
    });
  }
}
