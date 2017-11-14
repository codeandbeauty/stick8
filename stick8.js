/* global define */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root['Stick8'] = factory();
    }
}(this, function() {
    'use strict';

    var Stick8_, Stick8All, Stick8;

    Stick8_ = {
        div: false,
        divData: false,
        parentData: false,
        body: false,
        parent: false,
        maxTop: 0,
        defaults: {
            parent: false,
            minWidth: 0,
            selector: '.flb-box'
        },

        init: function(box, opts) {
            var me;

            // Merge default options
            for ( var i in this.defaults ) {
                if ( ! opts[i] ) {
                    opts[i] = this.defaults[i];
                }
            }

            if ( opts.parent ) {
                this.parent = document.querySelector(opts.parent);
            }

            me = this;
            this.box = box;
            this.options = opts;
            this.body = document.querySelector('body');
            this.initBox();

            window.addEventListener( 'resize', function() {
                me.reInitBox();
            });
        },

        reInitBox: function() {
            var me, timer;

            me = this;

            if ( this.div ) {
                this.body.removeChild(this.div);
                this.div = false;
            }
            this.show();

            // Let's delay the re-initialization to get the correct css styling
            timer = setInterval(function() {
                clearInterval(timer);
                me.initBox();
            }, 300);
        },

        initBox: function() {
            var viewport, me;

            viewport = this.getViewPort();

            if ( this.options.minWidth > 0 && viewport.width <= this.options.minWidth ) {
                /**
                Setting minimum width prevent the box from floating if the screen
                dimension is lesser than or equal to set minimum width.
                **/
                return;
            }

            // Create the sticky element container
            this.createDiv();
            me = this;

            this.stickOnScroll();

            window.addEventListener( 'scroll', function() {
                me.stickOnScroll();
            });
        },

        getData: function(box) {
            var rect, data, top, left;

            rect = box.getBoundingClientRect();
            data = {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left
            };

            top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            left = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;

            data.top += top;
            data.left += left;

            if ( box.scrollLeft ) {
                data.width -= box.scrollLeft;
            }

            if ( box.scrollTop ) {
                data.height -= box.scrollTop;
            }

            return data;
        },

        getViewPort: function() {
            var div, dim;

            div = document.createElement('div');
            div.style.position = 'fixed';
            div.style.top = 0;
            div.style.left = 0;
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.margin = 0;
            div.style.padding = 0;

            this.body.appendChild(div);
            dim = this.getData(div);
            this.body.removeChild(div);

            return {
                width: parseInt(dim.width),
                height: parseInt(dim.height)
            };
        },

        createDiv: function() {
            if ( this.div ) {
                return;
            }

            var data, div;

            data = this.getData(this.box);
            div = document.createElement('div');
            div.className = '__flb-container';
            div.style.position = 'fixed';
            div.style.width = data.width + 'px';
            div.style.height = data.height + 'px';
            div.style.top = data.top + 'px';
            div.style.left = data.left + 'px';
            div.appendChild(this.box.cloneNode(true));

            // Hide the original element first
            this.hide();

            // Then insert the new element
            this.body.appendChild(div);

            this.div = div;
            this.divData = data;

            if ( this.parent ) {
                this.parentData = this.getData(this.parent);
                this.maxTop = this.parentData.top + this.parentData.height;
                this.maxTop -= parseInt(data.height);
            }

            // Trigger the onCreate event
            if ( this.options.onCreate ) {
                this.options.onCreate.call(null, this);
            }
        },

        hide: function() {
            this.box.style.visibility = 'hidden';
        },

        show: function() {
            this.box.style.visibility = 'visible';
        },

        stickOnScroll: function() {
            var win_top, div_top, cur_top, min_top, max_top;

            win_top = window.pageYOffset;
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

            this.div.style.top = div_top + 'px';

            // Trigger the onScroll event
            if ( this.options.onScroll ) {
                this.options.onScroll.call(null, this);
            }
        }
    };

    Stick8All = function(box, opts) {
        var timer, stick8, me;

        stick8 = {};
        me = this;

        // Merge the object
        for ( var i in Stick8_ ) {
            stick8[i] = Stick8_[i];
        }

        // Init only if all are loaded
        timer = setInterval(function() {
            if ( 'complete' === document.readyState ) {
                clearInterval(timer);
                stick8.init(box, opts);
            }
        }, 100);
    };

    Stick8 = function(opts) {
        opts = opts || {};

        var selector, boxes, stick;

        selector = opts.selector || '.flb-box';
        boxes = document.querySelectorAll(selector);

        for(var i=0; i < boxes.length; i++) {
            stick = new Stick8All(boxes[i], opts);
        }
    };

    return Stick8;
}));