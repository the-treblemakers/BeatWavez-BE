DROP TABLE IF EXISTS users CASCADE; 
DROP TABLE IF EXISTS songs CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS queues;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL
);
CREATE TABLE songs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    vid_id TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    channel_name TEXT NOT NULL,
    channel_id TEXT NOT NUll
);
CREATE TABLE rooms (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    room_name TEXT NOT NULL,
    host TEXT NOT NULL
    -- switch to user once authorization is setup, currently pull stagename of creator as host
);
CREATE TABLE queues (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    room_id BIGINT NOT NULL REFERENCES rooms(id),
    song_id BIGINT NOT NULL REFERENCES songs(id),
    order BIGINT NOT NULL
);
