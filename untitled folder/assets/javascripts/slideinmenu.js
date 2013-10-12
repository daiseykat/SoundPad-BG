/**
 * 
 * Find more about the slide down menu at
 * http://cubiq.org/slide-in-menu
 *
 * Copyright (c) 2010 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 0.1beta1 - Last updated: 2010.05.28
 * 
 */

function log(msg) {
    return;
    var logger = document.getElementById('scroller');
    logger.innerHTML = '<p>' + msg + ': ' + new Date() + '</p>' + logger.innerHTML;
}

function slideInMenu (el, content, opened) {
	this.container = document.getElementById(el);
    this.mainContent = document.getElementById(content);
	this.handle = this.container.querySelector('.handle');
	
    this.initWidths();
    this.pos = this.openedPosition;
    this.open();

	//this.handle.addEventListener('click', this, true);
	//this.handle.addEventListener('mousemove', this, true);
	this.handle.addEventListener('touchstart', this, true);
}

slideInMenu.prototype = {
	opened: true,

    initWidths: function() {
        this.openedPosition = 0;
        this.closedPosition = this.container.clientWidth - this.handle.clientWidth;
        this.panelWidth = this.container.clientWidth;
        this.contentWidth = this.mainContent.clientWidth;

        this.container.style.opacity = '1';
        this.container.style.left = '0';
        this.container.style.webkitTransitionProperty = '-webkit-transform';
        this.container.style.webkitTransitionDuration = '400ms';

        this.mainContent.style.left = '0';
        this.mainContent.style.webkitTransitionPropoerty = '-webkit-transform';
        this.mainContent.style.webkitTransitionDuration = '400ms';
    },
	
	handleEvent: function(e) {
        log('Event: ' + e.type);
		switch (e.type) {
			case 'touchstart': this.touchStart(e); break;
			case 'touchmove': this.touchMove(e); break;
			case 'touchend': this.touchEnd(e); break;
		}
	},

    click: function(e) {
        log('Click!');
        this.container.style.webkitTransitionDuration = '400ms';
        this.setPosition(!this.opened ? this.openedPosition : this.closedPosition);
    },
	
	setPosition: function(pos) {

        log('setPosition: ' + pos);
		this.pos = pos;
		this.container.style.webkitTransform = 'translate3d(-' + pos + 'px,0,0)';
        //this.mainContent.style.webkitTransform = 'translate3d(' + (this.panelWidth - pos) + 'px,0,0)';
		
		if (this.pos == this.openedPosition) {
			this.opened = true;
            //this.mainContent.style.width = (this.contentWidth - this.panelWidth) + 'px';
            this.mainContent.style.left = this.panelWidth + 'px';
		} else if (this.pos == this.closedPosition) {
			this.opened = false;
            //this.mainContent.style.width = (this.contentWidth - this.handle.clientWidth) + 'px';
            this.mainContent.style.left = this.handle.clientWidth + 'px';
		}
	},
	
	touchStart: function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		this.container.style.webkitTransitionDuration = '0';
		this.startPos = this.pos;
		this.startDelta = e.touches[0].pageX - this.pos;
		
		this.handle.addEventListener('touchmove', this);
		this.handle.addEventListener('touchend', this);
	},
	
	touchMove: function(e) {
		var delta = e.touches[0].pageX - this.startDelta;

		if (delta < 0) {
			delta = 0;
		} else if (delta > this.openedPosition) {
			delta = this.openedPosition;
		}
		
		this.setPosition(delta);
	},
	
	touchEnd: function(e) {
		var strokeLength = this.pos - this.startPos;
		strokeLength*= strokeLength < 0 ? -1 : 1;
		
		if (strokeLength > 3) {		// It seems that on Android is almost impossibile to have a tap without a minimal shift, 3 pixels seems a good compromise
			this.container.style.webkitTransitionDuration = '200ms';
			if (this.pos==this.openedPosition || !this.opened) {
				this.setPosition(this.pos > this.openedPosition/3 ? this.openedPosition : this.closedPosition);
			} else {
				this.setPosition(this.pos > this.openedPosition ? this.openedPosition : this.closedPosition);
			}
		} else {
			this.container.style.webkitTransitionDuration = '400ms';
			this.setPosition(!this.opened ? this.openedPosition : this.closedPosition);
		}

		this.handle.removeEventListener('touchmove', this);
		this.handle.removeEventListener('touchend', this);
	},
	
	open: function() {
		this.setPosition(this.openedPosition);
	},

	close: function() {
		this.setPosition(this.closedPosition);
	},
	
	toggle: function() {
		if (this.opened) {
			this.close();
		} else {
			this.open();
		}
	}
}
