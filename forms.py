from flask_wtf import FlaskForm#
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import InputRequired, EqualTo, NumberRange, Length

class RegistrationForm(FlaskForm):
    user_id = StringField("User ID:",validators=[InputRequired(),Length(min=4,max=20)])
    password = PasswordField("Password:",validators=[InputRequired(), Length(min=4,max=20)])
    password2 = PasswordField("Confirm Password:",validators=[InputRequired(), EqualTo("password")])
    submit = SubmitField("Submit")

class LoginForm(FlaskForm):
    user_id = StringField("User ID:",validators=[InputRequired()])
    password = PasswordField("Password:",validators=[InputRequired()])
    submit = SubmitField("Submit")