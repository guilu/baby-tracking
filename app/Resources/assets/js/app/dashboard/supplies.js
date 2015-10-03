$(function() {
    var suppliesType;

    $('#suministrosModal').on('hidden.bs.modal', function () {
        // Remove temporary buttons
        $('#suministrosModal .supplies-types button.temporary').remove();

        // Reset all button states
        $('#suministrosModal .supplies-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Hide all sub options
        $('#suministrosModal .supplies-options').addClass('hide');
    });

    $('#suministrosModal .supplies-types button').fastClick(function () {
        // Reset all button states
        $('#suministrosModal .supplies-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        if ($(this).data('value') == 'otros') {
            // Prompt for supplies name
            var name = prompt('Introduce el nombre:');

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
                .html('<i class="icon-star"></i> ' + name);

            // Add button to the DOM
            button.insertBefore($(this));

            // Store supplies type
            suppliesType = name;
        } else {
            // Make this button primary
            $(this).removeClass('btn-info').addClass('btn-primary');

            // Store supplies type
            suppliesType = $(this).data('value');
        }

        // Show secondary options
        $('#suministrosModal .supplies-options').removeClass('hide');

        return false;
    });

    $('#suministrosModal button.save').fastClick(function () {
        trackEvent($('#suministrosModal'), 'Suministros', suppliesType, $(this).parent().find('.spinner').data('value'));
        return false;
    });
});