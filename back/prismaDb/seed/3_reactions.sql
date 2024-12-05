INSERT INTO "Reactions" ("name", "description", "trigger", "isActive", "createdAt", "serviceId")
VALUES
    ('Send email', 'Sends an email when triggered.', '{"reaction": "send_email"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'Google' LIMIT 1)),
    ('Set calendar event', 'Sets an event in Google Calendar when triggered.', '{"reaction": "set_event_calendar"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'Google' LIMIT 1)),
    ('Play playlist', 'Plays a predefined playlist in Spotify.', '{"reaction": "play_playlist"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'Spotify' LIMIT 1)),
    ('Upload file', 'Uploads a file to Dropbox when triggered.', '{"reaction": "upload_file"}', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'Dropbox' LIMIT 1));

INSERT INTO "ServiceReactions" ("serviceId", "reactionId")
SELECT id, (SELECT id FROM "Reactions" WHERE "name" = 'Send email' LIMIT 1)
FROM "Services" WHERE "name" = 'Google';

INSERT INTO "ServiceReactions" ("serviceId", "reactionId")
SELECT id, (SELECT id FROM "Reactions" WHERE "name" = 'Set calendar event' LIMIT 1)
FROM "Services" WHERE "name" = 'Google';

INSERT INTO "ServiceReactions" ("serviceId", "reactionId")
SELECT id, (SELECT id FROM "Reactions" WHERE "name" = 'Play playlist' LIMIT 1)
FROM "Services" WHERE "name" = 'Spotify';

INSERT INTO "ServiceReactions" ("serviceId", "reactionId")
SELECT id, (SELECT id FROM "Reactions" WHERE "name" = 'Upload file' LIMIT 1)
FROM "Services" WHERE "name" = 'Dropbox';
