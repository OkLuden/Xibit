from flask import Flask, render_template, url_for, redirect, request, jsonify, g, session, make_response
from forms import RegistrationForm, LoginForm
from db import get_db, close_db
from flask_session import Session


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
def profile():
    return render_template("profile.html", page = "Profile")

@app.route("/register" , methods = ["GET","POST"])
def register():
    form = RegistrationForm()
    #TO DO
    return render_template("register.html", page = "Register")

@app.route("/login" , methods = ["GET","POST"])
def login():
    form = LoginForm()
    #TO DO
    return render_template("login.html", page = "Login")

@app.route("/logout")
def logout():
    #TO DO
    return redirect(url_for("index"))