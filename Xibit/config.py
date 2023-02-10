import sshtunnel

class Config():

    def __init__(self):
        openSSH()


    def openSSH(self):
    server = sshtunnel.SSHTunnelForwarder(('xibitdb.darragh.container.netsoc.cloud', 16850),
    ssh_username='root',
    ssh_password='teamprojectteam8',
    remote_bind_address=('127.0.0.1', 3306))
    server.start()

