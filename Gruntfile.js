/* global require */

/**
 * When grunt command does not execute try these steps:
 *
 * - delete folder 'node_modules' and run command in console:
 *   $ npm install
 *
 * - Run test-command in console, to find syntax errors in script:
 *   $ grunt hello
 */

module.exports = function(grunt) {
 	// Show elapsed time at the end.
 	require( 'time-grunt' )(grunt);

 	// Load all grunt tasks.
 	require( 'load-grunt-tasks' )(grunt);

 	var buildtime, conf;

 	buildtime = new Date().toISOString();

 	conf = {
 	    js_files: [
 	        'Gruntfile.js',
 	        'stick8.js',
 	        'jquery.stick8.js'
 	    ]
 	};

 	grunt.initConfig({
 	    pkg: grunt.file.readJSON('package.json'),
 	    conf: conf,
        // JS: Validate JS files (1).
		jsvalidate: {
			all: conf.js_files
		},

		// JS: Validate JS files (2).
		jshint: {
			all: conf.js_files,
			options: {
				curly:   true,
				browser: true,
				eqeqeq:  true,
				immed:   true,
				latedef: true,
				newcap:  true,
				noarg:   true,
				sub:     true,
				undef:   true,
				boss:    true,
				eqnull:  true,
				unused:  true,
				quotmark: 'single',
				predef: [
					'jQuery',
					'Backbone',
					'_'
				],
				globals: {
					exports: true,
					module:  false
				}
			}
		},
        // JS: Compile/minify js files.
		uglify: {
			all: {
				files: [{
					expand: true,
					src: ['*.js', '!*.min.js', '!Gruntfile.js', '!Gulpfile.js'],
					ext: '.min.js',
					extDot: 'last'
				}],
				options: {
					banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
						' * <%= pkg.homepage %>\n' +
						' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
						' * Licensed GPLv2+' +
						' */\n',
					mangle: {
						except: ['jQuery']
					}
				}
			}
		}
 	});

 	grunt.registerTask( 'js', ['jsvalidate', 'jshint', 'uglify'] );
};