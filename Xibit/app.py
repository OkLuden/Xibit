from flask import Flask, render_template, url_for, redirect
from forms import RegistrationForm, LoginForm
from db import get_db, close_db
from flask_session import Session


app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.errorhandler(404)
def page_not_found(error):
    return render_template("error404.html", page="Error!"), 404
    
@app.route("/")
def test():
    return render_template("index.html" , page = "Home")