module.exports = function(grunt) {

  // Project configuration.
  var jsFiles = ['js/jquery-1.10.2.min.js', 'out/js/json.js', 'js/main.js', 'out/js/templates.js'];
  var jsDest = 'out/js/concat.js';

  var uglifyFiles = {};
  uglifyFiles[jsDest] = jsFiles;

  var htmlFiles = {
    'out/index.html': 'index.html'
  };

  var imgFiles = [{
    expand: true,
    cwd: 'img/',
    src: ['**.{png,jpg,gif}'],
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
      html: {
        files: htmlFiles
      },
      img: {
        files: imgFiles
      }
    },
    dot: {
      compile: {
        files: {
          'out/js/templates.js': 'templates/*.dot'
        }
      }
    },
    concatJSON: {
      compile: {
        files: {
          'out/js/json.js': 'json/*.json'
        }
      }
    },
    imagemin: {
      compile: {
        files: imgFiles
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-minify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-dot');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  
  grunt.task.registerMultiTask('concatJSON', 'Concats .json files into one js file', function() {
    var json = [],
      dest = this.files[0].dest,
      counter = 0;
    this.filesSrc.forEach(function(file) {
      var name = file.match(/([^\\\/\.]+).json/)[1];
      json.push(name + ': ' + JSON.stringify(grunt.file.readJSON(file)));
      ++counter;
    });
    grunt.file.write(dest, 'var jsonData = {\n' + json.join(',\n') + '\n};');
    grunt.log.writeln('File "' + dest + '" with ' + counter + ' json files created.');
  });

  // Default task(s).
  grunt.registerTask('default', ['stylus', 'dot', 'concatJSON', 'concat', 'copy:html', 'copy:img']);
  grunt.registerTask('production', ['stylus', 'dot', 'concatJSON', 'uglify', 'html_minify', 'imagemin']);

};
