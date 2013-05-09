module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('stripe.jquery.json'),
		jshint: {
			all: ['src/*.js'],
			options: {
				browser: true,
				bitwise: true,
				eqeqeq: true,
				passfail: false,
				nomen: false,
				plusplus: false,
				undef: true,
				evil: true,
				devel: true
			},
			globals: {
				jQuery: true,
				Zepto: true,
				module: true
			}
		},
		uglify: {
			options: {
				banner: [
					'/**',
					'	jQuery Plugin .stripe( options )',
					'	@version  : <%= pkg.version %>',
					'	@author   : Bruce Thomas',
					'	@requires : jquery<%= pkg.dependencies.jquery %>',
					'	@github   : <%= pkg.docs %>',
					'*/',
					''
				].join('\n')
			},
			dist: {
				src: 'src/jquery.<%= pkg.name %>.js',
				dest: 'dist/jquery.<%= pkg.name %>.min.js'
			}
		},
		copy: {
			main: {
				files: {
					"dist/" : ['src/**']
				}
			}
		},
		concat: {
			options: {
				stripBanners: true,
				banner: [
					'/**',
					'	jQuery Plugin .stripe( options )',
					'	@version  : <%= pkg.version %>',
					'	@author   : Bruce Thomas',
					'	@requires : jquery<%= pkg.dependencies.jquery %>',
					'	@github   : <%= pkg.docs %>',
					'*/',
					''
				].join('\n')
			},
			dist: {
				src: 'src/jquery.<%= pkg.name %>.js',
				dest: 'dist/jquery.<%= pkg.name %>.js'
			}
		}
	});

	//grunt.loadTasks('tasks');

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'concat','uglify']);
	//grunt.registerTask('default', ['copy', 'concat','uglify']);

};
