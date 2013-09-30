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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['stylus', 'uglify']);

};