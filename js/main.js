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
      students: $('#students'),
      lectures: $('#lectures')
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

  function showStudents() {
    selectMenuItem(menuItems.students);
  }

  function showLectures() {
    selectMenuItem(menuItems.lectures);
  }

  function initHistory() {
    historyManager = new HistoryManager();
    historyManager.setDefaultState(showAbout);
    historyManager.addState(/students/, showStudents);
    historyManager.addState(/lectures/, showLectures);
  }

  function menuItemClick(hash, event) {
    if (event.button === 0) {
      historyManager.goTo(hash);
    }
  }

  function initMenu() {
    menuItems.about.on('click', menuItemClick.bind(undefined, ''));
    menuItems.students.on('click', menuItemClick.bind(undefined, 'students'));
    menuItems.lectures.on('click', menuItemClick.bind(undefined, 'lectures'));
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