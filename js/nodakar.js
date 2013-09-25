var canvas = new fabric.Canvas('nodakar');
canvas.on("after:render", function(){canvas.calcOffset();});

function imagenCargada(objects) {
    var obj = objects[0];
    obj.set({'top': canvas.height / 4,
             'left': canvas.width / 2});
    canvas.add(obj);
//    canvas.calcOffset();
    canvas.renderAll();
}

fabric.loadSVGFromURL("../imagenes/nodakar2.svg", imagenCargada);


function agregarTexto(texto) {
    var textoObj = new fabric.Text(texto);
    textoObj.set({'top': canvas.height / 2,
                  'left': canvas.width / 2});
    canvas.add(textoObj);
    return textoObj;
}

function actualizarTexto(nuevoTexto) {
    var obj = canvas.getActiveObject();
    if (obj === null || obj === undefined) {
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
    textoElem.value = e.target.text;
});

canvas.on('selection:cleared', function(e) {
    textoElem.value = "";
});

// MAIN -------------------------------------

var textoObj = agregarTexto("NO AL DAKAR");
