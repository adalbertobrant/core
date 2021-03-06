function updateLastest(el){
    var name = el.id.replace('id_', '')
  
    $.get('/base/models/get-latest/' + name, function(data){
        if(data.data == -1){
            return
        }

        var pk = data.data[0]
        
        var last = $(el.children[el.children.length -1]).val()
        
        if(last != pk ){
            
            var jqel = $('#' + el.id)
            if(jqel.hasClass('django-select2')){
                var newOption = new Option(data.data[1], pk, false, false);
                jqel.append(newOption).trigger('change');
                $('#' + el.id).select2('close');
            }else{
                var opt = document.createElement('option')
                opt.value = pk
                opt.text = data.data[1]
                el.add(opt)
                $(el).blur()
            }
            
        }
    })
}

function createNew(btn){
    var target = btn.dataset.target
    if(target != ''){
        var modal = document.getElementById('id-my-modal');
        modal.style.display = 'block';
        $('#' + target).removeClass('iframe-hidden');
        $('#loading-iframe').addClass('iframe-loaded');
    }
}


$(document).ready(function(){
    var inputList = []


    if($('input[name="csrfmiddlewaretoken"]').length < 1){
        return
    }    
    if(inIframe()){
        return
    }
    //csrf setup
    var token = $('input[name="csrfmiddlewaretoken"]').val()
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", token);
            }
        }
    });

    $('select').each(function(i, el){
        //exclude certain inputs

        //list of duplicate fields that must be avoided
        if(['category', 'department', 'tax'].indexOf($(el).attr('name')) >= 0){
            return
        }

        //exclude filters
        if($(el).closest('div.filter-overlay').length > 0){
            return
        }
        //exclude report forms
        if($(el).closest('form.report-form').length > 0){
            return
        }

        //updates input every time it is opened
        if($(el).hasClass('django-select2')){
            $('#' + el.id).on('select2:opening', function (e) {
                updateLastest(e.target)
              });
        }else{
            el.addEventListener('focus', function(evt){
                updateLastest(evt.target)
            })
        }

        // use this instead of the name attribute because the id attribute can be changed
        var name = el.id.replace('id_', '')
        inputList.push(name)
    })
    $.ajax({
        url: '/base/models/get-latest-group',
        type: 'POST',
        data: {
            'names': JSON.stringify(inputList),
            'csrfmiddlewaretoken': token
        }, 

        success: function(data){
            var frameContainer = $('#iframe-container')
            Object.keys(data).forEach(key => {
                var select = $('select[name="'+ key +'"]')
                if(select.length == 0){
                    select = $('select#'+ key)
                }
                select.after("<div class='input-group-append'> \
                                <button type='button' class='btn btn-primary btn-sm select3-btn' data-target='"  + key + "-frame" +  "' onclick='createNew(this)'> + </button> \
                            </div>")
                select.parent().addClass('input-group mb-3')
                frameContainer.append("<iframe  class='frame-style iframe-hidden' \
                                                id='" + key + "-frame" + "' \
                                                src='" + data[key].link + "' \
                                                data-initial='" + data[key].link + "'> \
                                        </iframe>")
                var frame = $('#'+ key + "-frame") 
                frame.on('beforeunload', function(){
                    $('#loading-iframe').removeClass('iframe-loaded');
                })
                frame.on('load', function(){
                    var currURL= document.getElementById( key + "-frame").contentWindow.location.href;
                    currURL = '/' + currURL.replace(/^(?:\/\/|[^\/]+)*\//, "");
                    
                    if(currURL != frame.data('initial')){
                        $("#id-my-modal").hide();
                        resetModal()
                    }
                })
                
            });
    }})
})