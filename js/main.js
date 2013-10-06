var templates,
  define = function(dotTemplates) {
  templates = dotTemplates().templates;
};

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
  }

  function showLectures() {
    selectMenuItem(menuItems.lectures);
    content.html(templates.lectures(jsonData.lectures));
  }

  function showStudents() {
    selectMenuItem(menuItems.students);
  }

  function initHistory() {
    historyManager = new HistoryManager();
    historyManager.setDefaultState(showAbout);
    historyManager.addState(/lectures/, showLectures);
    historyManager.addState(/students/, showStudents);
  }

  function menuItemClick(hash, event) {
    if (event.button === 0) {
      historyManager.goTo(hash);
    }
  }

  function initMenu() {
    menuItems.about.on('click', menuItemClick.bind(undefined, ''));
    menuItems.lectures.on('click', menuItemClick.bind(undefined, 'lectures'));
    menuItems.students.on('click', menuItemClick.bind(undefined, 'students'));
  }

  function init() {
    initHistory();
    initMenu();
  }

  function start() {
    historyManager.start();
  }

  init();
  start();
});