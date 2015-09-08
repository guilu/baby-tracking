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
$(function() {
    $('.eventbutton-banyo').fastClick(function () {
        trackEvent(null, 'Banyo');
        return false;
    });
});
$(function() {
    $('#diaperModal button').fastClick(function () {
        trackEvent($('#diaperModal'), 'Panyal', $(this).data('value'));
        return false;
    });
});
$(function() {
    var feedType;

    $('#milkModal').on('hidden.bs.modal', function () {
        // Reset all button states
        $('#milkModal .feed-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Hide all sub options
        $('#milkModal .bottle-options').addClass('hide');
        $('#milkModal .time-options').addClass('hide');
    });

    $('#milkModal .feed-types button').fastClick(function () {
        console.log()
        // Reset all button states
        $('#milkModal .feed-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Make this button primary
        $(this).removeClass('btn-info').addClass('btn-primary');

        if ($(this).data('value') == 'left' || $(this).data('value') == 'right') {
            $('#milkModal .time-options').removeClass('hide');
            $('#milkModal .bottle-options').addClass('hide');
        } else {
            $('#milkModal .bottle-options').removeClass('hide');
            $('#milkModal .time-options').addClass('hide');
        }

        feedType = $(this).data('value');

        return false;
    });

    $('#milkModal button.save').fastClick(function () {
        trackEvent($('#milkModal'), 'Leche', feedType, $(this).parent().find('.spinner').data('value'));
        return false;
    });
});
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

$(function() {
    $('#foodModal .food-types button').fastClick(function () {
        var foodType;

        var refresh = false;
        if ($(this).data('value') == 'Otros') {
            foodType = prompt('Inserta el nombre de la comida:');
            refresh = true;

            if (!foodType) {
                return false;
            }
        } else {
            foodType = $(this).data('value');
        }

        trackEvent($('#foodModal'), 'Comida', foodType, '', refresh);

        return false;
    });
});
$(function() {
    if ($('#dashboard').length) {
        updateLastEvent();
        setInterval('updateLastEvent()', 10000);
    }
});

/**
 * Pinta las badges de los eventos primary con el tiempo que ha pasado desde la ultima vez
 */
function updateLastEvent()
{
    $.get('track/stats', function (response) {
        $('.eventbutton-milk').find('.badge').html(response.leche.time);
        $('.eventbutton-pump').find('.badge').html(response.sacaleche.time);
        $('.eventbutton-diaper').find('.badge').html(response.panyal.time);
        $('.eventbutton-food').find('.badge').html(response.comida.time);

        if (response.dormir.type == 'start') {
            if ($('.sleep-items').hasClass('hide')) {
                $('.sleep-items').removeClass('hide');
                $('body, .face.front').animate({ backgroundColor: '#D8D8D8' });
            }
        } else {
            if (!$('.sleep-items').hasClass('hide')) {
                $('.sleep-items').addClass('hide');
                $('body, .face.front').animate({ backgroundColor: '#FFF' });
            }
        }
    });
}
$(function() {
    $('#medicineModal .medicine-types button').fastClick(function () {
        var medicineType;

        var refresh = false;
        if ($(this).data('value') == 'Otra') {
            medicineType = prompt('Introduce el nombre:');
            refresh = true;

            if (!medicineType) {
                return false;
            }
        } else {
            medicineType = $(this).data('value');
        }

        trackEvent($('#medicineModal'), 'Medicina', medicineType, '', refresh);

        return false;
    });
});
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

        trackEvent($('#milestoneModal'), 'Hito', description);
        return false;
    });
});
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

        trackEvent($('#noteModal'), 'Nota', description);
        return false;
    });
});
function showNotification(event, error) {
  error = error || false;

  var formattedEvent = formatEvent(event);
  var selector = error ? '#error-notification' : '#success-notification';

  if (!error) {
    if (event.reverted) {
      $(selector + ' .lead strong').html('Corregido:');
      $(selector + ' .undo').hide();
      $(selector).removeClass('alert-info')
        .addClass('alert-warning');
    } else {
      $(selector + ' .lead strong').html('Guardado:');
      $(selector + ' .undo').show();
      $(selector).removeClass('alert-warning')
        .addClass('alert-info');
    }
  }

  // Set notification name
  $(selector + ' .event-type').html(formattedEvent.description);

  // Set event id
  $(selector).data('event-id', event.id);

  // Set default CSS, show and animate down
  $(selector)
    .stop()
    .css('top', '-500px')
    .show()
    .animate({ top: '0px' })
    .delay(8000) // Hide after 8 seconds
    .animate({ top: '-500px' });
}

$('#success-notification .undo').fastClick(function () {
  deleteEvent($('#success-notification').data('event-id'));

  return false;
});

$('#detailsModal button.save').fastClick(function () {
  updateEvent($('#success-notification').data('event-id'), $(this).parent().find('.spinner').data('value'));
  $('#detailsModal').modal('hide');
  
  return false;
});
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
$(function() {
    $('.eventbutton-dormir').fastClick(function () {
        trackEvent(null, 'Dormir');
        return false;
    });
});
$(function () {
    $('.spinner .spinner-left').fastClick(function () {
        var currentValue = $(this).parent().data('value');
        var step = $(this).parent().data('step');

        var newValue = currentValue -= step;

        if (newValue > 0) {
            $(this).parent().data('value', newValue);
            $(this).parent().find('.amount').html(formatDecimal(newValue));
        }
    });

    $('.spinner .spinner-right').fastClick(function () {
        var currentValue = $(this).parent().data('value');
        var step = $(this).parent().data('step');

        var newValue = currentValue += step;

        $(this).parent().data('value', newValue);
        $(this).parent().find('.amount').html(formatDecimal(newValue));
    });
});

function formatDecimal(value) {
    var integerPart = Math.floor(value);
    var decimalPart = value - integerPart;

    if (decimalPart == 0.25) {
        return integerPart + '&frac14;';
    } else if (decimalPart == 0.5) {
        return integerPart + '&frac12;';
    } else if (decimalPart == 0.75) {
        return integerPart + '&frac13;';
    } else {
        return value;
    }
}
$(function() {
    var suppliesType;

    $('#suppliesModal').on('hidden.bs.modal', function () {
        // Remove temporary buttons
        $('#suppliesModal .supplies-types button.temporary').remove();

        // Reset all button states
        $('#suppliesModal .supplies-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Hide all sub options
        $('#suppliesModal .supplies-options').addClass('hide');
    });

    $('#suppliesModal .supplies-types button').fastClick(function () {
        // Reset all button states
        $('#suppliesModal .supplies-types button')
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
        $('#suppliesModal .supplies-options').removeClass('hide');

        return false;
    });

    $('#suppliesModal button.save').fastClick(function () {
        trackEvent($('#suppliesModal'), 'Suministros', suppliesType, $(this).parent().find('.spinner').data('value'));
        return false;
    });
});
function trackEvent(activeModal, type, subtype, value, refresh)
{
    type = type || '';
    subtype = subtype || '';
    value = value || '';
    refresh = refresh || false;

    if (activeModal) {
        // Create and add loading indicator
        var spinner = $('<i>')
            .addClass('fa fa-spinner')
            .addClass('fa fa-spin')
            .addClass('fa fa-2x');

            activeModal.find('.modal-body').append(spinner);
    }

    // Perform AJAX request
    $.post('track/new', {
        type: type,
        subtype: subtype,
        value: value
    }, function (response) {
        // Remove loading indicator
        if (spinner)
            spinner.remove();

        // Show response
        if (response.success && response.success == true) {
            showNotification(response.event);
            
            if (activeModal)
                activeModal.modal('hide');
            
            updateLastEvent(); // Update the last feed/pump/diaper stats

            if (refresh) {
                window.location.reload();
            }
        } else {
            showNotification(type, true);
        }
    });
}

function deleteEvent(eventId)
{
    // Perform AJAX request
    $.post('track/delete', {
        id: eventId
    }, function (response) {
        // Show response
        if (response.success && response.success == true) {
            showNotification(response.event);
            
            updateLastEvent(); // Update the last feed/pump/diaper stats
        } else {
            showNotification(type, true);
        }
    });
}

function updateEvent(eventId, minutes)
{
    // Perform AJAX request
    $.post('track/update', {
        id: eventId,
        minutes: minutes
    }, function (response) {
        // Show response
        if (response.success && response.success == true) {
            showNotification(response.event);
            
            updateLastEvent(); // Update the last feed/pump/diaper stats
        } else {
            showNotification(type, true);
        }
    });
}