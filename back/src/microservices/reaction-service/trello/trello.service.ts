import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TrelloReactionService {
  async manageReactionTrello(
    refreshToken: string,
    reaction: string,
    data: any,
  ): Promise<string> {
    switch (reaction.toLowerCase()) {
      case 'create_new_card':
        return this.createNewCard(refreshToken, data);
      case 'create_new_list':
        return this.createNewList(refreshToken, data);
      case 'remove_card':
        return this.deleteCardByName(refreshToken, data);
      default:
        return 'Reaction not recognized for Trello';
    }
  }

  private async createNewCard(
    refreshToken: string,
    data: {
      board_short_link: string;
      card_name: string;
    },
  ): Promise<string> {
    if (!refreshToken) {
      console.log('Access token not available');
      return 'Access token not available';
    }

    const { board_short_link, card_name } = data;

    try {
      const listsUrl = `https://api.trello.com/1/boards/${board_short_link}/lists`;
      const listsResponse = await axios.get(listsUrl, {
        params: {
          key: process.env.TRELLO_API_KEY,
          token: refreshToken,
        },
      });

      const lists = listsResponse.data;

      if (!lists || lists.length === 0) {
        return `No list found for the board with id ${board_short_link}`;
      }

      const firstList = lists[0];
      const listId = firstList.id;

      const createCardUrl = `https://api.trello.com/1/cards`;
      const createCardParams = {
        idList: listId,
        name: card_name,
        key: process.env.TRELLO_API_KEY,
        token: refreshToken,
      };

      await axios.post(createCardUrl, null, {
        params: createCardParams,
      });

      console.log(
        `Card "${card_name}" created in the list "${firstList.name}" of the board ${board_short_link}`,
      );
      return `Card "${card_name}" created in the list "${firstList.name}" of the board ${board_short_link}`;
    } catch (error) {
      console.error(
        'Error when creating a card on Trello:',
        error.response?.data || error.message,
      );
      return `Card creation failed "${card_name}" in the board ${board_short_link}`;
    }
  }

  private async createNewList(
    refreshToken: string,
    data: {
      board_short_link: string;
      list_name: string;
    },
  ): Promise<string> {
    if (!refreshToken) {
      console.log('Access token not available');
      return 'Access token not available';
    }

    const { board_short_link, list_name } = data;

    try {
      const resolveBoardUrl = `https://api.trello.com/1/boards/${board_short_link}`;
      const resolveBoardParams = {
        key: process.env.TRELLO_API_KEY,
        token: refreshToken,
      };

      const boardResponse = await axios.get(resolveBoardUrl, {
        params: resolveBoardParams,
      });
      const resolvedBoardId = boardResponse.data.id;

      const createListUrl = `https://api.trello.com/1/lists`;
      const createListParams = {
        idBoard: resolvedBoardId,
        name: list_name,
        key: process.env.TRELLO_API_KEY,
        token: refreshToken,
      };

      await axios.post(createListUrl, null, {
        params: createListParams,
      });

      console.log(
        `List "${list_name}" created in the board ${board_short_link}`,
      );

      return `List "${list_name}" created in the board ${board_short_link}`;
    } catch (error) {
      console.error(
        'Error creating list on Trello:',
        error.response?.data || error.message,
      );
      return `List creation failed "${list_name}" in the board ${board_short_link}`;
    }
  }

  private async deleteCardByName(
    refreshToken: string,
    data: {
      board_short_link: string;
      card_name: string;
    },
  ): Promise<string> {
    if (!refreshToken) {
      console.log('Access token not available');
      return 'Access token not available';
    }

    const { board_short_link, card_name } = data;

    try {
      const listsUrl = `https://api.trello.com/1/boards/${board_short_link}/lists`;
      const listsResponse = await axios.get(listsUrl, {
        params: {
          key: process.env.TRELLO_API_KEY,
          token: refreshToken,
        },
      });

      const lists = listsResponse.data;

      if (!lists || lists.length === 0) {
        return `No list found for the board with id ${board_short_link}`;
      }

      for (const list of lists) {
        const cardsUrl = `https://api.trello.com/1/lists/${list.id}/cards`;
        const cardsResponse = await axios.get(cardsUrl, {
          params: {
            key: process.env.TRELLO_API_KEY,
            token: refreshToken,
          },
        });

        const cards = cardsResponse.data;
        const cardToDelete = cards.find((card: any) => card.name === card_name);

        if (cardToDelete) {
          const deleteCardUrl = `https://api.trello.com/1/cards/${cardToDelete.id}`;
          await axios.delete(deleteCardUrl, {
            params: {
              key: process.env.TRELLO_API_KEY,
              token: refreshToken,
            },
          });

          console.log(
            `Card "${card_name}" deleted from the board ${board_short_link}`,
          );
          return `Card "${card_name}" deleted from the board ${board_short_link}`;
        }
      }

      return `Card "${card_name}" not found in the board ${board_short_link}`;
    } catch (error) {
      console.error(
        'Error deleting card on Trello:',
        error.response?.data || error.message,
      );
      return `Failed to delete card "${card_name}" in the board ${board_short_link}`;
    }
  }
}
