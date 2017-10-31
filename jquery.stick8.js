/* global define */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        factory(jQuery);
    }
}(this, function($) {
    'use strict';

    var Stick8_, Stick8;

    Stick8_ = {
        div: false,
        divData: false,
        parentData: false,
        defaults: {
            top: 25,
            parent: false,
            minWidth: 0,
            selector: '.flb-box'
        },

        init: function(box, opts) {
            opts = $.extend(this.defaults, opts);

            if ( opts.parent ) {
                this.parent = $(opts.parent);
            }

            this.box = box;
            this.options = opts;
            this.initBox();

            $(window).on('resize', $.proxy(this, 'reInitBox'));
        },

        reInitBox: function() {
            var me, timer;

            me = this;

            if ( this.div ) {
                this.div.remove();
            }
            this.show();

            // Let's delay the re-initialization to get the correct css styling
            timer = setInterval(function() {
                clearInterval(timer);
                me.initBox();
            }, 300);
        },

        initBox: function() {
            var viewport;

            viewport = this.getViewPort();

            if ( this.options.minWidth && viewport.width <= this.options.minWidth ) {
                /**
                Setting minimum width prevent the box from floating if the screen
                dimension is lesser than or equal to set minimum width.
                **/
                return;
            }

            // Create the sticky element container
            this.createDiv();

            $(window).on('scroll', $.proxy( this, 'stickOnScroll'));
        },

        getData: function(box) {
            var offset;

            offset = box.offset();

            return {
                width: box.outerWidth(),
                height: box.outerHeight(),
                top: offset.top,
                left: offset.left
            };
        },

        getViewPort: function() {
            var div, width, height;

            div = $('<div>');
            div.css({
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                padding: 0,
                margin: 0
            });
            div.appendTo('body');

            width = div.width();
            height = div.height();

            div.remove();

            return {
                width: width,
                height: height
            };
        },

        createDiv: function() {
            var div, clone, data;

            div = $('<div>');
            data = this.getData(this.box);

            div.addClass('__flb-container');
            div.css({
                position: 'absolute',
                width: data.width,
                top: data.top + 'px',
                left: data.left + 'px'
            });
            clone = this.box.clone(true);
            clone.appendTo(div);
            div.appendTo('body');

            this.div = div;
            this.divData = data;

            if ( this.parent ) {
                this.parentData = this.getData(this.parent);
            }

            // Hide the box element
            this.hide();
        },

        hide: function() {
            this.box.css('visibility', 'hidden');
        },

        show: function() {
            this.box.css('visibility', 'visible');
        },

        stickOnScroll: function() {
            var win_top, div_top, min_top, max_top;

            win_top = $(window).scrollTop();
            div_top = this.divData.top;
            min_top = this.options.top;

            if ( win_top > div_top - min_top ) {
                div_top = win_top + min_top;

                if ( this.parent ) {
                    max_top = this.parentData.top + parseInt(this.parentData.height);
                    max_top -= parseInt(this.div.outerHeight());

                    if ( win_top + min_top > max_top ) {
                        div_top = max_top;
                    }
                }
            }

            this.div.css('top', div_top + 'px');
        }
    };

    Stick8 = function(box, opts) {
        $.extend(this, Stick8_);

        this.init(box, opts);
    };

    $.fn.Stick8 = function(opts) {
        opts = opts || {};

        $(this).each(function() {
            var stick;

            stick = new Stick8($(this), opts);
        });

        return this;
    };
}));