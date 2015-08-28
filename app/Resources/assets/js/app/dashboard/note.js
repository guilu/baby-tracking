$(function() {
    $('#noteModal button.save').fastClick(function () {
        var description = $('#noteModal textarea').val();

        if (description.length <= 0) {
            alert('Por favor escribe una nota:');
            return false;
        } else if (description.length > 255) {
            alert('Max 255 caracteres, lo siento!');
            return false;
        }

        trackEvent($('#noteModal'), 'Note', description);
        return false;
    });
});