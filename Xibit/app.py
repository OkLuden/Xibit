from flask import Flask, render_template, url_for, redirect, request, jsonify, g, session, make_response
from forms import RegistrationForm, LoginForm, DisplayNameForm
from db import get_db, close_db
from flask_session import Session
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.teardown_appcontext
def close_db_at_end_of_requests(e=None):
    close_db(e)

@app.before_request
def load_logged_in_user():
    g.user = session.get("user_id", None)

def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(**kwargs)
    return wrapped_view

@app.errorhandler(404)
def page_not_found(error):
    return render_template("error404.html", page="Error!"), 404

@app.route("/")
def index():
    return render_template("index.html", page = "Home")

@app.route("/paint", methods = ["GET","POST"])
def paint():
    return render_template("paint.html", page = "Paint" )

@app.route("/profile", methods = ["GET","POST"])
@login_required
def profile():
    form = DisplayNameForm()
    db = get_db()
    cursor = db.cursor()
    if form.validate_on_submit():
        new_display_name = form.display_name.data
        with open("profanity.txt", "r") as profanity_file:
            profanity = profanity_file.read().splitlines()
        with open("allowed.txt", "r") as allowed_file:
            allowed = allowed_file.read().splitlines()
        
        if any(word in new_display_name for word in profanity):
            if not any(word in new_display_name for word in allowed):
                form.display_name.errors.append("Display name invalid.")
        else:
            cursor.execute(''' UPDATE users
                            SET display_name = %s
                            WHERE username = %s;''', (new_display_name,g.user,))
            db.commit()
    cursor.execute(''' SELECT display_name FROM users
                                    WHERE username = %s;''', (g.user))
    display_name = cursor.fetchone()
    return render_template("profile.html", display_name = display_name, form = form, page = "Profile")


@app.route("/register" , methods = ["GET","POST"])
def register():
    form = RegistrationForm()
    #TO DO
    if form.validate_on_submit():
        user_id = form.user_id.data
        user_id = user_id.lower()
        password = form.password.data
        email = form.email.data
        with open("profanity.txt", "r") as profanity_file:
            profanity = profanity_file.read().splitlines()
        with open("allowed.txt", "r") as allowed_file:
            allowed = allowed_file.read().splitlines()
        
        if any(word in user_id for word in profanity):
            if not any(word in user_id for word in allowed):
                form.user_id.errors.append("User ID invalid.")
        elif "@" not in email:
            form.email.errors.append("Enter a valid email address.") 

        else:
            password = salt(password)
            db = get_db()
            cursor = db.cursor()
            cursor.execute(''' SELECT * FROM users
                                    WHERE username = %s;''', (user_id))
            user = cursor.fetchone()
            if user is None:
                cursor.execute('''INSERT INTO users (username, displayName, password, email)
                            VALUES (%s, %s, %s, %s);''', (user_id, user_id, generate_password_hash(password), email))
                db.commit()
                return redirect(url_for("login"))
            elif user is not None:
                form.user_id.errors.append("User ID already taken.")
    return render_template("register.html", form = form, page = "Register")


def salt(unsaltedPassword):
    saltedPassword = unsaltedPassword[:3] + "345" + unsaltedPassword[3:6] + "543" + unsaltedPassword[6:]
    return saltedPassword

@app.route("/login" , methods = ["GET","POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        user_id = user_id.lower()
        password = form.password.data
        password = salt(password)
        db = get_db()
        cursor = db.cursor()
        cursor.execute(''' SELECT * FROM users
                                WHERE username = %s;''', (user_id))
        user = cursor.fetchone()
        if user is None:
            form.user_id.errors.append("Incorrect username or password")
        elif not check_password_hash(user["password"],password):
            form.password.errors.append("Incorrect username or password")
        else:
            session.clear()
            session["user_id"] = user_id
            next_page = request.args.get("next")
            if not next_page:
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("login.html", form=form, page="Login")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))