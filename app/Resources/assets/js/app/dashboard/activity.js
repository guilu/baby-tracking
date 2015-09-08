$(function() {
    var activityType;

    $('#actividadModal').on('hidden.bs.modal', function () {
        // Remove temporary buttons
        $('#actividadModal .activity-types button.temporary').remove();

        // Reset all button states
        $('#actividadModal .activity-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Hide all sub options
        $('#actividadModal .activity-options').addClass('hide');
    });

    $('#actividadModal .activity-types button').fastClick(function () {
        // Reset all button states
        $('#actividadModal .activity-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');
            
        if ($(this).data('value') == 'Other') {
            // Prompt for activity name
            var name = prompt('Introduce el nombre de la actividad:');

            if (!name) {
                return false;
            }

            // Create button
            var button = $('<button>').attr('type', 'button')
                .addClass('btn')
                .addClass('btn-lg')
                .addClass('btn-primary')
                .addClass('temporary')
                .data('value', name)
                .html('<i class="fa fa-star"></i> ' + name);

            // Add button to the DOM
            button.insertBefore($(this));

            // Store activity type
            activityType = name;
        } else {
            // Make this button primary
            $(this).removeClass('btn-info').addClass('btn-primary');

            // Store activity type
            activityType = $(this).data('value');
        }

        // Show secondary options
        $('#actividadModal .activity-options').removeClass('hide');

        return false;
    });

    $('#actividadModal button.save').fastClick(function () {
        trackEvent($('#actividadModal'), 'Actividad', activityType, $(this).parent().find('.spinner').data('value'));
        return false;
    });
});