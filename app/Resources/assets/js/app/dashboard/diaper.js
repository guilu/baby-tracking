$(function() {
    $('#diaperModal button').fastClick(function () {
        trackEvent($('#diaperModal'), 'Panyal', $(this).data('value'));
        return false;
    });
});