var $menuItems;
var selectMenuItem;

$(function() {
  "use strict";

  var $selectedMenuItem;
  $menuItems = {
    about: $('#about'),
    lectures: $('#lectures'),
    students: $('#students')
  };
  $selectedMenuItem = $menuItems.about;

  selectMenuItem = function($item) {
    if ($item !== $selectedMenuItem) {
      $selectedMenuItem.removeClass('menu-item-selected');
      $selectedMenuItem = $item.addClass('menu-item-selected');
    }
  };
});