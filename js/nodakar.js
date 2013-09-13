var canvas = new fabric.Canvas('nodakar');

function agregarTexto(texto) {
    var textoObj = new fabric.Text(texto);
    textoObj.set({'top': canvas.height / 2,
                  'left': canvas.width / 2});
    canvas.add(textoObj);
    return textoObj;
}

// UI ---------------------------------------

ENTER_KEY = 13;

var textoElem = document.getElementById("texto");
textoElem.addEventListener('keypress', function (e) {
    if (e.keyCode === ENTER_KEY) {
        var obj = canvas.getActiveObject();
        if (obj === null) {
            agregarTexto(e.target.value);
        } else {
            obj.text = e.target.value;
            canvas.renderAll();
        }
    }
});

canvas.on('object:selected', function(e) {
    textoElem.value = e.target.text;
});

canvas.on('selection:cleared', function(e) {
    textoElem.value = "";
});

// MAIN -------------------------------------

var textoObj = agregarTexto("NO AL DAKAR");
