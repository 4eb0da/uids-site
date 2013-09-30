module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    stylus: {
      compile: {
        files: {
          'out/css/styles.css': 'css/styles.styl'
        }
      }
    },
    uglify: {
      compile: {
        files: {
          'out/js/concat.js': ['js/jquery-1.10.2.min.js', 'js/main.js']
        }
      }
    },
    html_minify: {
      compile: {
        files: {
          'out/index.html': 'index.html'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-minify');

  // Default task(s).
  grunt.registerTask('default', ['stylus', 'uglify', 'html_minify']);

};