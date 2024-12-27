# How to add a new Service-Actions-Reactions on the backend

1. [Add a new service](#1-add-a-new-service)
2. [Add a new action](#2-add-a-new-action)
3. [Add a new ingredient](#3-add-a-new-ingredient)
4. [Add a new reaction](#4-add-a-new-reaction)
5. [Workflow process](#5-workflow-process)

## 1. Add a new service

1. In the file seed/1_services.sql, we add our service to the services already present in the "Services" table. It requires a name in snake_case and a description.

```sql
INSERT INTO "Services" ("name", "description", "isActive", "createdAt")
VALUES
    ('google', 'Google services like Gmail, Calendar, Drive, etc.', true, NOW()),
    ('github', 'Github services for developpers.', true, NOW()),
    ('discord', 'Discord webhook.', true, NOW()),
    ('time', 'Time with cron and timer.', true, NOW()),
    ('rss', 'RSS feed monitoring.', true, NOW()),
    ('slack', 'Slack bot.', true, NOW());
    ('new_service', 'description of the new service.', true, NOW()); // Here insert a new service
```

Then you can create a folder in both the actions and reactions:

For actions:

![image](https://github.com/user-attachments/assets/3d41411a-9b8e-4e6d-8491-3df1026b0914)

For reactions:

![image](https://github.com/user-attachments/assets/99d1a301-a878-4a0e-8714-162b1d5322f6)

In the file reaction.service.ts, you can add a new service:

```ts
import { Injectable } from "@nestjs/common";
import { GoogleReactionService } from "../google/google.service";
import { DiscordReactionService } from "../discord/discord.service";
import { PrismaService } from "@prismaService/prisma/prisma.service";
import { ReactionDto } from "@common/dto/reaction.dto";
import { SlackReactionService } from "@reaction-service/slack/slack.service";
import { IReactionHandler } from "@reaction-service/handler/base.handler";

@Injectable()
export class ReactionService {
  private handlers: IReactionHandler[];

  constructor(
    private readonly googleService: GoogleReactionService,
    private readonly discordService: DiscordReactionService,
    private readonly slackService: SlackReactionService,
    private readonly prisma: PrismaService
  ) {
    this.handlers = [googleService, discordService, slackService]; // ! Add a new service if needed
  }

  async getReactions(): Promise<ReactionDto[]> {
    const reactions = await this.prisma.reactions.findMany({
      include: {
        service: true,
      },
    });

    return reactions.map((reaction) => ({
      id: reaction.id,
      name: reaction.name,
      description: reaction.description,
      trigger: reaction.trigger,
      isActive: reaction.isActive,
      createdAt: reaction.createdAt,
      serviceId: reaction.serviceId,
      service: reaction.service,
      body: reaction.body,
    }));
  }

  async handleReaction(
    service: string,
    reaction: string,
    data: any
  ): Promise<string> {
    console.log(`Delegating reaction handling for service: ${service}`);

    const handler = this.handlers.find((h) =>
      h.canHandle(service.toLowerCase())
    );
    if (!handler) {
      throw new Error("Service not recognized");
    }

    return handler.handle(reaction, data);
  }
}
```

Add a file in the handler folder to register the actions later.

![image](https://github.com/user-attachments/assets/aec872b5-eb73-4c7c-afa7-4a01dc18e2a3)

A file like this:
```ts
import { Injectable } from '@nestjs/common';
import { ActiveAction, ActiveReaction } from '@prisma/client';
import { IActionHandler } from './base.handler';

@Injectable()
export class NewActionHandler implements IActionHandler {

  canHandle(action: string): boolean {
    return ['new_action'].includes(
      action,
    );
  }

  async handle(
    action: ActiveAction,
    reactions: ActiveReaction[],
  ): Promise<void> {
    switch (action.name) {
      case 'new_action':
        await this.newActionService.newAction(action, reactions);
        break;
    }
  }
}
```

## 2. Add a new action

1. In the file `seed/2_actions.sql`, we add our action to the actions already present in the "Actions" table. It requires a name in snake_case, a description, an ID of the service associated with this action (using a SELECT query to simplify the link), and the body that will allow the frontend to display the fields to be passed to the action.

It is essential to have a service to link to the action!

```sql
INSERT INTO "Actions" ("name", "description", "isActive", "createdAt", "serviceId", "body")
VALUES
-- github
    ('check_push_github', 'Action triggered when a user push on a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),
    ('check_new_branch', 'Action triggered when a user create a branch a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),
    ('check_new_pr', 'Action triggered when a user create a pr on a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),

-- cron
    ('cron_action', 'Action triggered each X time.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'time' LIMIT 1), '[{"field": "expression", "description": "The cron expression describing the schedule of the action"}]'),

-- timer
    ('timer_action', 'Action triggered when the date is reached.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'time' LIMIT 1), '[{"field": "date", "description": "Date when the timer will be triggered (Ex: date: 2024-12-10)"}, {"field": "hour", "description": "Hour when the timer will be triggered (Ex: hour: 10)"}]'),

-- google
    ('receive_new_email', 'Action triggered when a mail is received on Gmail.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_calendar_event', 'Action triggered when an event is set on Google Calendar.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_task', 'Action triggered when a task is set on Google Task.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_playlist_youtube', 'Action triggered when a playlist is created on Youtube.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_drive_element', 'Action triggered when an element is created on Google Drive.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),

-- Insert a new action
    ('new_action', 'Description of a new action', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'new_service' LIMIT 1), '[]'),
```

In the action folder, select the service on which you want to add a new reaction, go to the corresponding service, and create a new function like this:

```ts
  async newAction(
    action: ActiveAction,
    reaction: ActiveReaction[],
  ): Promise<void> {
    try {
      // Code logic

      // ! When the action is triggered:
      const ingredients = [
        { field: 'ingredient_1', value: 'Value of the ingredient 1' },
        { field: 'ingredient_2', value: 'Value of the ingredient 2' },
        { field: 'trigger_date', value: getTriggerDate() }, // Same field at the end for all the actions
      ];
      await this.actionService.executeReactions(ingredients, reaction);
    } catch (error) {}
  }
```

Then, add the link to your action in the handler, in the `canHandle` method, and in the `switch case`, like this:

![image](https://github.com/user-attachments/assets/0bbf812c-b7ad-4e4f-b910-691581fd343c)

### 3. Add a new ingredient

1. In the file `seed/4_ingredients.sql`, we add our ingredient to the already existing ingredients in the "Ingredients" table. It requires a name in snake_case and a description. Then, in the "ActionsIngredients" table, we link the ingredients to our actions, requiring an `actionId` and an `ingredientId`.

```sql
INSERT INTO "Ingredients" ("name", "description")
VALUES
    ('repository_owner', 'Name of the repository owner on GitHub'),
    ('repository_name', 'Name of the repository on GitHub'),
    ('sender', 'Email of the user who sent the email on Gmail'),
    ('subject', 'Subject of the email received on Gmail'),
    ('body', 'Body of the email received on Gmail'),
    ('event_name', 'Name of the event created on Google Calendar'),
    ('event_date', 'Date of the event created on Google Calendar'),
    ('task_title', 'Title of the task created on Google Tasks'),
    ('playlist_name', 'Name of the YouTube playlist'),
    ('playlist_type', 'Type of the YouTube playlist'),
    ('element_name', 'Name of the item on Google Drive'),
    ('element_type', 'Type of the item on Google Drive'),
    ('trigger_date', 'Date and time the trigger was activated')

-- New ingredient
    ('new_ingredient', 'Description of the new ingredient')

RETURNING "id";

INSERT INTO "ActionsIngredients" ("actionId", "ingredientId")
VALUES
    ((SELECT id FROM "Actions" WHERE "name" = 'check_push_github' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'repository_owner' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_push_github' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'repository_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_push_github' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'cron_action' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'timer_action' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_youtube' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'playlist_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_youtube' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'playlist_type' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_youtube' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_drive_element' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'element_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_drive_element' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'element_type' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_drive_element' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'rss_feed' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1));

-- Link new ingredient to an action
    ((SELECT id FROM "Actions" WHERE "name" = 'new_action' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'new_ingredient' LIMIT 1));
```

When you call the function `executeReactions`, you must pass an array with all your ingredients, as shown here:

![image](https://github.com/user-attachments/assets/0986c455-03f8-4230-9d9d-51e99fa73d68)


These will then allow you to modify the reaction fields using the ingredients of the action.

## 4. Add a new reaction

1. In the file `seed/3_reactions.sql`, we add our reaction to the reactions already present in the "Reactions" table. It requires a name in snake_case, a description, an ID of the service linked to this reaction (using a `SELECT` statement to simplify the linking), and the body that will allow the frontend to display the fields to pass to the reaction.

It is imperative to have a service linked to the reaction!

```sql
INSERT INTO "Reactions" ("name", "description", "trigger", "isActive", "createdAt", "serviceId", "body")
VALUES
-- google
    ('send_email', 'Sends an email when triggered.', '{"reaction": "send_email"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "from", "description": "The senders email address of the request"}, {"field": "to", "description": "The recipients email address of the request"}, {"field": "subject", "description": "The subject of the email sent in the request"}, {"field": "text", "description": "The plain text body of the email"}, {"field": "html", "description": "The HTML formatted body of the email"}]'),
    ('set_calendar_event', 'Sets an event in Google Calendar when triggered.', '{"reaction": "set_event_calendar"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "calendarId", "description": "The calendar to which the event will be added"}, {"field": "summary", "description": "The title or summary of the event"}, {"field": "description", "description": "A description of the event"}, {"field": "location", "description": "The location of the event, e.g., Google Meet"}, {"field": "startDateTime", "description": "The start date and time of the event in ISO 8601 format"}, {"field": "endDateTime", "description": "The end date and time of the event in ISO 8601 format"}, {"field": "attendees", "description": "A list of participants email addresses for the event, as objects with email as the key"}]'),
    ('create_task', 'Create a task in Google Task when triggered.', '{"reaction": "create_task"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "tasklist", "description": "The tasklist to which the task will be added (e.g., @default)"}, {"field": "title", "description": "The title of the task"}, {"field": "notes", "description": "Additional notes for the task"}, {"field": "due", "description": "The due date of the task in ISO 8601 format"}]'),
    ('create_drive_element', 'Create an element (it can be a folder, docs, sheets, slides, forms) in Google Drive when triggered.', '{"reaction": "create_drive_element"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "title", "description": "The name of the element to be created (e.g., folder, document)"}, {"field": "elementType", "description": "The type of the element to be created. Possible values are: docs, sheets, slides, forms, folder"}]'),
    ('create_youtube_playlist', 'Create a Youtube Playlist when triggered.', '{"reaction": "create_youtube_playlist"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "title", "description": "The name of the YouTube playlist"}, {"field": "description", "description": "A description of the YouTube playlist"}, {"field": "privacyStatus", "description": "The privacy status of the playlist. Possible values are: public, private, unlisted"}]'),

-- discord
    ('send_message', 'Send message to discord channel.', '{"reaction": "send_message"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'discord' LIMIT 1), '[{"field": "message", "description": "Message to send in the channel"}]'),

-- slack
    ('send_slack_message', 'Sends a message to a Slack channel when triggered.', '{"reaction": "send_message"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'slack' LIMIT 1), '[{"field": "channelName", "description": "Name of the Slack channel to send the message to (without #)"}, {"field": "message", "description": "The message text to send"}]'),
    ('add_slack_reaction', 'Adds a reaction to the latest message in Slack channel.', '{"reaction": "add_reaction"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'slack' LIMIT 1), '[{"field": "channelName", "description": "Name of the Slack channel to add reaction to (without #)"}, {"field": "reaction", "description": "The emoji name to react with (e.g. thumbsup, heart, rocket)"}]'),
    ('pin_message', 'Pins the latest message in a channel',
        '{"reaction": "pin_message"}', true, NOW(),
        (SELECT id FROM "Services" WHERE "name" = 'slack' LIMIT 1),
        '[{"field": "channelName", "description": "Name of the Slack channel"}]'),
    ('upload_file', 'Uploads a file to a channel',
        '{"reaction": "upload_file"}', true, NOW(),
        (SELECT id FROM "Services" WHERE "name" = 'slack' LIMIT 1),
        '[{"field": "channelName", "description": "Name of the Slack channel"},
          {"field": "fileContent", "description": "Content to upload as file"},
          {"field": "filename", "description": "Name of the file"}]');

-- Insert a new reaction
    ('new_reaction', 'Description of the new reaction.', '{"reaction": "new_reaction"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'new_service' LIMIT 1), '[{"field": "new_field", "description": "Description of the new field"}]'),
```

In the "reactions" folder, select the service you want to add a new reaction to, and you will have a file like this:

```ts
import { Injectable } from "@nestjs/common";
import { IReactionHandler } from "@reaction-service/handler/base.handler";
import axios from "axios";

@Injectable()
export class NewReactionService implements IReactionHandler {
  constructor() {}

  canHandle(service: string): boolean {
    return service === "new_service";
  }

  async handle(reaction: string, data: any): Promise<string> {
    switch (reaction.toLowerCase()) {
      case "new_reaction":
        return this.newReaction(data);
      default:
        return "Reaction not recognized for New Reaction";
    }
  }

  private async newReaction(params: Params): Promise<string> {
    // Code logic to execute the reaction
  }
}
```

You just need to add a case to the switch statement and create the function to execute the reaction.

## 5. Workflow Process

Every 10 seconds, we check all active workflows to see if their actions have been detected.

```ts
  onModuleInit() {
    setInterval(async () => {
      await this.getWorkflows();
    }, 10000);
  }
```

If an action is detected, we then execute the reactions linked to this workflow using this function:

```ts
  async executeReactions(
    ingredientsAction: IngredientsAction[],
    reactions: ActiveReaction[],
  ): Promise<void>
```

It takes the action ingredients as parameters, along with the reactions to execute.
