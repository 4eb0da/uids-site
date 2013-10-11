module.exports = function(grunt) {
  "use strict";

  grunt.task.registerMultiTask('concatJS', 'Concats all .js files into one', function() {
    var dest = this.files[0].dest,
      res = '',
      counter = 0;
    this.filesSrc.forEach(function(file) {
      res += grunt.file.read(file);
      ++counter;
    });
    grunt.file.write(dest, '(function() {\n"use strict";\n' + res + '\n})();');
    grunt.log.writeln('File "' + dest + '" with ' + counter + ' js files created.');
  });
};