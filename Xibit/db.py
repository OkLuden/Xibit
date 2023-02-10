from flask import g
import pymysql.connections as dbConnection


def get_db():
    if "db" not in g:
        db = dbConnection.Connection(host='127.0.0.1', 
        user='root', 
        password='H1@l//C$rT', 
        database='XibitDB', 
        port=server.local_bind_port)
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()