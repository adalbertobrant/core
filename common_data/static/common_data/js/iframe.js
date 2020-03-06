$(window).on('load', function(){
    
    if(inIframe()){
     $("#nav").hide();
     $("#footer").hide();
     $('a.btn').each(function(){$(this).hide()})
     $(".jumbotron").addClass('shrink')
 }
})

function resetModal(){
    //reset the src attribute for the iframe so that multiple items can be created
    if($('#popup-frame').length > 0){
        $('#popup-frame').addClass('iframe-hidden')
    }
    $('.frame-style').each(function(i, el){
        if(!$(el).hasClass('iframe-hidden')){
            var src = $(el).data('initial')
            el.contentWindow.location.href = src
            $(el).addClass('iframe-hidden')
        }
    })
    //show loading spinner
    $('#loading-iframe').removeClass('iframe-loaded');
}

function closeModal(){
    if(confirm('Are you sure you want to close this page?')){
        resetModal();
        $("#id-my-modal").hide();
        $('#popup-frame').empty();
        $('.iframe-minimized').hide();
        
    }
}

function minimizeModal(){
    $("#id-my-modal").hide();
    $('.iframe-minimized').show();
}

function maximizeModal(){
    $("#id-my-modal").show();
    $('.iframe-minimized').hide();
}