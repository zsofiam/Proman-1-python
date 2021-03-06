from flask import Flask, render_template, url_for, request, session, redirect
from util import json_response

import data_manager

app = Flask(__name__)
app.secret_key = b'_5#z1W"O8ADq\n\xea]/'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    if 'username' in session:
        username = session["username"]
    else:
        username = None
    return render_template('index.html', username=username)


@app.route("/design")
def design():
    return render_template('design.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    input_check = True
    user_check = True
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        input_check = data_manager.check_register_input(username, password)
        user_check = data_manager.check_user(username)
        if user_check and input_check:
            hashed_password = data_manager.hash_password(password)
            data_manager.register_user(username, hashed_password)
            return redirect(url_for('login'))
    return render_template('register.html', input_check=input_check, user_check=user_check)


@app.route('/login', methods=['GET', 'POST'])
def login():
    user_check = True
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_dict = data_manager.get_user_data_by_username(username)
        if user_dict is None or data_manager.verify_password(password, user_dict['password']) is False:
            user_check = False
        else:
            session['logged_in'] = True
            session['username'] = username
            session['user_id'] = user_dict['id']
            return redirect(url_for('index'))
    return render_template('login.html', user_check=user_check)


@app.route('/logout')
def logout():
    session.clear()
    session['logged_in'] = False
    return redirect(url_for('index'))


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    boards = data_manager.get_boards()
    return boards


@app.route("/get-status/<int:board_id>")
@json_response
def get_statuses(board_id):
    statuses = data_manager.get_statuses()
    return statuses


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    cards = data_manager.get_cards_for_board(board_id)
    return cards




@app.route("/create-board", methods=['GET', 'POST'])
def create_board():
    if request.method == 'GET':
        private = False
        return render_template('create_board.html', private=private)
    else:
        # user can create public board even if not logged in
        title = request.form["title"]
        if 'username' in session:
            owner = session["username"]
            owner_id = data_manager.get_user_id_by_name(owner)["id"]
        else:
            owner_id = None
        is_open = True
        data_manager.create_board(title, owner_id, is_open)
        return redirect("/")


@app.route("/create-private-board", methods=['GET', 'POST'])
def create_private_board():
    if request.method == 'GET':
        private = True
        return render_template('create_board.html', private=private)
    else:
        # user can create private board only when logged in
        title = request.form["title"]
        owner = session["username"]
        owner_id = data_manager.get_user_id_by_name(owner)["id"]
        is_open = False
        data_manager.create_board(title, owner_id, is_open)
        return redirect("/")


@app.route("/modify-board-title", methods=['GET', 'POST'])
@json_response
def modify_board_title():
    if request.method == 'POST':
        if request.get_json():
            data = request.get_json()
            data_manager.modify_board_title(data)


@app.route("/create-card", methods=["GET", "POST"])
@json_response
def create_card():
    if request.method == 'POST':
        if request.get_json():
            data = request.get_json()
            data_manager.create_card(data)


@app.route("/delete-card", methods=["GET", "POST"])
@json_response
def delete_card():
    if request.method == 'POST':
        if request.get_json():
            data = request.get_json()
            data_manager.delete_card(data)


@app.route("/edit-card/<int:card_id>", methods=['POST','GET'])
@json_response
def edit_card(card_id:int):
    if request.method == 'POST':
        if request.get_json():
            data = request.get_json()
            data_manager.modify_card_content(data, card_id)


@app.route("/edit-card-status", methods=['GET', 'POST'])
@json_response
def edit_card_status():
    if request.method == 'POST':
        if request.get_json():
            data = request.get_json()
            data_manager.update_card_status(data)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
