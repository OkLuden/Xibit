from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import InputRequired, EqualTo, Length

class RegistrationForm(FlaskForm):
    user_id = StringField("User ID:",validators=[InputRequired(),Length(min=4,max=30)])
    email = StringField("Email:",validators=[InputRequired(),Length(min=4,max=254)])
    password = PasswordField("Password:",validators=[InputRequired(), Length(min=4,max=20)])
    password2 = PasswordField("Confirm Password:",validators=[InputRequired(), EqualTo("password")])
    submit = SubmitField("Submit")

class LoginForm(FlaskForm):
    user_id = StringField("User ID:",validators=[InputRequired()])
    password = PasswordField("Password:",validators=[InputRequired()])
    submit = SubmitField("Submit")

class DisplayNameForm(FlaskForm):
    display_name = StringField("Display Name:",validators=[InputRequired(),Length(min=4,max=20)])
    submit = SubmitField("Submit")