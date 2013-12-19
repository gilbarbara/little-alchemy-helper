/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			extensions: {
				src: [
					'bower_components/underscore/underscore.js',
					'bower_components/jquery/jquery.js',
					'bower_components/backbone/backbone.js',
					'assets/js/mixins.js',
					'assets/js/plugins.js',
					'bower_components/data-selector/src/jquery.data-selector.js',
					'bower_components/jquery.fn/sortElements/jquery.sortElements.js',
					'bower_components/jquery.cookie/jquery.cookie.js',
					'bower_components/unveil/jquery.unveil.js'
				],
				dest: 'assets/dist/extensions.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			extensions: {
				src: '<%= concat.extensions.dest %>',
				dest: 'assets/dist/extensions.min.js'
			},
			app: {
				src: 'assets/js/app.js',
				dest: 'assets/dist/app.min.js'
			}
		},
		clean: {
			extensions: ['<%= concat.extensions.dest %>']
		},
		copy: {
			main: {
				files: [
					{expand: true, flatten: true, src: ['bower_components/jquery/jquery.min.js'], dest: 'assets/dist/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['bower_components/bootstrap/dist/css/bootstrap.min.css'], dest: 'assets/dist/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['bower_components/respond/respond.min.js'], dest: 'assets/dist/', filter: 'isFile'},
					{expand: true, cwd: 'bower_components/', src: ['font-awesome/css/*', 'font-awesome/fonts/*'], dest: 'assets/dist'}
				]
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			extensions: {
				src: ['assets/js/mixins.js']
			},
			app: ['assets/js/app.js']

		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');


	// Default task.
	grunt.registerTask('default', ['jshint:app', 'uglify:app']);
	grunt.registerTask('ext', ['jshint:extensions', 'concat:extensions', 'uglify:extensions', 'clean:extensions']);
	grunt.registerTask('all', ['jshint', 'concat', 'uglify', 'copy', 'clean']);

};
