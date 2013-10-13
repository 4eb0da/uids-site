module.exports = function(grunt) {
  "use strict";

  grunt.task.registerMultiTask('mergeJSON', 'Merges students.json and avatars.json into one', function() {
    var students = grunt.file.readJSON(__dirname + '/../work/students.json'),
      avatars = grunt.file.readJSON(__dirname + '/../work/avatars.json');
    students.forEach(function(student, index) {
      var avatar = avatars[index];
      if (avatar) {
        student.large_avatar = avatar.large;
        student.small_avatar = avatar.small;
        student.avatar_width = avatar.smallWidth;
        student.avatar_height = avatar.smallHeight;
      }
    });
    grunt.file.write(__dirname + '/../work/json/students.json', JSON.stringify(students));
    grunt.log.writeln('Created merged students.json file');
  });
};