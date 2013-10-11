module.exports = function(grunt) {
  "use strict";

  grunt.task.registerMultiTask('transformJSON', 'Transforms links in json', function() {
    var fields = this.data.fields,
      dest,
      src,
      json;
    this.files.forEach(function(files) {
      dest = files.dest;
      src = files.src[0];
      json = grunt.file.readJSON(src);
      json.forEach(function(item) {
        fields.forEach(function(field) {
          var value;
          if (item.hasOwnProperty(field)) {
            value = item[field];
            if (value.substring(0, 4) !== 'http' && value.charAt(0) !== '/') {
              item[field] = '//' + value;
            }
          }
        });
      });
      grunt.file.write(dest, JSON.stringify(json));
    });
    grunt.log.writeln('Transform ' + this.files.length + ' json files ended successfully.');
  });
};