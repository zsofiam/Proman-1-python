import bcrypt
import database_common
from psycopg2.extras import RealDictCursor


def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


def check_register_input(username, password):
    if username == '' or password == '':
        return False
    return True


@database_common.connection_handler
def check_user(cursor: RealDictCursor, username):
    cursor.execute("SELECT username FROM users WHERE username = %s;", [username])
    user_dict = cursor.fetchone()
    if user_dict is None:
        return True
    return False


@database_common.connection_handler
def register_user(cursor: RealDictCursor, username, hashed_password):
    cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s);", (username, hashed_password))


@database_common.connection_handler
def get_user_data_by_username(cursor: RealDictCursor, username):
    cursor.execute("SELECT * FROM users WHERE username = %s;", [username])
    return cursor.fetchone()


@database_common.connection_handler
def get_boards(cursor: RealDictCursor):
    cursor.execute("SELECT * FROM boards ORDER BY id;")
    return cursor.fetchall()


@database_common.connection_handler
def get_statuses(cursor: RealDictCursor):
    cursor.execute("SELECT * FROM statuses ORDER BY id;")
    return cursor.fetchall()


@database_common.connection_handler
def get_cards_for_board(cursor: RealDictCursor, board_id):
    cursor.execute("SELECT * FROM cards WHERE board_id = %s;", [board_id])
    return cursor.fetchall()


@database_common.connection_handler
def create_board(cursor: RealDictCursor, title, owner_id, is_open):
    cursor.execute("INSERT INTO boards (title, owner, open) VALUES (%s, %s, %s);", (title, owner_id, is_open))


@database_common.connection_handler
def get_user_id_by_name(cursor: RealDictCursor, username):
    cursor.execute("SELECT id FROM users WHERE username = %s;", [username])
    return cursor.fetchone()


@database_common.connection_handler
def modify_board_title(cursor: RealDictCursor, data):
    cursor.execute("UPDATE boards SET title = %s WHERE id = %s;", (data.get("title"), data.get("id")))


@database_common.connection_handler
def create_card(cursor: RealDictCursor, data):
    cursor.execute("INSERT INTO cards (board_id, status_id) VALUES (%s, '1');", [data.get('board_id')])


@database_common.connection_handler
def delete_card(cursor: RealDictCursor, data):
    cursor.execute("DELETE FROM cards WHERE id = %s;", [data.get('card_id')])


@database_common.connection_handler
def modify_card_content(cursor: RealDictCursor, data, card_id):
    print(data.get('id'))
    print(data.get('title'))
    cursor.execute("UPDATE cards SET title = %s WHERE id = %s;", (data.get("title"), card_id,))


