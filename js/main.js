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

  function showStudents() {
    selectMenuItem(menuItems.students);
    content.html(templates.students(jsonData.students));
    document.title = 'Студенты - ШРИ 2013';
  }

  function getCoords(event) {
    var x = event.clientX,
      y = event.clientY;
    if (!x) {
      var touch = event.originalEvent.touch || event.originalEvent.touches[0] ||
        event.originalEvent.changedTouches[0];
      if (touch) {
        x = touch.pageX;
        y = touch.pageY;
      }
    }
    return {'x': x, 'y': y};
  }

  function touchMove(event) {
    var x2 = getCoords(event).x;
    deg += x2 - x;
    x = x2;
    $('.student-view-avatar').css('-webkit-filter', 'hue-rotate(' + deg + 'deg)');
    return false;
  }

  function touchEnd() {
    $(document).unbind('.touch');
  }

  var deg = 0;
  var x = 0;
  function touchStart(event) {
    x = getCoords(event).x;
    $(document).bind('touchmove.touch', touchMove);
    $(document).bind('touchend.touch', touchEnd);
  }

  function showStudent(hash) {
    var id = extractStudentId(hash),
      student = jsonData.students[id];
    selectMenuItem(menuItems.students);
    content.html(templates.student(student));
    document.title = student.first_name + ' ' + student.last_name + ' - ШРИ 2013';
    deg = 0;
    $('.student-view-avatar').bind('touchstart', touchStart);
  }

  function initHistory() {
    historyManager = new HistoryManager();
    historyManager.setDefaultState(showAbout);
    historyManager.addState(/lectures/, showLectures);
    historyManager.addState(/lecture\/\d+/, showLecture);
    historyManager.addState(/students/, showStudents);
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

  function initMenu() {
    menuItems.about.on('click', menuItemClick.bind(undefined, ''));
    menuItems.lectures.on('click', menuItemClick.bind(undefined, 'lectures'));
    menuItems.students.on('click', menuItemClick.bind(undefined, 'students'));
  }

  function initEvents() {
    content.on('click', '.lecture', lectureClick);
    content.on('click', '.student', studentClick);
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
