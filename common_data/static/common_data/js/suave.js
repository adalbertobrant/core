//shrink jumbotrons on scroll

var scrolling = false;
$(document).scroll(function () {
    scrolling = true;
});

function isScrollable() {
    var windowHeight = $(window).height();
    var pageHeight = $(document).height();
    return pageHeight / windowHeight > 1.3;
}

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function updateNotifications() {
    $.ajax({
        'method': 'GET',
        'url': '/messaging/api/notifications'
    }).then(function (data) {
        if (data.unread > 0) {
            $('#notification-title').text(data.latest.title);
            $('#notification-timestamp').text(data.latest.stamp);
            $('#notification-message').text(data.latest.message);
            $('#notification-dismiss').attr({
                'onclick': "$.get('/messaging/api/notifications/mark-read/" + data.latest.id + "')"
            });
            $('#notification-action').attr({
                'href': data.latest.action,
                'onclick': "$.get('/messaging/api/notifications/mark-read/" + data.latest.id + "')"
            });
            $('.notification-overlay').show(500);

        }
    })
}

setInterval(function () {
    if (scrolling) {
        scrolling = false;
        if ($(document).scrollTop() > 0 && isScrollable()) {
            $(".jumbotron").addClass("shrink");
        }
        if ($(document).scrollTop() === 0 && !inIframe()) {
            $(".jumbotron").removeClass("shrink");
        }
    }
}, 100)

function linkClickHandler(link){
   $('#popup-frame').attr('src', link);
   var modal = document.getElementById('id-my-modal');
    modal.style.display = 'block';
    $('#refresher-button').css('display', 'block');
}

// for employees deduction page
$(document).ready(function () {
    if ($('#id_deduction_method').length > 0) {
        $('.custom-options').hide();
        $('.fixed-options').hide();
        $('input[type=submit]').hide();
        $('#id_deduction_method').on('change', function () {
            $('input[type=submit]').show();
            if ($(this).val() == 0) {
                $('.custom-options').show();
                $('.fixed-options').hide();
            } else {
                $('.custom-options').hide();
                $('.fixed-options').show();
            }
        })
    }

    //button handlers

    document.getElementById('notifications-button').addEventListener('click',
        function () {
            $('.notifications').show()
            $('.notification-window').addClass('visible-notification-window')

        })
    document.getElementById('close-notifications').addEventListener('click',
        function () {
            $('.notifications').hide()

        })


    //notification polling
    updateNotifications();
    setInterval(updateNotifications, 60000)
})
