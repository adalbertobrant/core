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

// function updateNotifications() {
//     $.ajax({
//         'method': 'GET',
//         'url': '/messaging/api/notifications'
//     }).then(function (data) {
//         if (data.unread > 0) {
//             $('#notification-title').text(data.latest.title);
//             $('#notification-timestamp').text(data.latest.stamp);
//             $('#notification-message').text(data.latest.message);
//             $('#notification-dismiss').attr({
//                 'onclick': "$.get('/messaging/api/notifications/mark-read/" + data.latest.id + "')"
//             });
//             $('#notification-action').attr({
//                 'href': data.latest.action,
//                 'onclick': "$.get('/messaging/api/notifications/mark-read/" + data.latest.id + "')"
//             });
//             $('.notification-overlay').show(500);

//         }
//     })
// }

// do not use in pages with other links
function linkClickHandler(link, reload){
   $('#popup-frame').attr('src', link);
   var modal = document.getElementById('id-my-modal');
    modal.style.display = 'block';
    $('#popup-frame').on('load', function(){
        var currURL= document.getElementById("popup-frame").contentWindow.location.href;
        currURL = '/' + currURL.replace(/^(?:\/\/|[^\/]+)*\//, "");
        if(currURL == link){
            $('#loading-iframe').addClass('iframe-loaded')
            $('#popup-frame').removeClass('iframe-hidden')
        }else{
            modal.style.display = 'none'
            $('#popup-frame').attr('src', link);
            if(reload != undefined && reload){
                window.location.reload()
            }
        }
        
    })
    
}

function toggleMobileNav(){
    $('#nav').toggle()
}

// for employees deduction page
$(document).ready(function () {


    if($('#title').length){
        if(!$('#mobile-nav').length){
            $('#title').prepend("<button class='btn btn-primary' onclick='toggleMobileNav()' > <i class='fas fa-bars'></i> </button>")
        }
    }

    if(inIframe()){
        $('body').addClass('framed');
    }

    setNavbarActive();

    window.scrollTo(0, 0);

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
    try {
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
    // updateNotifications();
    // setInterval(updateNotifications, 60000)
    
    } catch (error) {
        console.log(error)
    }

    
    $(".jumbotron").addClass('shrink')
})

if(window.screen.width > 575){
    $(".ui-date-picker").datepicker({
        changeYear: true,
        changeMonth: true,
        dateFormat: 'yy-mm-dd',
        minDate: new Date(1955, 1,1),
        yearRange: "1955:2035"
        });
}else{
    $('.ui-date-picker').each(function(i, el){
        $(el).attr('type', 'date')
    })
}



function setNavbarActive(){
    var url = window.location.href;
    if(url.search('invoicing') !== -1){
        $("#sales").addClass('active')
    }else if(url.search('inventory') !== -1){
        $("#inventory").addClass('active')
    }else if(url.search('services') !== -1){
        $("#services").addClass('active')
    }else if(url.search('accounting') !== -1){
        $("#accounting").addClass('active')
    }else if(url.search('employees') !== -1){
        $("#employees").addClass('active')
    }else if(url.search('messaging') !== -1){
        $("#inbox").addClass('active')
    }else if(url.search('planner') !== -1){
        $("#planner").addClass('active')
    }
}
