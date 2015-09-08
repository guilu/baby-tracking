$('#list-button').fastClick(function() {
    if ($('.card').hasClass('flipped')) {
        // Flip back
        $('.card').removeClass('flipped');

        // Clear existing data
        $('.face.back table').html('');

        // Update flip button icon
        $(this).find('i').removeClass('icon-arrow-left').addClass('icon-list');
    } else {
        // Flip
        $('.card').addClass('flipped');

        // Update flip button icon
        $(this).find('i').removeClass('icon-list').addClass('icon-arrow-left');

        // Clear existing data
        $('.face.back table').html('');

        // Fetch list of events
        $.get('/track/list', function (events) {
            $.each(events, function (index, event) {
                var row = $('<tr>');

                var formattedEvent = formatEvent(event);
                row.append($('<td>').html($('<i>').addClass(event.type.icon)).append(' ' + event.type.name));
                row.append($('<td>').html(event.time));
                row.append($('<td>').html(formattedEvent.description));
                row.append($('<td>').html(formattedEvent.value));

                $('.face.back table').append(row);
            });
        });
    }

    return false;
});
