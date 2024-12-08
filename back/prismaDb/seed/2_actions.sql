INSERT INTO "Actions" ("name", "description", "isActive", "createdAt", "serviceId", "body")
VALUES
    ('to_change', 'Description of the actin.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[{"field": "title", "description": "description"}]')
