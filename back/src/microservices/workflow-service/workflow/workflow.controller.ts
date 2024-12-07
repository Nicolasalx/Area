import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowDto } from 'src/common/interfaces/workflow.interface';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  /**
   * Retrieves all workflows for a user by their ID
   * @param id User's ID
   */
  @Get(':id')
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
