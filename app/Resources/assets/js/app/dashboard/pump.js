$(function() {
    var pumpType;

    $('#sacalecheModal').on('hidden.bs.modal', function () {
        // Reset all button states
        $('#sacalecheModal .pump-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Hide all sub options
        $('#sacalecheModal .pump-options').addClass('hide');
    });

    $('#sacalecheModal .pump-types button').fastClick(function () {
        // Reset all button states
        $('#sacalecheModal .pump-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Make this button primary
        $(this).removeClass('btn-info').addClass('btn-primary');

        $('#sacalecheModal .pump-options').removeClass('hide');

        pumpType = $(this).data('value');

        return false;
    });

    $('#sacalecheModal button.save').fastClick(function () {
        trackEvent($('#sacalecheModal'), 'Sacaleche', pumpType, $(this).parent().find('.spinner').data('value'));
        return false;
    });
});