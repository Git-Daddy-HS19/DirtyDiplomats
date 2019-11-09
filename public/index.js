const form = $('#create-game-form')
const gameIdDiv = $('#game-id-div')
const gameIdSpan = $('#game-id-span')

form.submit(function(e) {
    e.preventDefault()
    $.ajax({
        url: form.attr('action'),
        type: form.attr('method'),
        data: form.serialize(),
        processData: false,
        success: data => {
            form.hide()
            gameIdSpan.text(data.id)
            gameIdDiv.show()
        }
    })
})
