var React = require('react');
var Router = require('react-router');
var StoriesPollsCommentsMixin = require('../../mixins/StoriesPollsCommentsMixin');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var GetStoryMixin = require('../../mixins/GetStoryMixin');
var CommentsStore = require('../../stores/CommentsStore');
var StoriesStore = require('../../stores/StoriesStore');
var PollStore = require('../../stores/PollStore');
var StoryComponent = require('../common/StoryComponent');
var LoaderComponent = require('../common/LoaderComponent');
var CommentsComponent = require('../common/CommentsComponent');
var SpacerComponent = require('../common/SpacerComponent');
var FooterComponent = require('../common/FooterComponent');
var moment = require('moment');
var Link = Router.Link;

function getStateFromStores(id) {
  return {
    item: StoriesStore.getStory(id),
    comment: CommentsStore.getCommentById(id),
    polls: PollStore.getAllPolls(),
    loading: StoriesStore.getLoadingStatus(),
    initialized: StoriesStore.getInitializedState()
  };
}

var ItemComponent = React.createClass({
  mixins: [Router.State, StoriesPollsCommentsMixin, GetStoryMixin, PureRenderMixin],
  _setState: function() {
    if(this.isMounted()) {
      var id = this.getQuery().id;
      if(this.isMounted()) {
        this.setState(getStateFromStores(id));
      }
    }
  },
  getInitialState: function() {
    var id = this.getQuery().id;
    return getStateFromStores(id);
  },
  render: function() {
    if(this.state.loading && !this.state.initialized) {
      var renderedHTML = <LoaderComponent />;
    }
    else {
      if(this.state.item.type === 'poll') {
        var pollsValue = this.state.item.parts.map((part, index) => {
          var poll = this.state.polls.get(part) || {};
          var pollText = poll.text || '';
          var pollScore = poll.score || 0;

          var pollLabel = pollScore + ' ';

          pollLabel += (poll.score === 1) ? 'point' : 'points';

          return (
            <tr key={index}>
              <tr><td>{pollText}</td></tr>
              <tr><td className='comhead'>{pollLabel}</td></tr>
            </tr>
          );
        });

        var polls = (
          <table className='poll-wrapper'>
          {pollsValue}
          </table>
        )
      }

      var renderedHTML = (
        <div>
          <StoryComponent story={this.state.item} numberOfComments={this.state.comment.size}/>
          {polls}
          <CommentsComponent comments={this.state.item.kids} commentsValue={this.state.comment}/>
        </div>
      );

    }


    if(this.state.item.type === 'comment') {

      var comment = this.state.item;
      var time = moment.unix(comment.time).fromNow();
      var ItemLink = <Link to='item' className='story-link' query={{ id: comment.id }}>Link</Link>;
      var UserLink = <Link to='user' className='story-link' query={{ id: comment.by }}>{comment.by}</Link>;

      document.title = comment.text.replace(/<[^>]*>/g, '').replace(/&#x27;/g, '\'') + ' | Reacter News';

      return (
        <div className='item-wrapper'>
          <div className='comment-wrapper'>
            <div className='username-row no-padding'>{UserLink} {time} | {ItemLink}</div>
            <div dangerouslySetInnerHTML={{__html: comment.text}} />
            <CommentsComponent comments={this.state.item.kids} commentsValue={this.state.comment} />
          </div>
          <div className='spacer-padding'></div>
          <SpacerComponent />
          <FooterComponent />
        </div>
      );
    }
    else {
      var stateTitle = this.state.item.title ? this.state.item.title + ' | ': '';

      document.title = stateTitle +  'Reacter News';


      return (
        <div className='item-wrapper'>
        {renderedHTML}
          <div className='spacer-padding'></div>
          <SpacerComponent />
          <FooterComponent />
        </div>
      );
    }

  }

});

module.exports = ItemComponent;