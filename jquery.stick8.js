/* global define */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jQuery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(jQuery);
    } else {
        // Browser globals (root is window)
        root['Stick8'] = factory(jQuery);
    }
}(this, function($) {
    'use strict';

    var Stick8_, Stick8, Stick8Instance;

    Stick8_ = {
        div: false,
        divData: false,
        parentData: false,
        maxTop: 0,
        defaults: {
            top: 0,
            parent: false,
            minWidth: 0,
            selector: '.flb-box'
        },

        init: function(box, opts) {
            opts = $.extend({}, this.defaults, opts);

            if ( opts.parent ) {
                this.parent = $(opts.parent);
            }

            this.box = box;
            this.options = opts;
            this.initBox();

            $(window).on('resize', $.proxy(this.reInitBox, this));
        },

        reInitBox: function() {
            var me, timer;

            me = this;

            if ( this.div ) {
                this.box.unwrap();
                this.clone.remove();
                this.div = false;
            }

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

            $(window).on('scroll', $.proxy( this.stickOnScroll, this));
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
            if ( this.div ) {
                return;
            }

            var div, clone, data;

            div = $('<div>');
            data = this.getData(this.box);

            div.addClass('__flb-container');
            div.css({
                position: 'fixed',
                width: data.width,
                top: data.top + 'px',
                left: data.left + 'px'
            });

            clone = $('<div>');
            clone.addClass('__flb-clone');
            clone.css({
                width: data.width,
                height: data.height
            });
            clone.insertBefore(this.box);

            // Wrap the target element
            this.box.wrap(div);

            this.div = this.box.parent();
            this.clone = clone;
            this.divData = data;
            this.maxTop = data.top + parseInt(data.height);

            if ( this.parent ) {
                this.parentData = this.getData(this.parent);
                this.maxTop = this.parentData.top + this.parentData.height;
                this.maxTop -= parseInt(data.height);
            }

            // Trigger the onCreate event
            if ( this.options.onCreate ) {
                this.options.onCreate.call(null, this);
            }

            // Initialize sticky positioning
            this.stickOnScroll();
        },

        stickOnScroll: function() {
            var win_top, div_top, cur_top, min_top, max_top;

            win_top = $(window).scrollTop();
            div_top = this.divData.top;
            min_top = parseInt(this.options.top);

            if ( this.options.top ) {
                // If top is defined, it assumed it's the maximum top the element must stop
                cur_top = parseInt(this.options.top) - win_top;

                if ( cur_top <= 0 ) {
                    div_top = this.divData.top - win_top;
                }

                if ( div_top <= min_top ) {
                    div_top = min_top;
                }
            }

            if ( this.parent ) {
                var div_max_top;

                div_max_top = max_top = win_top + ( this.options.top ? min_top : this.divData.top);

                if ( win_top > 0 && max_top >= this.maxTop ) {
                    div_top -= max_top - this.maxTop;
                }
            }

            this.div.css('top', div_top + 'px');

            // Trigger the onScroll event
            if ( this.options.onScroll ) {
                this.options.onScroll.call(null, this);
            }
        }
    };

    Stick8Instance = function(opts) {
        var box, timer, stick8;

        box = opts.selector ? $(opts.selector) : $('.flb-box');

        stick8 = $.extend({}, Stick8_);

        // Init only if all are loaded
        timer = setInterval(function() {
            if ( 'complete' === document.readyState && box.length ) {
                clearInterval(timer);
                stick8.init(box, opts);
            }
        }, 100);

        return stick8;
    };

    $.fn.Stick8 = function(opts) {
        opts = opts || {};

        $(this).each(function() {
            opts.selector = this;

            this.stick8 = new Stick8Instance(opts);
        });

        return this;
    };

    Stick8 = function(opts) {
        opts = opts || {};

        if ( ! opts.selector ) {
            opts.selector = '.flb-box';
        }

        return $(opts.selector).Stick8(opts);
    };

    return Stick8;
}));