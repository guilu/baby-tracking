$(function() {
    $('.eventbutton-banyo').fastClick(function () {
        trackEvent(null, 'Banyo');
        return false;
    });
});