INSERT INTO "Reactions" ("name", "description", "trigger", "isActive", "createdAt", "serviceId")
VALUES
    ('send_email', 'Sends an email when triggered.', '{"reaction": "send_email"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1)),
    ('set_calendar_event', 'Sets an event in Google Calendar when triggered.', '{"reaction": "set_event_calendar"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1)),
    ('play_playlist', 'Plays a predefined playlist in Spotify.', '{"reaction": "play_playlist"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'spotify' LIMIT 1));
