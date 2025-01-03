import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WorkflowDto } from '@common/dto/workflow.dto';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard';

@ApiTags('Workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  /**
   * Retrieves all workflows for a user by their ID
   * @param id User's ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get all workflows for a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Workflow successfully created.',
    schema: {
      example: {
        message:
          'User workflows 1f3afaac-7f27-4f22-9de5-ef86b621d9cd successfully recovered.',
        data: {
          id: 'bf2e9681-5049-4c49-9631-265635db22bb',
          name: 'Google Area',
          isActive: true,
          createdAt: '2024-12-07T22:38:20.885Z',
          userId: '1f3afaac-7f27-4f22-9de5-ef86b621d9cd',
          actions: [
            {
              id: 1,
              name: 'receive_email',
              description: 'Triggered when an email is received.',
              isActive: true,
              createdAt: '2024-12-07T22:28:57.903Z',
              serviceId: 1,
              service: {
                id: 1,
                name: 'google',
                description:
                  'Google services like Gmail, Calendar, Drive, etc.',
                isActive: true,
                createdAt: '2024-12-07T22:28:57.900Z',
              },
              data: [
                {
                  name: 'from',
                  description: "The sender's email address of the request",
                },
                {
                  name: 'subject',
                  description: 'The subject of the email sent in the request',
                },
                {
                  name: 'description',
                  description: 'The plain text body of the email',
                },
              ],
            },
          ],
          reactions: [
            {
              id: 1,
              name: 'send_email',
              description: 'Sends an email when triggered.',
              trigger: { reaction: 'send_email' },
              isActive: true,
              createdAt: '2024-12-07T22:28:57.906Z',
              serviceId: 1,
              service: {
                id: 1,
                name: 'google',
                description:
                  'Google services like Gmail, Calendar, Drive, etc.',
                isActive: true,
                createdAt: '2024-12-07T22:28:57.900Z',
              },
              data: [
                {
                  name: 'from',
                  description: "The sender's email address of the request",
                },
                {
                  name: 'to',
                  description: "The recipient's email address of the request",
                },
                {
                  name: 'subject',
                  description: 'The subject of the email sent in the request',
                },
                {
                  name: 'text',
                  description: 'The plain text body of the email',
                },
                {
                  name: 'html',
                  description: 'The HTML formatted body of the email',
                },
              ],
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        message:
          'No workflow found for user with ID 1f3afaac-7f27-4f22-9de5-ef86b621d9cd',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async getWorkflows(@Param('id') id: string) {
    try {
      const workflows = await this.workflowService.getWorkflowsByUserId(id);
      console.log('WORKFLOW: ', workflows);
      return {
        message: `User workflows ${id} successfully recovered.`,
        data: workflows,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a workflow and assigns it to a user
   * @param workflowDto Workflow data
   */
  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiResponse({
    status: 201,
    description: 'Workflow successfully created.',
    schema: {
      example: {
        message: 'Workflow successfully created.',
        data: {
          id: 'be343d87-0e8f-4d74-9705-db3e98079963',
          name: 'string',
          userId: 'a8fd7426-9ca9-4ddb-9420-cf38c96cf9cf',
          isActive: true,
          usersId: 'a8fd7426-9ca9-4ddb-9420-cf38c96cf9cf',
          activeActions: [
            {
              id: '41273c13-d46c-4354-939b-e183e072f937',
              name: 'new_card_created',
              description: 'Action for service: 7',
              data: {
                boardId: 'ABC',
              },
              isActive: true,
              serviceId: 7,
              workflowId: 'be343d87-0e8f-4d74-9705-db3e98079963',
              service: {
                id: 7,
                name: 'trello',
                description: 'Managing board and card in Trello.',
                isActive: true,
                createdAt: '2025-01-03T13:24:56.725Z',
              },
            },
          ],
          activeReactions: [
            {
              id: '9cc6ca59-0f36-46fb-a316-14f62ee4f7d3',
              name: 'send_message',
              description: 'Reaction for service: 3',
              trigger: 'send_message',
              data: {
                message: 'Hello from Trello',
              },
              isActive: true,
              serviceId: 3,
              workflowId: 'be343d87-0e8f-4d74-9705-db3e98079963',
              service: {
                id: 3,
                name: 'discord',
                description: 'Discord webhook.',
                isActive: true,
                createdAt: '2025-01-03T13:24:56.725Z',
              },
            },
          ],
          Users: {
            id: 'a8fd7426-9ca9-4ddb-9420-cf38c96cf9cf',
            name: 'Nicolas Alexandre',
            email: 'aaa@gmail.com',
            password:
              '$2b$10$3NCWuAo8dWYZb3OBuOMAz.MlHfSrnjEFJjxkdYs80CL.dSqud.EQy',
            picture: null,
            isActive: true,
            createdAt: '2025-01-03T13:42:13.856Z',
            type: 'CLASSIC',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid input.',
    schema: {
      example: {
        message: 'Invalid workflow data',
      },
    },
  })
  async createWorkflow(@Body() workflowDto: WorkflowDto) {
    try {
      const workflow = await this.workflowService.createWorkflow(workflowDto);
      return {
        message: 'Workflow successfully created.',
        data: workflow,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a workflow by its ID
   * @param id Workflow ID
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workflow by ID' })
  @ApiResponse({
    status: 200,
    description: 'Workflow successfully deleted.',
    schema: {
      example: {
        message: 'Workflow successfully deleted.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Workflow not found',
    schema: {
      example: {
        message: 'Workflow not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        message: 'Failed to delete workflow',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  async deleteWorkflow(@Param('id') id: string) {
    try {
      await this.workflowService.deleteWorkflow(id);
      return {
        message: 'Workflow successfully deleted.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting workflow:', error);
      throw new Error('Failed to delete workflow: ' + error.message);
    }
  }

  /**
   * Toggles a workflow's active status
   * @param id Workflow ID
   * @param isActive New active status
   */
  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle workflow active status' })
  @ApiBody({
    description: 'The new active status for the workflow',
    schema: {
      type: 'object',
      properties: {
        isActive: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Workflow status successfully updated.',
    schema: {
      example: {
        message: 'Workflow status successfully updated.',
        data: {
          id: '964abe83-b27a-4668-9620-3e4f5b1d6bae',
          name: 'A',
          userId: 'a8fd7426-9ca9-4ddb-9420-cf38c96cf9cf',
          isActive: false,
          usersId: 'a8fd7426-9ca9-4ddb-9420-cf38c96cf9cf',
          activeActions: [
            {
              id: 'b992464b-3694-4315-9ac0-ad3f6399c34c',
              name: 'check_push_github',
              description: 'Action for service: 2',
              data: {
                repositoryName: 'A',
                repositoryOwner: 'A',
              },
              isActive: true,
              serviceId: 2,
              workflowId: '964abe83-b27a-4668-9620-3e4f5b1d6bae',
              service: {
                id: 2,
                name: 'github',
                description: 'Github services for developpers.',
              },
            },
          ],
          activeReactions: [
            {
              id: 'f3b07173-ead9-4db1-be27-d35dadb5c12a',
              name: 'send_email',
              description: 'Reaction for service: 1',
              trigger: {
                reaction: 'send_email',
              },
              data: {
                to: 'A',
                from: 'A',
                html: 'A',
                text: 'A',
                subject: 'A',
              },
              isActive: true,
              serviceId: 1,
              workflowId: '964abe83-b27a-4668-9620-3e4f5b1d6bae',
              service: {
                id: 1,
                name: 'google',
                description:
                  'Google services like Gmail, Calendar, Drive, etc.',
              },
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Workflow not found',
    schema: {
      example: {
        message: 'Workflow not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async toggleWorkflow(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    try {
      const workflow = await this.workflowService.toggleWorkflow(
        id,
        body.isActive,
      );
      return {
        message: 'Workflow status successfully updated.',
        data: workflow,
      };
    } catch (error) {
      throw error;
    }
  }
}
