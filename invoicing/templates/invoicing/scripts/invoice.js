$(document).ready(function() {
    console.log('script_loaded')
    $('#id_salesperson').prop('disabled', true)
    $('#id_customer').change(function(evt) {
        $.get('/invoicing/api/customer/' + $(evt.target).val()).then(res => {
            console.log(res)
            if(res.billing_currency) {
                $('#id_currency').val(res.billing_currency).change()
            }
        })
        
    })
})