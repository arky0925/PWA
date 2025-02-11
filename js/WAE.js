(function($) {

    // Animate bar menu
    $('.hamburger-menu').on('click', function() {
        $('.bar').toggleClass('animate');
        if( $('body').hasClass('open-menu')){
            $('body').removeClass('open-menu');
        }else{
            $('body').toggleClass('open-menu');
        }
    });

    // Close menu when press esc
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            $('.bar').removeClass('animate');
            $('body').removeClass('open-menu');
        }
    });

})(jQuery);