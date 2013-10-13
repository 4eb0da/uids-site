$(function(){
	"use strict";

  var content = $('#content'),
    historyManager,
    menuItems = {
      about: $('#about'),
      lectures: $('#lectures'),
      students: $('#students')
    },
    selectedMenuItem = menuItems.about;

  function selectMenuItem(item) {
    if (item !== selectedMenuItem) {
      selectedMenuItem.removeClass('menu-item-selected');
      selectedMenuItem = item.addClass('menu-item-selected');
    }
  }

  function showAbout() {
    selectMenuItem(menuItems.about);
    content.html(templates.about());
    document.title = 'О ШРИ - ШРИ 2013';
  }

  function showLectures() {
    selectMenuItem(menuItems.lectures);
    content.html(templates.lectures(jsonData.lectures));
    document.title = 'Лекции - ШРИ 2013';
  }

  function extractLectureId(hash) {
    return hash.match(/lecture\/(\d+)/)[1];
  }

  function extractStudentId(hash) {
    return hash.match(/student\/(\d+)/)[1];
  }

  function showLecture(hash) {
    var id = extractLectureId(hash);
    selectMenuItem(menuItems.lectures);
    content.html(templates.lecture(jsonData.lectures[id]));
    document.title = jsonData.lectures[id].title + ' - ШРИ 2013';
  }

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
      width = content.children().eq(0).width(),
      $avatars = content.find('img'),
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
    selectMenuItem(menuItems.students);
    content.html(templates.students(jsonData.students));
    if (scrollChanged(resizeAvatars)) {
      resizeAvatars();
    }
    $(window).on('resize.students', resizeAvatars);
    document.title = 'Студенты - ШРИ 2013';
  }

  function hideStudents() {
    $(window).off('.students');
  }

  function showStudent(hash) {
    var id = extractStudentId(hash),
      student = jsonData.students[id];
    selectMenuItem(menuItems.students);
    content.html(templates.student(student));
    document.title = student.first_name + ' ' + student.last_name + ' - ШРИ 2013';
  }

  function initHistory() {
    historyManager = new HistoryManager();
    historyManager.setDefaultState(showAbout);
    historyManager.addState(/lectures/, showLectures);
    historyManager.addState(/lecture\/\d+/, showLecture);
    historyManager.addState(/students/, showStudents, hideStudents);
    historyManager.addState(/student\/\d+/, showStudent);
  }

  function menuItemClick(hash, event) {
    if (event.button === 0) {
      event.preventDefault();
      historyManager.goTo(hash);
    }
  }

  function lectureClick(event) {
    if (event.button === 0) {
      historyManager.goTo($(event.target).closest('.lecture').attr('href'));
    }
  }

  function studentClick(event) {
    if (event.button === 0) {
      historyManager.goTo($(event.target).closest('.student').attr('href'));
    }
  }

  function backClick(event) {
    if (event.button === 0) {
      if ($(event.target).hasClass('button-back-student')) {
        historyManager.goTo('students');
      } else {
        historyManager.goTo('lectures');
      }
    }
  }

  function initMenu() {
    menuItems.about.on('click', menuItemClick.bind(undefined, ''));
    menuItems.lectures.on('click', menuItemClick.bind(undefined, 'lectures'));
    menuItems.students.on('click', menuItemClick.bind(undefined, 'students'));
  }

  function initEvents() {
    content.on('click', '.lecture', lectureClick);
    content.on('click', '.student', studentClick);
    content.on('click', '.button-back', backClick);
  }

  function init() {
    initHistory();
    initMenu();
    initEvents();
  }

  function start() {
    historyManager.start();
  }

  init();
  start();
});
