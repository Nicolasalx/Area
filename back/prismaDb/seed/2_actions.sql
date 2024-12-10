INSERT INTO "Actions" ("name", "description", "isActive", "createdAt", "serviceId", "body")
VALUES
    ('check_push_github', 'Action triggered when a user push on a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),

    ('daily_cron_action', 'Action triggered each day at X hour.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'time' LIMIT 1), '[{"field": "hour", "description": "Hour when the cron will be trigered every day (Ex: hour: 10)"}]'),
    ('weekly_cron_action', 'Action triggered each day of the week at X hour.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'time' LIMIT 1), '[{"field": "hour", "description": "Hour when the cron will be trigered every day (Ex: hour: 10)"}, {"field": "day", "description": "Day when the cron will be trigered every day (Ex: day: monday OR day: tuesday)"}]'),
    ('timer_scheduled_action', 'Action triggered when the date is reached.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'time' LIMIT 1), '[{"field": "date", "description": "Date when the timer will be triggered (Ex: date: 2024-12-10)"}, {"field": "hour", "description": "Hour when the timer will be triggered (Ex: hour: 10)"}]');
