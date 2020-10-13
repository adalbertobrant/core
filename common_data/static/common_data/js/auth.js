var token =''

$.ajax({
    method: 'GET',
    url: '/base/current-user-token'
}).then(res =>{
    if (res.token == '' && (window.location.href.indexOf('login') == -1 || window.location.href.indexOf('superuser') == -1)){
        console.log('The current session has expired. Please login again.')
        // window.location.href = '/login'
    }else{
        token=res.token
        $.ajaxSetup({
            headers: {
              Authorization: 'Token ' + token
            }
          });
    }
}).catch(err =>{
    console.log(err)
    bentschAlert('Failed to get authorization token. Please login again.')
    window.location.href = '/login'
})

