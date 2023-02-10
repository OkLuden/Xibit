from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import InputRequired, EqualTo, Length

class RegistrationForm(FlaskForm):
    user_id = StringField("",validators=[InputRequired(),Length(min=4,max=30)])
    email = StringField("",validators=[InputRequired(),Length(min=4,max=254)])
    password = PasswordField("",validators=[InputRequired(), Length(min=4,max=20)])
    password2 = PasswordField("",validators=[InputRequired(), EqualTo("password")])
    submit = SubmitField("Register")

class LoginForm(FlaskForm):
    user_id = StringField("",validators=[InputRequired()])
    password = PasswordField("",validators=[InputRequired()])
    submit = SubmitField("Log In")

class DisplayNameForm(FlaskForm):
    display_name = StringField("Display Name:",validators=[InputRequired(),Length(min=4,max=20)])
    submit = SubmitField("Submit")