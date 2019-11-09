const form = $('#create-game-form')
const gameIdDiv = $('#game-id-div')
const gameIdSpan = $('#game-id-span')

form.submit(function(e) {
    e.preventDefault()
    var formData = new FormData(form[0])
    $.ajax({
        url: '/create-game',
        type: 'post',
        data: form.serialize(),
        success: function(data) {
            form.hide()
            gameIdSpan.text(data.id)
            gameIdDiv.show()
        }
    })
})
