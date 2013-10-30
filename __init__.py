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
from flask import abort
from flask.ext.login import LoginManager
from flask.ext.login import UserMixin
from flask.ext.login import login_required
from flask.ext.login import login_user
from flask.ext.login import logout_user
from flask.ext.login import current_user

BASE_DE_DATOS = os.path.join(os.path.dirname(__file__), 'nodakar.db')
CARPETA_SUBIDOS = os.path.join(os.path.dirname(__file__), 'media')

# FIXME PROD cambiar
PRODUCCION = False

app = Flask(__name__)
app.config['CARPETA_SUBIDOS'] = CARPETA_SUBIDOS

# FIXME PROD cambiar
app.config['URL_SUBIDOS'] = "http://0.0.0.0:8000/"
app.config['URL_SITIO'] = "http://0.0.0.0:5000/"

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

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "entrar"

class Usuario(UserMixin):
    def __init__(self, id_usuario):
        UserMixin.__init__(self)
        self.id = id_usuario

    def get_id(self):
        return self.id

usuario_admin = Usuario(u'admin')

@login_manager.user_loader
def cargar_usuario(id_usuario):
    return usuario_admin

@app.route('/admin')
@login_required
def admin():
    cur = get_db().cursor()
    cur.execute("select * from nodakar")
    datos = cur.fetchall()
    return render_template('admin.html', datos=datos, usuario=current_user, viendo_lista=True)

def se_autoriza(formu):
    # FIXME PROD cambiar
    return formu['username'].strip() == 'admin'

@app.route("/admin/entrar", methods=["GET", "POST"])
def entrar():
    if request.method == 'POST':
        if se_autoriza(request.form):
            login_user(usuario_admin)
            return redirect(request.args.get("next") or url_for("admin"))

    return render_template("entrar.html", usuario=current_user)

@app.route("/admin/salir")
@login_required
def salir():
    logout_user()
    return redirect(url_for('index'))

@app.route('/')
def index():
    cur = get_db().cursor()
    cur.execute('select id_remera from nodakar ' +
                'where censurada=0 ' +
                'order by random() limit 5')
    hechas = []
    for dato in cur.fetchall():
        hechas.append(dato[0])

    return render_template('index.html', hechas=hechas, usuario=current_user)

@app.route('/remera/<id_remera>')
def remera(id_remera):
    cur = get_db().cursor()
    if current_user.is_authenticated():
        cur.execute('select * from nodakar ' +
                    'where id_remera=?', (id_remera,))
    else:
        cur.execute('select * from nodakar ' +
                    'where id_remera=? and censurada=0', (id_remera,))
    datos = cur.fetchone()
    if datos == None:
        abort(404)

    nombre = datos[2]
    censurada = datos[7]

    return render_template('remera.html', nombre=nombre, censurada=censurada,
                           id_remera=id_remera, usuario=current_user)

@app.route("/admin/bloquear/<id_remera>")
@login_required
def bloquear(id_remera):
    cur = get_db().cursor()
    cur.execute('update nodakar set censurada=1 ' +
                'where id_remera=?', (id_remera,))
    get_db().commit()

    return redirect(url_for('admin'))

@app.route("/admin/desbloquear/<id_remera>")
@login_required
def desbloquear(id_remera):
    cur = get_db().cursor()
    cur.execute('update nodakar set censurada=0 ' +
                'where id_remera=?', (id_remera,))
    get_db().commit()

    return redirect(url_for('admin'))

@app.route('/publicar', methods=["POST"])
def publicar():

    # hacer un archivo de nombre unico para la imagen
    id_remera = None
    nombre_archivo = None
    while nombre_archivo is None:
        id_remera = str(uuid.uuid4())[:8]
        nombre = os.path.join(app.config['CARPETA_SUBIDOS'], id_remera + '.png')
        if not os.path.exists(nombre):
            nombre_archivo = nombre

    archivo = open(nombre_archivo, "wb")

    # guardar los datos de la imagen en el archivo
    datos_imagen = request.form['imagen']
    encabezado, cuerpo = datos_imagen.split(',')
    archivo.write(cuerpo.decode('base64'))
    archivo.close()

    datos = (None, id_remera, request.form['nombre'], request.form['correo'],
             request.form['ciudad'], request.form['provincia'],
             request.form['pais'], False)

    cur = get_db().cursor()
    cur.execute('insert into nodakar values (?,?,?,?,?,?,?,?)', datos)
    get_db().commit()

    return redirect(url_for("remera", id_remera=id_remera))

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

if __name__ == '__main__':

    if not PRODUCCION:
        app.debug = True

    app.run()
