# -*- coding: utf-8 -*-
import os
import sqlite3

from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask import g

BASE_DE_DATOS = os.path.join(os.path.dirname(__file__), 'nodakar.db')

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

# FIXME PROD generar
# >>> from __init__ import init_db
# >>> init_db()
def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
            db.commit()

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(BASE_DE_DATOS)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/gracias')
def gracias():
    return render_template('gracias.html')

@app.route('/publicar', methods=["POST"])
def publicar():
    # FIXME guardar imagen en disco
    # request.form['imagen']

    datos = (None, request.form['nombre'], request.form['correo'],
             request.form['ciudad'], request.form['provincia'],
             request.form['pais'], "/media/asd")

    cur = get_db().cursor()
    cur.execute('insert into nodakar values (?,?,?,?,?,?,?)', datos)
    get_db().commit()

    return redirect(url_for("gracias"))

if __name__ == '__main__':

    if not PRODUCCION:
        app.debug = True

    app.run()
