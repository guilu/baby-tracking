$(function() {
    $('.eventbutton-dormir').fastClick(function () {
        trackEvent(null, 'Dormir');
        return false;
    });
});