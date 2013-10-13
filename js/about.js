/**
 * Страница "О ШРИ"
 * Тут нет почти ничего
 */

$(function() {
  "use strict";

  var $content = $('#content');

  /**
   * Показывает страницу "about"
   */
  function showAbout() {
    selectMenuItem($menuItems.about);
    $content.html(templates.about());
    document.title = 'О ШРИ - ШРИ 2013';
  }

  /**
   * Инициализация
   */
  function init() {
    $menuItems.about.on('click', historyManager.goTo.bind(historyManager, ''));
    historyManager.setDefaultState(showAbout);
  }

  init();
});