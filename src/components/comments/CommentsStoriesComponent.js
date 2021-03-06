var React = require('react');
var Router = require('react-router');
var StoriesCommentsMixin = require('../../mixins/StoriesCommentsMixin');
var GetTopStoriesAndCommentsMixin = require('../../mixins/GetTopStoriesAndCommentsMixin');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var CommentsStore = require('../../stores/CommentsStore');
var StoriesStore = require('../../stores/StoriesStore');
var CommentItemComponent = require('./CommentItemComponent');
var LoaderComponent = require('../common/LoaderComponent');
var SpacerComponent = require('../common/SpacerComponent');
var FooterComponent = require('../common/FooterComponent');
var Link = Router.Link;

function getStateFromStores() {
  return {
    stories: StoriesStore.getAllStories(),
    loading: StoriesStore.getLoadingStatus(),
    initialized: StoriesStore.getInitializedState(),
    comments: CommentsStore.getCommentsByDate()
  };
}

var CommentsStoriesComponent = React.createClass({
  mixins: [Router.State, StoriesCommentsMixin, GetTopStoriesAndCommentsMixin, PureRenderMixin],
  _setState: function() {
    if(this.isMounted()) {
      var id = this.getQuery().id;
      if(this.isMounted()) {
        this.setState(getStateFromStores(id));
      }
    }
  },
  getInitialState: function() {
    return getStateFromStores();
  },
  render: function() {
    if(this.state.loading && !this.state.initialized) {
      var renderedHTML = (
        <LoaderComponent />
      );
    }
    else {
      var comments = this.state.comments.toArray().map(function( comment, index ) {
        var parentStory = this.state.stories.filter(function( story ) {
          return story.id === comment.parentId;
        });
        return (
          <div key={index}>
            <CommentItemComponent comment={comment} parent={parentStory.get(0)} />
          </div>
        );

      }, this);

      var renderedHTML = (
        <div className='item-wrapper'>
          <div className='comment-wrapper'>
        {comments}
          </div>
          <div className='spacer-padding'></div>
          <SpacerComponent />
          <FooterComponent />
        </div>
      );
    }

    return (
      <div>
        {renderedHTML}
      </div>
    );

  }
});

module.exports = CommentsStoriesComponent;