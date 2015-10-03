$(function() {
    var feedType;

    $('#lecheModal').on('hidden.bs.modal', function () {
        // Reset all button states
        $('#lecheModal .feed-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Hide all sub options
        $('#lecheModal .bottle-options').addClass('hide');
        $('#lecheModal .time-options').addClass('hide');
    });

    $('#lecheModal .feed-types button').fastClick(function () {
        console.log()
        // Reset all button states
        $('#lecheModal .feed-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Make this button primary
        $(this).removeClass('btn-info').addClass('btn-primary');

        if ($(this).data('value') == 'izquierda' || $(this).data('value') == 'derecha') {
            $('#lecheModal .time-options').removeClass('hide');
            $('#lecheModal .bottle-options').addClass('hide');
        } else {
            $('#lecheModal .bottle-options').removeClass('hide');
            $('#lecheModal .time-options').addClass('hide');
        }

        feedType = $(this).data('value');

        return false;
    });

    $('#lecheModal button.save').fastClick(function () {
        trackEvent($('#lecheModal'), 'Leche', feedType, $(this).parent().find('.spinner').data('value'));
        return false;
    });
});