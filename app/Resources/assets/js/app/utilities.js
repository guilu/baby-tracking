function formatEvent(event) {
    console.log(event);
    var result = {};

    // Depending on the input event object the event name may have a different property acessor
    var eventTypeName = event.type.name || event.type;

    // Set default values
    result.description = '';
    result.value = '';

    switch (eventTypeName) {
        case 'Leche':
            result.description = eventTypeName + ' (' + event.subtype + ')';
            result.value = (event.subtype == 'izquierda' || event.subtype == 'derecha') ? event.value + ' min.' : event.value + ' ml';
            break;

        case 'Sacaleche':
            result.description = 'Sacaleche ' + event.subtype;
            result.value = event.value + ' ml';
            break;

        case 'Panyal':
            result.description = 'Cambiado un pañal ' + (event.subtype == 'both' ? 'mojado y sucio' : event.subtype);
            break;

        case 'Dormir':
            result.description = (event.subtype == 'start') ? 'Inicio dormir' : 'Fin dormir';
            if (event.value) {
                if (event.value > 60) {
                    result.value = Math.floor(event.value / 60) + ' horas';
                } else {
                    result.value = event.value + ' min.';
                }
            }
            break;

        case 'Actividad':
            result.description = 'Actividad ' + event.subtype;
            result.value = event.value + ' min.';
            break;

        case 'Medicina':
        case 'Hito':
        case 'Nota':
            result.description = event.subtype;
            break;

        case 'Comida':
            result.description = 'Ha comido ' + event.subtype;
            break;

        case 'Baño':
            result.description = 'Un baño refrescante!';
            break;

        case 'Suministros':
            result.description = event.subtype;
            result.value = event.value + ' unidades.';
            break;
    }

    // Upper case first letter
    result.description = result.description.charAt(0).toUpperCase() + result.description.substr(1);

    return result;
}