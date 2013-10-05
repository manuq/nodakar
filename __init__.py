# -*- coding: utf-8 -*-
import os
from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for

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

@app.route('/gracias')
def gracias():
    return render_template('gracias.html')

@app.route('/publicar', methods=["POST"])
def publicar():
    print request.form['nombre'], request.form['correo'], request.form['ciudad'], request.form['provincia'], request.form['pais'], request.form['imagen']
    print request.files
    return redirect(url_for("gracias"))

if __name__ == '__main__':

    if not PRODUCCION:
        app.debug = True

    app.run()
