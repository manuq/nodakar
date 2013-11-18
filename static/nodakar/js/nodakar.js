// area en el que se puede diseñar
AREA_IZQUIERDA = 150;
AREA_ARRIBA = 55;
AREA_ANCHO = 310;
AREA_ALTO = 400;

fabric.Object.prototype.borderColor = "rgb(0,255,0)";
fabric.Object.prototype.borderOpacityWhenMoving = 1;
fabric.Object.prototype.cornerColor = "rgb(0,255,0)";
fabric.Object.prototype.cornerSize = 12;
fabric.Object.prototype.transparentCorners = false;

var canvas = new fabric.Canvas('nodakar');

var fondoColor = "/static/nodakar/imagenes/remera-a.png";
var fondoLineas = "/static/nodakar/imagenes/remera.png";
var fondoLogo = "/static/nodakar/imagenes/remera-logo2.png";

var mascara = new fabric.Rect({
    originX: 'left',
    originY: 'top',
    left: AREA_IZQUIERDA,
    top: AREA_ARRIBA,
    width: AREA_ANCHO - 4,
    height: AREA_ALTO - 4,
    selectable: false,
    visible: false,
    opacity: .5,
    stroke: 'rgb(0,255,0)',
    strokeWidth: 4,
    strokeDashArray: [10, 4],
    fill: 'transparent'
});

canvas.add(mascara);
canvas.controlsAboveOverlay = true;
canvas.clipTo = function(ctx) {
    ctx.rect(AREA_IZQUIERDA, AREA_ARRIBA, AREA_ANCHO, AREA_ALTO);
};

canvas.selectionColor = 'transparent';
canvas.selectionBorderColor = 'rgb(0,255,0)';
canvas.selectionLineWidth = 3;

function imagenSVGCargada(objects) {
    var obj = objects[0];
    var color = $("#color").attr("value");
    obj.set({
        'top': canvas.height / 4,
        'left': canvas.width / 2,
        'fill': color
    });
    canvas.add(obj);
    canvas.setActiveObject(obj);
//    canvas.renderAll();
}

// font-family: 'Permanent Marker', cursive;
// font-family: 'Julee', cursive;
// font-family: 'Schoolbell', cursive;
// font-family: 'Merienda One', cursive;

function agregarTexto(texto) {
    var textoObj = new fabric.Text(texto);
    var color = $("#color").attr("value");
    console.log(color);
    textoObj.set({
        'top': canvas.height / 2,
        'left': canvas.width / 2,
        'fontFamily': 'Julee',
        'fill': color
    });
    canvas.add(textoObj);
    return textoObj;
}

function actualizarTexto(nuevoTexto) {
    var obj = canvas.getActiveObject();
    if (obj === null || obj === undefined || obj.type !== 'text') {
        var nuevoObj = agregarTexto(nuevoTexto);
        canvas.setActiveObject(nuevoObj);
    } else {
        obj.set({text: nuevoTexto});
        canvas.renderAll();
    }
}

function colorearSeleccionado(color, opacidad) {
    var obj = canvas.getActiveObject();

    if (obj == null || obj == undefined) {
        return;
    }
    obj.set({fill: color});
    canvas.renderAll();
}

function borrarSeleccionado() {
    var obj = canvas.getActiveObject();
    var group = canvas.getActiveGroup();

    if (obj !== null && obj !== undefined) {
        canvas.discardActiveObject();
        canvas.fxRemove(obj);
    }

    if (group !== null && group !== undefined) {
        canvas.discardActiveGroup();
        group.forEachObject(function (obj) {
            canvas.fxRemove(obj);
        });
    }
}

function subirSeleccionado() {
    var obj = canvas.getActiveObject();

    if (obj !== null && obj !== undefined) {
        obj.bringForward();
    }
}

function bajarSeleccionado() {
    var obj = canvas.getActiveObject();

    if (obj !== null && obj !== undefined) {
        obj.sendBackwards();
    }
}

function frenteSeleccionado() {
    var obj = canvas.getActiveObject();

    if (obj !== null && obj !== undefined) {
        obj.bringToFront();
    }
}

function fondoSeleccionado() {
    var obj = canvas.getActiveObject();

    if (obj !== null && obj !== undefined) {
        obj.sendToBack();
    }
}

function imagenCargada(imagen) {
  var escala_ancho = 1;
  var escala_alto = 1;

  if ((imagen.width - AREA_ANCHO) > 0) {
      escala_ancho = AREA_ANCHO / imagen.width;
  }

  if ((imagen.height - AREA_ALTO) > 0) {
      escala_alto = AREA_ALTO / imagen.height;
  }

  var escala = Math.min(escala_ancho, escala_alto);

  imagen.scale(escala).set({
      'top': canvas.height / 2,
      'left': canvas.width / 2
  });
  canvas.add(imagen).setActiveObject(imagen);
}

function cargarImagen(url) {
    fabric.Image.fromURL(url, imagenCargada);
}

function canvasComoImagen() {
        canvas.deactivateAll().renderAll();

        var canvasImagen = document.getElementById("nodakar");

        var imagenFondoColor = new Image();
        imagenFondoColor.src = fondoColor;

        var imagenFondoLineas = new Image();
        imagenFondoLineas.src = fondoLineas;

        var imagenFondoLogo = new Image();
        imagenFondoLogo.src = fondoLogo;

        var imagen = new Image();
        imagen.src = canvasImagen.toDataURL();

        var canvasSalida = document.createElement('canvas');
        canvasSalida.width = canvasImagen.width;
        canvasSalida.height = canvasImagen.height;

        var ctx = canvasSalida.getContext("2d");
        ctx.drawImage(imagenFondoColor, 0, 0);
        ctx.drawImage(imagenFondoLineas, 0, 0);
        ctx.drawImage(imagenFondoLogo, 0, 0);
        ctx.drawImage(imagen, 0, 0);

        return canvasSalida.toDataURL();
}

// MENU -------------------------------------

document.getElementById("menu-remera").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='remera']").position().top
        }, 800);
    });

document.getElementById("menu-remera2").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='remera']").position().top
        }, 800);
    });

document.getElementById("menu-masinfo").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='mas-info']").position().top
        }, 800);
    });

document.getElementById("menu-hechas").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='hechas']").position().top
        }, 800);
    });

document.getElementById("info-arriba-1").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("#header").position().top
        }, 800);
    });

document.getElementById("info-arriba-2").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("#header").position().top
        }, 800);
    });

document.getElementById("info-arriba-3").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("#header").position().top
        }, 800);
    });


document.getElementById("info-arriba-4").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("#header").position().top
        }, 800);
    });


document.getElementById("info-arriba-5").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("#header").position().top
        }, 800);
    });

document.getElementById("info-arriba-6").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("#header").position().top
        }, 800);
    });

document.getElementById("btn-antecedentes").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='info-antecedentes']").position().top
        }, 800);
    });

document.getElementById("btn-oponemos").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='info-oponemos']").position().top
        }, 800);
    });

document.getElementById("btn-opinion").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='info-opinion']").position().top
        }, 800);
    });

document.getElementById("btn-recorrido").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='info-recorrido']").position().top
        }, 800);
    });

document.getElementById("btn-proyecto").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='info-proyecto']").position().top
        }, 800);
    });

document.getElementById("btn-proyecto2").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='info-proyecto']").position().top
        }, 800);
    });

document.getElementById("btn-documentos").
    addEventListener('click', function (e) {
        $("body, html").animate({
            scrollTop: $("div[name='info-documentos']").position().top
        }, 800);
    });


// UI ---------------------------------------

var textoElem = document.getElementById("texto");
textoElem.addEventListener('keyup', function (e) {
    actualizarTexto(e.target.value);
});

var borrarElem = document.getElementById("btn-borrar");
borrarElem.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    borrarSeleccionado();
});

document.getElementById("btn-subir").
    addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        subirSeleccionado();
    });

document.getElementById("btn-bajar").
    addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        bajarSeleccionado();
    });

// document.getElementById("btn-frente").
//     addEventListener('click', function (e) {
//         e.preventDefault();
//         e.stopPropagation();
//         frenteSeleccionado();
//     });

// document.getElementById("btn-fondo").
//     addEventListener('click', function (e) {
//         e.preventDefault();
//         e.stopPropagation();
//         fondoSeleccionado();
//     });

document.getElementById("btn-fin").
    addEventListener('click', function (e) {
        var inputImagen = document.getElementById("inputImagen");
        inputImagen.value = canvasComoImagen();
    });

var colorRemera = document.getElementById("color-remera");
colorRemera.onchange = function() {
    switch(this.value) {
        case "Blanco":
          fondoColor = "/static/nodakar/imagenes/remera-a.png";
          fondoLogo = "/static/nodakar/imagenes/remera-logo2.png";
          break;
        case "Rojo":
          fondoColor = "/static/nodakar/imagenes/remera-b.png";
          fondoLogo = "/static/nodakar/imagenes/remera-logo1.png";
          break;
        case "Amarillo":
          fondoColor = "/static/nodakar/imagenes/remera-c.png";
          fondoLogo = "/static/nodakar/imagenes/remera-logo1.png";
          break;
        case "Verde":
          fondoColor = "/static/nodakar/imagenes/remera-d.png";
          fondoLogo = "/static/nodakar/imagenes/remera-logo1.png";
          break;
        case "Celeste":
          fondoColor = "/static/nodakar/imagenes/remera-e.png";
          fondoLogo = "/static/nodakar/imagenes/remera-logo1.png";
          break;
        case "Azul":
          fondoColor = "/static/nodakar/imagenes/remera-f.png";
          fondoLogo = "/static/nodakar/imagenes/remera-logo1.png";
          break;
        case "Violeta":
          fondoColor = "/static/nodakar/imagenes/remera-g.png";
          fondoLogo = "/static/nodakar/imagenes/remera-logo1.png";
          break;
    }
    var canvasImagen = document.getElementById("nodakar");
    canvasImagen.style.backgroundImage =
        'url("' + fondoLogo +'"), url("' + fondoLineas +'"), url("' + fondoColor + '")';
};

window.onload = function() {
    $('input[type=file]').bootstrapFileInput();
    $('.selectpicker').selectpicker();
    $("#formu-publicar").validate();

    $('#color').minicolors({
        theme: 'bootstrap',
        defaultValue: '000000',
        change: colorearSeleccionado
    });

    $('#disenios a').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var src = this.getElementsByTagName('img')[0].src;
        // cargarImagen(src);
        fabric.loadSVGFromURL(src, imagenSVGCargada);
    });

    $('#carrusel').carousel({
        interval: 3000,
        pause: "false"
    });

    $("#imagen").change(function (e) {
        var ele = e.originalEvent.target || e.originalEvent.srcElement;
        for (var i = 0; i < ele.files.length; i++) {
            var file = ele.files[i];

            var reader = new FileReader();
            reader.onloadend = function() {
                cargarImagen(reader.result);
            }
            reader.readAsDataURL(file);
        }
    });
}

canvas.on('object:selected', function(e) {
    if (e.target.type === 'text') {
        textoElem.value = e.target.text;
    } else {
        textoElem.value = "";
    }
    $("#color").minicolors("value", e.target.fill);
});

canvas.on('before:selection:cleared', function(e) {
    if (e.target.type === 'text' && e.target.text == '') {
        canvas.remove(e.target);
    }
});

canvas.on('mouse:down', function(e) {
    mascara.bringToFront();
    mascara.set('visible', true);
});

canvas.on('mouse:up', function(e) {
    mascara.set('visible', false);
    canvas.renderAll();
});

canvas.on('selection:cleared', function(e) {
    textoElem.value = "";
});

canvas.on('object:removed', function(e) {
    textoElem.value = "";
});

// MAIN -------------------------------------

// var textoObj = agregarTexto("NO AL DAKAR");
// cargarImagen("/static/logo-pyar.png")
canvas.renderAll();
