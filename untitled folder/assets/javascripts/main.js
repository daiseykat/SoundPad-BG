$(document).ready(function(){

    var pageInitializers = {
        advancedSearch: function(){
            window.setTimeout(function(){
                loadSubcategories(1, '#category');
            }, 200);
        }
    }

    // Initialize carousel for each page when it is shown.
    $('div').live('pageshow', function(){
        var carouselTab = $(this).find('.tabCarousel');
        if (carouselTab.length > 0) {
            if (carouselTab.find('.jcarousel-container').length == 0) {
                // Carousel should be there, but was not initialized.
                carouselTab.find('.mycarousel').jcarousel();
            }
        }
        var initializer = pageInitializers[$(this).attr('id')];
        var initializerDone = pageInitializers[$(this).attr('id') + 'InitDone'];
        if (initializer && !initializerDone) {
            pageInitializers[$(this).attr('id') + 'InitDone'] = true;
            initializer();
        }
    });

    // Collapsible sidebar
    $(".hideSidebar").live('click', function(){
        var panel = $(this).parents('.panel').first();
        var sidebar = panel.parent();
        panel.animate({
            marginLeft: "-275px"
        }, 500);
        sidebar.animate({
            width: "0px",
            opacity: 0
        }, 400);
        sidebar.next().show("normal").animate({
            width: "28px",
            opacity: 1
        }, 200);
        sidebar.next().next().animate({
            marginLeft: "50px"
        }, 500);
    });

    $(".showSidebar").live('click', function(){
        var colright = $(this).next();
        var sidebar = $(this).prev();
        var panel = sidebar.find('.panel');
        colright.animate({
            marginLeft: "300px"
        }, 200);
        panel.animate({
            marginLeft: "0px"
        }, 400);
        sidebar.animate({
            width: "275px",
            opacity: 1
        }, 400);
        $(this).animate({
            width: "0px",
            opacity: 0
        }, 600).hide("slow");
    });

    window.setTimeout(function(){

        // Set up "Add to Home Screen" bubble.
        var bubble = new google.bookmarkbubble.Bubble();

        var cookiename = 'bookmark_bubble';

        bubble.hasHashParameter = function(){
            return false;
            return $.cookie(cookiename) != null;
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
        //bubble.show_();
    }, 5000);

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
			subcat.animate({height: 0, opacity: 0});
			subcat.find('select').selectmenu('disable');
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
            target.parents('.subcategory').animate({height: 51, opacity: 1});
			target.selectmenu('enable');
            target.selectmenu('refresh', true);
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
});
