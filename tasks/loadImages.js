module.exports = function(grunt) {
  "use strict";

  grunt.task.registerMultiTask('loadImages', 'Loads required images and creates small versions of it', function() {
    var students = require(__dirname + '/../json/students.json');
    var http = require('http-get');
    var fs = require('fs');
    var im = require('imagemagick');
    var path = require('path');
    var process = require('process');
    var counter = 0;
    var totalCount = 0;
    var imagesCount = 0;
    var done = this.async();

    var MAX_SIZE = 150;
    var largePath = __dirname + '/../img/students-large/';
    var smallPath = __dirname + '/../img/students-small/';

    if (!fs.existsSync(largePath)) {
      fs.mkdirSync(largePath);
    }
    if (!fs.existsSync(smallPath)) {
      fs.mkdirSync(smallPath);
    }

    function increaseCount() {
      process.nextTick(function() {
        if (++counter === totalCount) {
          grunt.log.writeln('Created ' + imagesCount + ' images');
          done(true);
        }
      });
    }

    students.forEach(function (student, index) {
      var avatar = student.link_photo;
      if (!avatar) {
        console.log('No avatar', index);
        return;
      }
      ++totalCount;
      http.get({url: avatar, bufferType: 'buffer'}, function (err, result) {
        increaseCount();
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
        var filePath = path.normalize(largePath + index + '.' + extension);
        ++totalCount;
        fs.writeFile(filePath, result.buffer, function(err) {
          increaseCount();
          if (err) {
            console.log(err);
            return;
          }
          ++imagesCount;
          console.log(filePath);
          ++totalCount;
          im.identify(filePath, function(err, info) {
            increaseCount();
            var scale = 1;
            if (err) {
              console.log(err);
              return;
            }
            if (info.width >= info.height) {
              scale = MAX_SIZE / info.width;
            } else {
              scale = MAX_SIZE / info.height;
            }
            ++totalCount;
            im.resize({
              srcPath: filePath,
              dstPath: filePath.replace('students-large', 'students-small'),
              width: Math.round(info.width * scale),
              height: Math.round(info.height * scale)
            }, function(err) {
              increaseCount();
              if (err) {
                console.log(err);
              } else {
                ++imagesCount;
              }
            });
          });
        });
      });
    });
  });
};