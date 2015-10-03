$(function() {
    $('#panyalModal button').fastClick(function () {
        trackEvent($('#panyalModal'), 'Panyal', $(this).data('value'));
        return false;
    });
});