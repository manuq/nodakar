# -*- coding: utf-8 -*-
import os
import sqlite3
import uuid

from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask import g

BASE_DE_DATOS = os.path.join(os.path.dirname(__file__), 'nodakar.db')
CARPETA_SUBIDOS = os.path.join(os.path.dirname(__file__), 'media')


PRODUCCION = False

app = Flask(__name__)
app.config['CARPETA_SUBIDOS'] = CARPETA_SUBIDOS

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

    # hacer un archivo de nombre unico para la imagen
    nombre_archivo = None
    nombre_con_subdir = None
    while nombre_archivo is None:
        nombre = str(uuid.uuid4())[:8] + '.png'
        nombre_con_subdir = os.path.join(app.config['CARPETA_SUBIDOS'], nombre)
        if not os.path.exists(nombre_con_subdir):
            nombre_archivo = nombre

    archivo = open(nombre_con_subdir, "wb")

    datos_imagen = request.form['imagen']
    encabezado, cuerpo = datos_imagen.split(',')
    archivo.write(cuerpo.decode('base64'))
    archivo.close()

    datos = (None, request.form['nombre'], request.form['correo'],
             request.form['ciudad'], request.form['provincia'],
             request.form['pais'], nombre_archivo)

    cur = get_db().cursor()
    cur.execute('insert into nodakar values (?,?,?,?,?,?,?)', datos)
    get_db().commit()

    return redirect(url_for("gracias"))

if __name__ == '__main__':

    if not PRODUCCION:
        app.debug = True

    app.run()
