var bentschAlert = function(message) {
    if(inIframe()) { return }

    document.getElementById('bentsch-modal-message').innerText = message 
    var modal = document.querySelector('.bentsch-modal')
    modal.style.display = "block"
    document.querySelector('.bentsch-close').onclick = function () {
        modal.style.display = "none"
    }

}