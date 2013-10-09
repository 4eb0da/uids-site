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
    document.title = 'About SHRI - SHRI 2013';
  }

  function showLectures() {
    selectMenuItem(menuItems.lectures);
    content.html(templates.lectures(jsonData.lectures));
    document.title = 'Lectures - SHRI 2013';
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
    document.title = jsonData.lectures[id].title + ' - SHRI 2013';
  }

  function showStudents() {
    selectMenuItem(menuItems.students);
    content.html(templates.students(jsonData.students));
    document.title = 'Students - SHRI 2013';
  }

  function showStudent(hash) {
    var id = extractStudentId(hash);
    selectMenuItem(menuItems.students);
    content.html(templates.student(jsonData.students[id]));
    document.title = jsonData.students[id].name + ' - SHRI 2013';
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
