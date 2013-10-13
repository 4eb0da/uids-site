$(function() {
  "use strict";

  var $content = $('#content');

  var MIN_HEIGHT = 100;
  var MAX_HEIGHT = 150;
  var PREFERRED_HEIGHT = 125;
  var MARGIN = 6;

  function setAvatarsHeight($avatars, start, end, height) {
    var i,
      student,
      scale;
    for (i = start; i < end; ++i) {
      student = jsonData.students[i];
      scale = height / student.avatar_height;
      $avatars.eq(i)
        .width(student.avatar_width * scale)
        .height(student.avatar_height * scale);
    }
  }

  function preferredSize(first, width, firstWidth, firstHeight) {
    var sum = 0,
      students = jsonData.students,
      height = PREFERRED_HEIGHT,
      count = first,
      len = students.length,
      i,
      tempHeight,
      availableWidth;
    for (i = first + 1; i < len; ++i) {
      availableWidth = width - (i - first + 1) * (MARGIN + 1);
      sum += (students[i].avatar_width * firstHeight) / students[i].avatar_height;
      tempHeight = availableWidth * firstHeight / (firstWidth + sum);
      if (tempHeight >= MIN_HEIGHT && tempHeight <= MAX_HEIGHT) {
        count = i;
        height = tempHeight;
      }
    }
    return [count, height];
  }

  function resizeAvatars() {
    var first = 0,
      len = jsonData.students.length,
      width = $content.children().eq(0).width(),
      $avatars = $content.find('img'),
      count,
      firstStudent,
      preferred;
    while (first < len) {
      firstStudent = jsonData.students[first];
      preferred = preferredSize(first, width, firstStudent.avatar_width, firstStudent.avatar_height);
      count = preferred[0];
      if (count > first) {
        setAvatarsHeight($avatars, first, count + 1, preferred[1]);
        first = count + 1;
      } else {
        setAvatarsHeight($avatars, first, len, PREFERRED_HEIGHT);
        first = len;
      }
    }
  }

  function scrollChanged(func) {
    var $win = $(window),
      $body = $('body'),
      hasScroll = $win.height() < $body.height();
    func();
    return hasScroll !== ($win.height() < $body.height());
  }

  function showStudents() {
    selectMenuItem($menuItems.students);
    $content.html(templates.students(jsonData.students));
    if (scrollChanged(resizeAvatars)) {
      resizeAvatars();
    }
    $(window).on('resize.students', resizeAvatars);
    document.title = 'Студенты - ШРИ 2013';
  }

  function hideStudents() {
    $(window).off('.students');
  }

  function extractStudentId(hash) {
    return hash.match(/student\/(\d+)/)[1];
  }

  function showStudent(hash) {
    var id = extractStudentId(hash),
      student = jsonData.students[id];
    selectMenuItem($menuItems.students);
    $content.html(templates.student(student));
    document.title = student.first_name + ' ' + student.last_name + ' - ШРИ 2013';
  }

  function studentClick(event) {
    if (event.button === 0) {
      historyManager.goTo($(event.target).closest('.student').attr('href'));
    }
  }

  function init() {
    var goToStudents = historyManager.goTo.bind(historyManager, 'students');
    $menuItems.students.on('click', goToStudents);
    $content.on('click', '.button-back-student', goToStudents);
    $content.on('click', '.student', studentClick);
    historyManager.addState(/students/, showStudents, hideStudents);
    historyManager.addState(/student\/\d+/, showStudent);
  }

  init();
});