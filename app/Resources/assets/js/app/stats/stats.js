$(function() {
    var first = true;

    $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [350, 250]
    });

    // Update stats by polling for updates
    updateStats();
    setInterval('updateStats()', 5000);
});

function updateStats()
{
    $.get('stats/update', function (data) {
        // Profile
        var $profileAge = $('.profile-age');
        var $profileHigiene = $('.profile-higiene');
        var $profileHambre = $('.profile-hambre');
        var $profileVejiga = $('.profile-vejiga');
        var $profileEnergia = $('.profile-energia');
        $profileAge.html(data.profile.age + ' de vida');
        barColor($profileHigiene, data.profile.attributes.higiene * 100);
        $profileHigiene.css('width', (data.profile.attributes.higiene * 100.0) + '%');
        barColor($profileHambre, data.profile.attributes.hambre * 100);
        $profileHambre.css('width', (data.profile.attributes.hambre * 100.0) + '%');
        barColor($profileVejiga, data.profile.attributes.vejiga * 100);
        $profileVejiga.css('width', (data.profile.attributes.vejiga * 100.0) + '%');
        barColor($profileEnergia, data.profile.attributes.energia * 100);
        $profileEnergia.css('width', (data.profile.attributes.energia * 100.0) + '%');

        if (data.profile.sleeping) {
            $('.box-profile .sleep-items').removeClass('hide');
            $profileAge.append('<span>Durmiendo (ssh!)</span>');
            $profileEnergia.parent().addClass('active');
        } else {
            $('.box-profile .sleep-items').addClass('hide');
            $profileEnergia.parent().removeClass('active');
        }

        // Pañal graph
        var $diaperChart = $("#diaperchart");
        var ctx = $diaperChart.get(0).getContext("2d");
        var options = {
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 1,
            scaleStartValue: 0,
            scaleLabel: "<%=value%>",
            scaleFontColor: "#FFF",
            pointDotRadius: 3,
            datasetStrokeWidth: 1,
            animation: first
        };
        var diaperchart = new Chart(ctx).Line(data.diaper_graph, options);
        $diaperChart.css('padding-left','10px');
        $diaperChart.css('padding-right','10px');

        // Pañal stats
        $('.diapers-available').html(data.diaper_stats.available);
        $('.diapers-run-out-days').html(data.diaper_stats.run_out.days + '<span>dias</span>');
        $('.diapers-run-out-date').html(data.diaper_stats.run_out.date);
        $('.diapers-average').html(Math.round(data.diaper_stats.used_per_day * 10) / 10);

        // Last fed
        $('.last-fed-icon').removeClass()
            .addClass('last-fed-icon')
            .addClass(data.last_fed.icon);


        $('.last-fed-time').html(data.last_fed.formatted_time.replace(' y', ', '));

        var amount = '';
        if (data.last_fed.type == 'izquierda' || data.last_fed.type == 'derecha') {
            amount = data.last_fed.value + '<span>min.</span>';
        } else {
            amount = data.last_fed.value + '<span>ml.</span>';
        }
        $('.last-fed-amount').html(amount);

        // Projected time until next feeding
        $('.feed-time-next').html(data.feed_time.next_feed_formatted);

        // Day chart
        $.each(data.day_chart, function (index, event) {
            var colorName = null;
            switch (event.type) {
                case 'Leche':
                    colorName = 'info';
                    break;

                case 'Panyal':
                    colorName = 'success';
                    break;
                    
                case 'Dormir':
                    colorName = 'warning';
                    break;
                    
                case 'Actividad':
                    colorName = 'warning';
                    break;
                    
                case 'Medicina':
                    colorName = 'danger';
                    break;
                    
                case 'Baño':
                    colorName = 'info';
                    break;
                    
            }

            if (colorName != null) {

                console.log("voy a poner las barras");
                var $descripcion = $('.box-day-chart .chart-description');
                var $progress = $('.box-day-chart .progress');

                var bar = $('<div>')
                    .addClass('progress-bar')
                    .addClass('progress-bar-' + colorName)
                    .css('width', (event.width * 100.0) + '%')
                    .css('left', (event.time_percent * 100.0) + '%')
                    .data('event', event);

                bar.fastClick(function() {
                    var event = $(this).data('event');
                    var formattedEvent = formatEvent(event);

                    $descripcion.html('<strong>' + event.time + '</strong>');

                    var description = (formattedEvent.description == 'Fin dormir' ? 'Durmiendo' : formattedEvent.description);

                    $descripcion.append(description);

                    if (formattedEvent.value) {
                        $descripcion.append('&mdash; ' + formattedEvent.value)
                    }
                });

                $progress.append(bar);
            }
        });
    });
    first = false;
}

function barColor(div,value){
    if(value < 25){
        div.addClass('progress-bar-danger');
    }
    if((value >= 25) && (value <= 50)){
        div.addClass('progress-bar-warning');
    }
    if((value >= 50) && (value <= 75)){
        div.addClass('progress-bar-info');
    }
    if(value > 75){
        div.addClass('progress-bar-success');
    }
}