INSERT INTO "Reactions" ("name", "description", "trigger", "isActive", "createdAt", "serviceId")
VALUES
    ('send_email', 'Sends an email when triggered.', '{"reaction": "send_email"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1)),
    ('set_calendar_event', 'Sets an event in Google Calendar when triggered.', '{"reaction": "set_event_calendar"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1)),
    ('create_task', 'Create a task in Google Task when triggered.', '{"reaction": "create_task"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1)),
    ('create_drive_element', 'Create an element (it can be a folder, forms, docs, spreadsheet) in Google Drive when triggered.', '{"reaction": "create_drive_element"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1));
