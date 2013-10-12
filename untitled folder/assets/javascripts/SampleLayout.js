$(document).ready(function(){
    var isiOS = navigator.userAgent.match(/iPad|iPod|iPhone/i) != null;

    if(isiOS) {
        myScroll = new iScroll('wrapper'); // This is just an initial iScroll setup. When new content is loaded via AJAX, scrollers  have to be initialized again.
    }

    // Sliding content within a <div>

    function slide(first, second) {
        /*
            The `first` and `second` are adjscent divs with absolute position.
        */
        var width = first.width();
        var commonCss = {
            '-webkit-transition': 'left 500ms ease-in-out'//,
            //width: first.parent().width() + 'px'
        };
        first.css(commonCss);
        second.css(commonCss);
        first.css('left', '-' + width + 'px');
        second.css('left', '0');
    }

    function slideToHtml(container, html, options) {
        /*
            Container contains a single div and acts as a viewport. We'll create a new
            div alongside existing child, then slide it in, and then kill the old div.
        */
        var first = container.children().first();
        first.css({position: 'absolute', left: '0'});
        second = $(html);
        // Bind events inside the "second", the new content slide.
        second.find('.dialogOpener').each(function(){
            var link = $(this);
            link.colorbox({width: 'auto', inline: true, href: link.attr('href')});
        });
        second.css({position: 'absolute', left: first.width() + 'px', top: '0', bottom: '0'});
        second.appendTo(container);
        var id = 'auto-' + Math.random();
        second.attr('id', id);
        second.css('width', '100%');
        slide(first, second);
        window.setTimeout(function() {
            second.siblings().remove();
            if(options.scrollAll) {
                if(isiOS) {
                    new iScroll(id);
                }
            }
            if (options.nestedList) {
                if (options.sidebar) {
                    var sidebar = $('#' + options.sidebar);
                    var mainContent = $('#' + options.mainContent);
                    mainContent.css({
                        position: 'absolute',
                        left: sidebar.width() + 'px',
                        right: '0',
                        top: '0',
                        bottom: '0',
                        overflow: 'auto'                            
                    });
                    if (isiOS) {
                        new slideInMenu(options.sidebar, options.mainContent, true);
                    }
                }
                if (isiOS) {
                    window.setTimeout(function() {
                        new iScroll(options.mainContent);
                    }, 100);
                }
            }
        }, 550);
    }

    function slideToUrl(container, targetUrl, options) {
        $.colorbox.close();
        $.ajax({
            url: targetUrl,
            success: function(response) {
                slideToHtml(container, response, options);
            }
        });
        var a = $('a[href="' + targetUrl + '"]');
        if (a.parents('li.jcarousel-item').length > 0) {
            $('li.jcarousel-item').removeClass('selected');
            $('.search h1').html(a.attr('title'));
            a.parent().addClass('selected');
        }
    }

    function initCarousel() {
        var carouselTab = $('.tabCarousel');
        if (carouselTab.length > 0) {
            if (carouselTab.find('.jcarousel-container').length == 0) {
                // Carousel should be there, but was not initialized.
                carouselTab.find('.mycarousel').jcarousel();
            }
        }
    }

    initCarousel();

    window.setTimeout(function(){

        // Set up "Add to Home Screen" bubble.
        var bubble = new google.bookmarkbubble.Bubble();

        var cookiename = 'bookmark_bubble';

        bubble.hasHashParameter = function(){
            return false;
        };

        bubble.setHashParameter = function(){
            return;
            if (!this.hasHashParameter()) {
                $.cookie(cookiename, 'yes', {
                    expires: 365,
                    path: '/'
                });
            }
        };

        bubble.showIfAllowed();
    }, 5000);


    $('.advancedSearchButton').colorbox({width: 'auto', inline: true, href: '#advancedSearchDialog'});
    $('.subcategoryPopup').colorbox({width: '40%', inline: true, href: '#subcategoryDialog'});
    $('.addToHomePopup').colorbox({background: 'transparent', top: '0px',left: '0px', width: 'auto', inline: true, href: '#addToHomeDialog'});

    // Advanced search form

    function loadSubcategories(parentId, target) {
        // Hide the blocks of subcategories.
		var foundCurrent = target == '#category';
		target = $(target);
		var targetCateg = target.parents('.subcategory');
		$('.subcategory').each(function(){
			var subcat = $(this);
			if (subcat.length > 0 && targetCateg.length > 0 && subcat[0] === targetCateg[0]) {
				foundCurrent = true;
			}
			if(!foundCurrent) {
				return;
			}
			subcat.hide();
			subcat.find('select').attr('disabled', 'disabled');
		});
        $.getJSON('categories/getsubcats/' + parentId, function(data) {
			if(data.length == 0) {
				return;
			}
            // Populate the category select.
            var innards = '<option value="0">All</option>';
            for (var key in data) {
                innards += '<option value="' + key + '">' + data[key] + '</option>';
            }
            target.html(innards);
            target.parents('.subcategory').show();
			target.removeAttr('disabled');
            $.colorbox.resize();
        });
    }

    $('#categoryTree').change(function() {
        var val = $(this).val();
        loadSubcategories(val, '#category');
    });

    $('#category').change(function(){
        var val = $(this).val();
        loadSubcategories(val, 'select[name=subcategory1]');
    });

    $('select[name=subcategory1]').change(function(){
        var val = $(this).val();
        loadSubcategories(val, 'select[name=subcategory2]');
    });

    $('select[name=subcategory2]').change(function(){
        var val = $(this).val();
        loadSubcategories(val, 'select[name=subcategory3]');
    });

    $('select[name=subcategory3]').change(function(){
        var val = $(this).val();
        loadSubcategories(val, 'select[name=subcategory4]');
    });

    $('select[name=subcategory4]').change(function(){
        var val = $(this).val();
        loadSubcategories(val, 'select[name=subcategory5]');
    });

    loadSubcategories(1, '#category');
	

    $('#advancedSearchDialog form').submit(function(){
        $.colorbox.close();
        slideToUrl($('.content'), 'fragments/browse.html', {nestedList: true, sidebar: 'sidebar', mainContent: 'scrollContainer'});
        return false;
    });

    $('a.loader').live('click', function() {
        var a = $(this);
        var url = a.attr('href');
        var options = {};
        if(a.hasClass('nestedlist')) {
            options.nestedList = true;
            options.sidebar = 'sidebar';
            options.mainContent = 'scrollContainer';
        } else {
            options.scrollAll = true;
        }
        slideToUrl($('.content'), url, options);
        return false;
    });

    window.setTimeout(function(){
        slideToUrl($('.content'), 'fragments/k12.html', {scrollAll: true});
    }, 200);


});
