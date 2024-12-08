INSERT INTO "Reactions" ("name", "description", "trigger", "isActive", "createdAt", "serviceId", "body")
VALUES
    ('send_email', 'Sends an email when triggered.', '{"reaction": "send_email"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "from", "description": "The senders email address of the request"}, {"field": "to", "description": "The recipients email address of the request"}, {"field": "subject", "description": "The subject of the email sent in the request"}, {"field": "text", "description": "The plain text body of the email"}, {"field": "html", "description": "The HTML formatted body of the email"}]'),
    ('set_calendar_event', 'Sets an event in Google Calendar when triggered.', '{"reaction": "set_event_calendar"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "calendarId", "description": "The calendar to which the event will be added"}, {"field": "summary", "description": "The title or summary of the event"}, {"field": "description", "description": "A description of the event"}, {"field": "location", "description": "The location of the event, e.g., Google Meet"}, {"field": "startDateTime", "description": "The start date and time of the event in ISO 8601 format"}, {"field": "endDateTime", "description": "The end date and time of the event in ISO 8601 format"}, {"field": "attendees", "description": "A list of participants email addresses for the event, as objects with email as the key"}]'),
    ('create_task', 'Create a task in Google Task when triggered.', '{"reaction": "create_task"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "tasklist", "description": "The tasklist to which the task will be added (e.g., @default)"}, {"field": "title", "description": "The title of the task"}, {"field": "notes", "description": "Additional notes for the task"}, {"field": "due", "description": "The due date of the task in ISO 8601 format"}]'),
    ('create_drive_element', 'Create an element (it can be a folder, docs, sheets, slides, forms) in Google Drive when triggered.', '{"reaction": "create_drive_element"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "title", "description": "The name of the element to be created (e.g., folder, document)"}, {"field": "elementType", "description": "The type of the element to be created. Possible values are: docs, sheets, slides, forms, folder"}]'),
    ('create_youtube_playlist', 'Create a Youtube Playlist when triggered.', '{"reaction": "create_youtube_playlist"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "title", "description": "The name of the YouTube playlist"}, {"field": "description", "description": "A description of the YouTube playlist"}, {"field": "privacyStatus", "description": "The privacy status of the playlist. Possible values are: public, private, unlisted"}]'),
    ('send_message', 'Send message to discord channel.', '{"reaction": "send_message"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'discord' LIMIT 1), '[{"field": "to_fill", "description": "To Fill"}]');
