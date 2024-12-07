INSERT INTO "Actions" ("name", "description", "isActive", "createdAt", "serviceId")
VALUES
    ('receive_email', 'Triggered when an email is received.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1)),
    ('create_event', 'Triggered when an event is created.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1)),
    ('play_music', 'Triggered when music starts playing.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'spotify' LIMIT 1));
