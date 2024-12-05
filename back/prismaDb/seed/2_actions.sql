INSERT INTO "Actions" ("name", "description", "isActive", "createdAt", "serviceId")
VALUES
    ('Receive email', 'Triggered when an email is received.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'Google' LIMIT 1)),
    ('Create event', 'Triggered when an event is created.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'Google' LIMIT 1)),
    ('Play music', 'Triggered when music starts playing.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'Spotify' LIMIT 1)),
    ('Sync files', 'Triggered when a file is uploaded to Dropbox.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'Dropbox' LIMIT 1));

INSERT INTO "ServiceActions" ("serviceId", "actionId")
SELECT id, (SELECT id FROM "Actions" WHERE "name" = 'Receive email' LIMIT 1)
FROM "Services" WHERE "name" = 'Google';

INSERT INTO "ServiceActions" ("serviceId", "actionId")
SELECT id, (SELECT id FROM "Actions" WHERE "name" = 'Create event' LIMIT 1)
FROM "Services" WHERE "name" = 'Google';

INSERT INTO "ServiceActions" ("serviceId", "actionId")
SELECT id, (SELECT id FROM "Actions" WHERE "name" = 'Play music' LIMIT 1)
FROM "Services" WHERE "name" = 'Spotify';

INSERT INTO "ServiceActions" ("serviceId", "actionId")
SELECT id, (SELECT id FROM "Actions" WHERE "name" = 'Sync files' LIMIT 1)
FROM "Services" WHERE "name" = 'Dropbox';
