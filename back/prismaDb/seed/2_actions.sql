INSERT INTO "Actions" ("name", "description", "isActive", "createdAt", "serviceId", "body")
VALUES
    ('check_push_github', 'Action triggered when a user push on a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),
    ('check_new_branch', 'Action triggered when a user create a branch a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),
    ('check_new_pr', 'Action triggered when a user create a pr on a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),

    ('cron_action', 'Action triggered each X time.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'time' LIMIT 1), '[{"field": "expression", "description": "The cron expression describing the schedule of the action"}]'),
    ('timer_action', 'Action triggered when the date is reached.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'time' LIMIT 1), '[{"field": "date", "description": "Date when the timer will be triggered (Ex: date: 2024-12-10)"}, {"field": "hour", "description": "Hour when the timer will be triggered (Ex: hour: 10)"}]'),
    ('receive_new_email', 'Action triggered when a mail is received on Gmail.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_calendar_event', 'Action triggered when an event is set on Google Calendar.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_task', 'Action triggered when a task is set on Google Task.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_playlist_youtube', 'Action triggered when a playlist is created on Youtube.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_drive_element', 'Action triggered when an element is created on Google Drive.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]');
