from flask import g
import pymysql.connections as dbConnection
import sshtunnel

def openSSH(self):
    server = sshtunnel.SSHTunnelForwarder(('xibitdb.darragh.container.netsoc.cloud', 16850),
    ssh_username='root',
    ssh_password='teamprojectteam8',
    remote_bind_address=('127.0.0.1', 3306))
    server.start()
    return server

def get_db():
    if "db" not in g:
        server = openSSH()
        db = dbConnection.Connection(host='127.0.0.1', 
        user='root', 
        password='H1@l//C$rT', 
        database='XibitDB', 
        port=server.local_bind_port
        cursorclass=pymsql.cursors.DictCursor)
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()