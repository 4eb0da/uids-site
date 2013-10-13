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
   * Переход на страницу "about"
   * @returns {Boolean}
   */
  function goToAbout() {
    historyManager.goTo('');
    return false;
  }

  /**
   * Инициализация
   */
  function init() {
    $menuItems.about.on('click', goToAbout);
    historyManager.setDefaultState(showAbout);
  }

  init();
});