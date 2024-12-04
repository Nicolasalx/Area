INSERT INTO "ActionsReactions" ("name", "description", "trigger", "isActive", "serviceId", "type", "createdAt")
VALUES
    ('Receive email', 'Triggered when an email is received.', '{"event": "email_received"}', true, (SELECT id FROM "Services" WHERE "name" = 'Google' LIMIT 1), 'ACTION', NOW()),
    ('Create event', 'Triggered when an event is created.', '{"event": "create_event"}', true, (SELECT id FROM "Services" WHERE "name" = 'Google' LIMIT 1), 'ACTION', NOW()),
    ('Play music', 'Triggered when music starts playing.', '{"event": "play_music"}', true, (SELECT id FROM "Services" WHERE "name" = 'Spotify' LIMIT 1), 'ACTION', NOW()),
    ('Sync files', 'Triggered when a file is uploaded to Dropbox.', '{"event": "file_uploaded"}', true, (SELECT id FROM "Services" WHERE "name" = 'Dropbox' LIMIT 1), 'ACTION', NOW()),

    ('Send email', 'Sends an email when triggered.', '{"reaction": "send_email"}', true, (SELECT id FROM "Services" WHERE "name" = 'Google' LIMIT 1), 'REACTION', NOW()),
    ('Set calendar event', 'Sets an event in Google Calendar when triggered.', '{"reaction": "set_event_calendar"}', true, (SELECT id FROM "Services" WHERE "name" = 'Google' LIMIT 1), 'REACTION', NOW()),
    ('Play playlist', 'Plays a predefined playlist in Spotify.', '{"reaction": "play_playlist"}', true, (SELECT id FROM "Services" WHERE "name" = 'Spotify' LIMIT 1), 'REACTION', NOW()),
    ('Upload file', 'Uploads a file to Dropbox when triggered.', '{"reaction": "upload_file"}', true, (SELECT id FROM "Services" WHERE "name" = 'Dropbox' LIMIT 1), 'REACTION', NOW());
