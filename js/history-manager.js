var HistoryManager;

/**
 * Модуль для работы с историей
 */
(function() {
  "use strict";

  /**
   * Интервал проверки изменения hash, для браузеров, которые не поддерживают onhashchange
   */
  var HISTORY_UPDATE = 100;

  /**
   * Функция-конструктор класса
   * @constructor
   */
  HistoryManager = function() {
    this._states = [];
    this._prevHash = this._normalizeHash(location.hash);
    this._currentState = undefined;
    this._initListener();
  };

  /**
   * Убирает решётку из строки, если она есть
   * @param {String} hash
   * @returns {String}
   * @private
   */
  HistoryManager.prototype._normalizeHash = function(hash) {
    if (hash.charAt(0) === '#') {
      return hash.substring(1);
    }
    return hash;
  };

  /**
   * Подписывается на изменения hash'а
   * @private
   */
  HistoryManager.prototype._initListener = function() {
    var handler = this._changeHandler.bind(this);
    if ('onhashchange' in window) {
      $(window).on('hashchange', handler);
    } else { //ie 6-?
      setInterval(handler, HISTORY_UPDATE);
    }
  };

  /**
   * Обработчик изменения hash'а
   * @private
   */
  HistoryManager.prototype._changeHandler = function() {
    var hash = this._normalizeHash(location.hash);
    if (hash !== this._prevHash) {
      this._prevHash = hash;
      this._update(hash);
    }
  };

  /**
   * Находит нужное состояние, соответствующее hash'у
   * @param {String} hash
   * @private
   */
  HistoryManager.prototype._update = function(hash) {
    var i,
      len,
      state;
    for (i = 0, len = this._states.length; i < len; ++i) {
      state = this._states[i];
      if (state.regexp.test(hash)) {
        if (this._currentState && this._currentState.outback) {
          this._currentState.outback();
        }
        this._currentState = state;
        state.callback(hash);
        return;
      }
    }
    if (this._defaultState) {
      this._defaultState(hash);
    }
  };

  /**
   * Добавляет состояние в список отслеживаемых
   * @param {RegExp} regexp      Регулярное выражение, которому должен соответствовать hash
   * @param {Function} callback  Функция, которая будет вызвана после перехода в состояние
   * @param {Function} [outback] Функция, которая будет вызвана после выхода из состояния
   */
  HistoryManager.prototype.addState = function(regexp, callback, outback) {
    this._states.push({
      regexp: regexp,
      callback: callback,
      outback: outback
    });
  };

  /**
   * Устанавливает состояние по-умолчанию.
   * Если текущий hash не подходит ни под одно из известных состояний, то будет использовано это
   * @param {Function} callback Функция, которая будет вызвана при переходе в состояние
   */
  HistoryManager.prototype.setDefaultState = function(callback) {
    this._defaultState = callback;
  };

  /**
   * Использует указанный hash, переходит в состояние, которое соответствует ему
   * @param {String} hash
   */
  HistoryManager.prototype.goTo = function(hash) {
    location.hash = hash;
    this._prevHash = hash;
    this._update(hash);
    $(window).scrollTop(0);
  };

  /**
   * Выбирает подходящее состояние
   */
  HistoryManager.prototype.start = function() {
    this._update(this._prevHash);
  };
})();

var historyManager = new HistoryManager();