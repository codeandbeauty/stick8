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
        defaults: {
            top: 25,
            parent: false,
            minWidth: 0,
            selector: '.flb-box'
        },

        init: function(box, opts) {
            var me;

            // Merge default options
            for ( var i in this.defaults ) {
                if ( 'undefined' === opts[i] ) {
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

            if ( this.options.minWidth && viewport.width <= this.options.minWidth ) {
                /**
                Setting minimum width prevent the box from floating if the screen
                dimension is lesser than or equal to set minimum width.
                **/
                return;
            }

            // Create the sticky element container
            this.createDiv();
            me = this;

            window.addEventListener( 'scroll', function() {
                me.stickOnScroll();
            });
        },

        getOffset: function(box) {
            var obj, left, top;

            left = 0;
            top = 0;
            obj = box;

            if ( obj.offsetParent ) {
                do {
                    left += obj.offsetLeft;
                    top += obj.offsetTop;
                } while(obj = obj.offsetParent);
            }

            return {left: left, top: top};
        },

        getStyle: function(elem, css) {
            if ( window.getComputedStyle ) {
                return getComputedStyle(elem).getPropertyValue(css);
            }

            return elem.currentStyle[css];
        },

        getBoxDimension: function(box) {
            var me, css, width, height;

            me = this;
            css = ['width', 'padding-left', 'padding-right', 'height', 'padding-top', 'padding-bottom'];
            width = 0;
            height = 0;

            css.map(function(prop, i) {
                var value = me.getStyle(box, prop);

                if ( i < 3 ) {
                    width += parseInt(value);
                } else {
                    height += parseInt(value);
                }
            });

            return {
                width: width + 'px',
                height: height + 'px'
            };
        },

        getData: function(box) {
            var offset, dim;

            offset = this.getOffset(box);
            dim = this.getBoxDimension(box);

            return {
                width: dim.width,
                height: dim.height,
                top: offset.top,
                left: offset.left
            };
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
            dim = this.getBoxDimension(div);
            this.body.removeChild(div);

            return {
                width: parseInt(dim.width),
                height: parseInt(dim.height)
            };
        },

        createDiv: function() {
            var data, div;

            data = this.getData(this.box);
            div = document.createElement('div');
            div.className = '__flb-container';
            div.style.position = 'absolute';
            div.style.width = data.width;
            div.style.top = data.top + 'px';
            div.style.left = data.left + 'px';
            div.appendChild(this.box.cloneNode(true));
            this.body.appendChild(div);

            this.div = div;
            this.divData = data;

            if ( this.parent ) {
                this.parentData = this.getData(this.parent);
            }

            // Hide the box element
            this.hide();
        },

        hide: function() {
            this.box.style.visibility = 'hidden';
        },

        show: function() {
            this.box.style.visibility = 'visible';
        },

        stickOnScroll: function() {
            var win_top, div_top, min_top, max_top;

            win_top = window.pageYOffset;
            div_top = this.divData.top;
            min_top = this.options.top;

            if ( win_top > div_top - min_top ) {
                div_top = win_top + min_top;

                if ( this.parent ) {
                    max_top = this.parentData.top + parseInt(this.parentData.height);
                    max_top -= parseInt(this.divData.height);

                    if ( win_top + min_top > max_top ) {
                        div_top = max_top;
                    }
                }
            }

            this.div.style.top = div_top + 'px';
        }
    };

    Stick8All = function(box, opts) {
        for ( var i in Stick8_ ) {
            this[i] = Stick8_[i];
        }

        this.init(box, opts);
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