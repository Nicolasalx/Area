import { IngredientsAction } from '@common/interfaces/ingredientsAction';
import { getToken, getUserId } from '@common/utils/token.utils';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import { google } from 'googleapis';

async function createIngredientsAction(
  task: any,
): Promise<IngredientsAction[]> {
  return [
    { field: 'task_title', value: task.title || 'No title' },
    { field: 'trigger_date', value: getTriggerDate() },
  ];
}

export async function newTask(
  action: any,
  reaction: any[],
  actionService: any,
): Promise<void> {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
  const { workflowId } = action;
  const REFRESH_TOKEN = await getToken(await getUserId(workflowId), 'google');

  try {
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const tasksApi = google.tasks({ version: 'v1', auth: oAuth2Client });

    const response = await tasksApi.tasks.list({
      tasklist: '@default',
      showCompleted: false,
      fields: 'items(id, title, updated)',
    });

    const tasks = response.data.items;

    if (tasks && tasks.length > 0) {
      let newTaskDetected = false;

      for (const task of tasks) {
        const taskUpdatedTime = new Date(task.updated).getTime();

        if (taskUpdatedTime > action.lastCheckTimestamp) {
          newTaskDetected = true;

          console.log(`New Task Detected: ${task.title || 'No Title'}`);
          const ingredients = await createIngredientsAction(task);

          await actionService.executeReactions(ingredients, reaction);
        }
      }

      if (newTaskDetected) {
        action.lastCheckTimestamp = Date.now();
      }
    }
  } catch (error) {
    console.error('ERROR:', error);
  }
}
