$(document).ready(function () {
    $('#slider').flickity();

    $('#slider').on('cellSelect', function (event, pointer) {
        console.log($('#slider .is-selected').attr("data-url"))

        var preview = $('#slider .is-selected').attr("data-url");
        var name = $('#slider .is-selected').attr("data-name");

        $('#preview-container .name').empty();
        $('#preview-container .name').text(name);
        $('#preview-container .preview').attr("src", ' ' + preview);

    });
    
    $('tr').hover(function () {
        console.log(this);
        var col = $(this).parent().children().index($(this));
        $('#slider').flickity( 'select', col )
    });



});

