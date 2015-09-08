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