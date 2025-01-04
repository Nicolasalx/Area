INSERT INTO "Reactions" ("name", "description", "trigger", "isActive", "createdAt", "serviceId", "body")
VALUES
-- google
    ('send_email', 'Sends an email when triggered.', '{"reaction": "send_email"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "from", "description": "The senders email address of the request"}, {"field": "to", "description": "The recipients email address of the request"}, {"field": "subject", "description": "The subject of the email sent in the request"}, {"field": "text", "description": "The plain text body of the email"}, {"field": "html", "description": "The HTML formatted body of the email"}]'),
    ('set_calendar_event', 'Sets an event in Google Calendar when triggered.', '{"reaction": "set_event_calendar"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "calendarId", "description": "The calendar to which the event will be added"}, {"field": "summary", "description": "The title or summary of the event"}, {"field": "description", "description": "A description of the event"}, {"field": "location", "description": "The location of the event, e.g., Google Meet"}, {"field": "startDateTime", "description": "The start date and time of the event in ISO 8601 format"}, {"field": "endDateTime", "description": "The end date and time of the event in ISO 8601 format"}, {"field": "attendees", "description": "A list of participants email addresses for the event, as objects with email as the key"}]'),
    ('create_task', 'Create a task in Google Task when triggered.', '{"reaction": "create_task"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "tasklist", "description": "The tasklist to which the task will be added (e.g., @default)"}, {"field": "title", "description": "The title of the task"}, {"field": "notes", "description": "Additional notes for the task"}, {"field": "due", "description": "The due date of the task in ISO 8601 format"}]'),
    ('create_drive_element', 'Create an element (it can be a folder, docs, sheets, slides, forms) in Google Drive when triggered.', '{"reaction": "create_drive_element"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "title", "description": "The name of the element to be created (e.g., folder, document)"}, {"field": "elementType", "description": "The type of the element to be created. Possible values are: docs, sheets, slides, forms, folder", "options": ["docs", "sheets", "slides", "forms", "folder"]}]'),
    ('create_youtube_playlist', 'Create a Youtube Playlist when triggered.', '{"reaction": "create_youtube_playlist"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "title", "description": "The name of the YouTube playlist"}, {"field": "description", "description": "A description of the YouTube playlist"}, {"field": "privacyStatus", "description": "The privacy status of the playlist. Possible values are: public, private, unlisted", "options": ["public", "private", "unlisted"]}]'),

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
          {"field": "filename", "description": "Name of the file"}]'),

-- trello
    ('create_new_card', 'Create a new card on trello.', '{"reaction": "create_new_card"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'trello' LIMIT 1), '[{"field": "board_short_link", "description": "Short link of the board on trello"}, {"field": "card_name", "description": "Name of the card created on trello"}]'),
    ('create_new_list', 'Create a new list on trello.', '{"reaction": "create_new_list"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'trello' LIMIT 1), '[{"field": "board_short_link", "description": "Short link of the board on trello"}, {"field": "list_name", "description": "Name of the list on trello"}]'),
    ('remove_card', 'Remove a card from a board on trello.', '{"reaction": "remove_card"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'trello' LIMIT 1), '[{"field": "board_short_link", "description": "Short link of the board on trello"}, {"field": "card_name", "description": "Name of the card removed on trello"}]'),
-- todoist
    ('create_task', 'Creates a new task in Todoist', '{"reaction": "create_task"}',
        true, NOW(), (SELECT id FROM "Services" WHERE name = 'todoist'),
        '[{"field": "content", "description": "The title of the task"},
            {"field": "description", "description": "The description of the task"}]'),
    ('create_project', 'Creates a new project in Todoist', '{"reaction": "create_project"}',
        true, NOW(), (SELECT id FROM "Services" WHERE name = 'todoist'),
        '[{"field": "name", "description": "Name of the project"},
        {"field": "color", "description": "Color of the project (optional)"}]'),

-- twilio
    ('send_sms', 'Send message to a +33783119455.', '{"reaction": "send_sms"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'twilio' LIMIT 1), '[{"field": "message", "description": "Message to send at the phone number"}]'),
    ('send_mms', 'Send message with image to +33783119455.', '{"reaction": "send_mms"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'twilio' LIMIT 1), '[{"field": "message", "description": "Message to send at the phone number"}, {"field": "img_url", "description": "Url of the image you want to insert in the message"}]'),

-- spotify
    ('create_spotify_playlist', 'Create a playlist on Spotify', '{"reaction": "create_spotify_playlist"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'spotify' LIMIT 1), '[{"field": "playlist_name", "description": "Name of the playlist"}, {"field": "playlist_type", "description": "Type of the playlist (public or private)", "options": ["public", "private"]}]'),
    ('add_song_to_playlist', 'Add a song to the playlist on Spotify', '{"reaction": "add_song_to_playlist"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'spotify' LIMIT 1), '[{"field": "playlist_name", "description": "Name of the playlist"}, {"field": "song_name", "description": "Name of the song you want to add in the playlist"}]');
