CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "Users" ("id", "name", "email", "password", "isActive", "createdAt", "type")
VALUES
    (uuid_generate_v4(), 'Manuel Tome', 'manuel.tome@epitech.eu', 'password123', true, NOW(), 'CLASSIC'),
    (uuid_generate_v4(), 'Nicolas Alexandre', 'nicolas1.alexandre@epitech.eu', 'password123', true, NOW(), 'CLASSIC'),
    (uuid_generate_v4(), 'Thibaud Cathala', 'thibaud.cathala@epitech.eu', 'password123', true, NOW(), 'CLASSIC'),
    (uuid_generate_v4(), 'Tiphaine Bertone', 'tiphaine.bertone@epitech.eu', 'password123', true, NOW(), 'CLASSIC'),
    (uuid_generate_v4(), 'Nicolas Melet', 'nicolas.melet@epitech.eu', 'password123', true, NOW(), 'CLASSIC');
