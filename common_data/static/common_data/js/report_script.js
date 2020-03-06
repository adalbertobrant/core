function generateReport(){
    $('.dash-loading').removeClass('dash-loaded')
}

$('.report-frame').on('load', function(){
    var currURL= document.getElementById("id-report-frame").contentWindow.location.href;
    currURL = '/' + currURL.replace(/^(?:\/\/|[^\/]+)*\//, "");
    if(currURL != "/base/blank-report"){
        $('.dash-loading').addClass('dash-loaded')
    }
})