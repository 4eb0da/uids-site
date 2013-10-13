$(function() {
  "use strict";

  var $content = $('#content');

  function showAbout() {
    selectMenuItem($menuItems.about);
    $content.html(templates.about());
    document.title = 'О ШРИ - ШРИ 2013';
  }

  function init() {
    $menuItems.about.on('click', historyManager.goTo.bind(historyManager, ''));
    historyManager.setDefaultState(showAbout);
  }

  init();
});