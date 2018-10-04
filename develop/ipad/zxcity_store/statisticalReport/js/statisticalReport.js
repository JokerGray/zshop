(function () {
    $("#content .navb a").click(function () {
        var dataHref = $(this).attr("data-href");
        if (dataHref) {
            window.parent.location = '../html/' + dataHref + '.html'
        }
    });
})(jQuery);
