var $menuItems;
var selectMenuItem;

/**
 * Работает с меню
 */
$(function() {
  "use strict";

  var $selectedMenuItem;
  $menuItems = {
    about: $('#about'),
    lectures: $('#lectures'),
    students: $('#students')
  };
  $selectedMenuItem = $menuItems.about;

  /**
   * Выделяет нужный пункт меню, выключает старый
   * @param {jQuery} $item
   */
  selectMenuItem = function($item) {
    if ($item !== $selectedMenuItem) {
      $selectedMenuItem.removeClass('menu-item-selected');
      $selectedMenuItem = $item.addClass('menu-item-selected');
    }
  };
});