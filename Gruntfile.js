module.exports = function(grunt) {

  // Project configuration.
  var jsFiles = ['js/jquery-1.10.2.min.js', 'js/main.js', 'out/js/templates.js'];
  var jsDest = 'out/js/concat.js';

  var uglifyFiles = {};
  uglifyFiles[jsDest] = jsFiles;

  var htmlFiles = {
    'out/index.html': 'index.html'
  };

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
        files: uglifyFiles
      }
    },
    concat: {
      compile: {
        src: jsFiles,
        dest: jsDest
      }
    },
    html_minify: {
      compile: {
        files: htmlFiles
      }
    },
    copy: {
      compile: {
        files: htmlFiles
      }
    },
    dot: {
      compile: {
        files: {
          'out/js/templates.js': 'templates/*.dot'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-minify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-dot');

  // Default task(s).
  grunt.registerTask('default', ['stylus', 'dot', 'concat', 'copy']);
  grunt.registerTask('production', ['stylus', 'dot', 'uglify', 'html_minify']);

};
