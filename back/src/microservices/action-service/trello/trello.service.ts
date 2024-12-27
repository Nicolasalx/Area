import { ActionService } from '@action-service/action/action.service';
import { Injectable } from '@nestjs/common';
import { getTriggerDate } from '@trigger-service/handler/get-trigger-date';
import axios from 'axios';

@Injectable()
export class TrelloActionService {
  private previousCheckTimestamp: number = Date.now();
  private previousCardIds: string[] = [];
  private previousCardStates: Record<string, any> = {};

  constructor(private readonly actionService: ActionService) {}

  async newCardCreated(action: any, reaction: any[]): Promise<void> {
    const board_short_link = action.data?.board_short_link;

    if (!board_short_link) {
      console.error('Board ID is missing in the action data.');
      return;
    }

    try {
      const url = `https://api.trello.com/1/boards/${board_short_link}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
      const response = await axios.get(url);
      const cards = response.data;

      const newCards = cards.filter((card: any) => {
        const cardTimestamp = new Date(card.dateLastActivity).getTime();
        return cardTimestamp > this.previousCheckTimestamp;
      });

      if (newCards.length > 0) {
        for (const card of newCards) {
          console.log(`New Card - Name: ${card.name}, URL: ${card.url}`);
          const ingredients = [
            { field: 'card_name', value: card.name || 'No Name' },
            { field: 'card_url', value: card.url || 'No URL' },
            { field: 'trigger_date', value: getTriggerDate() },
          ];

          await this.actionService.executeReactions(ingredients, reaction);
        }
      }

      this.previousCheckTimestamp = Date.now();
    } catch (error) {
      console.error('Error fetching Trello cards:', error);
    }
  }

  async detectDeletedCards(action: any, reaction: any[]): Promise<void> {
    const board_short_link = action.data?.board_short_link;

    if (!board_short_link) {
      console.error('Board ID is missing in the action data.');
      return;
    }

    try {
      const url = `https://api.trello.com/1/boards/${board_short_link}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
      const response = await axios.get(url);
      const cards = response.data;

      const currentCardIds = cards.map((card: any) => card.id);

      const deletedCards = this.previousCardIds.filter(
        (id: string) => !currentCardIds.includes(id),
      );

      if (deletedCards.length > 0) {
        for (const cardId of deletedCards) {
          const ingredients = [
            { field: 'card_id', value: cardId },
            { field: 'trigger_date', value: getTriggerDate() },
          ];

          await this.actionService.executeReactions(ingredients, reaction);
        }
      }

      this.previousCardIds = currentCardIds;
    } catch (error) {
      console.error('Error fetching Trello cards:', error);
    }
  }

  async detectModifiedCards(action: any, reaction: any[]): Promise<void> {
    const board_short_link = action.data?.board_short_link;

    if (!board_short_link) {
      console.error('Board ID is missing in the action data.');
      return;
    }

    try {
      const url = `https://api.trello.com/1/boards/${board_short_link}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
      const response = await axios.get(url);
      const cards = response.data;

      const modifiedCards = cards.filter((card: any) => {
        const previousState = this.previousCardStates[card.id];

        if (!previousState) {
          this.previousCardStates[card.id] = card;
          return false;
        }

        const hasChanged =
          card.name !== previousState.name ||
          card.desc !== previousState.desc ||
          card.labels.length !== previousState.labels.length ||
          card.due !== previousState.due ||
          card.idList !== previousState.idList;

        if (hasChanged) {
          this.previousCardStates[card.id] = card;
          return true;
        }

        return false;
      });

      if (modifiedCards.length > 0) {
        for (const card of modifiedCards) {
          const ingredients = [
            { field: 'card_name', value: card.name || 'No Name' },
            { field: 'card_url', value: card.url || 'No URL' },
            { field: 'trigger_date', value: getTriggerDate() },
          ];

          await this.actionService.executeReactions(ingredients, reaction);
        }
      }
    } catch (error) {
      console.error('Error fetching Trello cards:', error);
    }
  }

  async detectMovedCards(action: any, reaction: any[]): Promise<void> {
    const board_short_link = action.data?.board_short_link;

    if (!board_short_link) {
      console.error('Board ID is missing in the action data.');
      return;
    }

    try {
      const url = `https://api.trello.com/1/boards/${board_short_link}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
      const response = await axios.get(url);
      const cards = response.data;

      const movedCards = cards.filter((card: any) => {
        const previousState = this.previousCardStates[card.id];

        if (!previousState) {
          this.previousCardStates[card.id] = card;
          return false;
        }

        const hasMoved = card.idList !== previousState.idList;

        if (hasMoved) {
          console.log(
            `Card moved - Name: ${card.name}, From List: ${previousState.idList}, To List: ${card.idList}`,
          );
          this.previousCardStates[card.id] = card;
          return true;
        }

        return false;
      });

      if (movedCards.length > 0) {
        for (const card of movedCards) {
          const ingredients = [
            { field: 'card_name', value: card.name || 'No Name' },
            { field: 'card_url', value: card.url || 'No URL' },
            {
              field: 'from_list_id',
              value: this.previousCardStates[card.id]?.idList || 'Unknown',
            },
            { field: 'to_list_id', value: card.idList || 'Unknown' },
            { field: 'trigger_date', value: getTriggerDate() },
          ];

          await this.actionService.executeReactions(ingredients, reaction);
        }
      }
    } catch (error) {
      console.error('Error fetching Trello cards:', error);
    }
  }

  async detectNewLabels(action: any, reaction: any[]): Promise<void> {
    const board_short_link = action.data?.board_short_link;

    if (!board_short_link) {
      console.error('Board ID is missing in the action data.');
      return;
    }

    try {
      const url = `https://api.trello.com/1/boards/${board_short_link}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
      const response = await axios.get(url);
      const cards = response.data;

      const cardsWithNewLabels = cards.filter((card: any) => {
        const previousState = this.previousCardStates[card.id];

        if (!previousState) {
          this.previousCardStates[card.id] = card;
          return false;
        }

        const previousLabelIds = previousState.labels.map(
          (label: any) => label.id,
        );
        const currentLabelIds = card.labels.map((label: any) => label.id);

        const newLabels = currentLabelIds.filter(
          (labelId: string) => !previousLabelIds.includes(labelId),
        );

        if (newLabels.length > 0) {
          this.previousCardStates[card.id] = card;
          return true;
        }

        return false;
      });

      if (cardsWithNewLabels.length > 0) {
        for (const card of cardsWithNewLabels) {
          const labelColors = card.labels.map(
            (label) => label.color || 'No Color',
          );
          const labelColorsString = labelColors.join(', ');

          const ingredients = [
            { field: 'card_name', value: card.name || 'No Name' },
            { field: 'card_url', value: card.url || 'No URL' },
            {
              field: 'new_labels',
              value: labelColorsString || 'No New Labels',
            },
            { field: 'trigger_date', value: getTriggerDate() },
          ];

          await this.actionService.executeReactions(ingredients, reaction);
        }
      }
    } catch (error) {
      console.error('Error fetching Trello cards:', error);
    }
  }
}
