module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concurrent: {
			tasks: ['nodemon','watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		clean: {
			js: {
				src: ['public/js/simple.js']
			},
			css: {
				src: ['public/css/simple.css']
			}
		},
		concat: {
			js: {
				src: [
					'public/vendor/jquery/*.js',
					'public/vendor/jquery-ui/*.js',
					'public/vendor/underscore/*.js',
					'public/vendor/backbone/*.js',
					'public/vendor/frame/*.js',
					'public/js/model/*.js',
					'public/js/view/*.js',
					'public/js/page/*.js'
				],
				dest: 'public/js/simple.js'
			}
		},
		uglify: {
			js: {
				files: {
					'public/js/simple.js': ['public/js/simple.js']
				}
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				src: [
					'public/css/site.scss'
				],
				dest: 'public/css/simple.css'
			}
		},
		watch: {
			scripts: {
				files: [
					'public/vendor/frame/*.js',
					'public/js/model/*.js',
					'public/js/view/*.js',
					'public/js/page/*.js'
				],
				tasks: ['regenJS']
			},
			css: {
				files: [
					'public/css/*.scss'
				],
				tasks: ['regenCSS']
			}
		},
		nodemon: {
			dev: {
				script: 'app.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['clean','sass', 'concat:js', 'uglify', 'concurrent']);
	grunt.registerTask('regenJS', ['clean:js', 'concat:js', 'uglify']);
	grunt.registerTask('regenCSS', ['clean:css', 'sass'])};