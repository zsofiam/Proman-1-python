ALTER TABLE IF EXISTS ONLY cards DROP CONSTRAINT IF EXISTS fk_card_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY cards DROP CONSTRAINT IF EXISTS fk_card_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY users DROP CONSTRAINT IF EXISTS fk_users_board_id CASCADE;

DROP TABLE IF EXISTS boards;
CREATE TABLE boards (
    id serial NOT NULL PRIMARY KEY,
    title text DEFAULT 'Undefined',
    owner integer,
    open boolean
);

DROP TABLE IF EXISTS statuses;
CREATE TABLE statuses (
    id serial NOT NULL PRIMARY KEY,
    title text DEFAULT 'Undefined'
);

DROP TABLE IF EXISTS cards;
CREATE TABLE cards (
    id serial NOT NULL PRIMARY KEY,
    board_id integer NOT NULL,
    title text DEFAULT 'Undefined',
    status_id integer NOT NULL,
    "order" serial NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    username varchar unique NOT NULL,
    password varchar NOT NULL
);

ALTER TABLE cards
    ADD CONSTRAINT fk_card_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE cards
    ADD CONSTRAINT fk_card_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE boards
    ADD CONSTRAINT fk_board_user_id FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE;

INSERT INTO boards (title, open) VALUES ('Board 1', 'true'), ('Board 2', 'true');

INSERT INTO statuses (title) VALUES ('new'), ('in progress'), ('testing'), ('done');

INSERT INTO cards (board_id, title, status_id, "order") VALUES (1, 'new card 1', 1, 0),
                         (1, 'new card 2', 1, 1),
                         (1, 'in progress card', 2, 0),
                         (1, 'planning', 3, 0),
                         (1, 'done card 1', 4, 0),
                         (1, 'done card 2', 4, 1),
                         (2, 'new card 1', 1, 0),
                         (2, 'new card 2', 1, 1),
                         (2, 'in progress card', 2, 0),
                         (2, 'planning', 3, 0),
                         (2, 'done card 1', 4, 0),
                         (2, 'done card 2', 4, 1);