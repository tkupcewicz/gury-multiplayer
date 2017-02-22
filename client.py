import thread
import socket
import webbrowser

from random import randint
from sys import argv

import Queue
import SimpleHTTPServer
import SocketServer

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

q = Queue.Queue()


class GuryWS(WebSocket):
    def handleMessage(self):
        print('WS received: ', self.data)
        q.put(self.data)

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')


def start_ws(port):
    server.serveforever()


def start_webserver(port, port_ws):
    webbrowser.open_new_tab('http://127.0.0.1:' + str(port) + '/game/index.html?' + str(port_ws))
    httpd.serve_forever()


if __name__ == '__main__':
    if len(argv) < 3:
        print('Not enought arguments! Example: client.py 8.8.8.8 4444')
    else:
        p = randint(9000, 10000)
        p2 = randint(8000, 9000)
        server = SimpleWebSocketServer('', p2, GuryWS)
        httpd = SocketServer.TCPServer(("", p), SimpleHTTPServer.SimpleHTTPRequestHandler)
        thread.start_new_thread(start_ws, (10999,))
        thread.start_new_thread(start_webserver, (p, p2))
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((argv[1], int(argv[2])))
        while True:
            data = s.recv(100)
            print('TCP received:', data)
            if data:
                for i in server.connections:
                    server.connections[i].sendMessage(data)

            if not q.empty():
                ws_data = q.get_nowait()
                s.send(ws_data)
                print('TCP sending:', ws_data)


