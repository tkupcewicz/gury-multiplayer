import thread
import webbrowser
from random import randint
import SimpleHTTPServer
import SocketServer

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket


class GuryWS(WebSocket):

    def handleMessage(self):
        pass

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')


def start_ws(port):
    server = SimpleWebSocketServer('', port, GuryWS)
    server.serveforever()


def start_webserver(port):
    httpd = SocketServer.TCPServer(("", port), SimpleHTTPServer.SimpleHTTPRequestHandler)
    webbrowser.open_new_tab('http://127.0.0.1:' + str(port) + '/game/index.html')
    httpd.serve_forever()


p = randint(9000, 10000)
thread.start_new_thread(start_ws, (10999,))
thread.start_new_thread(start_webserver, (p,))

while True:
    pass