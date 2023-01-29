from Xibit import app, render_template

@app.route("/")
def index():
    return render_template("index.html")
