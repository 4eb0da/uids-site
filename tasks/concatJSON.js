module.exports = function(grunt) {
  "use strict";

  grunt.task.registerMultiTask('concatJSON', 'Concats .json files into one js file', function() {
    var json = [],
      dest = this.files[0].dest,
      counter = 0;
    this.filesSrc.forEach(function(file) {
      var name = file.match(/([^\\\/\.]+)\.json/)[1];
      json.push(name + ': ' + JSON.stringify(grunt.file.readJSON(file)));
      ++counter;
    });
    grunt.file.write(dest, 'var jsonData = {\n' + json.join(',\n') + '\n};');
    grunt.log.writeln('File "' + dest + '" with ' + counter + ' json files created.');
  });
};