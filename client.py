# coding: utf-8
import thread
import socket
import webbrowser

from random import randint
from sys import argv

import Queue
import SimpleHTTPServer
import SocketServer

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

q = Queue.Queue(maxsize=0)


class GuryWS(WebSocket):
    def handleMessage(self):
        print('WS received: ', self.data)
        q.put_nowait('$' + self.data)

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
        s.settimeout(0.01)
        while True:
            try:
                data = s.recv(100)
                if data:
                    for d in data.split('$'):
                        print('TCP received:', d)
                        for i in server.connections:
                            server.connections[i].sendMessage(unicode(d))
            except socket.timeout:
                pass
            except KeyboardInterrupt:
                quit()
            if not q.empty():
                ws_data = q.get()
                s.send(ws_data)
                print('TCP sending:', ws_data)


