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
        $('.eventbutton-leche').find('.badge').html(response.leche.time);
        $('.eventbutton-sacaleche').find('.badge').html(response.sacaleche.time);
        $('.eventbutton-panyal').find('.badge').html(response.panyal.time);
        $('.eventbutton-comida').find('.badge').html(response.comida.time);

        if (response.dormir.type == 'start') {
            if ($('.sleep-items').hasClass('hide')) {
                $('.sleep-items').removeClass('hide');
                $('body').animate({ backgroundColor: '#CCC' });
            }
        } else {
            if (!$('.sleep-items').hasClass('hide')) {
                $('.sleep-items').addClass('hide');
                $('body').animate({ backgroundColor: '#FFF' });
            }
        }
    });
}