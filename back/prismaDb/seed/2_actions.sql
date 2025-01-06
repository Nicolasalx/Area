INSERT INTO "Actions" ("name", "description", "isActive", "createdAt", "serviceId", "body")
VALUES
-- github
    ('check_push_github', 'Action triggered when a user push on a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),
    ('check_new_branch', 'Action triggered when a user create a branch a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),
    ('check_new_pr', 'Action triggered when a user create a pr on a repository.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'github' LIMIT 1), '[{"field": "repositoryOwner", "description": "Name of the repository owner "}, {"field": "repositoryName", "description": "Name of the repository"}]'),

-- cron
    ('cron_action', 'Action triggered each X time.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'time' LIMIT 1), '[{"field": "expression", "description": "The cron expression describing the schedule of the action", "options": ["5 sec", "1 min", "2 min", "3 min", "5 min", "15 min", "30 min", "1 hour", "1 day"]}]'),

-- timer
    ('timer_action', 'Action triggered when the date is reached.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'time' LIMIT 1), '[{"field": "date", "description": "Date when the timer will be triggered (Ex: date: 2024-12-10)"}, {"field": "hour", "description": "Hour when the timer will be triggered (Ex: hour: 10)"}]'),

-- google
    ('receive_new_email', 'Action triggered when a mail is received on Gmail.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_calendar_event', 'Action triggered when an event is set on Google Calendar.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_task', 'Action triggered when a task is set on Google Task.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_playlist_youtube', 'Action triggered when a playlist is created on Youtube.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),
    ('new_drive_element', 'Action triggered when an element is created on Google Drive.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'google' LIMIT 1), '[]'),

-- rss
    ('rss_feed', 'Action triggered when new items appear in RSS feed',
        true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'rss' LIMIT 1),
        '[{"field": "feedUrl", "description": "URL of the RSS feed to monitor", "required": true}]'),

-- slack
    ('check_new_message', 'Action triggered when a new message is posted in a specific Slack channel.',
        true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'slack' LIMIT 1),
        '[{"field": "channelName", "description": "Name of the Slack channel to monitor", "required": true}]'),
    ('check_mention', 'Action triggered when a user is mentioned in a specific Slack channel.',
        true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'slack' LIMIT 1), '[
        {"field": "channelName", "description": "Name of the Slack channel to monitor", "required": true},
        {"field": "username", "description": "Username of the Slack user to monitor mentions for", "required": true}
    ]'),
    ('check_reaction', 'Action triggered when a reaction is added to a message',
        true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'slack' LIMIT 1),
        '[{"field": "channelName", "description": "Name of the Slack channel to monitor", "required": true},
          {"field": "reaction", "description": "Emoji reaction to monitor for (e.g. thumbsup)", "required": true}]'),
    ('check_file_shared', 'Action triggered when a file is shared in channel',
        true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'slack' LIMIT 1),
        '[{"field": "channelName", "description": "Name of the Slack channel to monitor", "required": true}]'),

-- trello
    ('new_card_created', 'Action triggered when a card is created on a trello board.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'trello' LIMIT 1), '[{"field": "board_short_link", "description": "Short link of the board", "required": true}]'),
    ('new_card_deleted', 'Action triggered when a card is deleted on a trello board.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'trello' LIMIT 1), '[{"field": "board_short_link", "description": "Short link of the board", "required": true}]'),
    ('new_card_modified', 'Action triggered when a card is modified on a trello board.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'trello' LIMIT 1), '[{"field": "board_short_link", "description": "Short link of the board", "required": true}]'),
    ('new_card_moved', 'Action triggered when a card is moved on a trello board.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'trello' LIMIT 1), '[{"field": "board_short_link", "description": "Short link of the board", "required": true}]'),
    ('new_card_label', 'Action triggered when a label is added on a card on a trello board.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'trello' LIMIT 1), '[{"field": "board_short_link", "description": "Short link of the board", "required": true}]'),
-- Todoist
    ('check_new_task', 'Triggered when a new task is created',
        true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'todoist' LIMIT 1), '[]'),
-- openweather
     ('check_temperature', 'Triggered when temperature reaches threshold',
        true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'openweather' LIMIT 1),
        '[{"field": "city", "description": "City name", "required": true},
          {"field": "threshold", "description": "Temperature threshold in Celsius", "required": true},
          {"field": "condition", "description": "above or below", "required": true}]'),
    ('check_weather_change', 'Triggered when weather condition changes',
        true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'openweather' LIMIT 1),
        '[{"field": "city", "description": "City name", "required": true}]'),
-- Spotify
    ('new_music_played', 'Action triggered when a music is played on Spotify.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'spotify' LIMIT 1), '[]'),
    ('new_playlist_created_spotify', 'Action triggered when a track is added to a playlist on Spotify.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'spotify' LIMIT 1), '[]'),
-- CoinGecko
    ('check_price_increase', 'Action triggered when a price increase on the market, price is checked with CoinGecko.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'coingecko' LIMIT 1), '[{"field": "crypto", "description": "The crypto selectionned to check the price", "options": ["Bitcoin", "Ethereum", "Solana", "Cardano"]}, {"field": "price", "description": "Si le prix du marché dépasse le prix indiquer ici alors on déclenche l action"}]'),
    ('check_price_decrease', 'Action triggered when a price decrease on the market, price is checked with CoinGecko.', true, NOW(), (SELECT id FROM "Services" WHERE "name" = 'coingecko' LIMIT 1), '[{"field": "crypto", "description": "The crypto selectionned to check the price", "options": ["Bitcoin", "Ethereum", "Solana", "Cardano"]}, {"field": "price", "description": "Si le prix du marché passe en dessous du prix indiquer ici alors on déclenche l action"}]');
