$(function() {
    var activityType;

    $('#activityModal').on('hidden.bs.modal', function () {
        // Remove temporary buttons
        $('#activityModal .activity-types button.temporary').remove();

        // Reset all button states
        $('#activityModal .activity-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Hide all sub options
        $('#activityModal .activity-options').addClass('hide');
    });

    $('#activityModal .activity-types button').fastClick(function () {
        // Reset all button states
        $('#activityModal .activity-types button')
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
        $('#activityModal .activity-options').removeClass('hide');

        return false;
    });

    $('#activityModal button.save').fastClick(function () {
        trackEvent($('#activityModal'), 'Activity', activityType, $(this).parent().find('.spinner').data('value'));
        return false;
    });
});
$(function() {
    $('.eventbutton-bath').fastClick(function () {
        trackEvent(null, 'Bath');
        return false;
    });
});
$(function() {
    $('#diaperModal button').fastClick(function () {
        trackEvent($('#diaperModal'), 'Diaper', $(this).data('value'));
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
        trackEvent($('#milkModal'), 'Milk', feedType, $(this).parent().find('.spinner').data('value'));
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
            result.description = 'Pumped ' + event.subtype;
            result.value = event.value + ' ml';
            break;

        case 'Diaper':
            result.description = 'Cambio de pañal ' + (event.subtype == 'both' ? 'humedo y sucio' : event.subtype);
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
            result.description = event.subtype + ' activity';
            result.value = event.value + ' min.';
            break;

        case 'Medicine':
        case 'Milestone':
        case 'Note':
            result.description = event.subtype;
            break;

        case 'Food':
            result.description = 'Comió ' + event.subtype;
            break;

        case 'Bath':
            result.description = 'Un baño refrescante!';
            break;

        case 'Supplies':
            result.description = event.subtype;
            result.value = event.value + ' items.';
            break;
    }

    // Upper case first letter
    result.description = result.description.charAt(0).toUpperCase() + result.description.substr(1);

    return result;
}
$(function() {
    $('#foodModal .food-types button').fastClick(function () {
        var foodType;

        var refresh = false;
        if ($(this).data('value') == 'Other') {
            foodType = prompt('Enter food name:');
            refresh = true;

            if (!foodType) {
                return false;
            }
        } else {
            foodType = $(this).data('value');
        }

        trackEvent($('#foodModal'), 'Food', foodType, '', refresh);

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
        $('.eventbutton-milk').find('.badge').html(response.milk.time);
        $('.eventbutton-pump').find('.badge').html(response.pump.time);
        $('.eventbutton-diaper').find('.badge').html(response.diaper.time);
        $('.eventbutton-food').find('.badge').html(response.food.time);

        if (response.sleep.type == 'start') {
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
        if ($(this).data('value') == 'Other') {
            medicineType = prompt('Enter name:');
            refresh = true;

            if (!medicineType) {
                return false;
            }
        } else {
            medicineType = $(this).data('value');
        }

        trackEvent($('#medicineModal'), 'Medicine', medicineType, '', refresh);

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

        trackEvent($('#milestoneModal'), 'Milestone', description);
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

        trackEvent($('#noteModal'), 'Note', description);
        return false;
    });
});
function showNotification(event, error) {
  error = error || false;

  var formattedEvent = formatEvent(event);
  var selector = error ? '#error-notification' : '#success-notification';

  if (!error) {
    if (event.reverted) {
      $(selector + ' .lead strong').html('Reverted:');
      $(selector + ' .undo').hide();
      $(selector).removeClass('alert-info')
        .addClass('alert-warning');
    } else {
      $(selector + ' .lead strong').html('Saved:');
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

    $('#pumpModal').on('hidden.bs.modal', function () {
        // Reset all button states
        $('#pumpModal .pump-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Hide all sub options
        $('#pumpModal .pump-options').addClass('hide');
    });

    $('#pumpModal .pump-types button').fastClick(function () {
        // Reset all button states
        $('#pumpModal .pump-types button')
            .removeClass('btn-primary')
            .removeClass('btn-info')
            .addClass('btn-info');

        // Make this button primary
        $(this).removeClass('btn-info').addClass('btn-primary');

        $('#pumpModal .pump-options').removeClass('hide');

        pumpType = $(this).data('value');

        return false;
    });

    $('#pumpModal button.save').fastClick(function () {
        trackEvent($('#pumpModal'), 'Pump', pumpType, $(this).parent().find('.spinner').data('value'));
        return false;
    });
});
$(function() {
    $('.eventbutton-sleep').fastClick(function () {
        trackEvent(null, 'Sleep');
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

        if ($(this).data('value') == 'other') {
            // Prompt for supplies name
            var name = prompt('Enter name:');

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
        trackEvent($('#suppliesModal'), 'Supplies', suppliesType, $(this).parent().find('.spinner').data('value'));
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