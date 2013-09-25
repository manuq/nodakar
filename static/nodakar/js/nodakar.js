fabric.Object.prototype.borderColor = "rgb(0,255,0)";
fabric.Object.prototype.cornerColor = "rgb(0,255,0)";
fabric.Object.prototype.cornerSize = 12;
fabric.Object.prototype.transparentCorners = false;

var canvas = new fabric.Canvas('nodakar');
//var mascara = new fabric.Rect({ top: 280, left: 305, width: 310, height: 450, opacity: .2, fill: '#0ff' });
//canvas.add(mascara);
canvas.controlsAboveOverlay = true;
canvas.clipTo = function(ctx) {
    ctx.rect(150, 55, 310, 450);
};

canvas.selectionColor = 'rgba(100,255,100,0.3)';
canvas.selectionBorderColor = 'rgb(0,255,0)';
canvas.selectionLineWidth = 3;

function imagenCargada(objects) {
    var obj = objects[0];
    obj.set({'top': canvas.height / 4,
             'left': canvas.width / 2});
    canvas.add(obj);
    canvas.renderAll();
}

fabric.loadSVGFromURL("/static/nodakar/imagenes/nodakar2.svg", imagenCargada);

// font-family: 'Permanent Marker', cursive;
// font-family: 'Julee', cursive;
// font-family: 'Schoolbell', cursive;
// font-family: 'Merienda One', cursive;

function agregarTexto(texto) {
    var textoObj = new fabric.Text(texto);
    textoObj.set({'top': canvas.height / 2,
                  'left': canvas.width / 2,
                 'fontFamily': 'Julee'});
    canvas.add(textoObj);
    return textoObj;
}

function actualizarTexto(nuevoTexto) {
    var obj = canvas.getActiveObject();
    if (obj === null || obj === undefined || obj.type !== 'text') {
        var nuevoObj = agregarTexto(nuevoTexto);
        canvas.setActiveObject(nuevoObj);
    } else {
        obj.text = nuevoTexto;
        canvas.renderAll();
    }
}

// UI ---------------------------------------

ENTER_KEY = 13;

var textoElem = document.getElementById("texto");
textoElem.addEventListener('keyup', function (e) {
    actualizarTexto(e.target.value);
});

canvas.on('object:selected', function(e) {
    if (e.target.type === 'text') {
        textoElem.value = e.target.text;
    } else {
        textoElem.value = "";
    }
});

canvas.on('selection:cleared', function(e) {
    textoElem.value = "";
});

// MAIN -------------------------------------

var textoObj = agregarTexto("NO AL DAKAR");
canvas.renderAll();
