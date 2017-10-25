module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
       
        htmlhint: {
   			index: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'doctype-first': true,
					'spec-char-escape': true,
					'id-unique': true,
					'attr-no-duplication': true,
					'tag-self-close': true,
					'style-disabled': true
				},
				src: ['html--reader.tpl.php']
			},
			others: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'spec-char-escape': true,
					'id-unique': true,
					'attr-no-duplication': true,
					'tag-self-close': true,
					'style-disabled': true
				},
				src: ['404.html','reader.html', 'printer.html']
			}
		},
		jshint: {
			options: {
				
			  curly: true,
			  eqeqeq: true,
			  eqnull: true,
			  browser: true,
			  devel: true,
			  globals: {
				angular:true,
				jQuery: true,
				$:true,
				app:true,
				dataLayer:true,
				manifest:true,
                scrollMonitor:true
			  },
			  undef: true,
			  unused: true
			},
			files: {
				src: ['js/*.js','!js/*.min.js']
			}

		},
		uglify: {
			options: {
			  mangle: {
				except: ['$routeProvider', '$locationProvider', '$scope', '$routeParams', '$location']
			  }
			},
    		min: {
        		files: grunt.file.expandMapping(['js/**/*.js'], 'js/min/', {
            		rename: function(destBase, destPath) {
                		return destBase+destPath.replace('.js', '.min.js');
            		}
        		}),
                options: {
                    sourcemap: 'auto'
                }
    		}
		},
		sass: {
    		build: {
        		files: grunt.file.expandMapping(['dev-css/*.scss'], '', {
            		rename: function(destBase, destPath) {
                		return destBase+destPath.replace('.scss', '.css');
            		}
        		})
    		}
		},
		cssmin: {
    		target: {
        		files: [{
				  expand: true,
				  cwd: 'css',
				  src: ['*.css', '!*.min.css'],
				  dest: 'css/min',
				  ext: '.min.css'
				}]
			}
		},
		watch: {
 			html: {
        		files: ['*.html','*.php'],
        		tasks: ['htmlhint']
    		},
    		js: {
    			files: ['js/*.js'],
    			tasks: ['jshint']
    		},
    		scss: {
    			files: ['dev-css/*.scss'], 
    			tasks: ['sass','postcss']
    		}
		},
        
        postcss: {
            options: {
                 processors: [require('autoprefixer')({browsers:['>1%','last 2 versions']})]
            },
            dist: {
                 src: 'dev-css/reader.css',
                dest: 'css/reader.css'
            }
        }
    });

    grunt.registerTask('default', []);

};