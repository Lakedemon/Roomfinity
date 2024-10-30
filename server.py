from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
import threading

PORT = 8000

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()
        

server = HTTPServer(('localhost', PORT), CORSRequestHandler)

def run():
    server.serve_forever()

threading.Thread(target=run).start()
webbrowser.open('http://localhost:{PORT}/src/a_landing/LandingPage.html'.format(PORT=PORT))