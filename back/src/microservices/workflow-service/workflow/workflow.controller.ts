import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkflowDto } from '@common/dto/workflow.dto';

@ApiTags('Workflows')
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
            },
          ],
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
}
