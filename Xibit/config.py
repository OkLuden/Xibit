import sshtunnel
import pymysql.connections as dbConnection
import pymysql.cursors



server = sshtunnel.SSHTunnelForwarder(('xibitdb.darragh.container.netsoc.cloud', 16850),
ssh_username='root',
ssh_password='teamprojectteam8',
remote_bind_address=('127.0.0.1', 3306))

server.start()

db = dbConnection.Connection(host='127.0.0.1', user='root', password='H1@l//C$rT', database='XibitDB', port=server.local_bind_port)

with db.cursor() as cursor:
    sql = "SELECT * FROM `users`"
    cursor.execute(sql)
    result = cursor.fetchall()
    print(result)

server.stop()