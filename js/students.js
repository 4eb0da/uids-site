/**
 * Страница со списком студентов и с просмотром одного студента
 */
$(function() {
  "use strict";

  var $content = $('#content');

  /**
   * Минимальная высота ряда с фотографиями пользователей
   */
  var MIN_HEIGHT = 100;
  /**
   * Максимальная высота ряда с фотографиями пользователей
   */
  var MAX_HEIGHT = 150;
  /**
   * Предпочитаемая высота ряда, если фотографий недостаточно
   */
  var PREFERRED_HEIGHT = 125;
  /**
   * Отступ фотографий друг от друга
   */
  var MARGIN = 6;

  /**
   * Устанавливает размер фотографий, чтобы у них у всех был одинаковый размер
   * @param {jQuery} $avatars Объект со всеми изображениями
   * @param {Number} start    Номер первой фотографии данного ряда
   * @param {Number} end      Номер последней фотографии данного ряда
   * @param {Number} height   Высота, которую нужно поставить для всех фотографий
   */
  function setAvatarsHeight($avatars, start, end, height) {
    var i,
      student,
      scale;
    for (i = start; i < end; ++i) {
      student = jsonData.students[i];
      scale = height / student.avatar_height;
      $avatars.eq(i)
        .width(student.avatar_width * scale)
        .height(student.avatar_height * scale);
    }
  }

  /**
   * Вычисляет параметры ряда, наиболее подходящего в данный момент
   * @param {Number} first Номер первой фотографии
   * @param {Number} firstWidth Ширина первой фотографии
   * @param {Number} firstHeight Высота первой фотографии
   * @param {Number} width Доступная ширина
   * @returns {Array} - Количество фотографии в ряду и его высота
   */
  function preferredSize(first, firstWidth, firstHeight, width) {
    var sum = 0,
      students = jsonData.students,
      height = PREFERRED_HEIGHT,
      count = first,
      len = students.length,
      i,
      tempHeight,
      availableWidth;
    for (i = first + 1; i < len; ++i) {
      availableWidth = width - (i - first + 1) * (MARGIN + 1);
      sum += (students[i].avatar_width * firstHeight) / students[i].avatar_height;
      tempHeight = availableWidth * firstHeight / (firstWidth + sum);
      if (tempHeight >= MIN_HEIGHT && tempHeight <= MAX_HEIGHT) {
        count = i;
        height = tempHeight;
      }
    }
    return [count, height];
  }

  /**
   * Пересчитывает размер всех фотографий, чтобы они размещались в соразмерные ряды
   */
  function resizeAvatars() {
    var first = 0,
      len = jsonData.students.length,
      width = $content.children().eq(0).width(),
      $avatars = $content.find('img'),
      count,
      firstStudent,
      preferred;
    while (first < len) {
      firstStudent = jsonData.students[first];
      preferred = preferredSize(first, firstStudent.avatar_width, firstStudent.avatar_height, width);
      count = preferred[0];
      if (count > first) {
        setAvatarsHeight($avatars, first, count + 1, preferred[1]);
        first = count + 1;
      } else {
        setAvatarsHeight($avatars, first, len, PREFERRED_HEIGHT);
        first = len;
      }
    }
  }

  /**
   * Возвращает true, если в ходе выполнения func появился или пропал вертикальный скроллбар
   * @param {Function} func Функция, которую нужно выполнить
   * @returns {Boolean}
   */
  function hasScrollBarChanges(func) {
    var $win = $(window),
      $body = $('body'),
      hasScroll = $win.height() < $body.height();
    func();
    return hasScroll !== ($win.height() < $body.height());
  }

  /**
   * Показывает список студентов
   */
  function showStudents() {
    selectMenuItem($menuItems.students);
    $content.html(templates.students(jsonData.students));
    if (hasScrollBarChanges(resizeAvatars)) {
      resizeAvatars();
    }
    $(window).on('resize.students', resizeAvatars);
    document.title = 'Студенты - ШРИ 2013';
  }

  /**
   * Отписывается от изменения размера окна при переходе в другое состояние
   */
  function hideStudents() {
    $(window).off('.students');
  }

  /**
   * Возвращает идентификатор человека по hash'у
   * @param {String} hash
   * @returns {String}
   */
  function extractStudentId(hash) {
    return hash.match(/student\/(\d+)/)[1];
  }

  /**
   * Показывает страницу студента. В hash'е находится идентификатор
   * @param {String} hash
   */
  function showStudent(hash) {
    var id = extractStudentId(hash),
      student = jsonData.students[id];
    selectMenuItem($menuItems.students);
    $content.html(templates.student(student));
    document.title = student.first_name + ' ' + student.last_name + ' - ШРИ 2013';
  }

  /**
   * Клик по фотографии студента в списке
   * @param {Object} event jQuery-событие
   */
  function studentClick(event) {
    if (event.button === 0) {
      historyManager.goTo($(event.target).closest('.student').attr('href'));
    }
  }

  /**
   * Инициализация
   */
  function init() {
    var goToStudents = historyManager.goTo.bind(historyManager, 'students');
    $menuItems.students.on('click', goToStudents);
    $content.on('click', '.button-back-student', goToStudents);
    $content.on('click', '.student', studentClick);
    historyManager.addState(/students/, showStudents, hideStudents);
    historyManager.addState(/student\/\d+/, showStudent);
  }

  init();
});