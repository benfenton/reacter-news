var ReacterNewsDispatcher = require('../dispatcher/ReacterNewsDispatcher');
var ReacterNewsConstants = require('../constants/ReacterNewsConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ReacterNewsConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _comments = new Map();

function _addComment(rawComments) {

  if(!rawComments.comment.deleted) {

    var count = _comments.get(rawComments.parent) && _comments.get(rawComments.parent).count || 0;
    var comments = _comments.get(rawComments.parent) && _comments.get(rawComments.parent).comments || new Map();

    if(!comments.get(rawComments.comment.id)){
      count += 1;
      comments.set(rawComments.comment.id, rawComments.comment);

      _comments.set(rawComments.parent, {
        count: count,
        comments: comments
      });
    }
  }
}

var CommentsStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCommentById: function(parent) {
    return _comments.get(parseInt(parent)) || new Map();
  },

  getAllComments: function() {
    return _comments;
  }
});

CommentsStore.dispatchToken = ReacterNewsDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {
    case ActionTypes.RECEIVE_RAW_COMMENTS:
      _addComment(action.rawComments);
      CommentsStore.emitChange();
      break;
    default:
      break;
  }

});

module.exports = CommentsStore;