from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed
from wtforms import StringField, PasswordField, SubmitField, FileField, BooleanField
from wtforms.validators import InputRequired, EqualTo, Length, Optional

class RegistrationForm(FlaskForm):
    user_id = StringField("",validators=[InputRequired(),Length(min=4,max=30)])
    email = StringField("",validators=[InputRequired(),Length(min=4,max=254)])
    password = PasswordField("",validators=[InputRequired(), Length(min=8,max=20)])
    password2 = PasswordField("",validators=[InputRequired(), EqualTo("password")])
    submit = SubmitField("Register")

class LoginForm(FlaskForm):
    user_id = StringField("",validators=[InputRequired()])
    password = PasswordField("",validators=[InputRequired()])
    submit = SubmitField("Log In")

class ProfileEditForm(FlaskForm):
    profile_pic = FileField(validators=[Optional(), FileAllowed(['png', 'jpg', 'jpeg', 'gif'], "Incorrect format")])
    rm_pfp = BooleanField("Remove Profile Picture",validators=[Optional()])
    display_name = StringField("Display Name:",validators=[Length(min=4,max=20), Optional()])
    bio = StringField("Bio:",validators=[Length(min=1,max=300), Optional()])
    submit = SubmitField("Submit")