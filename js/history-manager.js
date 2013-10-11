var HISTORY_UPDATE = 100;
function HistoryManager() {
  this._states = [];
  this._prevHash = this._normalizeHash(location.hash);
  this._currentState = undefined;
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
      this._currentState = state;
      state.callback(hash);
      return;
    }
  }
  if (this._defaultState) {
    this._defaultState(hash);
  }
};

HistoryManager.prototype.addState = function(regexp, callback, commands) {
  this._states.push({
    regexp: regexp,
    callback: callback,
    commands: commands
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

HistoryManager.prototype.sendCommand = function(command) {
  if (this._currentState && this._currentState.commands && this._currentState.commands[command]) {
    this._currentState.commands[command]();
  }
};