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