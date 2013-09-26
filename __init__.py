# -*- coding: utf-8 -*-
import os
from flask import Flask
from flask import render_template

PRODUCCION = False

app = Flask(__name__)

class WebFactionMiddleware(object):
    def __init__(self, app):
        self.app = app
    def __call__(self, environ, start_response):
        environ['SCRIPT_NAME'] = '/no-al-dakar'
        return self.app(environ, start_response)

if PRODUCCION:
    app.wsgi_app = WebFactionMiddleware(app.wsgi_app)

# FIXME PROD cambiar
# >>> import os
# >>> os.urandom(24)
app.secret_key = "unodostres"

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':

    if not PRODUCCION:
        app.debug = True

    app.run()
