/**
 * Страница со списком лекций и с просмотром одной лекции
 */
$(function() {
  "use strict";

  var $content = $('#content');

  /**
   * Показывает список лекций
   */
  function showLectures() {
    selectMenuItem($menuItems.lectures);
    $content.html(templates.lectures(jsonData.lectures));
    document.title = 'Лекции - ШРИ 2013';
  }

  /**
   * Находит идентификатор лекции по hash'у
   * @param {String} hash
   * @returns {String}
   */
  function extractLectureId(hash) {
    return hash.match(/lecture\/(\d+)/)[1];
  }

  /**
   * Показывает лекцию
   * @param {String} hash
   */
  function showLecture(hash) {
    var id = extractLectureId(hash);
    selectMenuItem($menuItems.lectures);
    $content.html(templates.lecture(jsonData.lectures[id]));
    document.title = jsonData.lectures[id].title + ' - ШРИ 2013';
  }

  /**
   * Обработчик клика по лекции в списке
   * @param {Object} event jQuery-событие
   * @returns {Boolean}
   */
  function lectureClick(event) {
    if (event.button === 0) {
      historyManager.goTo($(event.target).closest('.lecture').attr('href'));
      return false;
    }
    return true;
  }

  function goToLectures() {
    historyManager.goTo('lectures');
    return false;
  }

  /**
   * Инициализирует
   */
  function init() {
    $menuItems.lectures.on('click', goToLectures);
    $content.on('click', '.button-back-lecture', goToLectures);
    $content.on('click', '.lecture', lectureClick);
    historyManager.addState(/lectures/, showLectures);
    historyManager.addState(/lecture\/\d+/, showLecture);
  }

  init();
});