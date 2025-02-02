INSERT INTO "Ingredients" ("name", "description")
VALUES
    ('repository_owner', 'Name of the repository owner on GitHub'),
    ('repository_name', 'Name of the repository on GitHub'),
    ('sender', 'Email of the user who sent the email on Gmail'),
    ('subject', 'Subject of the email received on Gmail'),
    ('body', 'Body of the email received on Gmail'),
    ('event_name', 'Name of the event created on Google Calendar'),
    ('event_date', 'Date of the event created on Google Calendar'),
    ('task_title', 'Title of the task created on Google Tasks'),
    ('playlist_name', 'Name of the YouTube playlist'),
    ('playlist_type', 'Type of the YouTube playlist'),
    ('element_name', 'Name of the item on Google Drive'),
    ('element_type', 'Type of the item on Google Drive'),
    ('trigger_date', 'Date and time the trigger was activated'),

-- trello
    ('card_name', 'Name of the trello card'),
    ('card_url', 'Url of the trello card'),
    ('card_id', 'ID of the trello card'),
    ('from_list_id', 'ID of the list before moved'),
    ('to_list_id', 'ID of the list after moved'),
    ('new_labels', 'ID of the list after moved'),

-- todoist
    ('task_description', 'Description of the Todoist task'),
    ('task_priority', 'Priority level of the Todoist task'),
-- openweather
    ('temperature', 'Current temperature in Celsius'),
    ('weather_condition', 'Current weather condition (sunny, rainy, etc.)'),
    ('humidity', 'Current humidity percentage'),
    ('wind_speed', 'Current wind speed in m/s'),
    ('city_name', 'Name of the city'),
-- spotify
    ('song_name', 'Name of the song'),
    ('song_artists', 'Name of all the artists of the song'),
    ('song_release_date', 'Release date of the song'),

    ('playlist_name', 'Name of the playlist'),
    ('playlist_owner_name', 'Name of the playlist owner'),
    ('playlist_id', 'Id of the playlist'),
-- coingecko
    ('crypto', 'Crypto name'),
    ('given_crypto_price', 'Given price of the crypto'),
    ('current_crypto_price', 'Actual price of the crypto'),

-- WorldTime
    ('current_time', 'Current time in the monitored timezone'),
    ('is_daytime', 'It is currently daytime'),
    ('timezone', 'The timezone being monitored'),
    ('day_of_week', 'Current day of the week'),
-- newsapi
    ('headline', 'News headline text'),
    ('source', 'News source name'),
    ('news_url', 'URL to full article'),
    ('news_description', 'Article description'),
-- fuelPrice
    ('fuel_type', 'Type of the fuel like gazole or sp95'),
    ('actual_fuel_price', 'Price of the actual fuel'),
-- EarthQuakeAlerts
    ('magnitude', 'Magnitude of the earthquake'),
    ('location', 'Location of the earthquake'),
-- OpenSky
    ('flight_name', 'Location of the earthquake'),
    ('flight_id', 'Location of the earthquake'),
    ('flight_country', 'Location of the earthquake')
RETURNING "id";

INSERT INTO "ActionsIngredients" ("actionId", "ingredientId")
VALUES
    ((SELECT id FROM "Actions" WHERE "name" = 'check_push_github' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'repository_owner' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_push_github' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'repository_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_push_github' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_branch' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'repository_owner' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_branch' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'repository_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_branch' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_pr' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'repository_owner' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_pr' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'repository_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_pr' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'cron_action' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'timer_action' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'receive_new_email' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'sender' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'receive_new_email' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'subject' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'receive_new_email' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'body' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'receive_new_email' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_calendar_event' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'event_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_calendar_event' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'event_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_calendar_event' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_task' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'task_title' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_task' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_youtube' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'playlist_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_youtube' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'playlist_type' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_youtube' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_drive_element' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'element_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_drive_element' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'element_type' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_drive_element' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'rss_feed' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

-- trello
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_created' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'card_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_created' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'card_url' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_created' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_deleted' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'card_id' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_deleted' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_modified' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'card_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_modified' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'card_url' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_modified' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_moved' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'card_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_moved' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'card_url' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_moved' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'from_list_id' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_moved' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'to_list_id' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_moved' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_label' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'card_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_label' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'card_url' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_label' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'new_labels' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_card_label' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
-- todoist
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_task' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'task_title' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_task' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'task_description' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_task' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'task_priority' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_task' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
-- openweather
    ((SELECT id FROM "Actions" WHERE "name" = 'check_temperature'),
        (SELECT id FROM "Ingredients" WHERE "name" = 'temperature' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_temperature'),
        (SELECT id FROM "Ingredients" WHERE "name" = 'city_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_temperature'),
        (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

    ((SELECT id FROM "Actions" WHERE "name" = 'check_weather_change'),
        (SELECT id FROM "Ingredients" WHERE "name" = 'weather_condition' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_weather_change'),
        (SELECT id FROM "Ingredients" WHERE "name" = 'city_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_weather_change'),
        (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

-- spotify
    ((SELECT id FROM "Actions" WHERE "name" = 'new_music_played' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'song_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_music_played' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'song_artists' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_music_played' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'song_release_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_music_played' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_created_spotify' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'playlist_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_created_spotify' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'playlist_owner_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_created_spotify' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'playlist_id' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'new_playlist_created_spotify' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

-- coingecko
    ((SELECT id FROM "Actions" WHERE "name" = 'check_price_increase' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'crypto' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_price_increase' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'given_crypto_price' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_price_increase' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'current_crypto_price' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_price_increase' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

    ((SELECT id FROM "Actions" WHERE "name" = 'check_price_decrease' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'crypto' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_price_decrease' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'given_crypto_price' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_price_decrease' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'current_crypto_price' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_price_decrease' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
-- WorldTime
    ((SELECT id FROM "Actions" WHERE "name" = 'check_timezone' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'current_time' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_timezone' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'timezone' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_timezone' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'day_of_week' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_timezone' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),

    ((SELECT id FROM "Actions" WHERE "name" = 'check_daynight' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'current_time' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_daynight' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'is_daytime' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_daynight' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'timezone' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_daynight' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'day_of_week' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_daynight' LIMIT 1),
        (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
-- Newsapi
    ((SELECT id FROM "Actions" WHERE "name" = 'monitor_breaking_news' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'headline' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'monitor_breaking_news' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'source' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'monitor_breaking_news' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'news_url' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'monitor_breaking_news' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'news_description' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'monitor_breaking_news' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
-- FuelPrice
    ((SELECT id FROM "Actions" WHERE "name" = 'check_fuel_price_increase' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'fuel_type' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_fuel_price_increase' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'actual_fuel_price' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_fuel_price_increase' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_fuel_price_decrease' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'fuel_type' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_fuel_price_decrease' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'actual_fuel_price' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_fuel_price_decrease' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
-- Earthquake
    ((SELECT id FROM "Actions" WHERE "name" = 'check_earthquake_alerts' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'magnitude' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_earthquake_alerts' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'location' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_earthquake_alerts' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
-- OpenSky
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_france' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'flight_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_france' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'flight_id' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_france' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'flight_country' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_france' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_england' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'flight_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_england' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'flight_id' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_england' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'flight_country' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_england' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_spain' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'flight_name' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_spain' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'flight_id' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_spain' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'flight_country' LIMIT 1)),
    ((SELECT id FROM "Actions" WHERE "name" = 'check_new_flight_in_spain' LIMIT 1), (SELECT id FROM "Ingredients" WHERE "name" = 'trigger_date' LIMIT 1));
