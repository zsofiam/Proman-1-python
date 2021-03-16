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
