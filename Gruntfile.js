module.exports = function(grunt) {

  // Project configuration.
  var jsFiles = [
    'js/jquery-1.10.2.min.js',
    'out/js/json.js',
    'js/crossbrowser.js',
    'js/history-manager.js',
    'out/js/templates.js',
    'js/main.js'
  ];
  var jsDest = 'out/js/concat.js';

  var uglifyFiles = {};
  uglifyFiles[jsDest] = jsFiles;

  var htmlFiles = {
    'out/index.html': 'index.html'
  };

  var imgFiles = [{
    expand: true,
    cwd: 'img/',
    src: ['**/*.{png,jpg,gif}'],
    dest: 'out/img'
  }];

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
          'out/js/concat.js': 'out/js/concat.js'
        }
      }
    },
    html_minify: {
      compile: {
        files: htmlFiles
      }
    },
    copy: {
      html: {
        files: htmlFiles
      },
      img: {
        files: imgFiles
      }
    },
    compileDot: {
      compile: {
        files: {
          'out/js/templates.js': 'templates/*.dot'
        }
      }
    },
    transformJSON: {
      compile: {
        files: {
          'out/json/students.json': 'json/students.json',
          'out/json/lectures.json': 'json/lectures.json'
        },
        fields: [
          'link_photo',
          'link_facebook',
          'link_vk',
          'link_gihub',
          'link_yaru'
        ]
      }
    },
    concatJSON: {
      compile: {
        files: {
          'out/js/json.js': 'out/json/*.json'
        }
      }
    },
    concatJS: {
      compile: {
        files: uglifyFiles
      }
    },
    imagemin: {
      compile: {
        files: imgFiles
      }
    },
    loadImages: {
      compile: {}
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-minify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-dot');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Default task(s).
  grunt.registerTask('default', ['stylus', 'compileDot', 'transformJSON', 'concatJSON', 'concatJS', 'copy:html', 'copy:img']);
  grunt.registerTask('production', ['stylus', 'compileDot', 'transformJSON', 'concatJSON', 'concatJS', 'uglify', 'html_minify', 'imagemin']);

};
