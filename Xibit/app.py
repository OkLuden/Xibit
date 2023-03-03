from flask import Flask, render_template, url_for, redirect, request, jsonify, g, session, make_response, logging, flash
from forms import RegistrationForm, LoginForm, ProfileEditForm
from db import get_db, close_db
from flask_session import Session
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from json import loads
from datetime import datetime
import uuid as uuid
import os


app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.config['UPLOAD_FOLDER'] = 'static/images/profilepics'
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
    db = get_db()
    cursor = db.cursor()
    cursor.execute(''' SELECT postID, image FROM posts ORDER BY postID DESC;''')
    postID = dict(cursor.fetchall())
    post = postID.values()

    cursor.execute(''' SELECT postID, date FROM posts ORDER BY postID DESC;''')
    date_dict = dict(cursor.fetchall())
    date_list = date_dict.values()

    # fetch userID for post and then translate into username
    cursor.execute(''' SELECT creatorID FROM posts ORDER BY postID DESC;;''')
    users = cursor.fetchall()
    cursor.execute(''' SELECT userID, username FROM users;''')
    translate = dict(cursor.fetchall())
    cursor.execute(''' SELECT userID, displayName FROM users;''')
    translate2 = dict(cursor.fetchall())
    cursor.execute(''' SELECT userID, profilepic FROM users;''')
    translate3 = dict(cursor.fetchall())
    users_list = []
    for user in users:
        users_list.append([translate[user[0]], translate2[user[0]], translate3[user[0]]])
    
    cursor.execute(''' SELECT postID, likes FROM posts ORDER BY postID DESC;''')
    likes = cursor.fetchall()
    likes_list = []
    for like in likes:
        likes_list.append([like[1], like[0]])

    if g.user is None:
        user_likes = [-1]
    else:
        cursor.execute(''' SELECT postID FROM likes WHERE userID = %s;''', (getUserID(cursor)))
        user_likes = cursor.fetchall()
        user_likes = [i[0] for i in user_likes]

    return render_template("index.html", page = "Home", post = post, user=users_list, likes=likes_list, date=date_list, user_likes=user_likes)

@app.route("/like/<likeID>", methods = ["GET",'POST'])
@login_required
def likePost(likeID):
    db = get_db()
    cursor = db.cursor()

    userID = getUserID(cursor)
    cursor.execute('''REPLACE INTO likes (userID, postID) VALUES (%s, %s);''', (userID, likeID))

    cursor.execute('''SELECT COUNT(postID) FROM likes WHERE postID = %s;''', (likeID))
    likes = cursor.fetchone()[0]
    print(likes)
    cursor.execute(''' UPDATE posts SET likes = %s WHERE postID = %s;''', (likes, likeID))

    db.commit()
    
    return("/")

@app.route("/delike/<likeID>", methods = ["GET",'POST'])
@login_required
def delikePost(likeID):
    db = get_db()
    cursor = db.cursor()

    userID = getUserID(cursor, g.user)
    cursor.execute('''DELETE FROM likes WHERE userID = %s AND postID = %s;''', (userID, likeID))

    cursor.execute('''SELECT COUNT(postID) FROM likes WHERE postID = %s;''', (likeID))
    likes = cursor.fetchone()[0]
    print(likes)
    cursor.execute(''' UPDATE posts SET likes = %s WHERE postID = %s;''', (likes, likeID))

    db.commit()
    return("/")


@app.route("/paint", methods = ["GET","POST"])
def paint():
    return render_template("paint.html", page = "Paint" )

@app.route("/profile/<user>", methods = ["GET","POST"])
@login_required
def profile(user):
    db = get_db()
    cursor = db.cursor()
    if user == g.user:
        form = ProfileEditForm()
        friendStatus = None
        if form.validate_on_submit():
            new_display_name = form.display_name.data
            new_bio = form.bio.data
            new_pfp = form.profile_pic.data
            pfp_filename = secure_filename(new_pfp.filename)
            new_pfp_name = str(uuid.uuid1()) + "_" + pfp_filename
            pfp_filename = new_pfp_name

            if form.rm_pfp.data is True:
                form.rm_pfp.data = False
                cursor.execute('''SELECT profilepic FROM users WHERE username = %s;''', (g.user,))
                prev_pfp_filename = cursor.fetchone()[0]
                if prev_pfp_filename and prev_pfp_filename != 'default-profile.png':
                    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], prev_pfp_filename))
                cursor.execute('''UPDATE users SET profilepic = %s WHERE username = %s;''', ('default-profile.png', g.user,))
                db.commit()
            elif new_pfp:
                cursor.execute('''SELECT profilepic FROM users WHERE username = %s;''', (g.user,))
                prev_pfp_filename = cursor.fetchone()[0]

                new_pfp.save(os.path.join(app.config['UPLOAD_FOLDER'], pfp_filename))
                cursor.execute('''UPDATE users SET profilepic = %s WHERE username = %s;''', (new_pfp_name, g.user,))
                db.commit()

                if prev_pfp_filename and prev_pfp_filename != 'default-profile.png':
                    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], prev_pfp_filename))

            with open("profanity.txt", "r") as profanity_file:
                profanity = profanity_file.read().splitlines()
            with open("allowed.txt", "r") as allowed_file:
                allowed = allowed_file.read().splitlines()
        
            if any(word in new_display_name for word in profanity):
                if not any(word in new_display_name for word in allowed):
                    form.display_name.errors.append("Display name invalid. Profanity detected.")
            elif not new_display_name:
                pass
            else:
                cursor.execute(''' UPDATE users
                            SET displayName = %s
                            WHERE username = %s;''', (new_display_name,g.user,))
                db.commit()
        
            if any(word in new_bio for word in profanity):
                if not any(word in new_bio for word in allowed):
                    form.bio.errors.append("Bio invalid.")
            elif not new_bio:
                pass
            else:
                cursor.execute(''' UPDATE users
                                    SET bio = %s
                                    WHERE username = %s;''', (new_bio,g.user,))
                db.commit()
    else:
        form = None
        friendStatus = getFriendStatus(user)

    cursor.execute(''' SELECT displayName FROM users
                                    WHERE username = %s;''', (user))
    display_name = cursor.fetchone()

    cursor.execute(''' SELECT bio FROM users
                                    WHERE username = %s;''', (user))
    bio = cursor.fetchone()

    cursor.execute(''' SELECT profilepic FROM users
                                        WHERE username = %s;''', (user))
    profilepic = cursor.fetchone()


    return render_template("profile.html", profilepic = profilepic, display_name = display_name, bio = bio, form = form, page = "Profile", user = user, friendStatus = friendStatus)


@app.route("/sendFriendRequest/<user>", methods = ["GET"])
@login_required
def sendFriendRequest(user):
    db = get_db()
    with db.cursor() as cursor:
        userID = getUserID(cursor, g.user)
        otherID = getUserID(cursor, user)
        time = getDateTime()
        cursor.execute("""INSERT INTO friendRequests VALUES (%s, %s, %s)""", (userID, otherID, time))
        db.commit()
        flash(f"Sent friend Request to {user}")
        return redirect(url_for('profile', user = user))

@app.route("/acceptFriendRequest/<user>", methods = ["GET"])
@login_required
def acceptFriendRequest(user):
    db = get_db()
    with db.cursor() as cursor:
        userID = getUserID(cursor, g.user)
        otherID = getUserID(cursor, user)
        time = getDateTime()
        cursor.execute("""INSERT INTO friends VALUES(%s, %s, %s);""", (userID, otherID, time))
        db.commit()
        flash(f"Accepted friend request from {user}")
        return redirect(url_for('profile', user = user))

@app.route("/deleteFriendRequest/<user>", methods = ["GET"])
@login_required
def deleteFriendRequest(user):
    db = get_db()
    with db.cursor() as cursor:
        userID = getUserID(cursor, g.user)
        otherID = getUserID(cursor, user)
        cursor.execute("""DELETE FROM friendRequests WHERE senderID = %s AND receiverID = %s;""", (userID, otherID))
        db.commit()
        flash(f"Rescinded friend request to {user}")
        return redirect(url_for('profile', user = user))

@app.route("/viewFriends", methods = ["GET"])
@login_required
def viewFriends(user):
    pass

def getFriendStatus(user):
    db = get_db()
    with db.cursor() as cursor:
        userID = getUserID(cursor, g.user)
        otherID = getUserID(cursor, user)
        cursor.execute("""SELECT * FROM friends WHERE (user1ID = %s AND user2ID = %s) OR (user1ID = %s AND user2ID = %s);""",
                       (userID, otherID, otherID, userID))
        if cursor.fetchone() != None:
            return "FRIENDS"
        cursor.execute("""SELECT * FROM friendRequests WHERE senderID = %s AND receiverID = %s;""", (userID, otherID))
        if cursor.fetchone() != None:
            return "SENT"
        cursor.execute("""SELECT * FROM friendRequests WHERE senderID = %s AND receiverID = %s;""", (otherID, userID))
        if cursor.fetchone() != None:
            return "RECEIVED"
        return None


def getDateTime():
    now = datetime.utcnow()
    return now.strftime('%Y-%m-%d %H:%M:%S')

@app.route("/register" , methods = ["GET","POST"])
def register():
    form = RegistrationForm()
    
    if form.validate_on_submit():
        form_user_id = form.user_id.data
        user_id = form_user_id.lower()
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
                cursor.execute('''INSERT INTO users (username, displayName, profilepic, bio, password, email)
                            VALUES (%s, %s, %s, %s, %s, %s);''', (user_id, form_user_id, "default-profile.png", "", generate_password_hash(password), email))
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
        cursor.execute(''' SELECT password FROM users
                                WHERE username = %s;''', (user_id))

        if cursor.fetchone() is None:
            form.password.errors.append("Incorrect username or password")
        else:
            cursor.execute(''' SELECT password FROM users
                                WHERE username = %s;''', (user_id))
            user = cursor.fetchone()[0]
            if not check_password_hash(user,password):
                form.password.errors.append("Incorrect username or password")
            else:
                session.clear()
                session["user_id"] = user_id
                g.user = user_id
                next_page = request.args.get("next")
                if not next_page:
                    next_page = url_for("index")
                return redirect(next_page)
    return render_template("login.html", form=form, page="Login")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

def getUserID(cursor, username):
        getUserSql = """SELECT userID FROM users WHERE username = %s;"""
        cursor.execute(getUserSql, username)
        return cursor.fetchone()[0]

@app.route("/post/<string:blob>", methods = ["GET", "POST"])
@login_required
def post(blob):
    post_data = loads(blob)
    db = get_db()
    cursor = db.cursor()

    cursor.execute(''' SELECT MAX(postID) FROM posts''')
    
    postID = cursor.fetchone()[0]
    if postID == None:
        postID = 1
    else:
        postID += 1

    creatorID = getUserID(cursor=cursor, username=g.user)

    current_time = datetime.now()
    date_posted = current_time.strftime("%Y/%m/%d %H:%M:%S")
    
    cursor.execute('''INSERT INTO posts (postID, creatorID, image, date) VALUES (%s, %s, %s, %s);''', (postID, creatorID, post_data, date_posted))
    db.commit()
 
    return("/")

@app.route("/viewPost/<postID>", methods = ['GET'])
def viewPost(postID):
    db = get_db()
    cursor = db.cursor()
    with cursor as cursor:
        cursor.execute("""SELECT * FROM posts WHERE postID = %s);""", (postID))
        post = cursor.fetchone()
        return render_template("viewPost.html", post=post)