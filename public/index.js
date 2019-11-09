const form = $('#create-game-form')
const gameIdDiv = $('#game-id-div')
const gameIdSpan = $('#game-id-span')

form.submit(e => {
    e.preventDefault()
    $.ajax({
        url: form.attr('action'),
        type: form.attr('method'),
        data: form.serialize(),
        success: data => {
            form.hide()
            gameIdSpan.text(data.id)
            gameIdDiv.show()
        }
    })
})
