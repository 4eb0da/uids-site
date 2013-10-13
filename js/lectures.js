$(function() {
  "use strict";

  var $content = $('#content');

  function showLectures() {
    selectMenuItem($menuItems.lectures);
    $content.html(templates.lectures(jsonData.lectures));
    document.title = 'Лекции - ШРИ 2013';
  }

  function extractLectureId(hash) {
    return hash.match(/lecture\/(\d+)/)[1];
  }

  function showLecture(hash) {
    var id = extractLectureId(hash);
    selectMenuItem($menuItems.lectures);
    $content.html(templates.lecture(jsonData.lectures[id]));
    document.title = jsonData.lectures[id].title + ' - ШРИ 2013';
  }

  function lectureClick(event) {
    if (event.button === 0) {
      historyManager.goTo($(event.target).closest('.lecture').attr('href'));
    }
    return true;
  }

  function init() {
    var goToLectures = historyManager.goTo.bind(historyManager, 'lectures');
    $menuItems.lectures.on('click', goToLectures);
    $content.on('click', '.button-back-lecture', goToLectures);
    $content.on('click', '.lecture', lectureClick);
    historyManager.addState(/lectures/, showLectures);
    historyManager.addState(/lecture\/\d+/, showLecture);
  }

  init();
});