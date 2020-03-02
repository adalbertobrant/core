function updateLastest(el){
    var name = el.id.replace('id_', '')
    $.get('/base/models/get-latest/' + name, function(data){
        var pk = data.data[0]
        var last = el.children.length -1 
        if(last != pk){
            var jqel = $('#' + el.id)
            if(jqel.hasClass('select2widget')){
                var newOption = new Option(data.data[1], pk, false, false);
                $('#' + el.id).append(newOption).trigger('change');
            }else{
                var opt = document.createElement('option')
                opt.value = pk
                opt.text = data.data[1]
                el.add(opt)
            }
            
        }
    })
}

function createNew(btn){
    var name = btn.dataset.widget
    $.get('/base/views/get-create-view/' + name, function(data){
        
        if(data.link != ''){
            $('#popup-frame').attr('src', data.link);
            var modal = document.getElementById('id-my-modal');
            modal.style.display = 'block';
        }
        
    })

    //get element name from neighbour
}


$(document).ready(function(){
    if(inIframe()){
        return
    }
    
    $('select').each(function(i, el){
        //exclude certain inputs

        if(['category', 'department'].indexOf($(el).attr('name')) >= 0){
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

        //exclude taxes
        if(el.id.indexOf('tax') > -1){
            return
        }

        //checks when an input is required
        if($(el).hasClass('django-select2')){
            $('#' + el.id).on('select2:opening', function (e) {
                updateLastest(e.target)
              });
        }else{
            el.addEventListener('focus', function(evt){
                updateLastest(evt.target)
            })
        }
        

        //adds button to select
        //only add for inputs with models
        var name = el.id.replace('id_', '')
        $.get('/base/models/get-latest/' + name, function(data){
            
            if(data.data == -1){
                return
            }
            $(el).parent().addClass('input-group mb-3')
        
            var id = 'new-' + name
            $(el).after("<div class='input-group-append'> \
                            <button type='button' class='btn btn-primary btn-sm select3-btn' data-widget='"  + name +  "' onclick='createNew(this)'> + </button> \
                        </div>")
        })
        


        
        
    })
})