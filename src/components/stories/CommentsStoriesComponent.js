var React = require('react');
var Router = require('react-router');
var ReacterNewsWebAPIUtils = require('../../utils/ReacterNewsWebAPIUtils');
var CommentsStore = require('../../stores/CommentsStore');
var StoriesStore = require('../../stores/StoriesStore');
var PollStore = require('../../stores/PollStore');
var CommentItemComponent = require('../stories/CommentItemComponent');
var CommentsComponent = require('../comments/CommentsComponent');
var SpacerComponent = require('../common/SpacerComponent');
var FooterComponent = require('../common/FooterComponent');

var _ = require('../../utils/UnderscoreDebounce');
var moment = require('moment');
var Link = Router.Link;

function getStateFromStores() {
  return {
    stories: StoriesStore.getAllStories(),
    comments: CommentsStore.getCommentsByDate()
  };
}

var ItemComponent = React.createClass({
  mixins: [Router.State],
  statics :{
    willTransitionTo: function(transition, params, query) {
      ReacterNewsWebAPIUtils.getTopStoriesAndComments();
    }
  },
  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function() {
    StoriesStore.addChangeListener(this._onChange);
    CommentsStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    StoriesStore.removeChangeListener(this._onChange);
    CommentsStore.removeChangeListener(this._onChange);
  },
  render: function() {

    var comments = this.state.comments.map(function(comment) {
      var parentStory = this.state.stories.filter(function(story) {
        return story.id === comment.parent;
      });
      return (
        <div key={comment.comment.id}>
          <CommentItemComponent comment={comment.comment} parent={parentStory[0]} />
        </div>
      );

    }, this);

    return (
      <div className="item-wrapper">
        <div className="comment-wrapper">
        {comments}
        </div>
        <div className="spacer-padding"></div>
        <SpacerComponent />
        <FooterComponent />
      </div>
    );

  },
  /**
   * Event handler for 'change' events coming from StoriesStore
   */
  _onChange: _.debounce(function () {
    this._setState();
  }, 75),

  _setState: function() {
    if(this.isMounted()) {
      var id = this.getQuery().id;
      if(this.isMounted()) {
        this.setState(getStateFromStores(id));
      }
    }
  }
});

module.exports = ItemComponent;