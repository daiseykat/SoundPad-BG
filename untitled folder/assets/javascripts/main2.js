$(document).ready(function(){

    var isiOS = navigator.userAgent.match(/iPad|iPod|iPhone/i) != null;

    initLayout();
    initCarousel();

    function initCarousel() {
        var carouselTab = $('.tabCarousel');
        if (carouselTab.length > 0) {
            if (carouselTab.find('.jcarousel-container').length == 0) {
                // Carousel should be there, but was not initialized.
                carouselTab.find('.mycarousel').jcarousel();
            }
        }
    }

    function initLayout() {

        var myScroll; 

        function loaded() { 
            if(isiOS) {
                menu = new slideInMenu('slidemenu', 'mainContent', true);
                myScroll = new iScroll('wrapper');         
            } else {
                $('#mainContent').css({
                        left: '115px', 
                        top: '199px',
                        right: '0px',
                        position: 'absolute'
                });
            }
        }

        document.addEventListener('touchmove', function (e) {
                e.preventDefault(); 
                }, false);

        function updateOrientation()
        {
            var orientation=window.orientation;
            var wasOpened = menu.opened;
            if(wasOpened) {
                menu.close();
            }
            window.setTimeout(function(){
                $('#mainContent').css('width', '100%');
                menu.initWidths();
                if(wasOpened) {                
                    menu.open()
                }
            }, 500);
        }
        window.onorientationchange=updateOrientation;

        setTimeout(function () {
                loaded();
            }, 200);
    }


    function slide(first, second) {
        /*
            The `first` and `second` are adjscent divs with absolute position.
        */
        var width = first.width();
        var commonCss = {
            '-webkit-transition': 'left 500ms ease-in-out',
            width: first.parent().width() + 'px'
        };
        first.css(commonCss);
        second.css(commonCss);
        first.css('left', '-' + width + 'px');
        second.css('left', '0');
    }

    function slideToHtml(container, html) {
        /*
            Container contains a single div and acts as a viewport. We'll create a new
            div alongside existing child, then slide it in, and then kill the old div.
        */
        var first = container.children().first();
        first.css({position: 'absolute', left: '0'});
        second = $(html);
        second.css({position: 'absolute', left: first.width() + 'px'});
        second.appendTo(container);
        var id = 'auto-' + Math.random();
        second.attr('id', id);
        slide(first, second);
        window.setTimeout(function(){
            first.remove();
            new iScroll(id);
        }, 550);
    }

    function slideTo(el) {
        /*
            The `el` is one of a series in a container, and only one of them is visible.
            Find the visible one, position `el` to the right from it, and slide.
        */
        var siblings = el.first().siblings();
        var visible = null;
        siblings.filter(':visible').each(function(){
           var sibling = $(this);
           if(sibling.css('position') == 'absolute' && sibling.css('left') == '0') {
               visible = sibling;               
           }
        });
        if(visible) {
            el.width(visible.width);
            el.css({
                position: 'absolute',
                left: visible.width() + 'px'
            });
            slide(visible, el);
        }
    }

    function slideToUrl(container, targetUrl) {
        $.ajax({
            url: targetUrl,
            success: function(response) {
                slideToHtml(container, response);
            }
        });
    }


    $('a.loader').click(function() {
        var a = $(this);
        var url = a.attr('href');//'fragments/' + a.attr('id').substr('load_'.length) + '.html';
        slideToUrl($('#mainContent'), url);
        return false;
    });

});
