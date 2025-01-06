INSERT INTO "Services" ("name", "description", "isActive", "oauthNeed", "createdAt")
VALUES
    ('google', 'Google services like Gmail, Calendar, Drive, etc.', true, true, NOW()),
    ('github', 'Github services for developpers.', true, true, NOW()),
    ('discord', 'Discord webhook.', true, true, NOW()),
    ('time', 'Time with cron and timer.', true, false, NOW()),
    ('rss', 'RSS feed monitoring.', true, false, NOW()),
    ('slack', 'Slack bot.', true, false, NOW()),
    ('trello', 'Managing board and card in Trello.', true, true, NOW()),
    ('todoist', 'Todoist task management.', true, false, NOW()),
    ('twilio', 'Twilio SMS / Phone / E-mail sending.', true, false, NOW()),
    ('openweather', 'Weather monitoring.', true, false, NOW()),
    ('spotify', 'Music service.', true, true, NOW()),
    ('worldtime', 'World Time monitoring service.', true, false, NOW()),
    ('newsapi', 'Monitor breaking news.', true, false, NOW()),
    ('coingecko', 'Check crypto price on the market with CoinGecko.', true, false, NOW());
