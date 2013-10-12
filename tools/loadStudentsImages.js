(function () {
  "use strict";

  var students = require(__dirname + '/../json/students.json');
  var http = require('http-get');
  var fs = require('fs');
  var im = require('imagemagick');
  var path = require('path');

  students = students.slice(0, 1);

  students.forEach(function (student, index) {
    var avatar = student.link_photo;
    if (!avatar) {
      console.log('No avatar', index);
      return;
    }
    http.get({url: avatar, bufferType: 'buffer'}, function (err, result) {
      if (err) {
        console.log(avatar, index, err);
        return;
      }
      var contentType = result.headers['content-type'],
        extension;
      if (contentType === 'image/jpeg') {
        extension = 'jpg';
      } else if (contentType === 'image/png') {
        extension = 'png';
      } else {
        console.log('Unknown content-type', contentType);
        return;
      }
      var filePath = path.normalize(__dirname + '/../img/students-large/' + index + '.' + extension);
      fs.writeFile(filePath, result.buffer, function(err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(filePath);
        im.identify(filePath, function(err, info) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(info.width, info.height);
        });
      });
    });
  });
})();