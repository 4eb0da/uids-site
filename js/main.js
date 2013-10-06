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

  var HISTORY_UPDATE = 100;
  function HistoryManager() {
    this._states = [];
    this._prevHash = this._normalizeHash(location.hash);
    this._initListener();
  }

  HistoryManager.prototype._normalizeHash = function(hash) {
    if (hash.charAt(0) === '#') {
      return hash.substring(1);
    }
    return hash;
  };

  HistoryManager.prototype._initListener = function() {
    var handler = this._changeHandler.bind(this);
    if ('onhashchange' in window) {
      $(window).on('hashchange', handler);
    } else { //ie 7-?
      setInterval(handler, HISTORY_UPDATE);
    }
  };

  HistoryManager.prototype._changeHandler = function() {
    var hash = this._normalizeHash(location.hash);
    if (hash !== this._prevHash) {
      this._prevHash = hash;
      this._update(hash);
    }
  };

  HistoryManager.prototype._update = function(hash) {
    var i,
      len,
      state;
    for (i = 0, len = this._states.length; i < len; ++i) {
      state = this._states[i];
      if (state.regexp.test(hash)) {
        state.callback(hash);
        return;
      }
    }
    if (this._defaultState) {
      this._defaultState(hash);
    }
  };

  HistoryManager.prototype.addState = function(regexp, callback) {
    this._states.push({
      regexp: regexp,
      callback: callback
    });
  };

  HistoryManager.prototype.setDefaultState = function(callback) {
    this._defaultState = callback;
  };

  HistoryManager.prototype.goTo = function(hash) {
    location.hash = hash;
    this._prevHash = hash;
    this._update(hash);
  };

  HistoryManager.prototype.start = function() {
    this._update(this._prevHash);
  };

  function selectMenuItem(item) {
    if (item !== selectedMenuItem) {
      selectedMenuItem.removeClass('menu-item-selected');
      selectedMenuItem = item.addClass('menu-item-selected');
    }
  }

  function showAbout() {
    selectMenuItem(menuItems.about);
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