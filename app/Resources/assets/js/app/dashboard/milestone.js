$(function() {
    $('#milestoneModal button.save').fastClick(function () {
        var description = $('#milestoneModal textarea').val();

        if (description.length <= 0) {
            alert('Por favor, introduce una descripción:');
            return false;
        } else if (description.length > 255) {
            alert('Máximo 255 caracteres, sorry!');
            return false;
        }

        trackEvent($('#milestoneModal'), 'Milestone', description);
        return false;
    });
});