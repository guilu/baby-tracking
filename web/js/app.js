// Hide address bar on mobile devices
function hideAddressBar()
{
    if (!window.location.hash)
    {
        if (document.height < window.outerHeight)
        {
            document.body.style.height = (window.outerHeight + 50) + 'px';
        }

        setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
    }
}

window.addEventListener("load", function() { if (!window.pageYOffset) { hideAddressBar(); } });
window.addEventListener("orientationchange", hideAddressBar );
function formatEvent(event) {
    var result = {};

    // Depending on the input event object the event name may have a different property acessor
    var eventTypeName = event.type.name || event.type;

    // Set default values
    result.description = '';
    result.value = '';

    switch (eventTypeName) {
        case 'Milk':
            result.description = eventTypeName + ' (' + event.subtype + ')';
            result.value = (event.subtype == 'left' || event.subtype == 'right') ? event.value + ' min.' : event.value + ' ml';
            break;

        case 'Pump':
            result.description = 'Sacaleche ' + event.subtype;
            result.value = event.value + ' ml';
            break;

        case 'Diaper':
            result.description = 'Cambiado un pañal ' + (event.subtype == 'both' ? 'mojado y sucio' : event.subtype);
            break;

        case 'Sleep':
            result.description = (event.subtype == 'start') ? 'Inicio dormir' : 'Fin dormir';
            if (event.value) {
                if (event.value > 60) {
                    result.value = Math.floor(event.value / 60) + ' horas';
                } else {
                    result.value = event.value + ' min.';
                }
            }
            break;

        case 'Activity':
            result.description = 'Actividad ' + event.subtype;
            result.value = event.value + ' min.';
            break;

        case 'Medicine':
        case 'Milestone':
        case 'Note':
            result.description = event.subtype;
            break;

        case 'Food':
            result.description = 'Ha comido ' + event.subtype;
            break;

        case 'Bath':
            result.description = 'Un baño refrescante!';
            break;

        case 'Supplies':
            result.description = event.subtype;
            result.value = event.value + ' unidades.';
            break;
    }

    // Upper case first letter
    result.description = result.description.charAt(0).toUpperCase() + result.description.substr(1);

    return result;
}