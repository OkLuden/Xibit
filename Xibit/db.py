from flask import g
import pymysql
import pymysql.cursors as cursor
import sshtunnel

def openSSH():
    server = sshtunnel.SSHTunnelForwarder(('csgate.ucc.ie', 22),
    ssh_username='dh29',
    ssh_password='aaookeeb',
    remote_bind_address=('127.0.0.1', 3306))
    server.start()
    return server

def get_db():
    if "db" not in g:
        server = openSSH()
        g.db = pymysql.connect(host='cs1.ucc.ie', 
        user='dh29', 
        password='uthao', 
        database='cs2208_dh29', 
        port=3306)
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()