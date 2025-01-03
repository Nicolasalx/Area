import { Controller, Get, Req } from '@nestjs/common';
import { AboutService } from './about.service';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('About')
@ApiBearerAuth()
@Controller()
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('about.json')
  @ApiOperation({
    summary: 'Returns information about active services',
    description:
      "This API endpoint returns an object containing active services and the client's IP address.",
  })
  @ApiResponse({
    status: 200,
    description: 'The services information was retrieved successfully.',
    schema: {
      example: {
        client: {
          host: '127.0.0.1',
        },
        server: {
          current_time: 1734734279,
          services: [
            {
              name: 'google',
              actions: [
                {
                  name: 'receive_new_email',
                  description:
                    'Action triggered when a mail is received on Gmail.',
                },
                {
                  name: 'new_calendar_event',
                  description:
                    'Action triggered when an event is set on Google Calendar.',
                },
              ],
              reactions: [
                {
                  name: 'send_email',
                  description: 'Sends an email when triggered.',
                },
              ],
            },
          ],
        },
      },
    },
  })
  handleAboutRequest(@Req() request: any) {
    let clientIp =
      request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    if (clientIp === '::1') {
      clientIp = '127.0.0.1';
    }

    return this.aboutService.getAboutMessage(clientIp);
  }
}
