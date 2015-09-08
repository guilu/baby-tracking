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