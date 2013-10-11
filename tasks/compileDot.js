module.exports = function(grunt) {
  "use strict";

  grunt.task.registerMultiTask('compileDot', 'Compiles dot templates into one js file', function() {
    var dot = require('dot'),
      toSource = require('tosource'),
      dest = this.files[0].dest,
      res = {},
      counter = 0;
    dot.templateSettings.selfcontained = true;
    this.filesSrc.forEach(function(file) {
      var func = dot.template(grunt.file.read(file)),
        name = file.match(/([^\\\/\.]+)\.dot/)[1];
      res[name] = func;
      ++counter;
    });
    grunt.file.write(dest, 'var templates = ' + toSource(res) + ';');
    grunt.log.writeln('File "' + dest + '" with ' + counter + ' templates created.');
  });
};